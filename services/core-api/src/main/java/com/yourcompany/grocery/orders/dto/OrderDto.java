package com.yourcompany.grocery.orders.dto;

import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.users.dto.AddressDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private UUID id;
    private String orderNumber;
    private UUID customerId;
    private String customerName;
    private UUID storeId;
    private String storeName;
    private AddressDto deliveryAddress;
    private String status;
    private String paymentStatus;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal deliveryFee;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private Instant placedAt;
    private Instant estimatedDeliveryAt;
    private Instant deliveredAt;
    private Instant cancelledAt;
    private List<OrderItemDto> items;
    private List<OrderStatusHistoryDto> statusHistory;

    public static OrderDto fromEntity(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName())
                .storeId(order.getStore().getId())
                .storeName(order.getStore().getName())
                .deliveryAddress(order.getDeliveryAddress() != null ? AddressDto.fromEntity(order.getDeliveryAddress()) : null)
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .deliveryFee(order.getDeliveryFee())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .specialInstructions(order.getSpecialInstructions())
                .placedAt(order.getPlacedAt())
                .estimatedDeliveryAt(order.getEstimatedDeliveryAt())
                .deliveredAt(order.getDeliveredAt())
                .cancelledAt(order.getCancelledAt())
                .items(order.getItems().stream().map(OrderItemDto::fromEntity).collect(Collectors.toList()))
                .statusHistory(order.getStatusHistory().stream().map(OrderStatusHistoryDto::fromEntity).collect(Collectors.toList()))
                .build();
    }
}
