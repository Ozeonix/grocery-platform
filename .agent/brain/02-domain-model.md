# Domain Model

Core aggregates:
- User
- Store
- Product
- Inventory
- Cart
- Order
- Payment
- Delivery
- Coupon
- Notification

Order is a central business workflow but must not become a giant object containing every concern.

Inventory must protect against overselling.

Payment state must be reconciled with gateway state.

Delivery is linked to an order but has its own lifecycle.

User roles and resource ownership must be enforced independently where necessary.
