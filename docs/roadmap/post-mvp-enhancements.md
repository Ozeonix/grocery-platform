# Post-MVP Technical Enhancements Roadmap

## Executive Summary

The grocery delivery platform MVP establishes a rock-solid, production-ready foundation powered by a modular monolith architecture ([services/core-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api)), specialized Node.js edge services ([services/realtime-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/realtime-api) and [services/worker](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/worker)), PostgreSQL, and Redis. 

To ensure lean delivery, eliminate speculative architectural debt, and avoid unbudgeted third-party service dependencies during initial deployment, select capabilities are implemented with deterministic mock layers or lightweight existing infrastructure (Redis).

This document formally specifies three **post-MVP enhancements**, defining their:
- **Purpose**
- **Current MVP Approach**
- **Prerequisites**
- **Acceptance Criteria**
- **Risks & Mitigation**
- **Measurable Activation Conditions**

> [!IMPORTANT]
> **Production Security & Tracking Integrity Notice:**  
> These items are tracked as post-MVP enhancements only because the current MVP operates in a staged demo/testing mode with simulated gateways and coordinate broadcasts. If the business decides to accept real monetary transactions or market true live courier tracking to end-users prior to full post-MVP rollout, **payment security (cryptographic webhook validation, signature checking, idempotency, PCI compliance) and functional tracking cannot be postponed or bypassed**. They must be promoted to blocking MVP requirements immediately.

---

## 1. Production Payment Gateway Integration (Khalti & eSewa)

### 1.1 Purpose
Replace the local mock payment gateway with production-grade Nepali digital payment service providers (**Khalti** and **eSewa**). This provides real-time digital payment processing, secure webhooks, automated transaction reconciliation, cryptographic signature verification, and automated handling of network dropouts or user abandonments.

### 1.2 Current MVP Approach
- The backend utilizes [MockPaymentGateway.java](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api/src/main/java/com/yourcompany/grocery/payments/service/MockPaymentGateway.java) implementing the [PaymentGateway](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api/src/main/java/com/yourcompany/grocery/payments/service/PaymentGateway.java) interface.
- Payments submitted via Cash on Delivery (`COD`) return simulated `PENDING_COLLECTION` state; card or wallet payments return simulated `CAPTURED` state using generated UUIDs.
- No third-party network requests, cryptographic signatures, or external webhook endpoints are currently configured.

### 1.3 Prerequisites
1. **Merchant Verification & API Credentials:**
   - Formal corporate entity registration in Nepal.
   - Executed merchant agreements with Khalti (Khalti ePay v2 / Merchant API keys) and eSewa (ePay v2 merchant code and secret key).
2. **Infrastructure & Secret Management:**
   - Public HTTPS domain with trusted SSL certificates for webhook ingress.
   - Secret injection via environment variables or secret manager (`KHALTI_SECRET_KEY`, `KHALTI_PUBLIC_KEY`, `ESEWA_MERCHANT_CODE`, `ESEWA_SECRET_KEY`). No secrets in repository.
3. **Database Schema Enhancements:**
   - Dedicated table or columns in PostgreSQL for webhook event tracking and payment idempotency logs (`payment_webhook_events`, `idempotency_key`, `raw_payload`, `processed_at`).

### 1.4 Acceptance Criteria
- [ ] **Initiation & Redirection:**
  - `POST /api/v1/payments/initiate` creates a local pending payment transaction record and returns the authorized gateway checkout URL or token to the customer frontend.
- [ ] **Cryptographic Signature Validation:**
  - Ingress webhook endpoints (`/api/v1/payments/webhooks/khalti` and `/api/v1/payments/webhooks/esewa`) strictly verify HMAC-SHA256 signatures before reading request payloads. Unsigned or invalid requests are rejected with HTTP 401/400 and logged for security auditing.
- [ ] **Strict Idempotency:**
  - Ingress webhooks use unique transaction identifiers (`transaction_uuid` / `pidx`) as idempotency keys. Duplicate deliveries return HTTP 200 without duplicate order state transitions or duplicate notifications.
- [ ] **Automated Payment State Reconciliation:**
  - Scheduled background worker runs every 15 minutes to query Khalti Lookup (`/api/v2/epay/lookup/`) and eSewa Status Inquiry APIs for payments lingering in `PENDING` state for >10 minutes (reconciling abandoned browser redirects).
- [ ] **Comprehensive Audit Trail & Zero Plaintext Data:**
  - Full transaction request and response metadata stored in [PaymentTransaction.java](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api/src/main/java/com/yourcompany/grocery/payments/entity/PaymentTransaction.java) with sensitive customer tokens sanitized.

### 1.5 Risks & Mitigation Strategies
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Webhook Replay / Forgery Attacks** | Critical | Enforce HMAC-SHA256 signature verification with gateway public/secret keys. Enforce replay timestamp expiration window (<= 300 seconds). |
| **Double Credit / State Race Conditions** | High | PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) on the `payments` record during webhook execution combined with unique database constraint on `gateway_payment_id`. |
| **Customer Closes Browser Before Redirect** | High | Automated background reconciliation job querying provider inquiry APIs to mark payment captured or expired. |
| **Provider Downtime / Timeouts** | Medium | Graceful retry policies with exponential backoff on verification calls, circuit breaker protection, and fallback prompt to Cash on Delivery. |

### 1.6 Measurable Activation Conditions
Activate production payment integration when **any** of the following conditions are met:
1. **Commercial Launch:** Scheduled public launch where real monetary collection is legally and commercially required.
2. **Merchant Approval:** Both Khalti and eSewa merchant verification procedures are signed and production API credentials are provisioned.
3. **Transaction Volume Intent:** Business determines that >20% of orders require digital wallet payment at checkout rather than COD.

---

## 2. Real Map Integration (Google Maps Platform)

### 2.1 Purpose
Replace the static and mock visual representations in the web customer portal ([apps/customer-web/src/features/tracking/OrderTrackingModal.tsx](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-web/src/features/tracking/OrderTrackingModal.tsx)) and Flutter applications ([apps/customer-mobile](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-mobile) and [apps/delivery-mobile](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/delivery-mobile)) with real **Google Maps Platform SDKs**. This provides accurate route navigation, dynamic polylines, geocoded store/customer markers, live delivery vehicle movement, and accurate turn-by-turn or arrival time calculations.

### 2.2 Current MVP Approach
- [OrderTrackingModal.tsx](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-web/src/features/tracking/OrderTrackingModal.tsx) displays a placeholder container with an emoji (`🗺️`), static distance text, and an interval timer simulating rider progress.
- Flutter mobile apps ([apps/customer-mobile/lib/features/tracking/tracking_screen.dart](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-mobile/lib/features/tracking/tracking_screen.dart)) render a stylized container with `Icon(Icons.map)` and simulated text updates.
- Real-time location messages are broadcast via WebSocket through [services/realtime-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/realtime-api), but rendered only as numerical status strings without visual map tiles.

### 2.3 Prerequisites
1. **Google Cloud Platform (GCP) Configuration:**
   - Active GCP billing account with Google Maps Platform enabled.
   - Specific APIs enabled: *Maps JavaScript API*, *Maps SDK for Android*, *Maps SDK for iOS*, *Directions API*, *Geocoding API*.
2. **API Key Security & Hardening:**
   - Web API keys locked down by HTTP Referrer restrictions (e.g., `https://grocery.ozeonix.com/*`).
   - Android API keys restricted by SHA-1 certificate fingerprint and application package name (`com.ozeonix.grocery.*`).
   - iOS API keys restricted by iOS Bundle Identifier.
   - Sensitive server-side APIs (Directions, Distance Matrix) proxied via backend service to avoid client-side API key abuse.
   - Daily quota caps and GCP billing alert thresholds configured to prevent unexpected charges.
3. **Device Permissions & Client Dependencies:**
   - Add native location permissions in `AndroidManifest.xml` (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`) and `Info.plist` (`NSLocationWhenInUseUsageDescription`).
   - Package dependencies: `@react-google-maps/api` for React web; `google_maps_flutter` and `geolocator` for Flutter apps.

### 2.4 Acceptance Criteria
- [ ] **Web Customer Portal ([OrderTrackingModal.tsx](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-web/src/features/tracking/OrderTrackingModal.tsx)):**
  - Replaces placeholder icon container with an interactive Google Map widget centered on the delivery bounds.
  - Displays distinct custom markers for Store location, Customer delivery address, and Driver location.
  - Renders a driving polyline between origin and destination fetched via backend Directions proxy.
- [ ] **Flutter Customer App ([apps/customer-mobile](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-mobile)):**
  - Embeds `GoogleMap` widget with smooth camera animations.
  - Updates driver marker location in real time as WebSocket coordinate updates are received, including bearing angle calculation for vehicle orientation.
- [ ] **Flutter Delivery App ([apps/delivery-mobile](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/delivery-mobile)):**
  - Renders map route navigation with turn instructions from driver's current GPS position to customer destination.
  - Integrates `geolocator` to stream background location coordinates to [services/realtime-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/realtime-api) at throttled intervals (5–10 seconds).
- [ ] **Graceful Fallbacks & Permission Handlers:**
  - Clear user prompts for location permission with UI fallback if permission is denied or device GPS is unavailable.

### 2.5 Risks & Mitigation Strategies
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Unbounded Google Maps API Incurred Cost** | High | Proxy routing requests through server-side Redis cache with 30-minute TTL for identical route queries. Set daily quota limits in Google Cloud Console. |
| **API Key Leakage & Scraping** | High | Apply strict domain referrer and SHA-1 application restrictions. Never expose unrestricted or server keys in client bundle. |
| **Excessive Mobile Battery & Data Drain** | Medium | Throttle mobile rider GPS broadcasts to adaptive intervals (e.g., 5 seconds when moving, 30 seconds when stationary). |
| **Intermittent Mobile Connectivity** | Medium | Implement dead-reckoning / linear interpolation on client screens so vehicle marker glides smoothly between coordinate updates. |

### 2.6 Measurable Activation Conditions
Activate real map integration when **any** of the following conditions are met:
1. **Fleet Size Scale:** Delivery fleet expands beyond 10 active concurrent couriers where manual address lookup causes delivery delay.
2. **Order Density:** Store processes >100 deliveries per day where delivery support tickets concerning courier whereabouts exceed 5% of orders.
3. **Commercial Budget Approval:** Operational budget approved for Google Maps Platform API consumption ($200 monthly free tier exceeded by usage forecast).

---

## 3. Apache Kafka Adoption

### 3.1 Purpose
Introduce Apache Kafka as an enterprise distributed event streaming platform to support durable event log persistence, consumer group replayability, and high-throughput asynchronous communication across independently deployed microservices.

### 3.2 Current MVP Approach
- The platform operates as a cohesive **modular monolith** with Spring Boot ([services/core-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api)).
- Asynchronous tasks (notifications, batch jobs) are processed via Redis BullMQ / queues in [services/worker](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/worker).
- Realtime telemetry and tracking events are fanned out via lightweight Redis Pub/Sub through [services/realtime-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/realtime-api).
- Relational integrity and transactions are maintained within PostgreSQL.

### 3.3 Prerequisites
1. **Service Extraction Matured:** Core domains (such as Delivery Logistics or Order Management) have been formally extracted into autonomous microservices according to [ADR-004: Service Extraction Criteria](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/decisions/ADR-004-service-extraction-criteria.md).
2. **Transactional Outbox & CDC Pipeline:** Implementation of the Transactional Outbox pattern in PostgreSQL and Debezium / Kafka Connect infrastructure to avoid dual-write hazards.
3. **Operational Readiness & Tooling:** KRaft-based Kafka cluster running in high availability with Prometheus Kafka Exporters, Grafana monitoring dashboards, and Schema Registry (Confluent / Apicurio) for schema contract enforcement.
4. **Team Operational Capacity:** Dedicated DevOps/SRE support capable of managing partition rebalancing, storage compaction, consumer lag alerts, and disaster recovery.

### 3.4 Acceptance Criteria
- [ ] **Architecture Review Board Evaluation:**
  - Formal architectural review convened to evaluate measured telemetry before any code migration begins.
  - Review confirms that existing Redis and PostgreSQL optimizations cannot satisfy documented throughput or replay requirements.
- [ ] **Event Schema Governance:**
  - Strict Avro or Protobuf schemas versioned in `packages/event-contracts` and registered in Schema Registry.
- [ ] **Guaranteed Delivery & Outbox:**
  - Core services write business changes and outbox events within a single local PostgreSQL database transaction.
  - Kafka producers use `acks=all`, idempotent producer flags enabled, and retries with backoff.
- [ ] **Idempotent Consumer Implementation:**
  - Downstream consumers track processed message IDs in deduplication stores to prevent double-processing.
- [ ] **Dead-Letter Queue (DLQ) & Lag Alerting:**
  - Unprocessable messages routed to dead-letter topics with automated alerting when consumer group lag exceeds 500 messages.

### 3.5 Risks & Mitigation Strategies
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Premature Operational Complexity** | High | Treat volume and fan-out thresholds strictly as **review triggers** rather than automatic migration orders. Keep modular monolith architecture with Redis until empirical metrics mandate change. |
| **Dual-Write State Inconsistency** | Critical | Enforce Transactional Outbox pattern; ban direct dual writes (e.g., writing to DB and Kafka in the same application method). |
| **Consumer Group Rebalance Freezes** | Medium | Use static consumer group membership and tune `max.poll.interval.ms` to prevent rebalances during batch workloads. |
| **Significant Infrastructure Overhead** | High | Quantify hosting costs of redundant broker clusters versus managed Redis before greenlighting deployment. |

### 3.6 Measurable Activation Conditions (Review Triggers vs. Migration Rules)

> [!CAUTION]
> **Proposed thresholds are review triggers, NOT unconditional migration rules.**  
> Hitting a numerical metric does not trigger an automatic rewrite. Instead, it schedules an architecture review to evaluate actual metrics, operational burden, and alternative solutions before deciding on adoption.

| Review Trigger Threshold | Metric & Condition | Purpose of Review |
| :--- | :--- | :--- |
| **Throughput Trigger** | Sustained event volume > **25,000 events/second** across 7 consecutive days | Evaluate whether Redis Pub/Sub memory utilization or network saturation limits are reached, or whether batching/clustering Redis suffices. |
| **Fan-Out Trigger** | A single domain event is consumed by > **3 independent services** at differing processing rates | Evaluate whether independent consumer group offsets, slow consumer backpressure, and replayability justify Kafka's operational cost. |
| **Durable Replay Trigger** | Business/compliance requirement to replay event history from arbitrary offsets over >30 days | Evaluate if event sourcing / log retention is required versus PostgreSQL audit tables or data lake batch exports. |

---

## 4. Architecture Governance & Summary

| Enhancement | Current MVP Solution | Post-MVP Target | Key Governance Constraint |
| :--- | :--- | :--- | :--- |
| **Payments** | [MockPaymentGateway.java](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api/src/main/java/com/yourcompany/grocery/payments/service/MockPaymentGateway.java) (COD & simulated tokens) | Production Khalti & eSewa APIs + HMAC webhook verification + auto-reconciliation | Must NOT be deferred if real money is accepted in initial launch. |
| **Maps** | [OrderTrackingModal.tsx](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-web/src/features/tracking/OrderTrackingModal.tsx) mock UI & WebSocket coordinate streaming | Google Maps JavaScript API + Mobile SDKs + Directions proxy | Must NOT be deferred if true navigation is promised to couriers. |
| **Messaging** | Redis Pub/Sub + BullMQ queues in modular monolith | Apache Kafka Cluster + Transactional Outbox + Schema Registry | Evaluate metrics and operational overhead before adoption; thresholds are review triggers only. |

*Document maintained under platform architectural governance in accordance with [AGENTS.md](file:///home/bhola-dev58/Ozeonix/grocery-platform/AGENTS.md).*
