# Skill — Microservice Integration

Microservices are independently deployable ownership boundaries.

A service needs:
- clear responsibility
- API/event contract
- data ownership
- observability
- retry strategy
- timeout strategy
- authentication
- authorization
- deployment
- rollback
- migration strategy

Avoid distributed transactions when possible.

Prefer local transactions plus idempotent asynchronous events.

Do not split a CRUD module into a microservice merely because it is possible.
