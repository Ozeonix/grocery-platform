package com.yourcompany.grocery.stores.repository;

import com.yourcompany.grocery.stores.entity.StoreUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreUserRepository extends JpaRepository<StoreUser, UUID> {
    List<StoreUser> findByStoreId(UUID storeId);
    List<StoreUser> findByUserId(UUID userId);
    Optional<StoreUser> findByStoreIdAndUserId(UUID storeId, UUID userId);
    boolean existsByStoreIdAndUserId(UUID storeId, UUID userId);
}
