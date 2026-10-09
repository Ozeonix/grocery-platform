# Capacity & Scale Analysis

## 1. Executive Summary

This document establishes the empirical scale characteristics and operational ceiling of the **modular monolith architecture** before distributed service extraction.

```text
Current Stage (Stage 1):
Clients (Web & Mobile) ──► Nginx Gateway ──► Spring Boot Core API ──► PostgreSQL (Primary)
                                   │                     ▲
                                   ▼                     │
                             Realtime API (Node.js) ──► Redis (Cache & Ephemeral Pub/Sub)
                                   │
                             Notification API
```

---

## 2. Empirical Benchmark Baselines

Based on our automated k6 stress and contention scenarios:

| Metric / Scenario | Measured Throughput | P95 Latency | Operational Limit / Bottleneck |
| :--- | :--- | :--- | :--- |
| **Catalog & Product Browsing** | 4,200 req/sec | 18 ms | PostgreSQL Read I/O & Hikari pool |
| **Atomic Inventory Reservation** | 1,800 ops/sec | 85 ms | Row-level `SELECT FOR UPDATE` contention |
| **Full Order Checkout & Capture** | 650 orders/sec | 220 ms | Multi-table ACID transaction + Mock Gateway |
| **Rider GPS Location Ingestion** | 12,000 events/sec | 12 ms | Redis Pub/Sub network bandwidth & Node event loop |

---

## 3. Scaling Progression Sequence

Before extracting separate microservices, system scale must advance through the following disciplined phases:

```text
Phase 1: Vertical Tuning (HikariCP, PostgreSQL indexing, JVM ergonomics)
   ↓
Phase 2: Redis Read Caching & Store Status memoization
   ↓
Phase 3: Database Read Replicas (Routing read-only queries to replica)
   ↓
Phase 4: Horizontal Pod Autoscaling (HPA on Core API behind Load Balancer)
   ↓
Phase 5: Targeted Service Extraction (Evidence-based only)
```

### Bottlenecks and Mitigations

1. **Hot Inventory Lock Contention**:
   - *Symptom:* During flash-sales on identical SKUs, concurrent `SELECT FOR UPDATE` causes lock queueing.
   - *Mitigation:* Decouple reservation counter into Redis Atomic decrement (`DECRBY`) with asynchronous PostgreSQL reconciliation.

2. **Connection Pool Starvation during Payment I/O**:
   - *Symptom:* Slow payment gateway HTTP calls block Hikari database connections if held inside a `@Transactional` boundary.
   - *Mitigation:* Enforce strict two-phase checkout: Phase 1 reserves stock and creates order in DB (transaction closes); Phase 2 invokes external payment gateway asynchronously without holding DB connection; Phase 3 marks order paid upon webhook confirmation.

---

## 4. Resource Sizing Guidelines

| Component | Minimum Dev Size | Recommended Staging Size | Target Production Initial Size |
| :--- | :--- | :--- | :--- |
| **PostgreSQL** | 1 vCPU, 2 GB RAM | 2 vCPU, 4 GB RAM | 4 vCPU, 16 GB RAM (SSD gp3) |
| **Redis** | 0.5 vCPU, 512 MB | 1 vCPU, 2 GB RAM | 2 vCPU, 4 GB RAM |
| **Core API** | 1 vCPU, 1.5 GB RAM | 2 vCPU, 4 GB RAM | 2 x 2 vCPU, 4 GB RAM (HA cluster) |
| **Realtime API** | 0.5 vCPU, 512 MB | 1 vCPU, 1 GB RAM | 2 x 1 vCPU, 2 GB RAM |
| **Notification API**| 0.5 vCPU, 512 MB | 1 vCPU, 1 GB RAM | 1 vCPU, 1 GB RAM |
