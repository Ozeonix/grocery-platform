# Frontend Architecture

## Web stack

React.js + TypeScript.

Applications:

- admin-web
- store-web
- customer-web

## Folder strategy

Use feature-first organization.

Example:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── profile/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── main.tsx
```

## Rules

- Feature code stays close to the feature.
- Shared components must actually be shared.
- Do not create a giant global utilities folder.
- Do not put server business rules in React.
- API calls belong in a predictable data-access layer.
- Authentication state is separate from domain state.
- Loading, error and empty states are required for important screens.
- Accessibility and responsive behavior are first-class requirements.

## State

Use local state for local UI.

Use a dedicated server-state strategy for API data.

Do not put every API response into global state.

## Design system

Shared visual primitives should be documented and reused, but applications may have domain-specific screens.
