package com.yourcompany.grocery.payments.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

public final class EsewaSignatureUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";

    private EsewaSignatureUtil() {}

    public static String generateSignature(String totalAmount, String transactionUuid, String productCode, String secretKey) {
        try {
            String data = String.format("total_amount=%s,transaction_uuid=%s,product_code=%s", totalAmount, transactionUuid, productCode);
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to compute HMAC-SHA256 signature for eSewa", e);
        }
    }

    public static boolean verifySignature(String totalAmount, String transactionUuid, String productCode, String secretKey, String receivedSignature) {
        if (receivedSignature == null || secretKey == null) {
            return false;
        }
        String computedSignature = generateSignature(totalAmount, transactionUuid, productCode, secretKey);
        return MessageDigest.isEqual(
                computedSignature.getBytes(StandardCharsets.UTF_8),
                receivedSignature.getBytes(StandardCharsets.UTF_8)
        );
    }
}
