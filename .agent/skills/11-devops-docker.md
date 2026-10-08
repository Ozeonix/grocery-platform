# Skill — Docker & DevOps

Local development should be reproducible.

Use Docker Compose for infrastructure dependencies.

Containers should:
- have predictable configuration
- use environment variables
- avoid secrets baked into images
- expose only necessary ports
- have health checks where useful

Production should separate:
- application deployment
- infrastructure
- secrets
- persistent data

Never expose PostgreSQL/Redis directly to the public internet.
