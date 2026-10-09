package com.yourcompany.grocery.payments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotBlank(message = "Payment method is required (e.g. CARD, UPI, WALLET, CASH_ON_DELIVERY)")
    private String paymentMethod;

    @Builder.Default
    private String gatewayProvider = "MOCK";

    private String paymentToken;
}
