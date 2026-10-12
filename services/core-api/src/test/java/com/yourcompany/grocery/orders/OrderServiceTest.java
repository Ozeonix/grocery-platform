package com.yourcompany.grocery.orders;

import com.yourcompany.grocery.cart.entity.Cart;
import com.yourcompany.grocery.cart.repository.CartRepository;
import com.yourcompany.grocery.cart.service.CartService;
import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.inventory.service.InventoryService;
import com.yourcompany.grocery.orders.dto.CheckoutRequest;
import com.yourcompany.grocery.orders.dto.OrderDto;
import com.yourcompany.grocery.orders.dto.UpdateOrderStatusRequest;
import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.orders.entity.OrderItem;
import com.yourcompany.grocery.orders.repository.OrderItemRepository;
import com.yourcompany.grocery.orders.repository.OrderRepository;
import com.yourcompany.grocery.orders.repository.OrderStatusHistoryRepository;
import com.yourcompany.grocery.orders.service.OrderService;
import com.yourcompany.grocery.products.entity.Product;
import com.yourcompany.grocery.stores.entity.Store;
import com.yourcompany.grocery.users.entity.Address;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.AddressRepository;
import com.yourcompany.grocery.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private OrderStatusHistoryRepository statusHistoryRepository;
    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartService cartService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AddressRepository addressRepository;
    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private OrderService orderService;

    private UUID customerId;
    private User customer;
    private UUID orderId;
    private Order order;
    private Store store;

    @BeforeEach
    void setUp() {
        customerId = UUID.randomUUID();
        customer = User.builder()
                .id(customerId)
                .email("shopper@ozeonix.com")
                .firstName("Alice")
                .lastName("Shopper")
                .build();

        store = Store.builder()
                .id(UUID.randomUUID())
                .name("Fresh Harvest Market Hub")
                .build();

        orderId = UUID.randomUUID();
        order = Order.builder()
                .id(orderId)
                .orderNumber("ORD-2026-0001")
                .customer(customer)
                .store(store)
                .deliveryAddress(Address.builder().id(UUID.randomUUID()).city("Kathmandu").build())
                .subtotal(new BigDecimal("30.00"))
                .totalAmount(new BigDecimal("35.00"))
                .status("CONFIRMED")
                .paymentStatus("PAID")
                .items(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Checkout with empty cart throws BadRequestException")
    void testCheckout_EmptyCart_ThrowsBadRequest() {
        when(userRepository.findById(customerId)).thenReturn(Optional.of(customer));
        Cart emptyCart = Cart.builder()
                .id(UUID.randomUUID())
                .user(customer)
                .items(new ArrayList<>())
                .build();
        when(cartRepository.findByUserId(customerId)).thenReturn(Optional.of(emptyCart));

        CheckoutRequest request = CheckoutRequest.builder()
                .deliveryAddressId(UUID.randomUUID())
                .build();

        assertThrows(BadRequestException.class, () -> orderService.checkout(customerId, request));
        verify(orderRepository, never()).save(any());
    }

    @Test
    @DisplayName("Update order status transitions correctly")
    void testUpdateOrderStatus_Success() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(userRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateOrderStatusRequest updateRequest = UpdateOrderStatusRequest.builder()
                .status("PREPARING")
                .reason("Store staff packing items")
                .build();

        OrderDto updated = orderService.updateOrderStatus(orderId, customerId, updateRequest);

        assertNotNull(updated);
        assertEquals("PREPARING", order.getStatus());
        verify(statusHistoryRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Cancel order releases stock reservation")
    void testCancelOrder_ReleasesStock() {
        Product sampleProduct = Product.builder().id(UUID.randomUUID()).name("Organic Bananas").build();
        OrderItem item = OrderItem.builder().id(UUID.randomUUID()).product(sampleProduct).quantity(2).build();
        order.setItems(Collections.singletonList(item));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(userRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateOrderStatusRequest cancelRequest = UpdateOrderStatusRequest.builder()
                .status("CANCELLED")
                .reason("Customer cancelled order")
                .build();

        OrderDto result = orderService.updateOrderStatus(orderId, customerId, cancelRequest);

        assertNotNull(result);
        assertEquals("CANCELLED", order.getStatus());
        verify(inventoryService, times(1)).releaseReservedStock(store.getId(), sampleProduct.getId(), 2);
    }

    @Test
    @DisplayName("Delivered order deducts fulfilled inventory")
    void testDeliverOrder_DeductsInventory() {
        Product sampleProduct = Product.builder().id(UUID.randomUUID()).name("Whole Milk").build();
        OrderItem item = OrderItem.builder().id(UUID.randomUUID()).product(sampleProduct).quantity(1).build();
        order.setItems(Collections.singletonList(item));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(userRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateOrderStatusRequest deliverRequest = UpdateOrderStatusRequest.builder()
                .status("DELIVERED")
                .reason("Doorstep OTP verified")
                .build();

        OrderDto result = orderService.updateOrderStatus(orderId, customerId, deliverRequest);

        assertNotNull(result);
        assertEquals("DELIVERED", order.getStatus());
        verify(inventoryService, times(1)).deductFulfilledStock(store.getId(), sampleProduct.getId(), 1, order.getOrderNumber());
    }

    @Test
    @DisplayName("Get order by ID throws ResourceNotFoundException when non-existent")
    void testGetOrder_NotFound() {
        UUID randomId = UUID.randomUUID();
        when(orderRepository.findById(randomId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(randomId));
    }
}
