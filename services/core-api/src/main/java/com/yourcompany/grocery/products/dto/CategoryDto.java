package com.yourcompany.grocery.products.dto;

import com.yourcompany.grocery.products.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {

    private UUID id;
    private UUID parentId;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private int sortOrder;
    private boolean active;

    public static CategoryDto fromEntity(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .sortOrder(category.getSortOrder())
                .active(category.isActive())
                .build();
    }
}
