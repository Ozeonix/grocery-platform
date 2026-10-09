package com.yourcompany.grocery.payments.service;

import com.yourcompany.grocery.common.exception.BadRequestException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.orders.entity.Order;
import com.yourcompany.grocery.orders.entity.OrderStatusHistory;
import com.yourcompany.grocery.orders.repository.OrderRepository;
import com.yourcompany.grocery.orders.repository.OrderStatusHistoryRepository;
import com.yourcompany.grocery.payments.dto.PaymentDto;
import com.yourcompany.grocery.payments.dto.ProcessPaymentRequest;
import com.yourcompany.grocery.payments.dto.RefundPaymentRequest;
import com.yourcompany.grocery.payments.entity.Payment;
import com.yourcompany.grocery.payments.entity.PaymentTransaction;
import com.yourcompany.grocery.payments.repository.PaymentRepository;
import com.yourcompany.grocery.payments.repository.PaymentTransactionRepository;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final PaymentGateway paymentGateway;

    @Transactional
    public PaymentDto processPayment(UUID customerId, ProcessPaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("Order does not belong to the authenticated user");
        }

        if ("PAID".equals(order.getPaymentStatus())) {
            throw new BadRequestException("Order is already paid");
        }

        String method = request.getPaymentMethod().toUpperCase();
        String provider = request.getGatewayProvider() != null ? request.getGatewayProvider().toUpperCase() : "MOCK";

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> Payment.builder()
                        .order(order)
                        .customer(order.getCustomer())
                        .amount(order.getTotalAmount())
                        .currency("USD")
                        .paymentMethod(method)
                        .gatewayProvider(provider)
                        .status("INITIATED")
                        .build());

        payment.setPaymentMethod(method);
        payment.setGatewayProvider(provider);

        PaymentGateway.ChargeResult result = paymentGateway.processCharge(payment, request.getPaymentToken());

        PaymentTransaction transaction = PaymentTransaction.builder()
                .payment(payment)
                .transactionType("CHARGE")
                .amount(payment.getAmount())
                .gatewayReference(result.gatewayReference())
                .gatewayResponse(result.rawResponse())
                .status(result.success() ? "SUCCESS" : "FAILED")
                .build();

        if (result.success()) {
            boolean isCod = "CASH_ON_DELIVERY".equals(method) || "COD".equals(method);

            if (isCod) {
                payment.setStatus("PENDING");
                payment.setGatewayPaymentId(result.gatewayPaymentId());
                order.setPaymentStatus("PENDING");
            } else {
                payment.setStatus("CAPTURED");
                payment.setGatewayPaymentId(result.gatewayPaymentId());
                order.setPaymentStatus("PAID");
            }

            if ("CREATED".equals(order.getStatus())) {
                String previousStatus = order.getStatus();
                order.setStatus("CONFIRMED");
                OrderStatusHistory history = OrderStatusHistory.builder()
                        .order(order)
                        .fromStatus(previousStatus)
                        .toStatus("CONFIRMED")
                        .reason(isCod ? "Order confirmed with Cash on Delivery" : "Order confirmed upon successful payment")
                        .changedBy(order.getCustomer())
                        .build();
                statusHistoryRepository.save(history);
            }
        } else {
            payment.setStatus("FAILED");
            order.setPaymentStatus("FAILED");
        }

        orderRepository.save(order);
        Payment savedPayment = paymentRepository.save(payment);
        transaction.setPayment(savedPayment);
        transactionRepository.save(transaction);
        savedPayment.getTransactions().add(transaction);

        if (!result.success()) {
            throw new BadRequestException("Payment failed: " + result.errorMessage());
        }

        return PaymentDto.fromEntity(savedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentDto getPaymentByOrderId(UUID orderId, UUID customerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment for order", "orderId", orderId));

        return PaymentDto.fromEntity(payment);
    }

    @Transactional
    public PaymentDto refundPayment(UUID actorId, UUID paymentId, RefundPaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (!"CAPTURED".equals(payment.getStatus())) {
            throw new BadRequestException("Only captured payments can be refunded. Current status: " + payment.getStatus());
        }

        if (request.getAmount().compareTo(payment.getAmount()) > 0) {
            throw new BadRequestException("Refund amount cannot exceed total payment amount");
        }

        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        PaymentGateway.RefundResult result = paymentGateway.processRefund(payment, request.getAmount(), request.getReason());

        PaymentTransaction transaction = PaymentTransaction.builder()
                .payment(payment)
                .transactionType("REFUND")
                .amount(request.getAmount())
                .gatewayReference(result.gatewayReference())
                .gatewayResponse(result.rawResponse())
                .status(result.success() ? "SUCCESS" : "FAILED")
                .build();

        transactionRepository.save(transaction);
        payment.getTransactions().add(transaction);

        if (result.success()) {
            if (request.getAmount().compareTo(payment.getAmount()) >= 0) {
                payment.setStatus("REFUNDED");
                payment.getOrder().setPaymentStatus("REFUNDED");
            } else {
                payment.setStatus("PARTIALLY_REFUNDED");
                payment.getOrder().setPaymentStatus("PARTIALLY_REFUNDED");
            }

            OrderStatusHistory history = OrderStatusHistory.builder()
                    .order(payment.getOrder())
                    .fromStatus(payment.getOrder().getStatus())
                    .toStatus(payment.getOrder().getStatus())
                    .reason("Payment refunded: " + request.getReason())
                    .changedBy(actor)
                    .build();
            statusHistoryRepository.save(history);
            orderRepository.save(payment.getOrder());
        } else {
            throw new BadRequestException("Refund failed: " + result.errorMessage());
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return PaymentDto.fromEntity(updatedPayment);
    }
}
