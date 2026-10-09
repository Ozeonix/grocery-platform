package com.yourcompany.grocery.payments.service;

import com.yourcompany.grocery.payments.entity.Payment;

import java.math.BigDecimal;

public interface PaymentGateway {

    ChargeResult processCharge(Payment payment, String paymentToken);

    RefundResult processRefund(Payment payment, BigDecimal refundAmount, String reason);

    record ChargeResult(
            boolean success,
            String gatewayPaymentId,
            String gatewayReference,
            String rawResponse,
            String errorMessage
    ) {}

    record RefundResult(
            boolean success,
            String gatewayReference,
            String rawResponse,
            String errorMessage
    ) {}
}
