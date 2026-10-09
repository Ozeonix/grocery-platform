# Load Testing & Performance Benchmark Suite

This directory contains automated k6 performance and stress test suites for the Grocery Online Delivery Platform.

## Target Scenarios

### 1. Flash-Sale Inventory Contention (`scenarios/inventory_contention_test.js`)
- **Objective:** Validates atomic row-level locking (`SELECT FOR UPDATE`) under high concurrency.
- **Verification:** Ensures zero overselling and graceful `400 Insufficient Stock` responses once physical inventory is exhausted.
- **Traffic Profile:** 100 to 500 concurrent virtual users hitting the same SKU simultaneously.

### 2. End-to-End Checkout & Payment Throughput (`scenarios/checkout_payment_flow_test.js`)
- **Objective:** Measures order placement latency, database transaction duration, and mock gateway response under sustained traffic.
- **SLO Targets:**
  - P95 Latency < 250ms
  - Error rate < 1%
  - Throughput > 150 requests/sec

### 3. Realtime Location Streaming & WebSocket Stress (`scenarios/realtime_tracking_load_test.js`)
- **Objective:** Benchmarks Socket.IO and Redis Pub/Sub broadcast capacity under hundreds of active rider location broadcasts.

## Running Tests

Using k6:
```bash
# Run flash-sale inventory contention test
k6 run scenarios/inventory_contention_test.js

# Run full checkout & payment flow test
k6 run scenarios/checkout_payment_flow_test.js

# Run realtime websocket tracking test
k6 run scenarios/realtime_tracking_load_test.js
```
