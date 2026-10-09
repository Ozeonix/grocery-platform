package com.yourcompany.grocery.payments.service;

import com.yourcompany.grocery.payments.entity.Payment;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component("mockPaymentGateway")
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public ChargeResult processCharge(Payment payment, String paymentToken) {
        String method = payment.getPaymentMethod() != null ? payment.getPaymentMethod().toUpperCase() : "CARD";

        // Cash on delivery scenario: No immediate online charge, confirmed for delivery collection
        if ("CASH_ON_DELIVERY".equals(method) || "COD".equals(method)) {
            String reference = "cod_ref_" + UUID.randomUUID().toString().substring(0, 8);
            String rawResponse = "{\"status\":\"PENDING_COLLECTION\",\"method\":\"COD\",\"amount\":" + payment.getAmount() + "}";
            return new ChargeResult(true, "cod_" + payment.getOrder().getId(), reference, rawResponse, null);
        }

        // Simulate decline/failure if token contains "fail" or "decline"
        if (paymentToken != null && (paymentToken.toLowerCase().contains("fail") || paymentToken.toLowerCase().contains("decline"))) {
            String rawResponse = "{\"status\":\"FAILED\",\"error\":\"Payment declined by issuer\"}";
            return new ChargeResult(false, null, "ref_err_" + System.currentTimeMillis(), rawResponse, "Card declined by issuing bank");
        }

        // Successful charge
        String gatewayPaymentId = "ch_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String gatewayReference = "txn_mock_" + System.currentTimeMillis();
        String rawResponse = "{\"status\":\"CAPTURED\",\"gatewayId\":\"" + gatewayPaymentId + "\",\"amount\":" + payment.getAmount() + ",\"currency\":\"" + payment.getCurrency() + "\"}";

        return new ChargeResult(true, gatewayPaymentId, gatewayReference, rawResponse, null);
    }

    @Override
    public RefundResult processRefund(Payment payment, BigDecimal refundAmount, String reason) {
        String refundRef = "re_mock_" + UUID.randomUUID().toString().substring(0, 12);
        String rawResponse = "{\"status\":\"REFUNDED\",\"refundRef\":\"" + refundRef + "\",\"amount\":" + refundAmount + ",\"reason\":\"" + (reason != null ? reason : "Requested by merchant") + "\"}";

        return new RefundResult(true, refundRef, rawResponse, null);
    }
}
