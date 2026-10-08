# Root Agent Contract

## Mandatory startup behavior

Before modifying code:

1. Read this file.
2. Read `.agent/brain/00-project-context.md`.
3. Read `.agent/brain/01-architecture-principles.md`.
4. Read the relevant domain architecture.
5. Read applicable skill files under `.agent/skills/`.
6. Inspect existing implementation before introducing new files or abstractions.

Do not ask the human for information already defined in the repository documentation.

## Non-negotiable architecture rules

- PostgreSQL is the primary relational database.
- React + TypeScript is used for web.
- Flutter is used for mobile.
- Spring Boot owns core business logic.
- Node.js + Express is for supporting services, realtime, integrations and workers.
- Redis is for cache, ephemeral state, rate limiting and job/queue use cases.
- S3-compatible storage is for files/media.
- Nginx/API Gateway handles production routing.
- REST is the default API style.
- WebSocket is used only where realtime communication is justified.
- Kafka is FUTURE infrastructure and must not be introduced without a documented scale/architecture decision.

## Clean-code rules

- Prefer simple, boring solutions.
- Do not duplicate business rules.
- Do not create speculative abstractions.
- Do not create folders only because a pattern exists elsewhere.
- Keep modules cohesive.
- Keep dependencies directional.
- Validate input at system boundaries.
- Never trust frontend authorization.
- Never hardcode secrets.
- Never commit `.env`.
- Never silently change database semantics.
- Every schema change requires a migration.
- Every breaking API change requires a version/migration strategy.
- Delete dead code rather than leaving abandoned alternatives.
- Do not leave temporary debug code, console logs, commented-out blocks or generated junk in production code.

## Agent coordination

Agents must respect ownership:

- Backend agent → `services/core-api`
- Web agent → `apps/*-web`
- Mobile agent → `apps/*-mobile`
- Realtime/integration agent → Node services
- Infrastructure agent → `infrastructure`, Docker and CI/CD
- Architecture agent → docs and ADRs

Cross-domain changes require checking contracts before editing.

## Definition of done

A change is complete only when:
- implementation works,
- tests are appropriate,
- API/database contracts are updated,
- migrations exist if required,
- documentation is updated,
- no secrets are exposed,
- no unnecessary dependency was introduced,
- affected builds remain valid.
