package com.yourcompany.grocery.cart.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.cart.dto.AddToCartRequest;
import com.yourcompany.grocery.cart.dto.CartDto;
import com.yourcompany.grocery.cart.dto.UpdateCartItemRequest;
import com.yourcompany.grocery.cart.service.CartService;
import com.yourcompany.grocery.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        CartDto cart = cartService.getCartDto(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartDto cart = cartService.addToCart(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartDto cart = cartService.updateItemQuantity(principal.getId(), itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID itemId
    ) {
        CartDto cart = cartService.removeItem(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserPrincipal principal) {
        cartService.clearCart(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
