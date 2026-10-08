# Database Relationships

```text
User
 ├── Addresses
 ├── Orders
 └── Roles

Store
 ├── Store Users
 ├── Products
 └── Inventory

Product
 ├── Category
 └── Inventory

Cart
 └── Cart Items → Product

Order
 ├── Order Items → Product
 ├── Status History
 ├── Payment
 └── Delivery

Delivery
 ├── Delivery Partner
 └── Order

Payment
 └── Payment Transactions
```

## Consistency rules

Inventory reservation and order creation must have carefully defined transactional boundaries.

Order item price must be stored as a snapshot so historical orders do not change when product prices change.

Deletion of business-critical records should usually be soft/deactivated rather than destructive deletion.

Referential integrity belongs in the database where appropriate, not only in application code.
