# @puzzle-ui/fullstack

First-party full-stack integrations for Puzzle.

The package provides browser-safe authentication functionality, server-side authentication handlers, reusable authentication screens and framework adapters.

Authentication policies, persistence and security-sensitive operations remain in the framework-independent `@puzzle-ui/auth` and `@puzzle-ui/session` packages.

## Installation

```bash
bun add @puzzle-ui/fullstack @puzzle-ui/auth @puzzle-ui/session @puzzle-ui/ui
```

Install React 19 and the appropriate framework peer dependencies in your application.

## Package architecture

```text
@puzzle-ui/fullstack
└── auth/
    ├── client/
    │   ├── index.ts
    │   ├── react.tsx
    │   ├── messages.ts
    │   ├── auth.css
    │   └── passkeys.ts
    ├── server/
    │   ├── index.ts
    │   ├── mfa.ts
    │   ├── lifecycle.ts
    │   └── session.ts
    ├── shared/
    │   └── index.ts
    ├── next/
    │   └── index.ts
    └── tanstack/
        └── index.ts
```

## Public exports

| Import                               | Responsibility                                              |
| ------------------------------------ | ----------------------------------------------------------- |
| `@puzzle-ui/fullstack/auth/client`   | React provider, hooks, authentication UI and browser client |
| `@puzzle-ui/fullstack/auth/server`   | Server handlers, sessions and authentication lifecycle      |
| `@puzzle-ui/fullstack/auth/shared`   | Serializable public contracts                               |
| `@puzzle-ui/fullstack/auth/next`     | Next.js App Router adapter                                  |
| `@puzzle-ui/fullstack/auth/tanstack` | TanStack Start adapter                                      |

## Client

### AuthProvider

Wrap the application in `AuthProvider`.

```tsx
import { AuthProvider } from "@puzzle-ui/fullstack/auth/client";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider
    options={{
      basePath: "/api/auth",
    }}
    locale="en"
  >
    {children}
  </AuthProvider>
);
```

The provider creates and shares one authentication client.

Authentication state is retrieved from the server. Session credentials are not stored in browser storage.

### Hooks

```tsx
import { useAuth, useSession, useUser } from "@puzzle-ui/fullstack/auth/client";

const Profile = () => {
  const user = useUser();
  const session = useSession();
  const auth = useAuth();

  if (session.isLoading) return null;

  if (!user) return null;

  return (
    <div>
      <span>{user.email}</span>
      <button onClick={() => void auth.signOut()}>Sign out</button>
    </div>
  );
};
```

### Authentication components

Available components:

- `SignInForm`
- `SignUpForm`
- `MfaChallengeForm`
- `RequiredMfaEnrollment`
- `PasswordResetRequestForm`
- `PasswordResetForm`
- `EmailVerificationForm`
- `EmailVerificationNotice`
- `ChangePasswordForm`
- `MfaSettings`
- `AuthScreen`

All components support className customization.

Redirects are opt-in through `redirectTo` and restricted to same-origin paths.

### AuthScreen

```tsx
import { AuthScreen } from "@puzzle-ui/fullstack/auth/client";

export default function LoginPage() {
  return <AuthScreen mode="sign-in" redirectTo="/dashboard" />;
}
```

### Registration

```tsx
import { AuthScreen } from "@puzzle-ui/fullstack/auth/client";

export default function RegisterPage() {
  return <AuthScreen mode="sign-up" />;
}
```

### MFA management

```tsx
import { MfaSettings } from "@puzzle-ui/fullstack/auth/client";

export default function SecurityPage() {
  return <MfaSettings />;
}
```

### Localization

Supported built-in locales:

- English (`en`)
- German (`de`)
- Spanish (`es`)

Unknown locales fall back to English.

Individual messages can be overridden:

```tsx
<AuthProvider
  locale="en"
  messages={{
    signIn: "Welcome back",
    signUp: "Join us",
  }}
>
  {children}
</AuthProvider>
```

## Server

### Creating the server

```ts
import { createAuthServer } from "@puzzle-ui/fullstack/auth/server";

import {
  authManager,
  mfaManager,
  stepUpManager,
  sessions,
  cookie,
  csrf,
} from "./auth-managers";

export const authServer = createAuthServer({
  auth: authManager,
  mfa: mfaManager,
  stepUp: stepUpManager,
  sessions,
  cookie,
  csrf,
  resolveClientIp,
});
```

The supplied managers and providers must be initialized using their respective package contracts.

### Route handlers

`createAuthRouteHandlers` returns a map of paths and HTTP methods to Web Request handlers.

The default base path is `/api/auth`.

A custom base path can be configured.

### Lifecycle integration

The optional lifecycle integration provides:

- Email verification requests.
- Email verification.
- Password reset requests.
- Password reset completion.
- Authenticated password changes.

Password reset requests use a generic public response to prevent account enumeration.

### Session security

- Session tokens remain in HttpOnly cookies.
- State-changing requests require CSRF protection.
- Authentication responses use no-store caching.
- Password changes invalidate existing sessions.
- MFA challenge tokens remain server-managed.
- Client-facing responses contain only public user data.

## Next.js App Router

```ts
// app/api/auth/[...auth]/route.ts

import { auth } from "@/lib/auth";

import { createNextAuthHandler } from "@puzzle-ui/fullstack/auth/next";

const handlers = createNextAuthHandler({
  auth,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
```

## TanStack Start

```ts
import { createTanStackAuthHandler } from "@puzzle-ui/fullstack/auth/tanstack";

import { auth } from "./auth";

export const authHandler = createTanStackAuthHandler({
  auth,
});
```

Register the handler using the application's TanStack server route configuration.

## Runtime support

The package uses Web APIs for HTTP request and response handling.

Supported targets:

- Node.js
- Cloudflare Workers
- Bun development environments
- Browser authentication interfaces

Persistent sessions, tokens and authentication records must use durable storage.

## Build

```bash
bun run --filter @puzzle-ui/fullstack build
```

## Typecheck

```bash
bun run --filter @puzzle-ui/fullstack typecheck
```

## Tests

```bash
bun run --filter @puzzle-ui/fullstack test
```

## Security boundaries

The package maintains separate public entry points for:

- Client functionality.
- Server functionality.
- Shared contracts.
- Framework integrations.

Client code must never import server implementations, database adapters, secrets or password hashing implementations.

Server functionality must never be re-exported from browser-facing entry points.

Framework adapters must delegate security policies and authentication operations to the underlying authentication packages.

## Scope

This package is designed to support additional full-stack Puzzle modules in the future.

Authentication is the first module. Other modules should follow the same principles:

- Explicit client/server boundaries.
- Framework-independent domain logic.
- Serializable shared contracts.
- Thin framework adapters.
- Explicit public exports.
