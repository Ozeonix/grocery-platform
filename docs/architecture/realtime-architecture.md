# Realtime Architecture

## Purpose

Realtime is primarily required for delivery tracking and important order status updates.

## Initial architecture

```text
Delivery Mobile
      │
   WebSocket
      ▼
Node Realtime API
      │
    Redis
      │
      ▼
Customer Mobile/Web
```

The Spring Boot API remains authoritative.

## Rules

- Do not persist critical state only in Redis.
- Reconnect clients safely.
- Use heartbeats/timeouts.
- Authenticate realtime connections.
- Authorize access to individual order/delivery channels.
- Rate-limit abusive connections.
- Avoid broadcasting private customer information.
- Define event names and payload contracts.

## Future

When service extraction and event volume justify it:

```text
Order Service ─┐
Delivery Service ─┼→ Kafka → Realtime consumers
User Service ────┘
```

Kafka is not required for the first implementation.
