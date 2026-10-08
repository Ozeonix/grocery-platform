# Nginx / API Gateway

Production routing belongs here.

Recommended routing:

- `/api/v1/*` → Spring Boot core API
- `/realtime/*` → Node realtime API
- `/notifications/*` → notification service when exposed
- static web applications → respective frontend deployment

Do not expose databases directly to the public internet.
