package com.yourcompany.grocery.products.controller;

import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.products.dto.CategoryDto;
import com.yourcompany.grocery.products.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategory(@PathVariable String idOrSlug) {
        CategoryDto category;
        try {
            UUID id = UUID.fromString(idOrSlug);
            category = categoryService.getCategoryById(id);
        } catch (IllegalArgumentException ex) {
            category = categoryService.getCategoryBySlug(idOrSlug);
        }
        return ResponseEntity.ok(ApiResponse.success(category));
    }
}
