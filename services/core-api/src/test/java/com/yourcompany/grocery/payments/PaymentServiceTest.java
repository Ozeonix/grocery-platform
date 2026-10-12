package com.yourcompany.grocery.payments;

import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.delivery.service.DeliveryService;
import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.orders.repository.OrderRepository;
import com.yourcompany.grocery.orders.repository.OrderStatusHistoryRepository;
import com.yourcompany.grocery.payments.dto.PaymentDto;
import com.yourcompany.grocery.payments.dto.ProcessPaymentRequest;
import com.yourcompany.grocery.payments.entity.Payment;
import com.yourcompany.grocery.payments.repository.PaymentRepository;
import com.yourcompany.grocery.payments.repository.PaymentTransactionRepository;
import com.yourcompany.grocery.payments.service.MockPaymentGateway;
import com.yourcompany.grocery.payments.service.PaymentService;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private PaymentTransactionRepository transactionRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderStatusHistoryRepository statusHistoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DeliveryService deliveryService;

    private MockPaymentGateway paymentGateway;
    private PaymentService paymentService;

    private UUID customerId;
    private User customer;
    private UUID orderId;
    private Order order;

    @BeforeEach
    void setUp() {
        paymentGateway = new MockPaymentGateway();
        paymentService = new PaymentService(
                paymentRepository,
                transactionRepository,
                orderRepository,
                statusHistoryRepository,
                userRepository,
                paymentGateway,
                deliveryService
        );

        customerId = UUID.randomUUID();
        customer = User.builder()
                .id(customerId)
                .email("test.customer@ozeonix.com")
                .firstName("Test")
                .lastName("Customer")
                .build();

        orderId = UUID.randomUUID();
        order = Order.builder()
                .id(orderId)
                .customer(customer)
                .totalAmount(new BigDecimal("25.50"))
                .status("CREATED")
                .paymentStatus("PENDING")
                .build();
    }

    @Test
    @DisplayName("Process payment successfully for Card/Digital Wallet")
    void testProcessPayment_Success_Card() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProcessPaymentRequest request = ProcessPaymentRequest.builder()
                .orderId(orderId)
                .paymentMethod("CARD")
                .paymentToken("tok_mock_valid_123")
                .gatewayProvider("MOCK")
                .build();

        PaymentDto result = paymentService.processPayment(customerId, request);

        assertNotNull(result);
        assertEquals("CAPTURED", result.getStatus());
        assertEquals(new BigDecimal("25.50"), result.getAmount());
        assertEquals("PAID", order.getPaymentStatus());
        assertEquals("CONFIRMED", order.getStatus());

        verify(paymentRepository, atLeastOnce()).save(any(Payment.class));
        verify(transactionRepository, atLeastOnce()).save(any());
        verify(deliveryService, times(1)).createDeliveryForOrder(order);
    }

    @Test
    @DisplayName("Process payment for Cash on Delivery sets status to PENDING")
    void testProcessPayment_Success_CashOnDelivery() {
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(orderId)).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProcessPaymentRequest request = ProcessPaymentRequest.builder()
                .orderId(orderId)
                .paymentMethod("COD")
                .gatewayProvider("MOCK")
                .build();

        PaymentDto result = paymentService.processPayment(customerId, request);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals("PENDING", order.getPaymentStatus());
        assertEquals("CONFIRMED", order.getStatus());

        verify(deliveryService, times(1)).createDeliveryForOrder(order);
    }

    @Test
    @DisplayName("Reject payment if order is already marked PAID")
    void testProcessPayment_OrderAlreadyPaid_ThrowsBadRequest() {
        order.setPaymentStatus("PAID");
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        ProcessPaymentRequest request = ProcessPaymentRequest.builder()
                .orderId(orderId)
                .paymentMethod("CARD")
                .build();

        assertThrows(BadRequestException.class, () -> paymentService.processPayment(customerId, request));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reject payment if order belongs to a different customer")
    void testProcessPayment_WrongCustomer_ThrowsBadRequest() {
        UUID wrongCustomerId = UUID.randomUUID();
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        ProcessPaymentRequest request = ProcessPaymentRequest.builder()
                .orderId(orderId)
                .paymentMethod("CARD")
                .build();

        assertThrows(BadRequestException.class, () -> paymentService.processPayment(wrongCustomerId, request));
        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reject payment if order is not found")
    void testProcessPayment_OrderNotFound_ThrowsResourceNotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(orderRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        ProcessPaymentRequest request = ProcessPaymentRequest.builder()
                .orderId(nonExistentId)
                .paymentMethod("CARD")
                .build();

        assertThrows(ResourceNotFoundException.class, () -> paymentService.processPayment(customerId, request));
    }
}
