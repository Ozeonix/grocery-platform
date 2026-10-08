package com.yourcompany.grocery.stores.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.stores.dto.CreateStoreRequest;
import com.yourcompany.grocery.stores.dto.StoreDto;
import com.yourcompany.grocery.stores.dto.UpdateStoreRequest;
import com.yourcompany.grocery.stores.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreDto>>> getAllStores() {
        List<StoreDto> stores = storeService.getAllActiveStores();
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ApiResponse<StoreDto>> getStore(@PathVariable String idOrSlug) {
        StoreDto store;
        try {
            UUID id = UUID.fromString(idOrSlug);
            store = storeService.getStoreById(id);
        } catch (IllegalArgumentException ex) {
            store = storeService.getStoreBySlug(idOrSlug);
        }
        return ResponseEntity.ok(ApiResponse.success(store));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StoreDto>> createStore(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateStoreRequest request
    ) {
        StoreDto store = storeService.createStore(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Store created successfully", store));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StoreDto>> updateStore(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStoreRequest request
    ) {
        StoreDto updated = storeService.updateStore(id, request);
        return ResponseEntity.ok(ApiResponse.success("Store updated successfully", updated));
    }
}
