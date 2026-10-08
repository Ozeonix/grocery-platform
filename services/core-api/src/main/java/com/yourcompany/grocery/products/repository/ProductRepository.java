package com.yourcompany.grocery.products.repository;

import com.yourcompany.grocery.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByStoreIdAndDeletedAtIsNull(UUID storeId);
    List<Product> findByCategoryIdAndDeletedAtIsNull(UUID categoryId);
    Optional<Product> findByStoreIdAndSku(UUID storeId, String sku);
    boolean existsByStoreIdAndSku(UUID storeId, String sku);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND p.deletedAt IS NULL AND p.status = 'ACTIVE' AND p.available = true")
    List<Product> findActiveProductsByStore(@Param("storeId") UUID storeId);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL AND p.status = 'ACTIVE' AND p.available = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchActiveProducts(@Param("query") String query);
}
