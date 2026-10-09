package com.yourcompany.grocery.payments.repository;

import com.yourcompany.grocery.payments.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    List<PaymentTransaction> findByPaymentIdOrderByCreatedAtDesc(UUID paymentId);
}
