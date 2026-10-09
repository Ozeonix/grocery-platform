package com.yourcompany.grocery.delivery.repository;

import com.yourcompany.grocery.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    Optional<Delivery> findByOrderId(UUID orderId);
    List<Delivery> findByDeliveryPartnerIdOrderByCreatedAtDesc(UUID deliveryPartnerId);
    List<Delivery> findByDeliveryPartnerIdAndStatusIn(UUID deliveryPartnerId, List<String> statuses);
    List<Delivery> findByStatus(String status);
}
