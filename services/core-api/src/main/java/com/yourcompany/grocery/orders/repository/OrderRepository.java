package com.yourcompany.grocery.orders.repository;

import com.yourcompany.grocery.orders.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByCustomerIdOrderByPlacedAtDesc(UUID customerId);
    List<Order> findByStoreIdOrderByPlacedAtDesc(UUID storeId);
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndCustomerId(UUID id, UUID customerId);
}
