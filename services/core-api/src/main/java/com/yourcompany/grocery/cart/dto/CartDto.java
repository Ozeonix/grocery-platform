package com.yourcompany.grocery.cart.dto;

import com.yourcompany.grocery.cart.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private List<CartItemDto> items;
    private BigDecimal subtotal;
    private int totalItemCount;

    public static CartDto fromEntity(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList());

        BigDecimal subtotal = itemDtos.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalCount = itemDtos.stream()
                .mapToInt(CartItemDto::getQuantity)
                .sum();

        return CartDto.builder()
                .id(cart.getId())
                .storeId(cart.getStore() != null ? cart.getStore().getId() : null)
                .storeName(cart.getStore() != null ? cart.getStore().getName() : null)
                .items(itemDtos)
                .subtotal(subtotal)
                .totalItemCount(totalCount)
                .build();
    }
}
