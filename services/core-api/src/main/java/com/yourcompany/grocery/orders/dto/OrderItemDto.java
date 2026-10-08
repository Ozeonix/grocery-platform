package com.yourcompany.grocery.orders.dto;

import com.yourcompany.grocery.orders.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {

    private UUID id;
    private UUID productId;
    private String productName;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal totalPrice;

    public static OrderItemDto fromEntity(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
