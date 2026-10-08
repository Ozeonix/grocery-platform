package com.yourcompany.grocery.inventory.dto;

import com.yourcompany.grocery.inventory.entity.Inventory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {

    private UUID id;
    private UUID storeId;
    private UUID productId;
    private String productName;
    private String sku;
    private int quantity;
    private int reservedQuantity;
    private int availableQuantity;
    private int lowStockThreshold;
    private Instant updatedAt;

    public static InventoryDto fromEntity(Inventory inventory) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .storeId(inventory.getStore().getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .sku(inventory.getProduct().getSku())
                .quantity(inventory.getQuantity())
                .reservedQuantity(inventory.getReservedQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .lowStockThreshold(inventory.getLowStockThreshold())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}
