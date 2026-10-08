package com.yourcompany.grocery.products.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProductRequest {

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product slug is required")
    private String slug;

    private String description;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String barcode;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    private BigDecimal compareAtPrice;
    private BigDecimal costPrice;

    @Builder.Default
    private String unit = "pcs";

    private String imageUrl;

    @Builder.Default
    private int initialStock = 0;
}
