package com.yourcompany.grocery.delivery.service;

import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.delivery.dto.AssignDeliveryRequest;
import com.yourcompany.grocery.delivery.dto.DeliveryDto;
import com.yourcompany.grocery.delivery.dto.DeliveryPartnerProfileDto;
import com.yourcompany.grocery.delivery.dto.UpdatePartnerStatusRequest;
import com.yourcompany.grocery.delivery.dto.VerifyDeliveryRequest;
import com.yourcompany.grocery.delivery.dto.VerifyPickupRequest;
import com.yourcompany.grocery.delivery.entity.Delivery;
import com.yourcompany.grocery.delivery.entity.DeliveryPartner;
import com.yourcompany.grocery.delivery.repository.DeliveryPartnerRepository;
import com.yourcompany.grocery.delivery.repository.DeliveryRepository;
import com.yourcompany.grocery.inventory.service.InventoryService;
import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.orders.entity.OrderItem;
import com.yourcompany.grocery.orders.entity.OrderStatusHistory;
import com.yourcompany.grocery.orders.repository.OrderRepository;
import com.yourcompany.grocery.orders.repository.OrderStatusHistoryRepository;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    @Transactional
    public DeliveryPartnerProfileDto getOrRegisterPartner(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DeliveryPartner newPartner = DeliveryPartner.builder()
                            .user(user)
                            .vehicleType("MOTORBIKE")
                            .isOnline(false)
                            .isBusy(false)
                            .build();
                    return deliveryPartnerRepository.save(newPartner);
                });

        return DeliveryPartnerProfileDto.fromEntity(partner);
    }

    @Transactional
    public DeliveryPartnerProfileDto updatePartnerStatus(UUID userId, UpdatePartnerStatusRequest request) {
        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner for user", "userId", userId));

        if (request.getIsOnline() != null) {
            partner.setOnline(request.getIsOnline());
        }
        if (request.getLatitude() != null) {
            partner.setCurrentLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            partner.setCurrentLongitude(request.getLongitude());
        }
        if (request.getVehicleType() != null) {
            partner.setVehicleType(request.getVehicleType());
        }
        if (request.getVehicleNumber() != null) {
            partner.setVehicleNumber(request.getVehicleNumber());
        }
        if (request.getLicenseNumber() != null) {
            partner.setLicenseNumber(request.getLicenseNumber());
        }

        DeliveryPartner updated = deliveryPartnerRepository.save(partner);
        return DeliveryPartnerProfileDto.fromEntity(updated);
    }

    @Transactional
    public DeliveryDto createDeliveryForOrder(Order order) {
        return deliveryRepository.findByOrderId(order.getId())
                .map(d -> DeliveryDto.fromEntity(d, false))
                .orElseGet(() -> {
                    String pickupOtp = String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 999999));
                    String deliveryOtp = String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 999999));

                    Delivery delivery = Delivery.builder()
                            .order(order)
                            .status("PENDING_ASSIGNMENT")
                            .pickupOtp(pickupOtp)
                            .deliveryOtp(deliveryOtp)
                            .build();

                    Delivery saved = deliveryRepository.save(delivery);
                    return DeliveryDto.fromEntity(saved, false);
                });
    }

    @Transactional
    public DeliveryDto assignDelivery(AssignDeliveryRequest request, UUID actorId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        Delivery delivery = deliveryRepository.findByOrderId(order.getId())
                .orElseGet(() -> {
                    String pickupOtp = String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 999999));
                    String deliveryOtp = String.format("%06d", ThreadLocalRandom.current().nextInt(100000, 999999));
                    return deliveryRepository.save(Delivery.builder()
                            .order(order)
                            .status("PENDING_ASSIGNMENT")
                            .pickupOtp(pickupOtp)
                            .deliveryOtp(deliveryOtp)
                            .build());
                });

        DeliveryPartner partner;
        if (request.getPartnerId() != null) {
            partner = deliveryPartnerRepository.findById(request.getPartnerId())
                    .orElseThrow(() -> new ResourceNotFoundException("DeliveryPartner", "id", request.getPartnerId()));
        } else {
            List<DeliveryPartner> available = deliveryPartnerRepository.findByIsOnlineTrueAndIsBusyFalse();
            if (available.isEmpty()) {
                throw new BadRequestException("No delivery partners currently available and online");
            }
            partner = available.get(0);
        }

        partner.setBusy(true);
        deliveryPartnerRepository.save(partner);

        delivery.setDeliveryPartner(partner);
        delivery.setStatus("ASSIGNED");
        delivery.setAssignedAt(Instant.now());
        Delivery updatedDelivery = deliveryRepository.save(delivery);

        String previousStatus = order.getStatus();
        order.setStatus("ASSIGNED");
        orderRepository.save(order);

        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(previousStatus)
                .toStatus("ASSIGNED")
                .reason("Assigned to rider " + partner.getUser().getFirstName() + " " + partner.getUser().getLastName())
                .changedBy(actor)
                .build();
        statusHistoryRepository.save(history);

        return DeliveryDto.fromEntity(updatedDelivery, false);
    }

    @Transactional
    public DeliveryDto confirmPickup(UUID partnerUserId, UUID deliveryId, VerifyPickupRequest request) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", deliveryId));

        if (delivery.getDeliveryPartner() == null || !delivery.getDeliveryPartner().getUser().getId().equals(partnerUserId)) {
            throw new BadRequestException("You are not authorized to pick up this delivery");
        }

        if (!"ASSIGNED".equals(delivery.getStatus())) {
            throw new BadRequestException("Delivery is not in ASSIGNED state. Current state: " + delivery.getStatus());
        }

        if (!delivery.getPickupOtp().equals(request.getPickupOtp())) {
            throw new BadRequestException("Invalid store pickup OTP");
        }

        delivery.setStatus("PICKED_UP");
        delivery.setPickedUpAt(Instant.now());
        Delivery savedDelivery = deliveryRepository.save(delivery);

        Order order = delivery.getOrder();
        String prevStatus = order.getStatus();
        order.setStatus("OUT_FOR_DELIVERY");
        orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(prevStatus)
                .toStatus("OUT_FOR_DELIVERY")
                .reason("Order picked up from store by rider, out for delivery")
                .changedBy(delivery.getDeliveryPartner().getUser())
                .build();
        statusHistoryRepository.save(history);

        return DeliveryDto.fromEntity(savedDelivery, false);
    }

    @Transactional
    public DeliveryDto completeDelivery(UUID partnerUserId, UUID deliveryId, VerifyDeliveryRequest request) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery", "id", deliveryId));

        if (delivery.getDeliveryPartner() == null || !delivery.getDeliveryPartner().getUser().getId().equals(partnerUserId)) {
            throw new BadRequestException("You are not authorized to complete this delivery");
        }

        if (!"PICKED_UP".equals(delivery.getStatus()) && !"OUT_FOR_DELIVERY".equals(delivery.getStatus())) {
            throw new BadRequestException("Delivery is not in transit. Current state: " + delivery.getStatus());
        }

        if (!delivery.getDeliveryOtp().equals(request.getDeliveryOtp())) {
            throw new BadRequestException("Invalid customer delivery verification OTP");
        }

        delivery.setStatus("DELIVERED");
        delivery.setDeliveredAt(Instant.now());
        delivery.setProofOfDeliveryUrl(request.getProofOfDeliveryUrl());
        Delivery savedDelivery = deliveryRepository.save(delivery);

        DeliveryPartner partner = delivery.getDeliveryPartner();
        partner.setBusy(false);
        deliveryPartnerRepository.save(partner);

        Order order = delivery.getOrder();
        String prevStatus = order.getStatus();
        order.setStatus("DELIVERED");
        order.setDeliveredAt(Instant.now());

        // Deduct inventory stock fulfilled
        for (OrderItem item : order.getItems()) {
            inventoryService.deductFulfilledStock(order.getStore().getId(), item.getProduct().getId(), item.getQuantity(), order.getOrderNumber());
        }

        orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .fromStatus(prevStatus)
                .toStatus("DELIVERED")
                .reason("Order successfully delivered to customer with OTP verification")
                .changedBy(partner.getUser())
                .build();
        statusHistoryRepository.save(history);

        return DeliveryDto.fromEntity(savedDelivery, false);
    }

    @Transactional(readOnly = true)
    public List<DeliveryDto> getPartnerDeliveries(UUID partnerUserId) {
        DeliveryPartner partner = deliveryPartnerRepository.findByUserId(partnerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner for user", "userId", partnerUserId));

        return deliveryRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(partner.getId()).stream()
                .map(d -> DeliveryDto.fromEntity(d, false))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DeliveryDto getDeliveryByOrderId(UUID orderId, UUID requesterId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery for order", "orderId", orderId));

        boolean isCustomer = delivery.getOrder().getCustomer().getId().equals(requesterId);
        boolean isPartner = delivery.getDeliveryPartner() != null && delivery.getDeliveryPartner().getUser().getId().equals(requesterId);

        // For customer: show deliveryOtp to hand to rider, hide pickupOtp
        // For partner: show pickupOtp to show store, hide deliveryOtp until customer provides it
        return DeliveryDto.fromEntity(delivery, false);
    }
}
