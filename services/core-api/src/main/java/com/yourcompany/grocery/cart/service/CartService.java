package com.yourcompany.grocery.cart.service;

import com.yourcompany.grocery.cart.dto.AddToCartRequest;
import com.yourcompany.grocery.cart.dto.CartDto;
import com.yourcompany.grocery.cart.entity.Cart;
import com.yourcompany.grocery.cart.entity.CartItem;
import com.yourcompany.grocery.cart.repository.CartItemRepository;
import com.yourcompany.grocery.cart.repository.CartRepository;
import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.inventory.entity.Inventory;
import com.yourcompany.grocery.inventory.repository.InventoryRepository;
import com.yourcompany.grocery.products.entity.Product;
import com.yourcompany.grocery.products.repository.ProductRepository;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional
    public Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart cart = Cart.builder()
                    .user(user)
                    .build();
            return cartRepository.save(cart);
        });
    }

    @Transactional(readOnly = true)
    public CartDto getCartDto(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto addToCart(UUID userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .filter(p -> p.getDeletedAt() == null && p.isAvailable())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        // Single-store cart rule: if cart is from another store, reset cart to new store
        if (cart.getStore() != null && !cart.getStore().getId().equals(product.getStore().getId())) {
            cart.getItems().clear();
            cartRepository.saveAndFlush(cart);
        }
        cart.setStore(product.getStore());

        // Check stock availability
        Inventory inventory = inventoryRepository.findByStoreIdAndProductId(product.getStore().getId(), product.getId())
                .orElseThrow(() -> new BadRequestException("Product inventory is not configured"));

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        int targetQuantity = request.getQuantity();
        if (existingItemOpt.isPresent()) {
            targetQuantity += existingItemOpt.get().getQuantity();
        }

        if (inventory.getAvailableQuantity() < targetQuantity) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + inventory.getAvailableQuantity() + " available)");
        }

        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            existing.setQuantity(targetQuantity);
            existing.setUnitPrice(product.getPrice()); // Always refresh with authoritative DB price
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice()) // Authoritative DB price
                    .build();
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return CartDto.fromEntity(saved);
    }

    @Transactional
    public CartDto updateItemQuantity(UUID userId, UUID cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findByIdAndCartUserId(cartItemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            Inventory inventory = inventoryRepository.findByStoreIdAndProductId(cart.getStore().getId(), item.getProduct().getId())
                    .orElseThrow(() -> new BadRequestException("Product inventory is not configured"));

            if (inventory.getAvailableQuantity() < quantity) {
                throw new BadRequestException("Requested quantity exceeds available stock (" + inventory.getAvailableQuantity() + " available)");
            }

            item.setQuantity(quantity);
            item.setUnitPrice(item.getProduct().getPrice());
            cartItemRepository.save(item);
        }

        if (cart.getItems().isEmpty()) {
            cart.setStore(null);
        }

        Cart saved = cartRepository.save(cart);
        return CartDto.fromEntity(saved);
    }

    @Transactional
    public CartDto removeItem(UUID userId, UUID cartItemId) {
        return updateItemQuantity(userId, cartItemId, 0);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cart.setStore(null);
        cartRepository.save(cart);
    }
}
