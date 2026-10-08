package com.yourcompany.grocery.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentRequest {

    @NotNull(message = "Product ID is required")
    private UUID productId;

    @NotNull(message = "Quantity delta is required")
    private Integer quantityDelta;

    @NotBlank(message = "Movement type is required")
    private String movementType; // RESTOCK, ADJUSTMENT, DAMAGE

    private String referenceId;
    private String notes;
}
