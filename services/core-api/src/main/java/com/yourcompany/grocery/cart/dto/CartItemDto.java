package com.yourcompany.grocery.cart.dto;

import com.yourcompany.grocery.cart.entity.CartItem;
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
public class CartItemDto {

    private UUID id;
    private UUID productId;
    private String productName;
    private String productImageUrl;
    private String unit;
    private BigDecimal unitPrice;
    private int quantity;
    private BigDecimal totalPrice;

    public static CartItemDto fromEntity(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImageUrl(item.getProduct().getImageUrl())
                .unit(item.getProduct().getUnit())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
