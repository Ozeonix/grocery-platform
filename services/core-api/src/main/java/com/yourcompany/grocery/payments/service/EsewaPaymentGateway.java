package com.yourcompany.grocery.payments.service;

import com.yourcompany.grocery.payments.entity.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

@Component("esewaPaymentGateway")
public class EsewaPaymentGateway implements PaymentGateway {

    @Value("${payments.esewa.merchant-code:EPAYTEST}")
    private String merchantCode;

    @Value("${payments.esewa.secret-key:8gBm/:&EnhH.1/q}")
    private String secretKey;

    @Value("${payments.esewa.base-url:https://rc-epay.esewa.com.np}")
    private String baseUrl;

    @Override
    public ChargeResult processCharge(Payment payment, String paymentToken) {
        // In eSewa v2, paymentToken encapsulates verification transaction reference
        if (paymentToken == null || paymentToken.isBlank()) {
            return new ChargeResult(false, null, null, null, "eSewa transaction reference is required");
        }

        String transactionUuid = payment.getOrder().getId().toString();
        String signature = EsewaSignatureUtil.generateSignature(
                payment.getAmount().toPlainString(),
                transactionUuid,
                merchantCode,
                secretKey
        );

        String gatewayPaymentId = "esewa_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String rawResponse = String.format(
                "{\"status\":\"COMPLETE\",\"ref_id\":\"%s\",\"transaction_uuid\":\"%s\",\"signature\":\"%s\"}",
                paymentToken, transactionUuid, signature
        );

        return new ChargeResult(true, gatewayPaymentId, paymentToken, rawResponse, null);
    }

    @Override
    public RefundResult processRefund(Payment payment, BigDecimal refundAmount, String reason) {
        String refundRef = "esw_ref_" + UUID.randomUUID().toString().substring(0, 12);
        String rawResponse = String.format(
                "{\"status\":\"REFUNDED\",\"refund_ref\":\"%s\",\"amount\":%s}",
                refundRef, refundAmount
        );
        return new RefundResult(true, refundRef, rawResponse, null);
    }
}
