# @puzzle-ui/auth

Framework-independent authentication primitives for Puzzle applications. Use this package when you need server-side registration and password sign-in, session validation, email and password lifecycle flows, MFA, passkeys, recovery codes, or step-up authentication without tying your auth core to a framework.

**Documentation:** [puzzle-ui.com/docs/auth](https://puzzle-ui.com/docs/auth)

## Install

```bash
npm install @puzzle-ui/auth
```

The package uses `@puzzle-ui/storage` and `@puzzle-ui/session` adapters, and includes a SimpleWebAuthn server adapter. You provide a storage adapter, a session manager, a secure Argon2id `PasswordHasher`, a shared `RateLimitProvider`, and an email provider for lifecycle workflows.

## Minimal usage

```ts
import { StorageAuthManager } from "@puzzle-ui/auth";

const auth = new StorageAuthManager(
  { storage, passwordHasher, rateLimitProvider, sessions },
  { rateLimitKeySecret },
);

await auth.initialize();

const result = await auth.register({
  email: "person@example.com",
  password: "a-long-unique-password",
  ipAddress: trustedClientIp,
});

if (!("status" in result)) {
  // Store result.token in a secure, HttpOnly cookie on the server.
}
```

Keep session and challenge tokens server-side. The token must not be sent in browser JSON or stored in local or session storage. Add the MFA manager to the dependencies and configure `mfaPolicy` when MFA is needed.

## Features and entry point

The package exports all APIs from the single root entry point, `@puzzle-ui/auth`:

- `StorageAuthManager` for registration, password sign-in, auth state and session revocation.
- `StorageAuthLifecycleManager` for email verification/change, password reset/change, profile updates, account deactivation and deletion.
- `StorageAuthMfaManager` for TOTP, WebAuthn passkeys, recovery codes and factor management.
- `StorageAuthStepUpManager` for session-bound additional MFA verification and session rotation.
- `StorageRateLimitProvider`, `WebCryptoAuthSecretProtector`, and `SimpleWebAuthnProvider` as built-in infrastructure adapters.
- Typed provider contracts, storage records and collection setup, auth errors, and crypto/TOTP utilities.

For storage adapter capabilities and initialization, see [`@puzzle-ui/storage`](https://puzzle-ui.com/docs/storage). For browser clients, secure cookie handlers, and framework adapters, see [`@puzzle-ui/fullstack`](https://puzzle-ui.com/docs/fullstack). The [Authentication Setup guide](https://puzzle-ui.com/docs/developer/authentication) describes application integration.

## Security notes

Auth requires durable storage with the capabilities used by the configured managers. Production deployments should use HTTPS, secure HttpOnly cookies, shared persistent rate limiting, a maintained Argon2id password hasher, encrypted TOTP secrets, hashed recovery codes, and exact WebAuthn origin/RP ID configuration. The package does not provide OAuth, application authorization, or ready-made auth pages.
