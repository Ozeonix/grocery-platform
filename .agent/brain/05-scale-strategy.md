# Scale Strategy

Scale in stages.

Stage 1:
modular monolith + PostgreSQL + Redis + Node support services.

Stage 2:
measure bottlenecks, add indexes, caching, queues, read optimization and horizontal scaling.

Stage 3:
extract the highest-value domain services.

Likely first extraction candidates:
- Order
- Delivery
- User

Stage 4:
introduce Kafka for durable event distribution when service/event requirements justify it.

Do not introduce Kafka simply to claim an event-driven architecture.

Service extraction must have:
- clear ownership
- API contract
- data ownership
- observability
- deployment strategy
- failure/retry strategy
- migration/rollback plan
