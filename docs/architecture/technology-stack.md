# Technology Stack

| Layer | Technology |
|---|---|
| Admin Web | React + TypeScript |
| Store Web | React + TypeScript |
| Customer Web | React + TypeScript |
| Customer Mobile | Flutter |
| Delivery Mobile | Flutter |
| Store Mobile | Flutter |
| Core Backend | Spring Boot |
| Supporting Backend | Node.js + Express + TypeScript |
| Primary Database | PostgreSQL |
| Cache/Queue | Redis |
| Object Storage | S3-compatible |
| Local Infrastructure | Docker |
| Routing | Nginx/API Gateway |
| Future Event Backbone | Kafka |
| API Style | REST + WebSocket where needed |

## MySQL

MySQL is intentionally not part of the default runtime.

Use it only if a concrete integration or business requirement makes it necessary. Document the reason in an ADR.
