# System Overview

## Purpose

Define the complete technical shape of the grocery delivery platform.

## High-level architecture

```text
Customer Web ─────┐
Customer Mobile ──┤
Store Web ────────┤
Store Mobile ────┤
Delivery Mobile ──┤
Admin Web ────────┤
                  ▼
          Nginx / API Gateway
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Spring Boot Core       Node.js Support
      API                    │
        │             ┌──────┼──────┐
        │             ▼      ▼      ▼
        │        Realtime Notifications Worker
        │
   ┌────┴────┐
   ▼         ▼
PostgreSQL Redis
   │
   ▼
S3-compatible storage
```

## Source of truth

PostgreSQL is authoritative for persistent business state.

Redis is never the authoritative source for orders, payments, inventory or user records.

Realtime systems distribute state changes but do not own the authoritative state.

## Core business domains

- Authentication
- Users
- Stores
- Categories
- Products
- Inventory
- Cart
- Orders
- Payments
- Delivery
- Coupons
- Reviews
- Notifications
- Support
- Audit

## Architectural evolution

Initial:

```text
React/Flutter
      ↓
Gateway
      ↓
Spring Boot modular monolith
      ↓
PostgreSQL
```

Later, only if required:

```text
User Service
Order Service
Delivery Service
Payment Service
      ↓
Kafka events
      ↓
independently owned persistence
```

Microservice extraction is an optimization for scale/organizational boundaries, not a default requirement.
