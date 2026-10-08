package com.yourcompany.grocery.stores.repository;

import com.yourcompany.grocery.stores.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {
    Optional<Store> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("SELECT s FROM Store s WHERE s.deletedAt IS NULL AND s.status = 'ACTIVE' ORDER BY s.name ASC")
    List<Store> findAllActiveStores();

    @Query("SELECT s FROM Store s WHERE s.deletedAt IS NULL AND s.city = :city AND s.status = 'ACTIVE'")
    List<Store> findActiveStoresByCity(@Param("city") String city);
}
