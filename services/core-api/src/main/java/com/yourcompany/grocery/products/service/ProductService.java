package com.yourcompany.grocery.products.service;

import com.yourcompany.grocery.common.exception.ConflictException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.inventory.entity.Inventory;
import com.yourcompany.grocery.inventory.entity.InventoryMovement;
import com.yourcompany.grocery.inventory.repository.InventoryMovementRepository;
import com.yourcompany.grocery.inventory.repository.InventoryRepository;
import com.yourcompany.grocery.products.dto.CreateProductRequest;
import com.yourcompany.grocery.products.dto.ProductDto;
import com.yourcompany.grocery.products.dto.UpdateProductRequest;
import com.yourcompany.grocery.products.entity.Category;
import com.yourcompany.grocery.products.entity.Product;
import com.yourcompany.grocery.products.repository.CategoryRepository;
import com.yourcompany.grocery.products.repository.ProductRepository;
import com.yourcompany.grocery.stores.entity.Store;
import com.yourcompany.grocery.stores.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByStore(UUID storeId) {
        return productRepository.findActiveProductsByStore(storeId).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String query) {
        if (!StringUtils.hasText(query)) {
            return List.of();
        }
        return productRepository.searchActiveProducts(query.trim()).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .filter(p -> p.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductDto.fromEntity(product);
    }

    @Transactional
    public ProductDto createProduct(UUID storeId, CreateProductRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", storeId));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        if (productRepository.existsByStoreIdAndSku(storeId, request.getSku())) {
            throw new ConflictException("Product with SKU '" + request.getSku() + "' already exists for this store");
        }

        Product product = Product.builder()
                .store(store)
                .category(category)
                .name(request.getName().trim())
                .slug(request.getSlug().trim().toLowerCase())
                .description(request.getDescription())
                .sku(request.getSku().trim().toUpperCase())
                .barcode(request.getBarcode())
                .price(request.getPrice())
                .compareAtPrice(request.getCompareAtPrice())
                .costPrice(request.getCostPrice())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .status("ACTIVE")
                .available(true)
                .build();

        Product savedProduct = productRepository.save(product);

        // Initialize inventory record
        Inventory inventory = Inventory.builder()
                .store(store)
                .product(savedProduct)
                .quantity(request.getInitialStock())
                .reservedQuantity(0)
                .lowStockThreshold(5)
                .build();
        inventoryRepository.save(inventory);

        if (request.getInitialStock() > 0) {
            InventoryMovement movement = InventoryMovement.builder()
                    .store(store)
                    .product(savedProduct)
                    .quantityDelta(request.getInitialStock())
                    .movementType("RESTOCK")
                    .notes("Initial stock on product creation")
                    .build();
            inventoryMovementRepository.save(movement);
        }

        return ProductDto.fromEntity(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(UUID productId, UpdateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        if (StringUtils.hasText(request.getName())) product.setName(request.getName().trim());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getCompareAtPrice() != null) product.setCompareAtPrice(request.getCompareAtPrice());
        if (request.getCostPrice() != null) product.setCostPrice(request.getCostPrice());
        if (request.getUnit() != null) product.setUnit(request.getUnit());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) product.setStatus(request.getStatus());
        if (request.getAvailable() != null) product.setAvailable(request.getAvailable());

        Product updated = productRepository.save(product);
        return ProductDto.fromEntity(updated);
    }
}
