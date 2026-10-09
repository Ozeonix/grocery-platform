package com.yourcompany.grocery.payments.dto;

import com.yourcompany.grocery.payments.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private UUID id;
    private UUID orderId;
    private String orderNumber;
    private UUID customerId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private String gatewayProvider;
    private String gatewayPaymentId;
    private List<PaymentTransactionDto> transactions;
    private Instant createdAt;
    private Instant updatedAt;

    public static PaymentDto fromEntity(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .orderId(payment.getOrder() != null ? payment.getOrder().getId() : null)
                .orderNumber(payment.getOrder() != null ? payment.getOrder().getOrderNumber() : null)
                .customerId(payment.getCustomer() != null ? payment.getCustomer().getId() : null)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .gatewayProvider(payment.getGatewayProvider())
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .transactions(payment.getTransactions() != null
                        ? payment.getTransactions().stream()
                            .map(PaymentTransactionDto::fromEntity)
                            .collect(Collectors.toList())
                        : Collections.emptyList())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
