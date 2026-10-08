package com.yourcompany.grocery.orders.service;

import com.yourcompany.grocery.cart.entity.Cart;
import com.yourcompany.grocery.cart.entity.CartItem;
import com.yourcompany.grocery.cart.repository.CartRepository;
import com.yourcompany.grocery.cart.service.CartService;
import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.inventory.service.InventoryService;
import com.yourcompany.grocery.orders.dto.CheckoutRequest;
import com.yourcompany.grocery.orders.dto.OrderDto;
import com.yourcompany.grocery.orders.dto.UpdateOrderStatusRequest;
import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.orders.entity.OrderItem;
import com.yourcompany.grocery.orders.entity.OrderStatusHistory;
import com.yourcompany.grocery.orders.repository.OrderItemRepository;
import com.yourcompany.grocery.orders.repository.OrderRepository;
import com.yourcompany.grocery.orders.repository.OrderStatusHistoryRepository;
import com.yourcompany.grocery.stores.entity.Store;
import com.yourcompany.grocery.users.entity.Address;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.AddressRepository;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDto checkout(UUID customerId, CheckoutRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        Cart cart = cartRepository.findByUserId(customerId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty() || cart.getStore() == null) {
            throw new BadRequestException("Cart is empty or does not belong to any store");
        }

        Store store = cart.getStore();
        if (!store.isAcceptingOrders() || !"ACTIVE".equals(store.getStatus())) {
            throw new BadRequestException("Store is currently not accepting orders");
        }

        Address address = addressRepository.findByIdAndUserId(request.getDeliveryAddressId(), customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getDeliveryAddressId()));

        // 1. Reserve stock atomically for each cart item
        for (CartItem item : cart.getItems()) {
            inventoryService.reserveStock(store.getId(), item.getProduct().getId(), item.getQuantity());
        }

        // 2. Authoritative price recalculation (Never trust client pricing)
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            BigDecimal itemPrice = item.getProduct().getPrice();
            BigDecimal lineTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal taxRate = new BigDecimal("0.05"); // 5% tax
        BigDecimal taxAmount = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deliveryFee = new BigDecimal("3.99");
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(taxAmount).add(deliveryFee).subtract(discountAmount);

        // 3. Generate unique human-readable order number
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + ThreadLocalRandom.current().nextInt(1000, 9999);

        // 4. Create Order
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customer(customer)
                .store(store)
                .deliveryAddress(address)
                .status("CREATED")
                .paymentStatus("PENDING")
                .subtotal(subtotal)
                .taxAmount(taxAmount)
                .deliveryFee(deliveryFee)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .specialInstructions(request.getSpecialInstructions())
                .placedAt(Instant.now())
                .estimatedDeliveryAt(Instant.now().plus(45, ChronoUnit.MINUTES))
                .build();

        Order savedOrder = orderRepository.save(order);

        // 5. Create immutable OrderItem snapshots
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(item.getProduct())
                    .productName(item.getProduct().getName())
                    .unitPrice(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .totalPrice(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build();
            orderItems.add(orderItemRepository.save(orderItem));
        }
        savedOrder.setItems(orderItems);

        // 6. Record Initial Status History
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(savedOrder)
                .fromStatus(null)
                .toStatus("CREATED")
                .reason("Order placed by customer")
                .changedBy(customer)
                .build();
        statusHistoryRepository.save(history);
        savedOrder.getStatusHistory().add(history);

        // 7. Clear customer cart
        cartService.clearCart(customerId);

        return OrderDto.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getCustomerOrders(UUID customerId) {
        return orderRepository.findByCustomerIdOrderByPlacedAtDesc(customerId).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getStoreOrders(UUID storeId) {
        return orderRepository.findByStoreIdOrderByPlacedAtDesc(storeId).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return OrderDto.fromEntity(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(UUID orderId, UUID changedById, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User actor = changedById != null ? userRepository.findById(changedById).orElse(null) : null;
        String previousStatus = order.getStatus();
        String targetStatus = request.getStatus().toUpperCase();

        if (previousStatus.equals(targetStatus)) {
            return OrderDto.fromEntity(order);
        }

        // Handle inventory lifecycle according to order transition
        if ("CANCELLED".equals(targetStatus) && !"CANCELLED".equals(previousStatus)) {
            // Release reserved stock back to availability
            for (OrderItem item : order.getItems()) {
                inventoryService.releaseReservedStock(order.getStore().getId(), item.getProduct().getId(), item.getQuantity());
            }
            order.setCancelledAt(Instant.now());
        } else if ("DELIVERED".equals(targetStatus) && !"DELIVERED".equals(previousStatus)) {
            // Deduct fulfilled inventory
            for (OrderItem item : order.getItems()) {
                inventoryService.deductFulfilledStock(order.getStore().getId(), item.getProduct().getId(), item.getQuantity(), order.getOrderNumber());
            }
            order.setDeliveredAt(Instant.now());
        }

        order.setStatus(targetStatus);
        Order updated = orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(updated)
                .fromStatus(previousStatus)
                .toStatus(targetStatus)
                .reason(request.getReason())
                .changedBy(actor)
                .build();
        statusHistoryRepository.save(history);
        updated.getStatusHistory().add(history);

        return OrderDto.fromEntity(updated);
    }
}
