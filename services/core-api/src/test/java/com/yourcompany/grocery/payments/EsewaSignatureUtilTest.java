package com.yourcompany.grocery.payments;

import com.yourcompany.grocery.payments.service.EsewaSignatureUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EsewaSignatureUtilTest {

    @Test
    @DisplayName("Generate and verify HMAC-SHA256 signature for eSewa v2")
    void testEsewaSignature_GenerateAndVerify() {
        String totalAmount = "100.00";
        String transactionUuid = "ORD-TEST-1234";
        String productCode = "EPAYTEST";
        String secretKey = "8gBm/:&EnhH.1/q";

        String signature = EsewaSignatureUtil.generateSignature(totalAmount, transactionUuid, productCode, secretKey);

        assertNotNull(signature);
        assertFalse(signature.isBlank());

        boolean isValid = EsewaSignatureUtil.verifySignature(totalAmount, transactionUuid, productCode, secretKey, signature);
        assertTrue(isValid);

        // Verification fails if amount is tampered
        boolean isTampered = EsewaSignatureUtil.verifySignature("200.00", transactionUuid, productCode, secretKey, signature);
        assertFalse(isTampered);

        // Verification fails with wrong secret key
        boolean isWrongKey = EsewaSignatureUtil.verifySignature(totalAmount, transactionUuid, productCode, "wrong_secret", signature);
        assertFalse(isWrongKey);
    }
}
