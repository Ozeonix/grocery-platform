# ADR-002 — Spring Boot Core Backend

## Decision
Use Spring Boot as the authoritative core business backend.

## Why
The platform has transaction-heavy workflows involving inventory, orders, payments and delivery. Spring Boot provides mature dependency injection, validation, transactions, security and persistence tooling.

## Node.js role
Node.js remains valuable for realtime communication, notifications, integrations and background workers.

Node.js must not become a second source of truth for core business rules.
