package com.yourcompany.grocery.stores.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStoreRequest {

    @NotBlank(message = "Store name is required")
    private String name;

    @NotBlank(message = "Store slug is required")
    private String slug;

    private String description;
    private String phone;
    private String email;
    private String logoUrl;
    private String bannerUrl;

    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    private String postalCode;

    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;

    @Builder.Default
    private LocalTime openingTime = LocalTime.of(8, 0);

    @Builder.Default
    private LocalTime closingTime = LocalTime.of(22, 0);
}
