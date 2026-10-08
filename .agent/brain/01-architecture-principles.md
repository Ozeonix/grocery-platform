# Architecture Principles

1. Correctness before cleverness.
2. Simplicity before distributed complexity.
3. Explicit ownership.
4. PostgreSQL is the source of truth.
5. Business rules belong in the backend.
6. APIs are contracts.
7. Database migrations are mandatory.
8. Security is enforced server-side.
9. Observability is part of production design.
10. Every asynchronous operation needs retry/idempotency considerations.
11. Realtime is a delivery mechanism, not a source of truth.
12. Kafka is a scale tool, not a default dependency.
13. Extract services based on evidence.
14. Delete obsolete code.
15. Prefer small cohesive modules over giant abstractions.
