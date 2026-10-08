package com.yourcompany.grocery.inventory.repository;

import com.yourcompany.grocery.inventory.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    Optional<Inventory> findByStoreIdAndProductId(UUID storeId, UUID productId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.store.id = :storeId AND i.product.id = :productId")
    Optional<Inventory> findWithLockByStoreIdAndProductId(@Param("storeId") UUID storeId, @Param("productId") UUID productId);

    List<Inventory> findByStoreId(UUID storeId);

    @Query("SELECT i FROM Inventory i WHERE i.store.id = :storeId AND (i.quantity - i.reservedQuantity) <= i.lowStockThreshold")
    List<Inventory> findLowStockItems(@Param("storeId") UUID storeId);
}
