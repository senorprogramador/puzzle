## Multi-factor authentication, passkeys and step-up

The authentication package includes a framework-independent MFA implementation.

Supported authentication factors:

- TOTP authenticators.
- WebAuthn passkeys.
- Single-use recovery codes.

The MFA manager supports:

- TOTP factor enrollment and verification.
- Passkey registration and authentication.
- Discoverable passkey sign-in.
- Password-backed MFA enrollment.
- Mandatory first-factor enrollment.
- Recovery code generation, verification and regeneration.
- Factor listing and removal.
- Challenge expiration and attempt limits.
- TOTP replay protection.
- WebAuthn challenge, origin and RP ID verification.
- Authenticator counter validation.
- MFA audit events.
- MFA-specific rate limiting.

### MFA policy

MFA is optional by default.

Configure a global requirement through `AuthManagerOptions`:

```ts
const auth = new StorageAuthManager(
  {
    storage,
    passwordHasher,
    rateLimitProvider,
    sessions,
    mfa,
  },
  {
    rateLimitKeySecret,
    mfaPolicy: {
      required: true,
    },
  },
);
```

For user-specific requirements, configure `requiredFor`:

```ts
const auth = new StorageAuthManager(
  {
    storage,
    passwordHasher,
    rateLimitProvider,
    sessions,
    mfa,
  },
  {
    rateLimitKeySecret,
    mfaPolicy: {
      requiredFor: async (user) => {
        const account = await roleRepository.findByUserId(user.id);

        return account?.role === "admin";
      },
    },
  },
);
```

The callback receives the public `AuthUser`. It can return a boolean or a promise.

When neither `required` nor `requiredFor` requires MFA, users without enrolled factors can sign in normally. Existing active factors are still challenged during sign-in.

### Mandatory first-factor enrollment

When MFA is required and the user has no active factor:

1. Password authentication succeeds.
2. The manager creates an enrollment challenge.
3. No normal authenticated session is issued.
4. The user enrolls either a TOTP authenticator or a passkey.
5. The first factor is verified.
6. Recovery codes are generated.
7. The factor, recovery codes and challenge consumption are committed.
8. Only then is an authenticated session issued.

The temporary enrollment token is server-only and must be transported through a short-lived, secure, HttpOnly cookie.

The browser must never receive the raw challenge token in JSON, local storage or session storage.

The authentication state is `mfa-enrollment-pending` until the enrollment has completed.

### Existing sessions and policy changes

The MFA policy is evaluated when an existing session is inspected.

If a policy now requires MFA and the user has no active factor, the authentication state becomes `mfa-enrollment-required`.

This is a restricted state, not an authenticated application session:

- `getCurrentUser()` returns `null`.
- `getAuthState()` returns `mfa-enrollment-required`.
- Applications must not authorize protected operations for this state.
- The user can use the enrollment flow after confirming their current password.
- Normal authentication is restored after an active factor exists.

Removing the last active factor therefore cannot silently preserve full application access when MFA is required.

### TOTP enrollment

For an authenticated user with a normal session:

```ts
const enrollment = await mfa.beginTotpEnrollment({
  sessionToken,
  currentPassword,
  ipAddress,
  label: "Authenticator",
});
```

Display the returned `otpauthUrl` as a QR code or allow the user to enter the secret manually.

Verify the first code:

```ts
const completed = await mfa.verifyTotpEnrollment({
  sessionToken,
  factorId: enrollment.factorId,
  code,
  ipAddress,
});
```

The result includes the public factor and recovery codes. Display recovery codes once and ask the user to store them securely.

### Passkey enrollment

Passkey registration is a two-step WebAuthn ceremony:

1. Generate registration options.
2. Verify the browser's registration response on the server.

The server must validate the expected challenge, origin, RP ID and user verification result.

Never trust browser-provided credential metadata without server-side verification.

### MFA sign-in

Password-backed sign-in returns `mfa-pending` when the account has active factors.

The user can complete the challenge using:

- TOTP.
- A registered passkey.
- A recovery code.

Discoverable passkey sign-in is also supported without requiring an email and password first.

A successful MFA challenge creates the authenticated session. The challenge is single-use and expires after its configured lifetime.

### Recovery codes

Recovery codes are generated during successful factor enrollment.

Store only their hashes. A recovery code:

- Can be used once.
- Is consumed atomically with successful authentication.
- Must never be written to audit metadata or application logs.

Users can regenerate their recovery codes after confirming their current password. Regeneration invalidates the previous unused codes.

### Step-up authentication

The step-up manager requires a recent MFA verification for sensitive operations.

Supported methods:

- TOTP.
- Passkey.
- Recovery code.

A step-up challenge is bound to the current authenticated session. Successful verification rotates that session and records the authentication method and verification timestamp in session metadata.

Use `hasRecentStepUp()` or `requireRecentStepUp()` in server-side actions that require recent MFA verification.

```ts
const session = await requireRecentStepUp(request, sessionOptions, 300);
```

The default maximum age is five minutes. The accepted maximum is one hour.

### MFA configuration

`AuthMfaManagerOptions` supports:

| Option                     | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `rateLimitKeySecret`       | HMAC secret for rate-limit identifiers           |
| `factorsCollection`        | MFA factor records                               |
| `challengesCollection`     | MFA challenge records                            |
| `recoveryCodesCollection`  | Hashed recovery codes                            |
| `challengeLifetimeSeconds` | Challenge lifetime                               |
| `recoveryCodeCount`        | Number of recovery codes generated               |
| `issuer`                   | TOTP issuer displayed in authenticator apps      |
| `totp`                     | TOTP digits, period and verification window      |
| `webAuthn`                 | RP ID, RP name and expected origin               |
| `requireVerifiedEmail`     | Require verified email before MFA authentication |
| `clock`                    | Injectable clock for deterministic tests         |

WebAuthn must use an exact expected origin and RP ID. Production deployments must use HTTPS.

TOTP secrets must be protected using a configured `AuthSecretProtector`. Do not store plaintext TOTP secrets.

### Fullstack integration

`@puzzle-ui/fullstack` provides framework-independent server handlers and a browser client.

Use the explicit package entry points:

- `@puzzle-ui/fullstack/auth/server`
- `@puzzle-ui/fullstack/auth/client`
- `@puzzle-ui/fullstack/auth/shared`
- `@puzzle-ui/fullstack/auth/next`
- `@puzzle-ui/fullstack/auth/tanstack`

The server owns cookies, challenge tokens and session tokens. The browser client receives public state and factor data only.

The client authentication statuses include:

- `unauthenticated`
- `mfa-pending`
- `mfa-enrollment-pending`
- `mfa-enrollment-required`
- `step-up-pending`
- `authenticated`

Applications must treat only `authenticated` as normal authenticated access.

### MFA security requirements

Production deployments must:

1. Use HTTPS.
2. Keep session and challenge tokens in secure, HttpOnly cookies.
3. Keep TOTP secrets encrypted at rest.
4. Keep recovery codes hashed at rest.
5. Configure exact WebAuthn origins and RP IDs.
6. Use shared, persistent rate limiting.
7. Preserve conditional writes and atomic storage operations.
8. Reject expired, consumed and over-attempted challenges.
9. Never expose tokens, TOTP secrets, recovery codes or provider errors in logs.
10. Restrict application access when a required MFA factor is missing.

### MFA testing

Run the authentication package tests:

```sh
bun run --filter @puzzle-ui/auth test
```

Run the fullstack tests:

```sh
bun run --filter @puzzle-ui/fullstack test
```

Run typechecks:

```sh
bun run --filter @puzzle-ui/auth typecheck
bun run --filter @puzzle-ui/fullstack typecheck
```

Build both packages:

```sh
bun run --filter @puzzle-ui/auth build
bun run --filter @puzzle-ui/fullstack build
```

## Scope and roadmap

`@puzzle-ui/auth` provides the framework-independent authentication core, account lifecycle workflows, MFA, passkeys, recovery codes and step-up authentication.

`@puzzle-ui/fullstack` provides the browser client, server handlers and Next.js and TanStack Start integration entry points.

The following features remain outside the current authentication scope:

- OAuth and external identity providers.
- Ready-made authentication pages and UI components.
- Application-specific authorization and role management.
- Application-specific email templates and delivery workflows.

These capabilities can be built on top of the authentication primitives without coupling the core package to a specific application or framework.
