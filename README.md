# Grocery Platform — Antigravity Workspace

This repository is the architectural workspace for a complete grocery online delivery platform.

Target local path:

`/home/bhola-dev58/Ozeonix/grocery-platform`

## Product surfaces

1. Admin web dashboard
2. Store/merchant web dashboard
3. Customer web application
4. Customer Flutter mobile app
5. Delivery partner Flutter mobile app
6. Store Flutter mobile app

## Technology stack

- Web: React.js + TypeScript
- Mobile: Flutter + Dart
- Core backend: Spring Boot + Java
- Supporting services: Node.js + Express + TypeScript
- Primary database: PostgreSQL
- Cache, ephemeral state and queues: Redis
- Object storage: S3-compatible storage
- Local infrastructure: Docker / Docker Compose
- Production routing: Nginx / API Gateway
- API style: REST, with WebSocket for realtime use cases
- Future event backbone: Kafka, only when actual scale requires it

## Architecture philosophy

Start with a modular monolith in Spring Boot plus small supporting Node services.

Do NOT start by creating a large collection of microservices.

The core API should have strong domain boundaries so domains can later be extracted without rewriting the business model.

Future extraction target:

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

Introduce this architecture only when measurable operational or scaling requirements justify it.

## Agent instructions

Before doing implementation work, agents MUST read:

1. `AGENTS.md`
2. `.agent/brain/00-project-context.md`
3. `.agent/brain/01-architecture-principles.md`
4. Relevant architecture documentation
5. Relevant `.agent/skills/*.md`

The documentation is the project's source of truth.
