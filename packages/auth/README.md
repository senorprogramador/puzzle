# @puzzle-ui/auth

Framework-independent authentication core for Puzzle.

`@puzzle-ui/auth` provides password-based authentication, account lifecycle management, email verification, password recovery, session integration, rate limiting and security auditing. It is designed to work with different storage adapters and runtime environments without depending on a specific web framework or database.

The package separates authentication logic from framework-specific concerns. Applications provide storage, password hashing, email delivery, rate limiting and session management through explicit provider interfaces.

## Features

### Authentication

- Email and password registration.
- Email and password sign-in.
- Configurable email verification requirement.
- Normalized email addresses and unique email constraints.
- Configurable password length validation.
- Argon2id password hashing through an injected provider.
- Timing-resistant sign-in behavior for unknown accounts.
- Generic invalid-credentials errors.
- Current-user retrieval.
- Authentication-state retrieval.
- Sign out and sign out everywhere.

### Account lifecycle

- Email verification with expiring, single-use tokens.
- Resending verification emails invalidates previous outstanding verification tokens.
- Password reset with enumeration-safe responses.
- Password change with current-password verification.
- Profile updates.
- Email address changes with confirmation.
- Account deactivation.
- Permanent account deletion.
- Session invalidation after sensitive account changes.

### Security

- Cryptographically secure action tokens.
- Action tokens are hashed before storage.
- Atomic token consumption and account mutations.
- Conditional writes to prevent concurrent token reuse.
- Atomic user and credential creation.
- HMAC-protected rate-limit identifiers.
- Storage-backed rate limiting.
- Configurable rate-limit policies.
- Audit events for authentication and account lifecycle operations.
- Fail-closed session validation after sensitive account changes.
- No plaintext password persistence.
- No weaker password-hashing fallback.

### Runtime and architecture

- Framework-independent implementation.
- Database-independent implementation through `@puzzle-ui/storage`.
- Session integration through `@puzzle-ui/session`.
- Node.js-compatible APIs.
- Cloudflare Workers-compatible APIs.
- Explicit dependency injection.
- No dependency on browser APIs or framework-specific request objects.

## Installation

Install the authentication package and its peer architecture packages:

```sh
bun add @puzzle-ui/auth @puzzle-ui/session @puzzle-ui/storage
```

You also need:

- A compatible `StorageAdapter` implementation.
- An Argon2id `PasswordHasher` implementation.
- A session manager.
- A rate-limit provider.
- An email provider for lifecycle workflows.

## Architecture

The authentication package is built around two managers.

| Manager                       | Responsibility                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `StorageAuthManager`          | Registration, sign-in, authentication state and session operations                 |
| `StorageAuthLifecycleManager` | Email verification, password recovery, account management and lifecycle operations |

Additional infrastructure:

| Component                  | Responsibility                              |
| -------------------------- | ------------------------------------------- |
| `StorageRateLimitProvider` | Atomic storage-backed rate limiting         |
| `PasswordHasher`           | Argon2id password hashing and verification  |
| `EmailProvider`            | Sending authentication-related emails       |
| `SessionManager`           | Session creation, validation and revocation |
| `StorageAdapter`           | Persistent storage and atomic operations    |

The application owns the concrete implementations of these dependencies. The authentication package does not assume a particular database, email service, password-hashing library or framework.

## Initialization

Both managers must be initialized before they can be used.

The following example assumes that the application has already configured a storage adapter, session manager, Argon2id password hasher and email provider.

```ts
import {
  StorageAuthManager,
  StorageAuthLifecycleManager,
  StorageRateLimitProvider,
} from "@puzzle-ui/auth";

import { StorageSessionManager } from "@puzzle-ui/session";

// Supplied by the application.
import { storage } from "./storage";
import { passwordHasher } from "./password-hasher";
import { emailProvider } from "./email-provider";

const rateLimitKeySecret = env.AUTH_RATE_LIMIT_SECRET;

if (!rateLimitKeySecret || rateLimitKeySecret.length < 32) {
  throw new Error(
    "AUTH_RATE_LIMIT_SECRET must contain at least 32 characters.",
  );
}

const sessions = new StorageSessionManager(storage, {
  lifetime: {
    idleTimeoutSeconds: 60 * 60 * 24 * 7,
    absoluteLifetimeSeconds: 60 * 60 * 24 * 30,
  },
  maximumSessionsPerUser: 10,
});

await sessions.initialize();

const rateLimitProvider = new StorageRateLimitProvider(storage);

const auth = new StorageAuthManager(
  {
    storage,
    passwordHasher,
    rateLimitProvider,
    sessions,
  },
  {
    rateLimitKeySecret,
    requireVerifiedEmail: true,
  },
);

const lifecycle = new StorageAuthLifecycleManager(
  {
    storage,
    passwordHasher,
    emailProvider,
    sessions,
    rateLimitProvider,
  },
  {
    rateLimitKeySecret,
    requireVerifiedEmail: true,
  },
);

await auth.initialize();
await lifecycle.initialize();
```

### Configuration consistency

When email verification is required, configure both managers with the same `requireVerifiedEmail` value.

The lifecycle manager independently enforces this setting when validating authenticated sessions for protected account-management operations.

Registration still creates a session. However, when verification is required, the unverified account cannot retrieve an authenticated current-user state or perform protected lifecycle operations until verification is complete.

### Password hasher

The application must provide a `PasswordHasher` implementation.

The provider contract is:

```ts
export type PasswordHash = {
  readonly hash: string;
  readonly algorithm: "argon2id";
  readonly parameters: Readonly<Record<string, number | string>>;
};

export interface PasswordHasher {
  hash(password: string): Promise<PasswordHash>;
  verify(password: string, stored: PasswordHash): Promise<boolean>;
  needsRehash?(stored: PasswordHash): boolean | Promise<boolean>;
}
```

The authentication package validates that generated hashes identify the `argon2id` algorithm. It does not silently fall back to another algorithm.

Use a maintained Argon2id implementation with parameters appropriate for your deployment environment.

### Email provider

The application provides email delivery through this interface:

```ts
export type EmailMessage = {
  readonly to: string;
  readonly subject: string;
  readonly template: string;
  readonly variables: Readonly<Record<string, string>>;
};

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}
```

The package supplies a template identifier and variables. The application is responsible for rendering and delivering the email.

The default template identifiers are:

| Workflow           | Template                         |
| ------------------ | -------------------------------- |
| Email verification | `auth/email-verification`        |
| Password reset     | `auth/password-reset`            |
| Email change       | `auth/email-change-verification` |

Each template receives:

- `url`: the generated callback URL containing the action token.
- `expiresAt`: the token expiration timestamp in ISO 8601 format.

Template identifiers and email subjects can be overridden through `AuthLifecycleManagerOptions`.

## Registration

Use `StorageAuthManager.register()` to create an account.

```ts
const result = await auth.register({
  email: "user@example.com",
  password: "a-secure-password",
  name: "Example User",
  ipAddress: trustedClientIp,
});
```

The result contains:

- The public user record.
- The authenticated session metadata.
- The raw session token.

The raw session token is server-only. It must only be delivered through a secure, HttpOnly cookie.

Never expose the token through client-side JSON responses, browser storage or client-side application state.

### Registration input

```ts
type AuthRegisterInput = {
  readonly email: string;
  readonly password: string;
  readonly name?: string | null;
  readonly ipAddress: string;
  readonly sessionMetadata?: Readonly<Record<string, unknown>>;
};
```

The IP address must be obtained from a trusted source in the framework integration. Do not blindly trust arbitrary `X-Forwarded-For` values.

### Email verification after registration

Registration does not automatically send a verification email.

When verification is required, request verification explicitly:

```ts
await lifecycle.sendEmailVerification({
  userId: result.user.id,
  verificationUrl: "https://example.com/verify-email",
  ipAddress: trustedClientIp,
});
```

The application should deliver the resulting callback URL to the user through its email provider.

Requesting another verification email invalidates previously outstanding verification tokens for that account.

## Sign in

Use `StorageAuthManager.signIn()` to authenticate an existing account.

```ts
const result = await auth.signIn({
  email: "user@example.com",
  password: "a-secure-password",
  ipAddress: trustedClientIp,
});
```

Invalid credentials produce the same public authentication error, regardless of whether the email address exists.

When `requireVerifiedEmail` is enabled, valid credentials are still rejected until the account has completed email verification.

Deactivated accounts cannot sign in. Their sign-in attempts return the generic invalid-credentials error.

### Sign-in input

```ts
type AuthSignInInput = {
  readonly email: string;
  readonly password: string;
  readonly ipAddress: string;
  readonly sessionMetadata?: Readonly<Record<string, unknown>>;
};
```

## Current user

Retrieve the current authenticated user from a session token:

```ts
const user = await auth.getCurrentUser(sessionToken);
```

The method returns `null` when:

- The session is invalid.
- The session has expired.
- The session has been revoked.
- The account no longer exists.
- The account has been deactivated.
- The session was invalidated by a sensitive account change.
- Email verification is required but has not been completed.

The returned user contains only public account fields.

```ts
export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly emailVerifiedAt: Date | null;
  readonly name: string | null;
  readonly image: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
```

Internal storage fields and password credentials are never included.

## Authentication state

Retrieve the current authentication state:

```ts
const state = await auth.getAuthState(sessionToken);

if (state.status === "authenticated") {
  console.log(state.userId);
  console.log(state.sessionId);
}
```

The current authentication state type is:

```ts
export type AuthState =
  | { readonly status: "unauthenticated" }
  | { readonly status: "primary-authenticated"; readonly userId: string }
  | {
      readonly status: "mfa-pending";
      readonly userId: string;
      readonly challengeId: string;
      readonly expiresAt: Date;
    }
  | {
      readonly status: "authenticated";
      readonly userId: string;
      readonly sessionId: string;
    };
```

The additional authentication states provide room for future multi-factor authentication workflows.

## Email verification

### Request verification

```ts
await lifecycle.sendEmailVerification({
  userId: user.id,
  verificationUrl: "https://example.com/verify-email",
  ipAddress: trustedClientIp,
});
```

The verification URL must be an HTTPS URL. HTTP is accepted for localhost development.

The email contains a cryptographically secure, single-use token.

Default token lifetime: **1 hour**.

### Verify email

The application extracts the token from the callback URL and passes it to the lifecycle manager:

```ts
const verifiedUser = await lifecycle.verifyEmail(token);
```

The token is consumed atomically with the account update and audit event.

A token cannot be reused, has a limited lifetime and is rejected if it has been revoked.

### Verification settings

```ts
const lifecycle = new StorageAuthLifecycleManager(dependencies, {
  rateLimitKeySecret,
  emailVerificationTokenLifetimeSeconds: 60 * 60,
  requireVerifiedEmail: true,
});
```

## Password recovery

### Request a password reset

```ts
await lifecycle.requestPasswordReset({
  email: "user@example.com",
  resetUrl: "https://example.com/reset-password",
  ipAddress: trustedClientIp,
});
```

The method deliberately returns the same public result whether or not the email address belongs to an account.

This prevents the password-reset endpoint from becoming an account-enumeration mechanism.

Email delivery errors are suppressed from the public response and can be observed through `onEmailDeliveryError`.

### Reset password

After the user follows the email link, pass the token and new password to the lifecycle manager:

```ts
await lifecycle.resetPassword({
  token,
  newPassword: "a-new-secure-password",
});
```

The operation:

- Validates the action token.
- Validates the new password.
- Hashes the new password using Argon2id.
- Consumes the action token.
- Updates the password credential.
- Invalidates outstanding password-reset tokens.
- Invalidates existing sessions.
- Records an audit event.

These changes are committed atomically.

Default token lifetime: **1 hour**.

## Change password

An authenticated user can change their password after confirming the current password.

```ts
await lifecycle.changePassword({
  sessionToken,
  currentPassword: "current-secure-password",
  newPassword: "a-new-secure-password",
});
```

The operation updates the password credential, invalidates outstanding password-reset tokens and invalidates existing sessions.

The current password must be correct.

The operation records an audit event and commits its credential and account changes atomically.

## Profile management

Update the user's public profile:

```ts
const updatedUser = await lifecycle.updateProfile({
  sessionToken,
  name: "Updated Name",
  image: "https://example.com/profile.webp",
});
```

Both fields are optional.

The image URL must use HTTPS and cannot contain embedded credentials.

The method returns the updated public user record.

## Email address changes

Changing an email address requires the current password and confirmation of the new address.

### Request an email change

```ts
await lifecycle.requestEmailChange({
  sessionToken,
  currentPassword: "current-secure-password",
  email: "new-address@example.com",
  verificationUrl: "https://example.com/verify-email-change",
  ipAddress: trustedClientIp,
});
```

The operation:

- Validates the authenticated session.
- Verifies the current password.
- Normalizes the new email address.
- Rejects an address that is already in use.
- Creates a single-use confirmation token.
- Sends the confirmation email.

Default token lifetime: **1 hour**.

### Confirm the new address

```ts
const updatedUser = await lifecycle.verifyEmailChange(token);
```

The email address is changed only after successful token verification.

The account update, token consumption and audit event are atomic.

Changing the email address invalidates existing sessions.

## Account deactivation

An authenticated user can deactivate their account after confirming their password.

```ts
await lifecycle.deactivateAccount({
  sessionToken,
  password: "current-secure-password",
});
```

Deactivation is a soft-deactivation. The account record and audit history remain stored.

The operation:

- Requires an authenticated session.
- Requires password confirmation.
- Sets `deactivatedAt`.
- Invalidates existing sessions.
- Records an `account-deactivated` audit event.

A deactivated account cannot sign in or use protected lifecycle operations.

The package does not currently expose an account-reactivation method.

## Account deletion

An authenticated user can permanently delete their account after confirming their password.

```ts
await lifecycle.deleteAccount({
  sessionToken,
  password: "current-secure-password",
});
```

The operation removes:

- The user record.
- Associated password credentials.
- Associated action tokens.

An `account-deleted` audit event is retained.

All existing sessions are revoked after the successful storage operation.

## Session management

The package delegates session lifecycle operations to `@puzzle-ui/session`.

The authentication manager exposes:

### Sign out

```ts
await auth.signOut(sessionToken);
```

The session is revoked and a sign-out audit event is recorded.

The framework integration remains responsible for clearing the corresponding browser cookie.

### Sign out everywhere

```ts
await auth.signOutEverywhere(user.id);
```

All sessions belonging to the user are revoked and an audit event is recorded.

### Session invalidation after account changes

Password resets, password changes, email changes, account deactivation and account deletion invalidate existing sessions.

For operations that update an existing account record, the package stores a `sessionsInvalidatedAt` timestamp as part of the same atomic storage batch.

Authentication and lifecycle validation reject sessions created at or before that timestamp.

This provides a fail-closed security boundary even if the underlying session provider cannot physically revoke every session immediately.

New sessions created after the invalidation timestamp can authenticate normally, provided the account is active and all authentication requirements are satisfied.

## Rate limiting

The package supports configurable rate limiting for registration, sign-in and lifecycle operations.

The `RateLimitProvider` contract is:

```ts
export interface RateLimitProvider {
  consume(input: {
    readonly key: string;
    readonly limit: number;
    readonly windowSeconds: number;
  }): Promise<{
    readonly allowed: boolean;
    readonly remaining: number;
    readonly resetAt: Date;
  }>;
}
```

### Storage-backed rate limiting

`StorageRateLimitProvider` provides a shared, storage-backed implementation.

```ts
const rateLimitProvider = new StorageRateLimitProvider(storage, {
  collectionName: "auth_rate_limits",
  maximumRetries: 12,
});
```

The provider uses conditional writes and unique constraints to handle concurrent requests.

It does not silently fall back to unrestricted access when storage is unavailable.

### Default policies

The default registration and sign-in policies are:

| Action       | Scope | Limit |     Window |
| ------------ | ----- | ----: | ---------: |
| Registration | Email |     5 |     1 hour |
| Registration | IP    |    10 |     1 hour |
| Sign-in      | Email |    10 | 15 minutes |
| Sign-in      | IP    |    30 | 15 minutes |

Lifecycle defaults:

| Action             | Scope | Limit | Window |
| ------------------ | ----- | ----: | -----: |
| Email verification | Email |     3 | 1 hour |
| Email verification | IP    |    10 | 1 hour |
| Password reset     | Email |     3 | 1 hour |
| Password reset     | IP    |    10 | 1 hour |
| Email change       | Email |     3 | 1 hour |
| Email change       | IP    |    10 | 1 hour |

Policies can be overridden through `rateLimits` in the respective manager options.

Rate-limit identifiers are HMAC-hashed using the configured `rateLimitKeySecret`.

The secret must contain at least 32 characters and must remain stable across application instances.

## Storage requirements

The authentication package uses the `StorageAdapter` interface from `@puzzle-ui/storage`.

The authentication manager requires:

- Unique constraints.
- Atomic batch operations.

The lifecycle manager additionally requires:

- Conditional writes.
- Unique constraints.
- Atomic batch operations.

The storage adapter must implement these capabilities correctly. In particular, atomic batches must not partially apply account changes or token consumption.

### Collections

The default collection names are:

| Collection           | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `auth_users`         | User accounts                                              |
| `auth_credentials`   | Password credentials                                       |
| `auth_action_tokens` | Email verification, password reset and email change tokens |
| `auth_audit_events`  | Authentication and lifecycle audit events                  |
| `auth_rate_limits`   | Rate-limit counters                                        |

Collection names can be overridden through the manager options.

### User records

The internal user storage record extends the public user model with:

- `normalizedEmail`
- `deactivatedAt`
- `sessionsInvalidatedAt`

These internal fields are not exposed through `AuthUser`.

### Credentials

Password credentials are stored separately from user records.

The credential record contains:

- User ID.
- Credential kind.
- Argon2id password hash.
- Password update timestamp.
- Revocation timestamp.

The storage layer enforces uniqueness for a user's credential kind.

### Action tokens

Action tokens are stored as hashes, never as plaintext tokens.

Each token contains:

- User ID.
- Purpose.
- Token hash.
- Expiration timestamp.
- Consumption timestamp.
- Optional target email.
- Revocation timestamp.

The storage layer enforces unique token hashes.

## Audit events

The package records audit events for authentication and account lifecycle operations.

Supported actions include:

- `account-registered`
- `sign-in`
- `sign-in-failed`
- `sign-out`
- `sign-out-everywhere`
- `email-verification-requested`
- `email-verified`
- `password-reset-requested`
- `password-reset-completed`
- `password-changed`
- `profile-updated`
- `email-change-requested`
- `email-changed`
- `account-deactivated`
- `account-deleted`

Audit records can contain a user ID, session ID and non-secret metadata.

Never add passwords, raw session tokens, action tokens or password hashes to audit metadata.

## Error handling

Authentication errors extend `AuthError`.

```ts
export type AuthErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "CONFIGURATION"
  | "PROVIDER"
  | "SESSION"
  | "INVALID_TOKEN";
```

Available error classes:

| Error                                | Code                  | Purpose                                                   |
| ------------------------------------ | --------------------- | --------------------------------------------------------- |
| `AuthValidationError`                | `INVALID_INPUT`       | Invalid input or validation failure                       |
| `AuthInvalidCredentialsError`        | `INVALID_CREDENTIALS` | Invalid email/password combination                        |
| `AuthEmailVerificationRequiredError` | `EMAIL_NOT_VERIFIED`  | Email verification is required                            |
| `AuthAccountConflictError`           | `CONFLICT`            | Account creation or email conflict                        |
| `AuthRateLimitError`                 | `RATE_LIMITED`        | Rate limit exceeded                                       |
| `AuthConfigurationError`             | `CONFIGURATION`       | Invalid configuration or unsupported storage capabilities |
| `AuthProviderError`                  | `PROVIDER`            | Provider or storage operation failure                     |
| `AuthSessionError`                   | `SESSION`             | Session validation or management failure                  |
| `AuthTokenError`                     | `INVALID_TOKEN`       | Invalid, expired, consumed or revoked action token        |

Errors expose a stable error code and can include a cause and structured details.

Applications should map these errors to appropriate HTTP responses in their framework integration. Avoid exposing internal provider errors or sensitive implementation details to clients.

## Configuration reference

### `AuthManagerOptions`

| Option                  | Type         | Default                 |
| ----------------------- | ------------ | ----------------------- |
| `rateLimitKeySecret`    | `string`     | Required                |
| `usersCollection`       | `string`     | `auth_users`            |
| `credentialsCollection` | `string`     | `auth_credentials`      |
| `auditCollection`       | `string`     | `auth_audit_events`     |
| `minimumPasswordLength` | `number`     | `8`                     |
| `maximumPasswordLength` | `number`     | `1024`                  |
| `requireVerifiedEmail`  | `boolean`    | `false`                 |
| `rateLimits`            | `object`     | See rate-limit defaults |
| `clock`                 | `() => Date` | Current time            |

### `AuthLifecycleManagerOptions`

| Option                                  | Type              | Default                       |
| --------------------------------------- | ----------------- | ----------------------------- |
| `rateLimitKeySecret`                    | `string`          | Required                      |
| `usersCollection`                       | `string`          | `auth_users`                  |
| `credentialsCollection`                 | `string`          | `auth_credentials`            |
| `actionTokensCollection`                | `string`          | `auth_action_tokens`          |
| `auditCollection`                       | `string`          | `auth_audit_events`           |
| `rateLimitsCollection`                  | `string`          | `auth_rate_limits`            |
| `minimumPasswordLength`                 | `number`          | `8`                           |
| `maximumPasswordLength`                 | `number`          | `1024`                        |
| `emailVerificationTokenLifetimeSeconds` | `number`          | `3600`                        |
| `passwordResetTokenLifetimeSeconds`     | `number`          | `3600`                        |
| `emailChangeTokenLifetimeSeconds`       | `number`          | `3600`                        |
| `emailTemplates`                        | `object`          | Built-in template identifiers |
| `emailSubjects`                         | `object`          | Built-in email subjects       |
| `rateLimits`                            | `object`          | See rate-limit defaults       |
| `requireVerifiedEmail`                  | `boolean`         | `false`                       |
| `clock`                                 | `() => Date`      | Current time                  |
| `onEmailDeliveryError`                  | `(error) => void` | Not configured                |
| `onSessionRevocationError`              | `(error) => void` | Not configured                |

The lifecycle manager's `rateLimitProvider` dependency is optional. When omitted, it creates a `StorageRateLimitProvider` using the configured storage adapter.

### `StorageRateLimitProviderOptions`

| Option           | Type         | Default            |
| ---------------- | ------------ | ------------------ |
| `collectionName` | `string`     | `auth_rate_limits` |
| `clock`          | `() => Date` | Current time       |
| `maximumRetries` | `number`     | `12`               |

## Testing

The package uses Node.js' built-in test runner.

Run the authentication package tests:

```sh
bun run --filter @puzzle-ui/auth test
```

Run the package typecheck:

```sh
bun run --filter @puzzle-ui/auth typecheck
```

Build the package:

```sh
bun run --filter @puzzle-ui/auth build
```

The test suite covers authentication behavior, lifecycle workflows, storage behavior, token handling, rate limiting and security-sensitive cases.

## Security considerations

Applications integrating this package must observe the following requirements:

1. **Session tokens are secrets.** Deliver raw session tokens exclusively through secure, HttpOnly cookies. Never expose them to browser JavaScript or serialize them into client-side JSON.
2. **Use HTTPS.** Authentication callback URLs and profile image URLs must use HTTPS. Localhost HTTP is supported for development callback URLs.
3. **Use Argon2id.** Supply a maintained Argon2id implementation. Do not replace it with a weaker algorithm or an ad hoc fallback.
4. **Protect the rate-limit secret.** Use a dedicated secret with at least 32 characters and keep it stable across application instances.
5. **Use shared rate limiting.** Production rate limiting must be backed by shared persistent storage rather than per-process in-memory counters.
6. **Trust client IP addresses carefully.** Framework integrations must derive IP addresses from trusted proxy configuration.
7. **Preserve atomic storage semantics.** User, credential, token and audit mutations must use the required atomic and conditional storage operations.
8. **Do not expose action tokens.** Raw action tokens should only be delivered through the intended email workflow. Persist only their hashes.
9. **Avoid account enumeration.** Keep password-reset responses generic and do not expose whether an email address belongs to an account.
10. **Keep internal errors private.** Do not expose provider errors, storage details or sensitive causes to clients.
11. **Keep verification settings aligned.** Configure `requireVerifiedEmail` consistently on both authentication managers.
12. **Observe delivery and revocation failures.** Use `onEmailDeliveryError` and `onSessionRevocationError` for operational logging and monitoring.

## Scope and roadmap

`@puzzle-ui/auth` currently provides the framework-independent authentication core and account lifecycle workflows described above.

The following features are outside the current package scope:

- TOTP multi-factor authentication.
- WebAuthn and passkeys.
- Recovery codes.
- OAuth and external identity providers.
- Framework-specific authentication endpoints.
- Framework-specific browser cookie handling.
- Ready-made authentication pages and UI components.

These capabilities belong to separate Puzzle Auth features and the `@puzzle-ui/fullstack` integration layer.

The authentication core is designed to remain reusable by those future integrations without coupling its storage or business logic to a specific framework.
