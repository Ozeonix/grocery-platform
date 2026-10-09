package com.yourcompany.grocery.delivery.dto;

import com.yourcompany.grocery.delivery.entity.Delivery;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDto {

    private UUID id;
    private UUID orderId;
    private String orderNumber;
    private UUID deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
    private String status;
    private String pickupOtp;
    private String deliveryOtp;
    private Instant assignedAt;
    private Instant pickedUpAt;
    private Instant deliveredAt;
    private String proofOfDeliveryUrl;
    private String storeName;
    private String storeAddress;
    private String customerAddress;
    private BigDecimal totalAmount;
    private Instant createdAt;

    public static DeliveryDto fromEntity(Delivery delivery, boolean maskOtps) {
        String storeAddr = delivery.getOrder() != null && delivery.getOrder().getStore() != null
                ? delivery.getOrder().getStore().getAddressLine1() + ", " + delivery.getOrder().getStore().getCity()
                : null;

        String custAddr = delivery.getOrder() != null && delivery.getOrder().getDeliveryAddress() != null
                ? delivery.getOrder().getDeliveryAddress().getAddressLine1() + ", " + delivery.getOrder().getDeliveryAddress().getCity()
                : null;

        return DeliveryDto.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrder() != null ? delivery.getOrder().getId() : null)
                .orderNumber(delivery.getOrder() != null ? delivery.getOrder().getOrderNumber() : null)
                .deliveryPartnerId(delivery.getDeliveryPartner() != null ? delivery.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(delivery.getDeliveryPartner() != null && delivery.getDeliveryPartner().getUser() != null
                        ? delivery.getDeliveryPartner().getUser().getFirstName() + " " + delivery.getDeliveryPartner().getUser().getLastName()
                        : null)
                .deliveryPartnerPhone(delivery.getDeliveryPartner() != null && delivery.getDeliveryPartner().getUser() != null
                        ? delivery.getDeliveryPartner().getUser().getPhoneNumber()
                        : null)
                .status(delivery.getStatus())
                .pickupOtp(maskOtps ? null : delivery.getPickupOtp())
                .deliveryOtp(maskOtps ? null : delivery.getDeliveryOtp())
                .assignedAt(delivery.getAssignedAt())
                .pickedUpAt(delivery.getPickedUpAt())
                .deliveredAt(delivery.getDeliveredAt())
                .proofOfDeliveryUrl(delivery.getProofOfDeliveryUrl())
                .storeName(delivery.getOrder() != null && delivery.getOrder().getStore() != null ? delivery.getOrder().getStore().getName() : null)
                .storeAddress(storeAddr)
                .customerAddress(custAddr)
                .totalAmount(delivery.getOrder() != null ? delivery.getOrder().getTotalAmount() : null)
                .createdAt(delivery.getCreatedAt())
                .build();
    }
}
