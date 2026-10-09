# ADR-005: Kafka Adoption Review Triggers and Evaluation Criteria

## Status
Accepted

## Context
Apache Kafka is frequently introduced prematurely in early-stage architectures, bringing substantial operational overhead:
- KRaft/ZooKeeper quorum management and cluster maintenance.
- Partition distribution, rebalancing pauses, and disk storage footprints.
- Schema Registry (Avro/Protobuf) contract enforcement and backward-compatibility governance.
- Consumer group offset lag monitoring, replay management, and dead-letter queue (DLQ) operations.
- Substantial infrastructure hosting costs and team cognitive load.

The grocery platform currently operates efficiently as a modular monolith ([services/core-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/core-api)) utilizing PostgreSQL for relational consistency and transactions, Redis for caching and BullMQ job queues ([services/worker](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/worker)), and Redis Pub/Sub for lightweight ephemeral event broadcasting ([services/realtime-api](file:///home/bhola-dev58/Ozeonix/grocery-platform/services/realtime-api)).

This ADR documents the architectural decision regarding Apache Kafka, formalizing specific capacity thresholds as **review triggers** rather than unconditional migration mandates.

## Decision

1. **Retain Modular Monolith with Redis & PostgreSQL:**
   - Continue leveraging Redis Pub/Sub, BullMQ job queues, and synchronous Spring Boot transactions for the platform MVP.
   - Do not deploy Kafka brokers, add Kafka dependencies, or introduce distributed messaging infrastructure at this stage.

2. **Review Triggers vs. Unconditional Migration Rules:**
   - The proposed numerical thresholds (e.g., >25,000 events/sec or >3 consuming services) are defined strictly as **review triggers**, **not unconditional migration mandates**.
   - Hitting any threshold does not authorize automatic or unvetted adoption of Kafka.
   - Reaching a trigger initiates a formal **Architecture Review Board (ARB)** evaluation to analyze actual system metrics, Redis saturation, operational overhead, and cost tradeoffs before committing to a messaging infrastructure shift.

## Architectural Review Triggers

When production telemetry observes any of the following conditions, an architectural review must be scheduled:

### Review Trigger 1: Sustained Ingestion Throughput
- **Threshold:** Sustained platform event ingestion exceeds **25,000 events/second** over 7 consecutive days (e.g., fine-grained rider telematics, city-wide IoT telemetry).
- **Review Evaluation:** Evaluate whether Redis memory usage or network bandwidth limits are actually saturated, or whether Redis clustering, event batching, or sampling sufficiently resolves the bottleneck before introducing Kafka.

### Review Trigger 2: High Fan-Out Across Multiple Independent Services
- **Threshold:** A single core business event stream is actively consumed by **more than 3 independent microservices** at divergent processing speeds (e.g., after domain boundaries are extracted per [ADR-004](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/decisions/ADR-004-service-extraction-criteria.md)).
- **Review Evaluation:** Assess whether independent consumer group offsets, backpressure isolation, and per-consumer replayability justify Kafka's operational burden, or if Redis Streams / message brokers with simpler operational profiles are appropriate.

### Review Trigger 3: Durable Event Replay & Long-Term Audit Retention
- **Threshold:** Business, financial, or regulatory requirements mandate replaying immutable event histories from arbitrary offsets across a multi-week/month retention window (e.g., event-sourced ledger reconstruction).
- **Review Evaluation:** Assess whether relational audit logs in PostgreSQL or cold-storage event archives (S3 / Parquet) meet the requirement, versus maintaining an active streaming Kafka cluster.

## Transition Architecture Blueprint (Upon Formal Approval)

If the Architecture Review Board empirically approves Kafka adoption based on measured requirements, the transition must follow this blueprint:

```text
Core API / Extracted Services
       │ (Single DB Transaction)
       ▼
   PostgreSQL ──► Transactional Outbox Table
                         │
                         ▼ (Debezium CDC / Poller)
                  Apache Kafka Cluster (KRaft)
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      Notification   Analytics    Realtime API
        Service      Pipeline     (WebSocket)
```

### Non-Negotiable Adoption Prerequisites:
1. **Transactional Outbox Pattern:** Direct dual-writes (writing to PostgreSQL and Kafka in the same application call) are strictly prohibited.
2. **Schema Registry Enforcement:** All event payloads must adhere to versioned schemas in `packages/event-contracts`.
3. **Idempotent Consumers:** Every downstream consumer must implement deduplication via unique event IDs.
4. **Dedicated Operations Runbooks:** Broker monitoring, partition rebalance alarms, consumer lag alerts, and automated backups in place.

## Consequences

- **Positive:** Preserves a simple, maintainable, and cost-effective modular architecture during MVP operations without unneeded infrastructure complexity.
- **Positive:** Establishes unambiguous, empirical triggers so architecture decisions are driven by measured reality rather than speculation or trend.
- **Negative:** If event replay or high multi-consumer fan-out becomes a day-one business requirement, migration review and rollout must be executed systematically.

---
*Related Documents:*
- [docs/roadmap/post-mvp-enhancements.md](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/roadmap/post-mvp-enhancements.md)
- [docs/decisions/ADR-004-service-extraction-criteria.md](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/decisions/ADR-004-service-extraction-criteria.md)
- [docs/architecture/capacity-and-scale-analysis.md](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/architecture/capacity-and-scale-analysis.md)
