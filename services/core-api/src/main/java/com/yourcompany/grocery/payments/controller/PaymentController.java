package com.yourcompany.grocery.payments.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.payments.dto.PaymentDto;
import com.yourcompany.grocery.payments.dto.ProcessPaymentRequest;
import com.yourcompany.grocery.payments.dto.RefundPaymentRequest;
import com.yourcompany.grocery.payments.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentDto>> processPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProcessPaymentRequest request
    ) {
        PaymentDto payment = paymentService.processPayment(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", payment));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDto>> getPaymentByOrderId(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID orderId
    ) {
        PaymentDto payment = paymentService.getPaymentByOrderId(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STORE_OWNER')")
    public ResponseEntity<ApiResponse<PaymentDto>> refundPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID paymentId,
            @Valid @RequestBody RefundPaymentRequest request
    ) {
        PaymentDto payment = paymentService.refundPayment(principal.getId(), paymentId, request);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully", payment));
    }
}
