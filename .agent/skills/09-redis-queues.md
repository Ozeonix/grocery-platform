# Skill — Redis

Use Redis for:
- cache
- sessions where appropriate
- rate limits
- temporary OTP state
- job queues
- ephemeral realtime coordination

Do not use Redis as the permanent source of truth for:
- orders
- payments
- inventory
- users

Every cached value needs an invalidation/TTL strategy.
