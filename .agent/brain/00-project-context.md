# Project Context

This is a grocery online delivery platform.

Business actors:
- Customer
- Store/Merchant
- Delivery Partner
- Admin/Operations

Customer journey:
discover → select → cart → checkout → payment → order tracking → delivery.

Store journey:
onboard → catalog → inventory → receive order → prepare → handoff.

Delivery journey:
availability → assignment → accept → pickup → navigation → customer verification → completion.

Admin journey:
operations → customers → stores → products → orders → delivery → payments → reports → support.

The technical architecture is intentionally designed for a startup that may grow substantially.

Initial architecture is modular monolith + supporting services.

Do not prematurely build a microservice ecosystem.
