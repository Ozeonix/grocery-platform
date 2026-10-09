package com.yourcompany.grocery.delivery.repository;

import com.yourcompany.grocery.delivery.entity.DeliveryPartner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, UUID> {
    Optional<DeliveryPartner> findByUserId(UUID userId);
    List<DeliveryPartner> findByIsOnlineTrueAndIsBusyFalse();
}
