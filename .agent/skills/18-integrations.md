# Skill — External Integrations

Treat external providers as unreliable boundaries.

Use:
- timeouts
- retries with backoff
- idempotency
- webhook verification
- reconciliation
- provider reference IDs
- explicit failure states

Never assume an external payment/notification provider succeeds because the request returned without an immediate error.
