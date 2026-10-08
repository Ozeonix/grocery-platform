You are the lead software architect and senior full-stack engineer for this project.

We are building a production-oriented **Grocery Online Delivery Platform** for a startup. This repository is the complete workspace for the project.

Before writing or modifying ANY code, you must first understand the existing workspace and architecture.

## 1. FIRST: READ THE PROJECT KNOWLEDGE

Start by reading these files completely:

1. `AGENTS.md`
2. `.agent/brain/00-project-context.md`
3. `.agent/brain/01-architecture-principles.md`
4. `.agent/brain/02-domain-model.md`
5. `.agent/brain/03-agent-coordination.md`
6. `.agent/brain/04-quality-bar.md`
7. `.agent/brain/05-scale-strategy.md`
8. `.agent/brain/06-security.md`

Then read all relevant files under:

```text
.agent/skills/
```

Especially the skills related to:

* system design
* API design
* database engineering
* clean code
* codebase hygiene
* scalability
* microservices
* Kafka/events
* Redis
* security
* Docker/DevOps
* CI/CD
* observability
* testing
* React
* Flutter
* realtime
* integrations
* production readiness

After that, read:

```text
docs/architecture/
docs/database/
docs/api/
docs/decisions/
```

Do not skip these documents.

They are the project's architecture source of truth.

---

# 2. UNDERSTAND THE PRODUCT

The platform contains:

### Web

* Admin Dashboard
* Store/Merchant Dashboard
* Customer Web Application

### Mobile

* Customer Flutter App
* Delivery Partner Flutter App
* Store Flutter App

### Backend

* Spring Boot Core API
* Node.js + Express Realtime API
* Node.js + Express Notification API
* Node.js Worker

### Infrastructure

* PostgreSQL
* Redis
* S3-compatible object storage
* Docker
* Nginx/API Gateway

### Future architecture

We may eventually evolve into:

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

IMPORTANT:

Do NOT implement this microservice architecture now.

Start with the documented modular-monolith architecture.

Only recommend/extract services when actual measured scale, reliability, deployment independence, team ownership, or workload requirements justify doing so.

Kafka must also NOT be introduced just because it appears in the future architecture.

---

# 3. TECHNOLOGY RULES

Use:

```text
Web:
React.js + TypeScript

Mobile:
Flutter + Dart

Core Backend:
Spring Boot + Java

Supporting Backend:
Node.js + Express + TypeScript

Database:
PostgreSQL

Cache / Queue:
Redis

Object Storage:
S3-compatible storage

Local Infrastructure:
Docker / Docker Compose

Production Routing:
Nginx / API Gateway

API:
REST

Realtime:
WebSocket where justified

Future Event Infrastructure:
Kafka
```

Do not introduce another technology without a real technical reason and without checking the existing architecture documentation.

Do not introduce MySQL by default. PostgreSQL is the primary database.

---

# 4. YOUR FIRST TASK IS NOT CODING

Before implementing features, inspect the entire repository.

Understand:

```text
apps/
services/
packages/
database/
infrastructure/
docs/
.agent/
```

Check what already exists.

Do NOT overwrite working files.

Do NOT generate duplicate architecture.

Do NOT create unnecessary boilerplate.

Do NOT start installing random dependencies.

Do NOT create microservices prematurely.

---

# 5. CREATE AN ARCHITECTURE VALIDATION REPORT

After reading the repository, give me a concise report containing:

### A. Current workspace structure

Show what exists and what each major directory is responsible for.

### B. Architecture understanding

Explain how you understand:

```text
React/Flutter
      ↓
Nginx/API Gateway
      ↓
Spring Boot Core API
      ↓
PostgreSQL
      ↓
Redis / S3
```

and where Node.js services fit.

### C. Domain boundaries

Explain the responsibilities of:

```text
Auth
Users
Stores
Products
Inventory
Cart
Orders
Payments
Delivery
Notifications
Support
```

### D. Agent responsibilities

Explain which agent/workspace area should own:

```text
Web
Mobile
Backend
Realtime
Notifications
Workers
Infrastructure
Database
```

### E. Future scalability

Explain exactly under what conditions you would recommend extracting:

```text
User Service
Order Service
Delivery Service
```

and when Kafka should be introduced.

### F. Risks

Identify architectural risks you see before implementation.

---

# 6. DO NOT ASK ME BASIC ARCHITECTURE QUESTIONS

The repository already contains the project's architecture decisions.

Use those documents as the default source of truth.

Only ask me a question if:

1. The requirement is genuinely ambiguous,
2. Two documented decisions conflict,
3. A business rule cannot reasonably be inferred,
4. A destructive or irreversible decision is required.

Otherwise make the smallest reasonable engineering decision and document it.

---

# 7. AFTER THE REPORT

Do NOT immediately build the entire platform.

Wait for my approval after the architecture validation report.

Once approved, we will build incrementally using vertical slices.

The first implementation milestone will be:

```text
Workspace
   ↓
Docker infrastructure
   ↓
PostgreSQL
   ↓
Redis
   ↓
S3-compatible storage
   ↓
Spring Boot Core API
   ↓
Authentication
   ↓
User/Roles
   ↓
Basic React applications
   ↓
Basic Flutter applications
```

Then we will progressively implement:

```text
Stores
   ↓
Products
   ↓
Inventory
   ↓
Cart
   ↓
Checkout
   ↓
Orders
   ↓
Payments
   ↓
Delivery
   ↓
Realtime Tracking
   ↓
Notifications
   ↓
Admin Operations
```

Always keep the system runnable after each milestone.

Your goal is not to generate the maximum amount of code.

Your goal is to build a **clean, maintainable, scalable system that another senior engineer can understand and continue developing.**

Start now by reading the project knowledge and architecture files, inspecting the repository, and then give me the architecture validation report.

Do not modify application code yet.
