# Skill — Kafka & Events

Kafka is future infrastructure.

Use it when:
- event throughput is significant,
- multiple independent consumers exist,
- replay is valuable,
- services need loose coupling,
- asynchronous processing improves reliability.

Event design must include:
- event name
- version
- producer
- consumer
- schema
- key/partition strategy
- ordering expectations
- retry behavior
- dead-letter strategy
- idempotency

Never assume exactly-once business behavior simply because Kafka is present.
