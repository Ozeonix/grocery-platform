package com.yourcompany.grocery.stores.dto;

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
public class UpdateStoreRequest {

    private String name;
    private String description;
    private String phone;
    private String email;
    private String logoUrl;
    private String bannerUrl;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String status;
    private Boolean acceptingOrders;
    private LocalTime openingTime;
    private LocalTime closingTime;
}
