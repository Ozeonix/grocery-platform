# Security Brain

Threat model every public endpoint.

Required:
- authentication
- authorization
- input validation
- rate limiting
- secure secrets
- audit logging for sensitive operations
- safe error responses
- dependency updates
- least privilege

Never trust:
- frontend roles
- mobile clients
- request prices
- request totals
- client-provided order status
- client-provided store ownership

Recalculate authoritative business values on the server.
