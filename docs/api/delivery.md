# Delivery API

Base path:

`/api/v1/delivery`

## Core operations

- delivery partner availability
- delivery assignment
- accept/reject assignment
- pickup confirmation
- location updates
- delivery status
- customer handoff
- OTP verification
- delivery completion

## Security

A delivery partner may access only deliveries assigned to them.

Location updates must be authenticated and rate-limited.

Customer contact information must be minimized.

## Completion

Delivery completion requires server-side validation of:
- correct delivery
- correct partner
- customer/order association
- OTP/proof where configured
- valid delivery state
