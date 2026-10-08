# Recommended Build Order

## Phase 0 — Foundation
1. Monorepo structure
2. Git
3. Docker Compose
4. PostgreSQL
5. Redis
6. Object storage
7. Spring Boot skeleton
8. Node service skeletons
9. React app shells
10. Flutter app shells

## Phase 1 — Identity
1. User registration/login
2. OTP support
3. Refresh tokens
4. Roles
5. Permissions
6. Customer/store/delivery/admin identities

## Phase 2 — Commerce
1. Stores
2. Categories
3. Products
4. Inventory
5. Cart
6. Addresses
7. Pricing

## Phase 3 — Orders
1. Checkout
2. Order creation
3. Order state machine
4. Store acceptance
5. Packing
6. Ready for pickup

## Phase 4 — Delivery
1. Delivery partner availability
2. Assignment
3. Pickup
4. Live tracking
5. OTP delivery confirmation
6. Delivery completion

## Phase 5 — Payments
1. Payment intent
2. Payment verification
3. Refunds
4. Webhooks
5. Transaction records

## Phase 6 — Operations
1. Admin dashboard
2. Reports
3. Coupons
4. Notifications
5. Support
6. Audit logs

## Phase 7 — Scale
Measure first.

Introduce Kafka and extract services only when real scale requires it.
