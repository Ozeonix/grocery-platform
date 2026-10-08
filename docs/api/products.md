# Products API

Base path:

`/api/v1/products`

## Endpoints

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PATCH /products/{id}`
- `POST /products/{id}/activate`
- `POST /products/{id}/deactivate`

## Rules

- Product ownership depends on store context.
- Product visibility is separate from physical inventory.
- Price changes must not mutate historical order item prices.
- Validate image/file metadata before storing.
- Search/filter APIs must be indexed according to actual query patterns.
