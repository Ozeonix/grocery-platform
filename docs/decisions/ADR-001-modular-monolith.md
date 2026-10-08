# ADR-001: Start With a Modular Monolith

## Decision

Use a Spring Boot modular monolith for the core business system.

## Why

A grocery startup needs fast iteration, transactional consistency and manageable operations before it needs dozens of independently deployed services.

## Future

Extract User, Order and Delivery services only when actual scale or team boundaries justify it.

Use Kafka for asynchronous events when event volume and service independence justify introducing it.
