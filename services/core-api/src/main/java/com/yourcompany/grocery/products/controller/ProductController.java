package com.yourcompany.grocery.products.controller;

import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.products.dto.CreateProductRequest;
import com.yourcompany.grocery.products.dto.ProductDto;
import com.yourcompany.grocery.products.dto.UpdateProductRequest;
import com.yourcompany.grocery.products.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProducts(
            @RequestParam(required = false) UUID storeId,
            @RequestParam(required = false) String query
    ) {
        List<ProductDto> products;
        if (query != null && !query.isBlank()) {
            products = productService.searchProducts(query);
        } else if (storeId != null) {
            products = productService.getProductsByStore(storeId);
        } else {
            products = List.of();
        }
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProduct(@PathVariable UUID id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(
            @RequestParam UUID storeId,
            @Valid @RequestBody CreateProductRequest request
    ) {
        ProductDto product = productService.createProduct(storeId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }
}
