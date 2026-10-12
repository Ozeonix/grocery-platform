package com.yourcompany.grocery.payments.service;

import com.yourcompany.grocery.payments.entity.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component("khaltiPaymentGateway")
public class KhaltiPaymentGateway implements PaymentGateway {

    @Value("${payments.khalti.public-key:test_public_key}")
    private String publicKey;

    @Value("${payments.khalti.secret-key:test_secret_key}")
    private String secretKey;

    @Value("${payments.khalti.base-url:https://a.khalti.com/api/v2}")
    private String baseUrl;

    @Override
    public ChargeResult processCharge(Payment payment, String paymentToken) {
        // In Khalti ePay v2, token represents the pidx (Payment Identifier Index) from customer return
        if (paymentToken == null || paymentToken.isBlank()) {
            return new ChargeResult(false, null, null, null, "Khalti verification token (pidx) is required");
        }

        String transactionId = "kht_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String rawResponse = String.format(
                "{\"pidx\":\"%s\",\"status\":\"Completed\",\"transaction_id\":\"%s\",\"total_amount\":%s}",
                paymentToken, transactionId, payment.getAmount()
        );

        return new ChargeResult(true, transactionId, paymentToken, rawResponse, null);
    }

    @Override
    public RefundResult processRefund(Payment payment, BigDecimal refundAmount, String reason) {
        String refundRef = "kht_ref_" + UUID.randomUUID().toString().substring(0, 12);
        String rawResponse = String.format(
                "{\"status\":\"Refunded\",\"refund_id\":\"%s\",\"amount\":%s}",
                refundRef, refundAmount
        );
        return new RefundResult(true, refundRef, rawResponse, null);
    }
}
