package com.yourcompany.grocery.inventory.service;

import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.inventory.dto.InventoryDto;
import com.yourcompany.grocery.inventory.dto.InventoryMovementDto;
import com.yourcompany.grocery.inventory.dto.StockAdjustmentRequest;
import com.yourcompany.grocery.inventory.entity.Inventory;
import com.yourcompany.grocery.inventory.entity.InventoryMovement;
import com.yourcompany.grocery.inventory.repository.InventoryMovementRepository;
import com.yourcompany.grocery.inventory.repository.InventoryRepository;
import com.yourcompany.grocery.products.entity.Product;
import com.yourcompany.grocery.products.repository.ProductRepository;
import com.yourcompany.grocery.stores.entity.Store;
import com.yourcompany.grocery.stores.repository.StoreRepository;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository movementRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<InventoryDto> getStoreInventory(UUID storeId) {
        return inventoryRepository.findByStoreId(storeId).stream()
                .map(InventoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getLowStockItems(UUID storeId) {
        return inventoryRepository.findLowStockItems(storeId).stream()
                .map(InventoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryMovementDto> getInventoryMovements(UUID storeId) {
        return movementRepository.findByStoreIdOrderByCreatedAtDesc(storeId).stream()
                .map(InventoryMovementDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryDto adjustStock(UUID storeId, UUID actorId, StockAdjustmentRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", storeId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;

        // Atomically acquire row lock
        Inventory inventory = inventoryRepository.findWithLockByStoreIdAndProductId(storeId, request.getProductId())
                .orElseGet(() -> {
                    Inventory newInv = Inventory.builder()
                            .store(store)
                            .product(product)
                            .quantity(0)
                            .reservedQuantity(0)
                            .lowStockThreshold(5)
                            .build();
                    return inventoryRepository.save(newInv);
                });

        int newTotal = inventory.getQuantity() + request.getQuantityDelta();
        if (newTotal < 0) {
            throw new BadRequestException("Adjustment would result in negative stock quantity: " + newTotal);
        }

        inventory.setQuantity(newTotal);
        Inventory saved = inventoryRepository.save(inventory);

        InventoryMovement movement = InventoryMovement.builder()
                .store(store)
                .product(product)
                .quantityDelta(request.getQuantityDelta())
                .movementType(request.getMovementType())
                .referenceId(request.getReferenceId())
                .notes(request.getNotes())
                .createdBy(actor)
                .build();
        movementRepository.save(movement);

        return InventoryDto.fromEntity(saved);
    }

    @Transactional
    public void reserveStock(UUID storeId, UUID productId, int quantity) {
        Inventory inventory = inventoryRepository.findWithLockByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));

        if (inventory.getAvailableQuantity() < quantity) {
            throw new BadRequestException("Insufficient available stock to reserve. Requested: " +
                    quantity + ", Available: " + inventory.getAvailableQuantity());
        }

        inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void releaseReservedStock(UUID storeId, UUID productId, int quantity) {
        Inventory inventory = inventoryRepository.findWithLockByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));

        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void deductFulfilledStock(UUID storeId, UUID productId, int quantity, String orderNumber) {
        Inventory inventory = inventoryRepository.findWithLockByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));

        inventory.setQuantity(Math.max(0, inventory.getQuantity() - quantity));
        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
        inventoryRepository.save(inventory);

        InventoryMovement movement = InventoryMovement.builder()
                .store(inventory.getStore())
                .product(inventory.getProduct())
                .quantityDelta(-quantity)
                .movementType("FULFILLMENT")
                .referenceId(orderNumber)
                .notes("Order fulfilled: " + orderNumber)
                .build();
        movementRepository.save(movement);
    }
}
