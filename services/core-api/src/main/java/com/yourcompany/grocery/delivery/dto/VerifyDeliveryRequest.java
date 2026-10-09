package com.yourcompany.grocery.delivery.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyDeliveryRequest {

    @NotBlank(message = "Delivery OTP is required")
    private String deliveryOtp;

    private String proofOfDeliveryUrl;
}
