# Mobile Architecture

## Stack

Flutter + Dart.

Applications:
- customer-mobile
- delivery-mobile
- store-mobile

## Structure

```text
lib/
├── core/
│   ├── network/
│   ├── storage/
│   ├── routing/
│   ├── theme/
│   └── utils/
├── features/
│   ├── auth/
│   ├── home/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── tracking/
│   └── profile/
├── shared/
└── main.dart
```

## Mobile-specific rules

- Offline behavior must be considered for delivery workflows.
- Location permissions must be explicit.
- Background location must be used only when justified.
- Never trust mobile-side role checks.
- Store tokens securely.
- Avoid blocking the UI on non-critical requests.
- Handle flaky networks gracefully.
- Delivery confirmation must be server validated.
