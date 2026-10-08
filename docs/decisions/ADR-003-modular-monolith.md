# ADR-003 — Modular Monolith First

## Decision
Start with one Spring Boot modular monolith rather than many microservices.

## Why
Early-stage product development benefits from simpler deployment, debugging, transactions and local development.

## Required preparation
Domains must have explicit boundaries, APIs and persistence ownership so extraction remains possible.

## Future
Extract User, Order, Delivery or other services only when measured scale, reliability, deployment independence or team ownership makes extraction worthwhile.
