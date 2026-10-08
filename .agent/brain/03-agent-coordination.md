# Agent Coordination

Before editing:
- inspect current code,
- read local AGENTS.md,
- read relevant architecture,
- identify API/database contracts.

Do not let multiple agents independently redesign the same module.

Cross-cutting changes should be coordinated through contracts and ADRs.

If an agent discovers a better architecture:
1. document the proposal,
2. assess impact,
3. update ADR/docs,
4. then implement.

Never silently migrate the architecture during a feature task.
