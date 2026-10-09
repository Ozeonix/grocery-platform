# Project Roadmap

1. Workspace + documentation
2. Docker/PostgreSQL/Redis/S3-compatible storage
3. Spring Boot core
4. Authentication and roles
5. Stores/products/inventory
6. Cart/checkout/orders
7. Payments
8. Delivery
9. Realtime tracking
10. Notifications
11. Admin/store/customer web
12. Flutter apps
13. Observability and CI/CD
14. Load testing
15. Measure scale
16. Extract services only where justified
17. Introduce Kafka only when durable event-driven communication is actually required

---

## Post-MVP Technical Enhancements

Detailed technical specifications, prerequisites, acceptance criteria, risk assessments, and measurable activation conditions for prospective post-MVP enhancements are formally tracked in:

👉 **[Post-MVP Enhancements Specification](file:///home/bhola-dev58/Ozeonix/grocery-platform/docs/roadmap/post-mvp-enhancements.md)**

### Key Post-MVP Enhancement Areas:
- **Production Payment Integration:** Upgrading from simulated mock gateway responses to verified Nepali payment providers (**Khalti** & **eSewa**) with cryptographic HMAC webhook validation, idempotency keys, and automated payment state reconciliation.
- **Real Map Integration:** Transitioning from the mock tracking card in [OrderTrackingModal.tsx](file:///home/bhola-dev58/Ozeonix/grocery-platform/apps/customer-web/src/features/tracking/OrderTrackingModal.tsx) and mobile apps to live **Google Maps Platform** SDKs with geocoding, polylines, location permissions, and secure API key controls.
- **Kafka Adoption Review Framework:** Tracking event volume (>25,000 events/sec) and multi-service consumer fan-out (>3 services) strictly as **review triggers** (evaluated via architecture review against actual metrics and operational costs) rather than unconditional automatic migration rules, maintaining the modular monolith with PostgreSQL and Redis until justified.

