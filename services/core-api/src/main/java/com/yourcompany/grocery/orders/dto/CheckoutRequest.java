package com.yourcompany.grocery.orders.dto;

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
public class CheckoutRequest {

    @NotNull(message = "Delivery address ID is required")
    private UUID deliveryAddressId;

    private String specialInstructions;

    @Builder.Default
    private String paymentMethod = "CASH_ON_DELIVERY"; // CREDIT_CARD, UPI, CASH_ON_DELIVERY
}
