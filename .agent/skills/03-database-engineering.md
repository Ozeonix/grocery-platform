# Skill — Database Engineering

Use PostgreSQL as the default.

Rules:
- migrations for every schema change
- constraints for integrity
- indexes based on query patterns
- normalized transactional model where appropriate
- denormalize only for measured performance needs
- exact decimal types for money
- UTC timestamps
- audit history for important state transitions
- safe migration/rollback planning

Never store authoritative state only in Redis.
