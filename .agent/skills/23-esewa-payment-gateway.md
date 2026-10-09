---
name: esewa-payment-gateway
description: Securely integrate eSewa payments into the grocery-platform Spring Boot backend, React web apps, and Flutter apps.
---

# eSewa Payment Gateway Skill

## 1. Purpose and project rules

Use this skill for eSewa payment initiation, redirects/deep links, callbacks, transaction verification/status checks, reconciliation, credentials, and eSewa integration in React, Spring Boot, Node.js, or Flutter.

Project stack: React + TypeScript web apps; Flutter + Dart mobile apps; Spring Boot + Java core API; PostgreSQL as source of truth; Redis only for cache/coordination. The core API owns all order/payment state transitions.

**Never mark an order paid because a browser redirects to a success URL, Flutter reports success, a callback merely arrived, or a client sends `status=SUCCESS`.** The backend must verify payment according to the selected official eSewa contract and match it to the expected order/payment attempt.

## 2. Before implementation

1. Read root `AGENTS.md`, relevant `.agent/brain/` files, and existing API, database, security, integrations, Flutter, testing, and documentation skills.
2. Inspect the current payment/order models, migrations, API patterns, configuration, error handling, and test conventions.
3. Read the current official documentation for the specific integration mode before writing code. Prefer official docs over blog posts or stale examples.
4. Identify whether the task needs ePay web form, Intent/deep-link, token-based payment, or maintenance of an existing SDK.
5. Prepare a short plan. Do not invent credentials, assume a URL is current, or switch payment flows without approval.
6. If official pages conflict or leave a security-critical detail unclear, document the discrepancy and ask for clarification.

## 3. Choose an integration

### ePay web form

Use for supported browser-based checkout. Official v2 form URLs documented at the time this skill was prepared:

- Test: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- Production: `https://epay.esewa.com.np/api/epay/main/v2/form`

Verify URLs and required fields immediately before implementation:
- https://developer.esewa.com.np/pages/Epay
- https://developer.esewa.com.np/pages/Epay-Transaction-Flow
- https://developer.esewa.com.np/pages/Epay-Integration
- https://developer.esewa.com.np/pages/Epay-Status-Check
- https://developer.esewa.com.np/pages/Epay-Credentials-URLs

The ePay v2 request commonly includes `amount`, `tax_amount`, `product_service_charge`, `product_delivery_charge`, `total_amount`, `product_code`, `transaction_uuid`, `success_url`, `failure_url`, `signed_field_names`, and `signature`. Follow the exact required fields for the current contract. Send zero for required charge fields when unused.

The documented total is:
`total_amount = amount + tax_amount + product_service_charge + product_delivery_charge`

Calculate totals on the backend from persisted cart/order pricing. Never trust a client-provided amount. Use `BigDecimal` in Java for money; avoid floating-point arithmetic as the source of truth. Generate a unique `transaction_uuid` for every attempt and obey eSewa's current format restrictions.

### Intent / deep-link flow

Use when an approved mobile-first experience requires opening the eSewa app. Official pages:
- https://developer.esewa.com.np/pages/Intent
- https://developer.esewa.com.np/pages/Intent-Transaction-Flow
- https://developer.esewa.com.np/pages/Intent-Signature-Generation
- https://developer.esewa.com.np/pages/Intent-Initialize-Payment
- https://developer.esewa.com.np/pages/Intent-Status-Check
- https://developer.esewa.com.np/pages/Intent-Testing

Documented test endpoints (confirm current values before use):
- Book: `https://rc-checkout.esewa.com.np/api/client/intent/payment/book`
- Status: `https://rc-checkout.esewa.com.np/api/client/intent/payment/status`
- Cancel: `https://rc-checkout.esewa.com.np/api/client/intent/payment/cancel`

The booking request documented by eSewa includes `product_code`, `amount`, `transaction_uuid`, `signed_field_names`, `signature`, `callback_url`, `redirect_url`, and `properties`. A response may return `booking_id`, `deeplink`, and `correlation_id`. Persist these identifiers against the internal payment attempt before returning a deeplink to the client.

Intent's status endpoint uses the relevant booking/product/correlation identifiers and a flow-specific signature. Validate the response and match it to the expected attempt before updating the order. The documentation lists statuses such as `BOOKED`, `SUCCESS`, `PENDING`, `FAILED`, `CANCELED`, and `REVERTED`. Unknown values must never map to success.

### SDKs and mobile

The project brief identifies Android, iOS, and Flutter SDK docs as deprecated. Treat them as legacy for new development unless eSewa confirms otherwise. Prefer a currently supported official flow. For an existing SDK integration, assess support status, platform compatibility, migration implications, and server verification before changing it. SDK callbacks are not a substitute for server-side verification.

Flutter references:
- https://developer.esewa.com.np/pages/Flutter-Overview
- https://developer.esewa.com.np/pages/Flutter-Instructions
- https://developer.esewa.com.np/pages/Flutter-IOS-Configuration
- https://developer.esewa.com.np/pages/Flutter-Android-Configuration
- https://developer.esewa.com.np/pages/Flutter-How-to-use-SDK-for-Payment
- https://developer.esewa.com.np/pages/Flutter-eSewa-Config
- https://developer.esewa.com.np/pages/Flutter-eSewa-Payment
- https://developer.esewa.com.np/pages/Flutter-eSewa-Payment-Success-Result
- https://developer.esewa.com.np/pages/Flutter-Transaction-Verification

Android references:
- https://developer.esewa.com.np/pages/Android-Transaction-Flow
- https://developer.esewa.com.np/pages/Android-System-Interaction
- https://developer.esewa.com.np/pages/Android-Integration
- https://developer.esewa.com.np/pages/Android-Error-Cases-and-Handling
- https://developer.esewa.com.np/pages/Android-Transaction-Verification
- https://developer.esewa.com.np/pages/Android-Credentials-URLs

iOS references:
- https://developer.esewa.com.np/pages/iOS-Overview
- https://developer.esewa.com.np/pages/iOS-Integration
- https://developer.esewa.com.np/pages/iOS-Error-Cases-and-Handling
- https://developer.esewa.com.np/pages/iOS-Transaction-Verification
- https://developer.esewa.com.np/pages/iOS-Credentials-URLs

### Token-based integration and CMS plugins

Token-based integration is a distinct merchant use case, not the default grocery checkout. Use only if the business requirement and eSewa merchant enablement call for it:
- https://developer.esewa.com.np/pages/Token-Overview
- https://developer.esewa.com.np/pages/Token-Inquiry
- https://developer.esewa.com.np/pages/Token-Payment
- https://developer.esewa.com.np/pages/Token-Status-Check
- https://developer.esewa.com.np/pages/Token-Test-credentials

WooCommerce, PrestaShop, and Magento docs are for those CMS platforms. Do not copy their plugin code into this custom Spring Boot/React/Flutter repository unless the project explicitly adopts a CMS:
- https://developer.esewa.com.np/pages/WooCommerce-Overview
- https://developer.esewa.com.np/pages/WooCommerce-Installation
- https://developer.esewa.com.np/pages/WooCommerce-Testing
- https://developer.esewa.com.np/pages/WooCommerce-Deploy
- https://developer.esewa.com.np/pages/Prestashop-Overview
- https://developer.esewa.com.np/pages/Prestashop-Installation
- https://developer.esewa.com.np/pages/Prestashop-Testing
- https://developer.esewa.com.np/pages/Prestashop-Deploy
- https://developer.esewa.com.np/pages/Magento-Overview
- https://developer.esewa.com.np/pages/Magento-Installation
- https://developer.esewa.com.np/pages/Magento-Testing
- https://developer.esewa.com.np/pages/Magento-Deploy

## 4. Payment lifecycle and data model

Adapt to the existing model rather than creating duplicate sources of truth. Persist a payment attempt linked to an order, with at least:
- Internal payment attempt ID and order ID.
- Provider `ESEWA` and integration mode `EPAY` or `INTENT`.
- Expected amount and currency where applicable.
- Unique merchant transaction UUID.
- Provider booking/reference/correlation identifiers as applicable.
- Internal payment status, timestamps, and verification/reconciliation metadata.
- Idempotency key or unique constraint.
- Sanitized provider error category and audit trail.

Keep payment status separate from order status. A typical internal state model could be `CREATED -> INITIATED -> PENDING -> SUCCEEDED | FAILED | CANCELED | REVERSED`; map real provider statuses carefully and align it with the existing domain model.

Rules:
1. Create the order/payment attempt and persist expected amount before redirecting.
2. Initiate the provider request from the backend; do not sign requests in React or Flutter.
3. Persist provider identifiers before returning the redirect/deep link.
4. Treat redirect parameters as navigation hints only.
5. Verify using the official status/verification API, and validate the response.
6. Match provider, merchant product code, attempt identifiers, expected amount, and order before marking success.
7. Use an atomic, idempotent database transition to mark payment successful and make order fulfillment eligible.
8. Pending, unknown, timeout, or missing callback means unresolved—not paid and not necessarily failed.
9. Process callbacks and verification responses safely more than once.
10. Record auditable state transitions.

Do not trust a callback simply because it reaches your endpoint. Validate its signature and fields according to the chosen flow and use status verification when required or when the result is ambiguous.

## 5. Signing and cryptography

ePay and Intent may use different signing fields, field ordering, keys, and payload formats. Never reuse one flow's signing code for another without confirming the current official contract.

For ePay v2, the official docs describe HMAC-SHA256 with Base64 output. The signing message is built from `signed_field_names` and their values in the exact order required by eSewa. The ePay example identifies `total_amount`, `transaction_uuid`, and `product_code` as mandatory signed fields and specifies their order. Follow the current page's exact serialization and separators.

For Intent, use the Intent-specific contract:
https://developer.esewa.com.np/pages/Intent-Signature-Generation

Implementation requirements:
- Use Java crypto APIs in Spring Boot.
- Keep signing in a small provider-specific backend component.
- Deterministically serialize fields and format amounts exactly as required.
- Validate required fields before signing.
- Add known test vectors from official documentation.
- Use constant-time signature comparison where supported.
- Never log secrets or unnecessarily log signatures/payment payloads.
- Never put production secrets in frontend variables, mobile assets, source control, screenshots, or documentation.

## 6. Credentials and configuration

Keep test and production configuration isolated. The following are illustrative variable names; adapt to repository conventions and confirm each URL for the chosen flow:

```dotenv
ESEWA_ENABLED=false
ESEWA_ENVIRONMENT=test
ESEWA_PRODUCT_CODE=
ESEWA_SECRET_KEY=
ESEWA_INTENT_ACCESS_KEY=
ESEWA_EPAY_FORM_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_EPAY_STATUS_URL=
ESEWA_INTENT_BOOK_URL=https://rc-checkout.esewa.com.np/api/client/intent/payment/book
ESEWA_INTENT_STATUS_URL=https://rc-checkout.esewa.com.np/api/client/intent/payment/status
ESEWA_INTENT_CANCEL_URL=https://rc-checkout.esewa.com.np/api/client/intent/payment/cancel
ESEWA_CALLBACK_BASE_URL=
ESEWA_SUCCESS_REDIRECT_URL=
ESEWA_FAILURE_REDIRECT_URL=
```

- Put only empty placeholders in `.env.example`.
- Ensure actual `.env` and secret files are ignored by Git.
- Keep secrets on the backend or in an approved secret manager.
- Fail safely if required settings are absent.
- Never silently switch between test and production.
- Do not use development credentials for live transactions.
- Recheck the official credentials/URLs page and merchant-provided production configuration.

General references:
- https://developer.esewa.com.np/pages/Introduction
- https://developer.esewa.com.np/pages/Contact
- https://developer.esewa.com.np/pages/Epay-Credentials-URLs
- https://developer.esewa.com.np/pages/Intent-Testing

## 7. Architecture boundaries

### Spring Boot core API
Owns server-side totals, payment attempts, signing, initiation, callback endpoints, verification, reconciliation, idempotency, database transitions, and audit events. Possible components include `EsewaPaymentClient`, `EsewaSignatureService`, `PaymentApplicationService`, and controller endpoints, but follow existing project naming and avoid overengineering.

### React web apps
Call the core API to initiate checkout. Redirect/form-post only using backend-provided validated data. After returning from eSewa, fetch payment status from the core API. Never expose secrets or mark payment successful from local client state.

### Flutter apps
Call the core API, open only the returned provider deeplink for the selected Intent flow, handle cancellation/app switching/app-not-installed/network-loss states, then refresh status from the core API. Never embed merchant secrets. Review any existing SDK's support status before using it.

### Node.js services
Do not move payment authority to Node merely for convenience. Use Node only where the existing architecture has a clear reason. Multiple services must not independently mutate payment status.

## 8. Reliability, concurrency, and reconciliation

- PostgreSQL is authoritative; Redis is not the source of truth for payments.
- Use migrations, not production schema auto-update.
- Add unique constraints for transaction identifiers and idempotency keys.
- Use guarded state transitions and database transactions to prevent duplicate fulfillment.
- Do not hold database transactions open during slow external requests.
- Apply bounded timeouts, rate limits, and safe retries with backoff.
- A network timeout does not prove failure. Query status before starting a potentially duplicate payment.
- Never map `PENDING`, `BOOKED`, `AMBIGUOUS`, unknown, or not-found/error responses to paid.
- Reconcile attempts whose callbacks were lost or delayed.
- Keep enough sanitized audit information for support without storing secrets or unnecessary personal data.
- Never store eSewa user passwords, MPINs, or payment credentials.

## 9. Security checklist

- Use HTTPS for production callback and redirect endpoints.
- Validate callback signature and schema according to the selected integration.
- Match amount, product code, transaction UUID/booking ID, order, and current state.
- Protect endpoints with authentication, authorization, validation, and rate limits.
- Prevent IDOR: customers can view only their own orders/payments; admin access must be permission-checked and audited.
- Apply CSRF protection where applicable to browser-session endpoints.
- Allow-list redirect destinations; never accept arbitrary client-supplied callback/redirect URLs.
- Do not expose raw provider errors or stack traces to users.
- Redact secrets, tokens, signatures where sensitive, and unnecessary personal data from logs.
- Test tampered payloads, replay, duplicate callbacks, forged redirects, and amount mismatch.
- Never fulfill an order based only on the success URL.

## 10. Errors and user experience

Handle invalid signature/configuration, provider outage, timeout, user cancellation, pending status, app/browser closure, duplicate callbacks, delayed callbacks, status lookup failure, mismatched amount/reference, reversed payment, and retry during an unresolved attempt.

When outcome is unknown, tell the user the payment is being checked. Do not claim failure just because the browser timed out. Before allowing a retry, check the previous attempt to avoid duplicate charges.

## 11. Tests required

Unit tests:
- Exact ePay and Intent signing vectors.
- Amount calculations and required fields.
- Status mapping, including unknown values.
- Invalid signature and missing fields.
- Duplicate transaction UUID and idempotency key.
- Mismatched amount/product code/reference.

Integration tests:
- Attempt persists before initiation response.
- Correct environment endpoint and payload are used.
- Verified success changes payment/order once.
- Pending does not fulfill an order.
- Duplicate callback does not double-fulfill.
- Invalid signature is rejected and audited.
- Timeout leaves recoverable pending state.
- Unauthorized customer cannot read another customer's payment.
- Migrations work against a clean database.

Sandbox end-to-end checks:
- Successful test payment.
- Cancellation and failure.
- Invalid signature/configuration.
- App/browser closes during payment.
- Delayed/missing callback.
- Pending status later becomes success.
- Duplicate callback/status processing.
- Reversal/refund status where supported by sandbox.

Do not use real money or production credentials for automated tests.

## 12. Observability and production readiness

Record structured events such as `payment_attempt_created`, `esewa_initiation_succeeded`, `esewa_initiation_failed`, `esewa_callback_received`, `esewa_signature_rejected`, `esewa_status_verified`, `payment_reconciliation_required`, and `payment_state_transitioned`. Include internal attempt/correlation IDs; never log secrets.

Monitor initiation errors, verification failures, pending payment age, callback delay, provider timeouts, and reconciliation backlog.

Before production:
- [ ] Merchant onboarding and live credentials approved.
- [ ] Production URLs and selected flow confirmed.
- [ ] Secrets outside Git/client bundles.
- [ ] Server-calculated amount and unique transaction ID.
- [ ] Signing has deterministic tests.
- [ ] Callback/status verification implemented.
- [ ] Redirects are not treated as proof.
- [ ] Duplicate events cannot double-charge or fulfill.
- [ ] Pending/unknown states are recoverable.
- [ ] Access control, timeouts, logs, alerts, and migrations reviewed.
- [ ] Sandbox scenarios pass and rollback procedure is documented.

## 13. Definition of done

An eSewa change is done only when official docs for the selected flow have been checked; existing architecture is followed; backend verification controls success; tests cover signing, validation, idempotency, state transitions, and failure cases; no secrets are committed; migrations and API docs are updated; the app remains runnable; and the agent reports changed files, test results, sandbox steps, assumptions, and merchant actions required.

## 14. Full official reference index

### General
- https://developer.esewa.com.np/pages/Introduction
- https://developer.esewa.com.np/pages/Contact

### ePay
- https://developer.esewa.com.np/pages/Epay
- https://developer.esewa.com.np/pages/Epay-Transaction-Flow
- https://developer.esewa.com.np/pages/Epay-Integration
- https://developer.esewa.com.np/pages/Epay-Status-Check
- https://developer.esewa.com.np/pages/Epay-Credentials-URLs

### Intent
- https://developer.esewa.com.np/pages/Intent
- https://developer.esewa.com.np/pages/Intent-Transaction-Flow
- https://developer.esewa.com.np/pages/Intent-Signature-Generation
- https://developer.esewa.com.np/pages/Intent-Initialize-Payment
- https://developer.esewa.com.np/pages/Intent-Status-Check
- https://developer.esewa.com.np/pages/Intent-Testing

### Android (legacy/deprecated per project brief; verify status)
- https://developer.esewa.com.np/pages/Android-Transaction-Flow
- https://developer.esewa.com.np/pages/Android-System-Interaction
- https://developer.esewa.com.np/pages/Android-Integration
- https://developer.esewa.com.np/pages/Android-Error-Cases-and-Handling
- https://developer.esewa.com.np/pages/Android-Transaction-Verification
- https://developer.esewa.com.np/pages/Android-Credentials-URLs

### iOS (legacy/deprecated per project brief; verify status)
- https://developer.esewa.com.np/pages/iOS-Overview
- https://developer.esewa.com.np/pages/iOS-Integration
- https://developer.esewa.com.np/pages/iOS-Error-Cases-and-Handling
- https://developer.esewa.com.np/pages/iOS-Transaction-Verification
- https://developer.esewa.com.np/pages/iOS-Credentials-URLs

### Flutter (legacy/deprecated per project brief; verify status)
- https://developer.esewa.com.np/pages/Flutter-Overview
- https://developer.esewa.com.np/pages/Flutter-Instructions
- https://developer.esewa.com.np/pages/Flutter-IOS-Configuration
- https://developer.esewa.com.np/pages/Flutter-Android-Configuration
- https://developer.esewa.com.np/pages/Flutter-How-to-use-SDK-for-Payment
- https://developer.esewa.com.np/pages/Flutter-eSewa-Config
- https://developer.esewa.com.np/pages/Flutter-eSewa-Payment
- https://developer.esewa.com.np/pages/Flutter-eSewa-Payment-Success-Result
- https://developer.esewa.com.np/pages/Flutter-Transaction-Verification

### CMS plugins (only if the project intentionally adopts that CMS)
- https://developer.esewa.com.np/pages/WooCommerce-Overview
- https://developer.esewa.com.np/pages/WooCommerce-Installation
- https://developer.esewa.com.np/pages/WooCommerce-Testing
- https://developer.esewa.com.np/pages/WooCommerce-Deploy
- https://developer.esewa.com.np/pages/Prestashop-Overview
- https://developer.esewa.com.np/pages/Prestashop-Installation
- https://developer.esewa.com.np/pages/Prestashop-Testing
- https://developer.esewa.com.np/pages/Prestashop-Deploy
- https://developer.esewa.com.np/pages/Magento-Overview
- https://developer.esewa.com.np/pages/Magento-Installation
- https://developer.esewa.com.np/pages/Magento-Testing
- https://developer.esewa.com.np/pages/Magento-Deploy

### Token-based (separate use case; not default checkout)
- https://developer.esewa.com.np/pages/Token-Overview
- https://developer.esewa.com.np/pages/Token-Inquiry
- https://developer.esewa.com.np/pages/Token-Payment
- https://developer.esewa.com.np/pages/Token-Status-Check
- https://developer.esewa.com.np/pages/Token-Test-credentials

Maintenance rule: payment docs can change. Recheck URLs, credentials, signing rules, required fields, and status semantics before implementation and production deployment. This skill is guidance, not a substitute for current official API documentation or merchant approval.
