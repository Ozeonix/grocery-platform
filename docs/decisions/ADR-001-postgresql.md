# ADR-001 — PostgreSQL

## Decision
Use PostgreSQL as the primary relational database.

## Why
The platform needs transactions, constraints, indexing, JSON support, strong consistency and mature Spring Boot integration.

## Alternatives
MySQL is technically viable but is not needed for the default architecture.

## Consequence
Teams must use migrations and database-aware design. A second relational database requires explicit justification.
