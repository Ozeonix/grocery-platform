# Database Schema

## Core entities

### users
Identity and customer/account information.

### roles / permissions
Authorization model.

### stores
Merchant/store information and operating status.

### store_users
Users associated with stores and their permissions.

### categories
Product grouping.

### products
Catalog information.

### inventory
Current stock state per store/product.

### inventory_movements
Auditable stock changes.

### addresses
Customer delivery addresses.

### carts / cart_items
Current customer shopping state.

### orders / order_items
Immutable order snapshot and lifecycle.

### order_status_history
Audit trail of order transitions.

### delivery_partners
Delivery worker profile and availability.

### deliveries
Assignment and delivery lifecycle.

### payments / payment_transactions
Payment state and gateway references.

### coupons
Discount definitions and redemption rules.

### notifications
Notification records and delivery status.

### support_tickets
Customer/operations issues.

### audit_logs
Security and operational audit events.

## Important constraints

- Use UUIDs or another stable non-sequential public identifier where appropriate.
- Never use mutable business text as a primary key.
- Monetary values must use exact decimal types, not floating point.
- Timestamps should be stored consistently, preferably UTC.
- Foreign keys should reflect ownership and lifecycle.
- Add indexes based on query patterns, not guesses.
