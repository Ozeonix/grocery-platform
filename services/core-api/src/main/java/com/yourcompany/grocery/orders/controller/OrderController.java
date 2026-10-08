package com.yourcompany.grocery.orders.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.orders.dto.CheckoutRequest;
import com.yourcompany.grocery.orders.dto.OrderDto;
import com.yourcompany.grocery.orders.dto.UpdateOrderStatusRequest;
import com.yourcompany.grocery.orders.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CheckoutRequest request
    ) {
        OrderDto order = orderService.checkout(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        List<OrderDto> orders = orderService.getCustomerOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrder(@PathVariable UUID id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getStoreOrders(@PathVariable UUID storeId) {
        List<OrderDto> orders = orderService.getStoreOrders(storeId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_DELIVERY_PARTNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderDto updated = orderService.updateOrderStatus(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", updated));
    }
}
