# ADR-004: Service Extraction Criteria

## Status
Accepted

## Context
The platform is currently implemented as a cohesive modular monolith (`services/core-api`) accompanied by specialized Node.js runtime services (`realtime-api`, `notification-api`). As customer adoption grows, business pressure may tempt premature extraction into microservices (e.g. `Order Service`, `Delivery Service`, `User Service`).

This ADR establishes non-negotiable criteria that must be satisfied before any domain boundary is extracted into an independent deployable microservice.

## Extraction Decision Rule

Do **not** extract a service based on architectural fashion, team preference, or theoretical scalability. A service extraction is approved **only** when at least two of the following four triggers are empirically satisfied:

### Trigger 1: Team & Deployment Independence
- Two or more distinct engineering teams (≥ 6 engineers each) are actively committing to conflicting areas of the monolith codebase.
- Deployment cadence requires independent release cycles (e.g., Delivery Logistics pod must deploy 10 times daily without triggering Core API redeployments).

### Trigger 2: Divergent Hardware Resource Profiles
- The domain workload has an asymmetric compute/memory requirement that forces inefficient monolith scaling:
  - Example: Delivery routing algorithms require intensive GPU/CPU optimization while Core API is primarily memory/IO-bound.

### Trigger 3: Failure Blast-Radius Isolation
- The failure of the specific component poses a catastrophic risk to unrelated platform services (e.g., delivery GPS tracking spikes taking down checkout transactions).

### Trigger 4: Database Connection / Table Contention
- A single domain's query load accounts for >60% of database IOPS and cannot be mitigated by indexes, Redis caching, or read replicas.

## Extraction Sequence & Non-Negotiable Prerequisites

When extraction criteria are satisfied, services must be extracted in this order:
1. **Delivery Service**: Decoupled from store catalog and customer accounts.
2. **Order Service**: Core state machine and ledger.
3. **User / Auth Service**: Identity provider.

### Prerequisites Before Code Cut:
1. **Isolated Data Store**: The extracted service owns its private database. No direct cross-database queries or foreign keys.
2. **Transactional Outbox Pattern**: Asynchronous state propagation using an outbox table to avoid distributed two-phase commit (2PC).
3. **Formal API Contracts**: Shared protobuf or OpenAPI specifications published to `packages/api-contracts`.
4. **Resilience & Fallbacks**: Circuit breakers, retry policies with exponential backoff, and idempotent consumers.
