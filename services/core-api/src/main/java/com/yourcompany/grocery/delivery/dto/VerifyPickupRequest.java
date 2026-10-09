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
public class VerifyPickupRequest {

    @NotBlank(message = "Pickup OTP is required")
    private String pickupOtp;
}
