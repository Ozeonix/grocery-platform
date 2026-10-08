# Backend Architecture

## Core

Spring Boot modular monolith.

Recommended structure:

```text
com.yourcompany.grocery
├── auth
├── users
├── stores
├── products
├── categories
├── inventory
├── cart
├── orders
├── payments
├── delivery
├── coupons
├── reviews
├── notifications
├── support
└── common
```

## Domain module rule

A domain module should own its:
- API/controller layer
- application/use-case layer
- domain rules
- persistence integration
- validation

Avoid unrestricted access between internal packages.

## Transaction boundaries

Use database transactions for operations that require atomicity.

Examples:
- creating an order
- reserving inventory
- recording payment state
- assigning delivery

External API calls should not be treated as database transactions.

Use idempotency and reconciliation where external systems are involved.

## REST

All public APIs use:

`/api/v1/...`

Use consistent:
- status codes
- error format
- pagination
- filtering
- sorting
- validation
- authentication
- authorization

## Security

Authorization must be checked server-side.

Roles are not sufficient for all access decisions; resource ownership and permissions may also matter.

Never return secrets or sensitive internal fields.
