package com.yourcompany.grocery.delivery.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.delivery.dto.AssignDeliveryRequest;
import com.yourcompany.grocery.delivery.dto.DeliveryDto;
import com.yourcompany.grocery.delivery.dto.DeliveryPartnerProfileDto;
import com.yourcompany.grocery.delivery.dto.UpdatePartnerStatusRequest;
import com.yourcompany.grocery.delivery.dto.VerifyDeliveryRequest;
import com.yourcompany.grocery.delivery.dto.VerifyPickupRequest;
import com.yourcompany.grocery.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/partner/profile")
    @PreAuthorize("hasRole('ROLE_DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<DeliveryPartnerProfileDto>> getPartnerProfile(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        DeliveryPartnerProfileDto profile = deliveryService.getOrRegisterPartner(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/partner/profile")
    @PreAuthorize("hasRole('ROLE_DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<DeliveryPartnerProfileDto>> updatePartnerStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdatePartnerStatusRequest request
    ) {
        DeliveryPartnerProfileDto profile = deliveryService.updatePartnerStatus(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Partner status updated successfully", profile));
    }

    @GetMapping("/partner/deliveries")
    @PreAuthorize("hasRole('ROLE_DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<List<DeliveryDto>>> getPartnerDeliveries(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<DeliveryDto> deliveries = deliveryService.getPartnerDeliveries(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<DeliveryDto>> assignDelivery(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AssignDeliveryRequest request
    ) {
        DeliveryDto delivery = deliveryService.assignDelivery(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Delivery assigned to partner", delivery));
    }

    @PostMapping("/{deliveryId}/pickup")
    @PreAuthorize("hasRole('ROLE_DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<DeliveryDto>> confirmPickup(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID deliveryId,
            @Valid @RequestBody VerifyPickupRequest request
    ) {
        DeliveryDto delivery = deliveryService.confirmPickup(principal.getId(), deliveryId, request);
        return ResponseEntity.ok(ApiResponse.success("Order picked up from store", delivery));
    }

    @PostMapping("/{deliveryId}/complete")
    @PreAuthorize("hasRole('ROLE_DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<DeliveryDto>> completeDelivery(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID deliveryId,
            @Valid @RequestBody VerifyDeliveryRequest request
    ) {
        DeliveryDto delivery = deliveryService.completeDelivery(principal.getId(), deliveryId, request);
        return ResponseEntity.ok(ApiResponse.success("Order delivered successfully", delivery));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<DeliveryDto>> getDeliveryByOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID orderId
    ) {
        DeliveryDto delivery = deliveryService.getDeliveryByOrderId(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(delivery));
    }
}
