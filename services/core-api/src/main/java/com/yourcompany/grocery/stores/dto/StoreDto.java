package com.yourcompany.grocery.stores.dto;

import com.yourcompany.grocery.stores.entity.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreDto {

    private UUID id;
    private String name;
    private String slug;
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
    private boolean acceptingOrders;
    private LocalTime openingTime;
    private LocalTime closingTime;

    public static StoreDto fromEntity(Store store) {
        return StoreDto.builder()
                .id(store.getId())
                .name(store.getName())
                .slug(store.getSlug())
                .description(store.getDescription())
                .phone(store.getPhone())
                .email(store.getEmail())
                .logoUrl(store.getLogoUrl())
                .bannerUrl(store.getBannerUrl())
                .addressLine1(store.getAddressLine1())
                .addressLine2(store.getAddressLine2())
                .city(store.getCity())
                .state(store.getState())
                .postalCode(store.getPostalCode())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .status(store.getStatus())
                .acceptingOrders(store.isAcceptingOrders())
                .openingTime(store.getOpeningTime())
                .closingTime(store.getClosingTime())
                .build();
    }
}
