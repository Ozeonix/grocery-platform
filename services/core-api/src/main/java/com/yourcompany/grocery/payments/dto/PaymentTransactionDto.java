package com.yourcompany.grocery.payments.dto;

import com.yourcompany.grocery.payments.entity.PaymentTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransactionDto {

    private UUID id;
    private UUID paymentId;
    private String transactionType;
    private BigDecimal amount;
    private String gatewayReference;
    private String status;
    private Instant createdAt;

    public static PaymentTransactionDto fromEntity(PaymentTransaction transaction) {
        return PaymentTransactionDto.builder()
                .id(transaction.getId())
                .paymentId(transaction.getPayment() != null ? transaction.getPayment().getId() : null)
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .gatewayReference(transaction.getGatewayReference())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
