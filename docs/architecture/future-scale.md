# Future Scale Plan

Do not begin with microservices.

Measure:
- request volume
- order volume
- database load
- queue latency
- realtime connection count
- deployment frequency
- team ownership
- failure isolation needs

Then extract.

Likely first candidates:

1. Order Service
2. Delivery Service
3. User Service

Use Kafka as the event backbone when the extracted services need durable asynchronous communication.

Example:

```text
                    FUTURE
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   User Service    Order Service   Delivery Service
       │               │                │
       └───────────────┼────────────────┘
                       │
                    Events
                       │
                    Kafka
                       │
                  PostgreSQL
```

Do not assume all services must share one PostgreSQL instance forever. Database ownership should evolve with service boundaries.
