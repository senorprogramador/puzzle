# Security Policy

## Supported versions

Puzzle is currently in the 0.x release series.

Security fixes should target the current development branch and the latest
published package versions.

The authentication-related packages must be treated as one coordinated
security surface:

- @puzzle-ui/storage
- @puzzle-ui/storage-d1
- @puzzle-ui/storage-mongodb
- @puzzle-ui/session
- @puzzle-ui/auth
- @puzzle-ui/fullstack

## Reporting a vulnerability

Do not publish security vulnerabilities as public GitHub issues.

Use GitHub's private vulnerability reporting or contact the repository
maintainer privately.

Please include:

- A description of the vulnerability.
- The affected package and version.
- The affected runtime and framework.
- Reproduction instructions.
- A proof of concept where possible.
- The potential impact.
- Suggested remediation, if known.

Do not include real user credentials, production tokens or personal data.

## Authentication security requirements

Production deployments must follow these requirements.

### Transport security

- Use HTTPS for all authentication endpoints.
- Never expose session tokens through URLs.
- Never store session tokens in localStorage or sessionStorage.
- Use HttpOnly cookies for session and temporary authentication tokens.
- Use Secure cookies in production.
- Use an appropriate SameSite policy.
- Do not allow untrusted origins.

### Session security

- Generate cryptographically secure opaque session tokens.
- Store only token hashes.
- Validate sessions against durable storage.
- Enforce idle and absolute expiration.
- Rotate sessions after sensitive authentication operations.
- Revoke sessions after password changes and account security events.
- Do not trust client-provided session metadata.

### Password security

- Use an Argon2id password hashing implementation.
- Never store plaintext passwords.
- Never log passwords or password hashes.
- Apply shared, persistent rate limiting.
- Use generic public responses for account recovery requests.
- Avoid disclosing whether an email address is registered.

### MFA security

- Encrypt TOTP secrets at rest.
- Store recovery codes as hashes.
- Consume recovery codes atomically.
- Reject expired and consumed challenges.
- Enforce challenge attempt limits.
- Prevent TOTP replay.
- Require cryptographic WebAuthn verification.
- Validate the expected WebAuthn challenge, origin and RP ID.
- Require user verification for passkey authentication.

### CSRF protection

- Validate the Origin header on state-changing requests.
- Use an explicit allowlist of origins.
- Reject cross-site state-changing requests.
- Do not treat a missing Origin header as trusted by default.
- Keep CSRF validation server-side.

### Storage requirements

Production storage adapters must support the capabilities required by
authentication and session management.

These include:

- Unique constraints.
- Conditional writes.
- Atomic batches.
- Durable persistence.

An in-memory storage implementation is suitable for tests and local
development only.

### Rate limiting

Rate limiting must be shared across application instances.

Do not use process-local counters for production authentication.

Rate-limit identifiers should be opaque and must not disclose email addresses,
IP addresses or other personal information in storage keys.

### Secrets

The following values must remain server-side:

- Session secrets.
- Rate-limit HMAC secrets.
- TOTP encryption keys.
- Database credentials.
- Email provider credentials.
- Application secrets.

Use a proper secret manager or the deployment platform's encrypted
environment configuration.

Never commit secrets or production environment files.

## Logging and observability

Logs must not contain:

- Session tokens.
- MFA challenge tokens.
- Password reset tokens.
- Email verification tokens.
- Passwords or password hashes.
- TOTP secrets.
- Recovery codes.
- Private WebAuthn credential material.
- Database credentials.

Security events may be recorded using non-sensitive identifiers and
sanitized metadata.

## WebAuthn deployment requirements

Production deployments must:

- Use HTTPS.
- Configure an exact RP ID.
- Configure exact expected origins.
- Use a maintained WebAuthn server implementation.
- Keep challenges server-managed.
- Reject unexpected origins, challenges and RP IDs.

Never accept browser-provided credential information without server-side
cryptographic verification.

## Dependency and release security

Every release must pass:

- Workspace typechecks.
- Package builds.
- Package tests.
- Browser tests.
- Storage conformance tests.
- Runtime compatibility checks.
- Package publication preflight.

Changes to authentication, session and storage packages require a security
review before release.

## Disclosure

Coordinate disclosure with the maintainer.

Do not disclose an unresolved vulnerability publicly without first allowing
the maintainer an opportunity to investigate and prepare a fix.
