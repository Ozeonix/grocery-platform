# Core Order Data Flow

```text
Customer
   |
   v
Customer App
   |
   v
API Gateway
   |
   v
Spring Boot Core API
   |
   +--> Cart
   |
   +--> Inventory reservation
   |
   +--> Order
   |
   +--> Payment
   |
   +--> Store
   |
   +--> Delivery
   |
   +--> Notification
   |
   v
PostgreSQL

Realtime tracking:
Delivery App -> Node Realtime API -> Redis -> Customer App
```

The authoritative order state remains in PostgreSQL.
Realtime channels provide fast updates but are not the source of truth.
