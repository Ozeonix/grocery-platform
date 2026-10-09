# ADR-005: Kafka Adoption Triggers and Architecture Boundary

## Status
Accepted

## Context
Apache Kafka is commonly introduced prematurely in startup architectures, adding substantial operational overhead (ZooKeeper/KRaft quorum management, partition rebalancing, storage footprint, and consumer group offset management).

The platform currently leverages Redis for caching, job queues, and lightweight ephemeral Pub/Sub (`order:status_changed`, `delivery:location`).

This ADR establishes explicit technical thresholds for when Apache Kafka must be introduced into the grocery delivery platform infrastructure.

## Decision

Continue using Redis Pub/Sub, BullMQ job queues, and direct synchronous Spring Boot execution until one or more of the following **review triggers** occur, at which point an architectural evaluation is conducted:

> [!NOTE]
> The thresholds below are strictly **review triggers** prompting evaluation of actual telemetry and operational overhead, **not unconditional migration rules**. See the authoritative [ADR-005: Kafka Adoption Review Triggers and Evaluation Criteria](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/decisions/ADR-005-kafka-adoption.md).

### Review Trigger 1: Event Persistence & Consumer Replay Requirement
- Business demands require replaying historic events from arbitrary offsets (e.g., rebuilding analytics read models, training machine learning demand forecasting models from event logs, or auditing historical pricing fluctuations).
- *Redis limitation:* Redis Pub/Sub is fire-and-forget; if a consumer is offline, messages are lost.

### Review Trigger 2: High Fan-Out Across Multiple Independent Consumer Services
- More than 3 independent services subscribe to the same business event streams (e.g. Order Placed event must be consumed simultaneously by Inventory, Notifications, Analytics Data Lake, and Fraud Detection services at different processing speeds).
- *Benefit:* Kafka consumer groups allow competing consumers to process at their own pace without impacting publishers.

### Review Trigger 3: Sustained Event Volume Exceeding In-Memory Limits
- Sustained event ingest exceeds **25,000 events/second** (e.g., city-wide high-frequency IoT telematics and fine-grained rider telemetry).
- *Redis limitation:* Holding high-volume event buffers in Redis risks memory exhaustion and cache eviction.


## Transition Architecture Blueprint

When Kafka is activated:

```text
Core API / Extracted Services
       │ (Transactional Outbox)
       ▼
   PostgreSQL ──► Debezium / CDC Poller
                        │
                        ▼
                 Apache Kafka Cluster
           ┌────────────┼────────────┐
           ▼            ▼            ▼
     Notification   Analytics    Realtime API
       Service      Pipeline     (WebSocket)
```

Until these triggers are verified by telemetry, Kafka remains disabled (`KAFKA_ENABLED=false` in `.env`).
