# Authentication API

Base path:

`/api/v1/auth`

## Endpoints

### POST /register
Create a user account.

### POST /login
Authenticate credentials.

### POST /refresh
Rotate/refresh access credentials.

### POST /logout
Invalidate refresh/session state as appropriate.

### POST /otp/request
Request an OTP through a supported channel.

### POST /otp/verify
Verify OTP.

## Rules

- Never return password hashes.
- Rate-limit authentication and OTP endpoints.
- Store passwords using a strong password hashing algorithm.
- Use short-lived access tokens.
- Store refresh credentials securely.
- Do not log tokens or OTP values.
- Account authorization must be enforced on backend routes.
