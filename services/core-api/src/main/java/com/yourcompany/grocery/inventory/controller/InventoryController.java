package com.yourcompany.grocery.inventory.controller;

import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.common.dto.ApiResponse;
import com.yourcompany.grocery.inventory.dto.InventoryDto;
import com.yourcompany.grocery.inventory.dto.InventoryMovementDto;
import com.yourcompany.grocery.inventory.dto.StockAdjustmentRequest;
import com.yourcompany.grocery.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/stores/{storeId}/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getStoreInventory(@PathVariable UUID storeId) {
        List<InventoryDto> inventory = inventoryService.getStoreInventory(storeId);
        return ResponseEntity.ok(ApiResponse.success(inventory));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getLowStockItems(@PathVariable UUID storeId) {
        List<InventoryDto> lowStock = inventoryService.getLowStockItems(storeId);
        return ResponseEntity.ok(ApiResponse.success(lowStock));
    }

    @GetMapping("/movements")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InventoryMovementDto>>> getMovements(@PathVariable UUID storeId) {
        List<InventoryMovementDto> movements = inventoryService.getInventoryMovements(storeId);
        return ResponseEntity.ok(ApiResponse.success(movements));
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('ROLE_STORE_OWNER', 'ROLE_STORE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InventoryDto>> adjustStock(
            @PathVariable UUID storeId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        InventoryDto updated = inventoryService.adjustStock(storeId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully", updated));
    }
}
