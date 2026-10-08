# Agent Workflow

## Recommended agent ownership

### Architecture Agent
Owns:
- architecture docs
- ADRs
- dependency boundaries
- API contract decisions

### Backend Agent
Owns:
- Spring Boot core-api
- database migrations
- business logic
- backend tests

### Web Agent
Owns:
- admin-web
- store-web
- customer-web

### Mobile Agent
Owns:
- customer-mobile
- delivery-mobile
- store-mobile

### Realtime/Integration Agent
Owns:
- realtime-api
- notification-api
- worker

### Infrastructure Agent
Owns:
- Docker
- Nginx
- CI/CD
- observability
- deployment configuration

Agents may coordinate, but no agent should silently change another domain's architecture.
