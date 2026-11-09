# @puzzle-ui/auth

Framework-independent authentication core for Puzzle.

The package provides password authentication, user credentials,
authentication state and session integration.

## Features

- Email and password registration.
- Email and password authentication.
- Argon2id password hashing through an injected provider.
- Password verification.
- HMAC-protected rate-limit identifiers.
- Configurable rate limiting.
- Atomic user and credential creation.
- Session creation and validation.
- Current-user retrieval.
- Sign out and sign out everywhere.
- Framework-independent implementation.
- Node.js and Cloudflare Workers compatible APIs.

## Installation

```sh
bun add @puzzle-ui/auth
```

## Initialization

The application supplies storage, password hashing, rate limiting and
session management.

```tsx
import { StorageAuthManager } from "@puzzle-ui/auth";
import { StorageSessionManager } from "@puzzle-ui/session";

const sessions = new StorageSessionManager(storage, {
  lifetime: {
    idleTimeoutSeconds: 60 * 60 * 24 * 7,
    absoluteLifetimeSeconds: 60 * 60 * 24 * 30,
  },
  maximumSessionsPerUser: 10,
});

await sessions.initialize();

const auth = new StorageAuthManager(
  {
    storage,
    passwordHasher,
    rateLimitProvider,
    sessions,
  },
  {
    rateLimitKeySecret: process.env.AUTH_RATE_LIMIT_SECRET,
  },
);

await auth.initialize();
```

`passwordHasher` must implement the `PasswordHasher` interface using Argon2id.

`rateLimitProvider` must provide atomic, shared rate limiting.
An in-memory rate limiter is only suitable for tests and local development.

The rate-limit secret must be stable across application instances.
Use a dedicated secret with at least 32 characters.

## Register

```tsx
const result = await auth.register({
  email: "user@example.com",
  password: "a-secure-password",
  name: "Example User",
  ipAddress: trustedClientIp,
});
```

The result contains:

- User.
- Authenticated session.
- Raw session token.
  The token is server-only. It must only be delivered through a secure
  HttpOnly cookie. Never expose it through client-side JSON or browser storage.

## Sign in

```tsx
const result = await auth.signIn({
  email: "user@example.com",
  password: "a-secure-password",
  ipAddress: trustedClientIp,
});
```

Invalid credentials always produce the same public authentication error.

## Get current user

```tsx
const user = await auth.getCurrentUser(sessionToken);
```

An invalid, expired or revoked session returns null.

The returned user does not contain password credentials or normalized
internal storage fields.

## Get authentication state

```tsx
const state = await auth.getAuthState(sessionToken);

if (state.status === "authenticated") {
  console.log(state.userId);
  console.log(state.sessionId);
}
```

## Sign out

```tsx
await auth.signOut(sessionToken);
```

The framework integration is responsible for clearing the corresponding
browser cookie.

## Sign out everywhere

```tsx
await auth.signOutEverywhere(user.id);
```

## Security considerations

- Plaintext passwords are never persisted.
- Password hashes are produced by the injected Argon2id provider.
- Users and credentials are created atomically.
- Normalized email addresses have a unique storage constraint.
- Raw session tokens are managed by @puzzle-ui/session.
- Rate-limit failures never silently fall back to unrestricted access.
- Email and IP rate-limit identifiers are HMAC-hashed.
- Unknown accounts also execute password verification.
- Public authentication errors do not disclose whether an account exists.
- Session tokens must only be delivered through secure HttpOnly cookies.

## Scope

The authentication core does not yet implement:

- Email verification workflows.
- Password reset workflows.
- TOTP or WebAuthn MFA workflows.
- OAuth or external identity providers.
- Framework-specific authentication endpoints.
  These belong to separate Puzzle Auth features.
