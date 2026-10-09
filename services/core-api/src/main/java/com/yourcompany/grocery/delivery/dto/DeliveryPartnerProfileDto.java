package com.yourcompany.grocery.delivery.dto;

import com.yourcompany.grocery.delivery.entity.DeliveryPartner;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerProfileDto {

    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String phone;
    private String vehicleType;
    private String vehicleNumber;
    private String licenseNumber;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private boolean isOnline;
    private boolean isBusy;
    private BigDecimal rating;
    private Instant createdAt;

    public static DeliveryPartnerProfileDto fromEntity(DeliveryPartner partner) {
        return DeliveryPartnerProfileDto.builder()
                .id(partner.getId())
                .userId(partner.getUser() != null ? partner.getUser().getId() : null)
                .fullName(partner.getUser() != null ? partner.getUser().getFirstName() + " " + partner.getUser().getLastName() : null)
                .email(partner.getUser() != null ? partner.getUser().getEmail() : null)
                .phone(partner.getUser() != null ? partner.getUser().getPhoneNumber() : null)
                .vehicleType(partner.getVehicleType())
                .vehicleNumber(partner.getVehicleNumber())
                .licenseNumber(partner.getLicenseNumber())
                .currentLatitude(partner.getCurrentLatitude())
                .currentLongitude(partner.getCurrentLongitude())
                .isOnline(partner.isOnline())
                .isBusy(partner.isBusy())
                .rating(partner.getRating())
                .createdAt(partner.getCreatedAt())
                .build();
    }
}
