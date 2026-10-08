# Orders API

Base path:

`/api/v1/orders`

## Lifecycle

```text
CART
 ↓
PLACED
 ↓
CONFIRMED
 ↓
PREPARING
 ↓
READY_FOR_PICKUP
 ↓
ASSIGNED
 ↓
PICKED_UP
 ↓
OUT_FOR_DELIVERY
 ↓
DELIVERED
```

Cancellation/refund states must be defined separately rather than allowing arbitrary transitions.

## Endpoints

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `POST /orders/{id}/cancel`
- `GET /orders/{id}/status`

Store and delivery operations use authorized state-transition endpoints.

## Rules

- Validate inventory before accepting the order.
- Store item price snapshots.
- Use idempotency for checkout/order creation where duplicate requests are possible.
- Do not allow clients to set arbitrary order statuses.
- Every important transition is auditable.
