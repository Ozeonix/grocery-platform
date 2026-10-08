package com.yourcompany.grocery.products.dto;

import com.yourcompany.grocery.products.entity.Product;
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
public class ProductDto {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private String sku;
    private String barcode;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private String unit;
    private String imageUrl;
    private String status;
    private boolean available;

    public static ProductDto fromEntity(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .storeId(product.getStore().getId())
                .storeName(product.getStore().getName())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .price(product.getPrice())
                .compareAtPrice(product.getCompareAtPrice())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .status(product.getStatus())
                .available(product.isAvailable())
                .build();
    }
}
