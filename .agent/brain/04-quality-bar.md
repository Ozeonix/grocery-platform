# Quality Bar

Production code must be:
- readable
- testable
- observable
- secure
- documented
- minimally coupled

Reject:
- duplicate helpers
- unexplained magic numbers
- giant controllers
- giant React components
- business logic inside UI components
- SQL scattered throughout unrelated classes
- duplicated DTO definitions without reason
- dead feature flags
- commented-out old implementations
- temporary debug logs
- secrets in source
- speculative microservices
