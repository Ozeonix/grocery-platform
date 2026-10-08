package com.yourcompany.grocery.inventory.dto;

import com.yourcompany.grocery.inventory.entity.InventoryMovement;
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
public class InventoryMovementDto {

    private UUID id;
    private UUID storeId;
    private UUID productId;
    private String productName;
    private int quantityDelta;
    private String movementType;
    private String referenceId;
    private String notes;
    private String createdByEmail;
    private Instant createdAt;

    public static InventoryMovementDto fromEntity(InventoryMovement movement) {
        return InventoryMovementDto.builder()
                .id(movement.getId())
                .storeId(movement.getStore().getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .quantityDelta(movement.getQuantityDelta())
                .movementType(movement.getMovementType())
                .referenceId(movement.getReferenceId())
                .notes(movement.getNotes())
                .createdByEmail(movement.getCreatedBy() != null ? movement.getCreatedBy().getEmail() : null)
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
