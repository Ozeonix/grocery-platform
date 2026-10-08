# ADR-003: Kafka Only When Scale Requires It

Kafka is intentionally not required for the initial system.

Use Kafka later when measurable requirements justify:
- high event throughput
- independent service scaling
- durable asynchronous event processing
- multiple event consumers
- operational need for event replay

Until then, use direct synchronous APIs and Redis-backed jobs/events where appropriate.
