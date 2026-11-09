# Puzzle Auth — Architecture & Foundation

**Epic:** E0 — Architecture & Foundation  
**Feature:** F0.1 — Architectural decisions  
**Status:** Completed — architectural decisions

## 1. Goal

Design a modular, framework-independent authentication system with first-party Puzzle UI authentication flows.

The architecture must support:

- Next.js App Router.
- TanStack Start.
- Node.js.
- Cloudflare Workers.
- MongoDB and Cloudflare D1.
- Extensible authentication methods.
- Secure session management.
- Multi-factor authentication.

The authentication core must not depend on a specific framework, database vendor, or UI implementation.

The architecture should allow applications to adopt individual parts of Puzzle Auth without requiring the entire ecosystem.

## 2. Package architecture

The authentication system is divided into packages with clearly defined responsibilities.

| Package                      | Responsibility                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `@puzzle-ui/storage`         | Vendor-neutral persistence contracts, capabilities and record types                     |
| `@puzzle-ui/storage-mongodb` | MongoDB storage adapter                                                                 |
| `@puzzle-ui/storage-d1`      | Cloudflare D1 storage adapter                                                           |
| `@puzzle-ui/session`         | Opaque session tokens, lifecycle, cookie policy and session operations                  |
| `@puzzle-ui/auth`            | Framework-independent authentication domain, use cases, policies and provider contracts |
| `@puzzle-ui/fullstack`       | First-party authentication screens and fullstack integrations                           |

Existing packages are reused wherever appropriate:

- `@puzzle-ui/ui`
- `@puzzle-ui/core`
- `@puzzle-ui/hooks`
- `@puzzle-ui/icons`
- `@puzzle-ui/theme`

### 2.1 Storage

`@puzzle-ui/storage` defines the persistence abstraction.

It must not contain database-specific implementations or dependencies.

Responsibilities:

- Typed persistence contracts.
- Entity and record definitions.
- Capability discovery.
- Atomic operation contracts.
- Storage adapter interfaces.

Database-specific behavior belongs in separate adapter packages.

### 2.2 Session

`@puzzle-ui/session` manages session lifecycle and security.

Responsibilities:

- Session creation.
- Session validation.
- Session rotation.
- Session revocation.
- Cookie configuration.
- Session token generation and hashing.
- Anonymous-to-authenticated session migration.

The session package may depend on storage but must not depend on the authentication domain.

### 2.3 Auth

`@puzzle-ui/auth` contains the framework-independent authentication domain.

Responsibilities:

- User authentication.
- Password verification.
- Email verification.
- Password reset.
- MFA workflows.
- Authentication state transitions.
- Security policies.
- External provider contracts.

The auth package may depend on storage and session.

It must not depend on React, Next.js, TanStack Start, or database SDKs.

### 2.4 Fullstack

`@puzzle-ui/fullstack` contains the first-party authentication UI and framework integrations.

Authentication pages should be available through one Puzzle package, while client-side and server-side code remain strictly separated.

Proposed structure:

```text
packages/fullstack/src/
└── auth/
    ├── client/
    │   └── index.ts
    ├── server/
    │   └── index.ts
    ├── shared/
    │   └── index.ts
    ├── next/
    │   └── index.ts
    └── tanstack/
        └── index.ts
```

Public package subpaths:
@puzzle-ui/fullstack/auth/client
@puzzle-ui/fullstack/auth/server
@puzzle-ui/fullstack/auth/shared
@puzzle-ui/fullstack/auth/next
@puzzle-ui/fullstack/auth/tanstack

#### Client

Contains browser-safe authentication components and functionality.

May depend on:

- Puzzle UI.
- Browser APIs.
- Shared authentication types and schemas.
  Must never import:
- Server entry points.
- Database adapters.
- Database SDKs.
- Secrets.
- Password hashing implementations.
- Server-only authentication logic.

#### Server

Contains server-side authentication functionality.

May depend on:

- @puzzle-ui/auth.
- @puzzle-ui/session.
- Storage adapters.
- Server-side providers.
  Must never be re-exported from browser-facing entry points.

#### Shared

Contains serializable, client-safe contracts shared between client and server.

Examples:

- Public authentication types.
- Validation schemas.
- Safe configuration types.
- Public authentication state definitions.
  Must not contain secrets, server implementations, or database-specific types.

#### Framework integrations

Framework-specific integrations live in separate subpaths.

They translate framework requests and actions into framework-independent authentication use cases.

They must not duplicate authentication policies or security logic.

Framework integrations should use optional peer dependencies where appropriate.

## 3. Dependency rules

The dependency graph must remain acyclic.
storage
↑
session
↑
auth
↑
fullstack/server

fullstack/client
└── Puzzle UI

fullstack/shared
└── Serializable contracts

fullstack/next
└── Fullstack + Next.js adapter

fullstack/tanstack
└── Fullstack + TanStack adapter

Rules:

1. Storage adapters depend on @puzzle-ui/storage.
2. @puzzle-ui/storage must never depend on adapters.
3. Session depends on storage.
4. Auth depends on storage and session.
5. Session must never depend on auth.
6. Fullstack server depends on auth and session.
7. Fullstack client depends on Puzzle UI and client-safe shared contracts.
8. Framework adapters depend on the relevant fullstack subpaths.
9. Auth and session must not depend on React or framework packages.
10. Cross-package imports must use public package exports, not internal filesystem paths.
11. Client entry points must never import server entry points.
12. Database SDKs must never leak into framework-independent packages.

## 4. Runtime and framework support

### 4.1 Supported runtimes

| Runtime            | Support                   | Purpose                             |
| ------------------ | ------------------------- | ----------------------------------- |
| Node.js (LTS)      | First-class               | Server runtime                      |
| Cloudflare Workers | First-class               | Edge/serverless runtime             |
| Browser            | Client-only               | Authentication UI and browser flows |
| Bun                | Development compatibility | Tooling and development             |

Node.js and Cloudflare Workers must be explicitly tested as production runtime targets.

Bun compatibility is desirable but does not constitute a separate production support contract.

### 4.2 Runtime-independent implementation

Where practical, use standard Web APIs:

- Request
- Response
- Headers
- URL
- crypto.subtle
  Node-specific functionality must be isolated behind injected providers or adapters.

Do not assume:

- Filesystem access.
- Long-lived process memory.
- Native Node.js modules.
- Persistent in-memory state.
  Cloudflare Workers must be able to execute authentication operations without relying on Node-only functionality.

Production sessions and one-time tokens require durable storage.

In-memory implementations are permitted only for tests and development.

### 4.3 Framework support

The following integrations are planned:

- Next.js App Router.
- TanStack Start.
  Both integrations must have independent integration tests.

Successful TypeScript compilation alone is not sufficient proof of runtime compatibility.

## 5. Data model

The data model must remain vendor-neutral.

### 5.1 User

Represents an authenticated user.

Fields:

- id
- email
- normalizedEmail
- emailVerifiedAt
- name
- image
- createdAt
- updatedAt
  User profile data should be extensible through a typed extension mechanism.

Authentication-owned fields remain controlled by Puzzle Auth.

### 5.2 Credential

Represents an authentication credential.

Fields:

- id
- userId
- kind
- createdAt
- updatedAt
  Password credentials contain:
- Password hash.
- Hash algorithm.
- Algorithm configuration metadata.
  Plaintext passwords must never be stored.

### 5.3 ExternalAccount

Represents an external identity provider account.

Fields should support:

- Provider identifier.
- Provider account identifier.
- Associated user.
- Provider metadata.
- Creation and update timestamps.
  OAuth and external provider linking are future capabilities and are not part of F0.1 implementation.

### 5.4 Session

Represents an active or anonymous session.

Fields:

- id
- tokenHash
- userId (nullable for anonymous sessions)
- kind
- createdAt
- lastSeenAt
- expiresAt
- revokedAt
- Optional metadata.
  Supported session kinds:
- anonymous
- authenticated
  Raw session tokens must never be stored.

### 5.5 VerificationToken

Represents a one-time verification or reset token.

Fields:

- id
- purpose
- subjectId
- tokenHash
- expiresAt
- consumedAt
- createdAt
  Tokens must be purpose-bound, short-lived and single-use.

### 5.6 MfaFactor

Represents a registered MFA factor.

Supported factor types:

- TOTP.
- WebAuthn.
  TOTP secrets must be encrypted at rest.

WebAuthn records contain the public key, credential ID, counter and required metadata.

### 5.7 RecoveryCode

Represents a one-time MFA recovery code.

Fields:

- id
- userId
- codeHash
- createdAt
- consumedAt
  Recovery codes must only be displayed in plaintext when generated.

Only their hashes are persisted.

## 6. Authentication state models

Authentication workflows must use explicit state transitions.

### 6.1 Primary authentication

Unauthenticated
|
v
PrimaryAuthenticated
|
+--------------------+
| |
v v
Authenticated MfaPending
|
v
Authenticated

When MFA is required, successful primary authentication must not grant normal authenticated access.

Instead, the user enters a separate, short-lived MfaPending state.

The MFA challenge must be:

- Short-lived.
- Purpose-bound.
- Associated with the user.
- Single-use.
- Protected against replay.
  Expired or exhausted challenges return the user to an unauthenticated state.

### 6.2 Email verification

Unverified
|
v
VerificationPending
|
v
Verified

Rules:

- Verification tokens expire.
- Resending verification invalidates or supersedes previous tokens.
- Token consumption and email verification must happen atomically.
- Email verification alone must not automatically authenticate a user.

### 6.3 Password reset

NoActiveReset
|
v
ResetPending
|
v
PasswordChanged

Rules:

- Public responses must not reveal whether an account exists.
- Reset tokens must be purpose-bound.
- Reset tokens must be short-lived.
- Reset tokens must be stored as hashes.
- Reset tokens must be consumed atomically.
- Password update and token consumption must happen atomically.
- Outstanding reset tokens must be invalidated after a successful reset.
- Existing sessions should be revoked by default after a password reset.

### 6.4 MFA

MFA must be modeled as a separate authentication process.

TOTP:

- A factor remains pending until possession is proven with a valid code.
- TOTP secrets must be encrypted at rest.
  WebAuthn:
- Challenges must be short-lived and single-use.
- Challenges must be bound to the user and operation.
- The server must validate the challenge, origin and relying-party identity.
- Browser-side validation alone is insufficient.
  Recovery codes:
- Generate a set of recovery codes.
- Display plaintext codes only once.
- Persist only hashes.
- Consume each code atomically.
- Prevent reuse.
  Factor removal or replacement requires recent re-authentication or another verified factor, with recovery safeguards.

## 7. Storage contract

The storage abstraction must expose typed, vendor-neutral operations.

It must not expose raw database queries or database SDK clients.

### 7.1 Required operations

The contract must support:

- Read by primary key.
- Unique lookups.
- Insert with uniqueness guarantees.
- Explicitly safe upsert operations.
- Conditional update and delete.
- Atomic one-time token consumption.
- Atomic recovery code consumption.
- Atomic session creation.
- Atomic session rotation.
- Atomic session revocation.
- Session token hash uniqueness.
- Transaction capability discovery.

### 7.2 Atomicity and concurrency

Security-critical operations must be atomic.

Examples:

- Consuming a verification token.
- Consuming a password reset token.
- Consuming an MFA recovery code.
- Rotating a session.
- Migrating an anonymous session.
  Do not implement security-critical operations as race-prone read-then-write sequences.

If an adapter cannot guarantee the required operation, it must fail explicitly.

It must never silently fall back to an unsafe implementation.

### 7.3 Constraints

Required uniqueness constraints:

- Normalized user email.
- Session token hash.
- Token hash within its purpose.
- WebAuthn credential ID.
  Adapters are responsible for:
- Schema management.
- Index creation.
- Serialization.
- Database-specific atomic operations.
- Capability reporting.
  Database clients must not leak through the storage abstraction.

### 7.4 MongoDB adapter

The MongoDB adapter must support atomic conditional writes and uniqueness constraints.

Transactions may only be used when the MongoDB deployment topology supports them.

The adapter must explicitly report unsupported capabilities.

### 7.5 Cloudflare D1 adapter

The D1 adapter must use prepared statements and supported database constraints.

Atomic operations should use the available D1 batch and transaction capabilities.

The adapter must explicitly report and test its limitations.

### 7.6 In-memory storage

In-memory storage is permitted for:

- Unit tests.
- Integration tests.
- Local development.
  It must never be presented as a production-ready persistence solution for sessions, tokens or other security-critical state.

## 8. Session lifecycle and security

### 8.1 Token generation

Session tokens must:

- Be cryptographically random.
- Have sufficient entropy.
- Be opaque.
- Be generated using secure runtime cryptography.
  Math.random() must never be used for security-sensitive token generation.

### 8.2 Token storage

Only a hash of the session token is stored.

The raw token is returned to the client only through the appropriate secure cookie mechanism.

Token comparison should use constant-time comparison where supported by the runtime.

### 8.3 Cookie policy

Default cookie policy:

- HttpOnly
- Secure in production.
- SameSite=Lax.
- Narrowest practical scope.
- Host-only cookie.
- Path=/.
  Use the \_\_Host- prefix where possible.

A \_\_Host- cookie requires:

- Secure.
- Path=/.
- No Domain attribute.
  Cookie lifetime must not exceed the server-side session expiry.

A cookie alone does not prove that a session remains valid.

### 8.4 Session rotation

Sessions must be rotated after security-sensitive boundaries, including:

- Successful authentication.
- MFA completion.
- Privilege changes.
- Other relevant security transitions.
  Rotation must invalidate the previous session.

### 8.5 Session validation

Every authenticated request must validate the session against durable server-side storage.

Validation includes:

- Token hash.
- Revocation state.
- Expiration.
- Applicable session policies.
  The server is authoritative.

### 8.6 Session expiration

Support configurable:

- Idle timeout.
- Absolute session lifetime.
  lastSeenAt may be updated according to a configurable policy.

The browser cookie must never extend the server-side session lifetime.

### 8.7 Logout

Logout must:

1. Revoke the server-side session.
2. Clear the corresponding cookie.
   Logout-all-devices must revoke all applicable sessions for the user.
   8.8 Anonymous-to-authenticated migration
   Anonymous sessions may contain temporary application data.

When an anonymous session becomes authenticated:

1. Create a new authenticated session.
2. Revoke the anonymous session.
3. Merge only explicitly allowlisted application data.
4. Validate data size and type.
5. Never copy roles, privileges, identity, MFA state or security state.
6. Ensure the migration is atomic where required.
7. Fail closed if safe migration cannot be guaranteed.
8. Set the new cookie only after successful commit.
   The new session must have a new session ID and token.

This prevents session fixation and privilege injection.

## 9. External provider contracts

External services must be injected through typed interfaces.

### 9.1 Password hashing

Define an injectable password hashing provider.

Responsibilities:

- hash(password)
- verify(password, hash)
- Algorithm metadata.
- Hash configuration.
  Argon2id is the default algorithm.

The actual runtime implementation must be injected where necessary.

No weak fallback algorithm is permitted.

The system should support rehashing when algorithm parameters change.

### 9.2 Randomness and token hashing

Use secure runtime cryptography.

Do not introduce insecure fallback behavior.

### 9.3 Email delivery

Define an asynchronous email provider.

Responsibilities:

- Sending verification emails.
- Sending password reset emails.
- Supporting configurable senders and templates.
- Returning typed delivery results.
  Email delivery failures must not reveal account existence.

### 9.4 Rate limiting

Define an injected atomic rate-limiting provider.

It must support shared, durable limits across application instances.

Suitable implementations may use Redis, D1 or another appropriate shared storage service.

In-memory rate limiting is restricted to development and tests.

### 9.5 Storage

Storage is injected through the vendor-neutral storage contracts.

Authentication logic must not depend on a specific database implementation.

### 9.6 WebAuthn

WebAuthn validation must happen on the server.

Browser APIs are used only for client-side ceremonies.

The server remains responsible for validating challenges, origins, relying-party identity and credential responses.

### 9.7 Framework integration

Framework adapters translate framework-specific requests and actions into framework-independent use cases.

They must not duplicate security policies.

### 9.8 Application extension hooks

Applications may extend selected behavior through typed extension hooks.

Extensions must be constrained and must not be able to bypass core security requirements.

## 10. Threat model

### 10.1 Assets

The following assets require protection:

- User identities and profiles.
- Password hashes.
- Authentication credentials.
- Active sessions.
- Verification tokens.
- Password reset tokens.
- MFA secrets.
- WebAuthn credentials.
- Recovery codes.
- Email addresses.

### 10.2 Security boundaries

Important boundaries include:

- Browser and server.
- Server and storage.
- Authentication core and external providers.
- Framework adapters and framework primitives.
- Anonymous and authenticated session data.

### 10.3 Threats and mitigations

| Threat                               | Mitigation                                                          |
| ------------------------------------ | ------------------------------------------------------------------- |
| Credential stuffing and brute force  | Atomic rate limiting, generic errors                                |
| Account enumeration                  | Uniform registration and password reset responses                   |
| Database compromise                  | Argon2id, salted hashes, no plaintext credentials                   |
| Session fixation                     | New session after authentication and migration                      |
| Session theft                        | Opaque random tokens, hash at rest, secure cookies                  |
| Session replay                       | Rotation, expiration and revocation                                 |
| CSRF                                 | SameSite cookies and origin/CSRF validation                         |
| XSS token exfiltration               | HttpOnly cookies, no tokens in localStorage or sessionStorage       |
| Token replay                         | Purpose-bound, short-lived, atomically consumed tokens              |
| MFA bypass                           | Distinct MfaPending state                                           |
| Recovery code reuse                  | Hashed codes and atomic consumption                                 |
| WebAuthn phishing                    | Server-side challenge, origin and RP validation                     |
| Privilege injection during migration | New session and allowlisted data migration                          |
| Storage race conditions              | Atomic operations, unique constraints and fail-closed behavior      |
| Secret leakage                       | Server-only modules, redacted logs and no secrets in client bundles |

### 10.4 Security limitations

Puzzle Auth cannot protect against:

- A compromised application server.
- Malicious privileged application code.
- Compromised user devices.
- Unsafe authorization logic implemented by the application.
  Applications remain responsible for their own authorization policies.

Puzzle Auth provides authentication and session security primitives; it does not automatically define application-level access control.

## 11. Architecture Decision Records

The following decisions are established for the initial architecture.

### ADR-001: Fullstack authentication package

Decision: Authentication UI and fullstack integrations live in one package with strictly separated client, server and shared subpaths.

Reason: A cohesive developer experience without compromising client/server boundaries.

### ADR-002: Framework-independent authentication core

Decision: Authentication domain logic must not depend on Next.js, TanStack Start or React.

Reason: Reusability and runtime portability.

### ADR-003: Capability-based storage contract

Decision: Storage adapters expose typed capabilities and atomic operations.

Reason: Avoid database-specific leakage and unsafe assumptions about adapter behavior.

### ADR-004: Argon2id password hashing

Decision: Argon2id is the default password hashing algorithm behind an injectable provider.

Reason: Strong password hashing with runtime implementation flexibility.

### ADR-005: Standard Schema interoperability

Decision: Validation should support Standard Schema interoperability.

Reason: Applications should be able to integrate compatible validation libraries without coupling the authentication core to one specific library.

### ADR-006: Injected email provider

Decision: Email delivery is provided through an injected typed interface.

Reason: Avoid coupling to a particular email service.

### ADR-007: Injected atomic rate limiter

Decision: Rate limiting is provided through an injected provider that supports atomic shared limits.

Reason: Production security must work across multiple application instances.

### ADR-008: Node.js and Cloudflare Workers

Decision: Both are first-class server runtime targets.

Reason: Support conventional server deployments and edge/serverless environments.

Next.js and TanStack Start integrations are tested independently.

### ADR-009: Opaque hashed session tokens

Decision: Session tokens are opaque, cryptographically random and stored only as hashes. Session migration creates a new authenticated session.

Reason: Reduce the impact of token leakage and prevent session fixation.

### ADR-010: Explicit MFA authentication state

Decision: MFA is represented as a distinct authentication state.

Reason: Primary authentication must never grant full access when MFA is still required.

## 12. Acceptance criteria

F0.1 is considered architecturally complete when the following decisions are documented.

| #   | Acceptance criterion                                             | Status    |
| --- | ---------------------------------------------------------------- | --------- |
| 1   | Package responsibilities and dependencies are defined            | Completed |
| 2   | Client/server import boundaries are explicit                     | Completed |
| 3   | Security-critical authentication state models are defined        | Completed |
| 4   | External integration interfaces and responsibilities are defined | Completed |
| 5   | Runtime support is explicitly documented                         | Completed |
| 6   | Storage and session security requirements are documented         | Completed |
| 7   | Threat model and mitigations are documented                      | Completed |
| 8   | Key technology choices are recorded as ADRs                      | Completed |

# 13. Consequences and next steps

The architecture establishes the foundation for subsequent implementation work.

Recommended next features:
E0.2 — Package skeletons

- Create package structures.
- Define package exports.
- Configure build outputs.
- Establish dependency boundaries.
- Add client/server import boundary checks.
- Add package-level tests.
  Storage implementation
- Implement the vendor-neutral storage contracts.
- Define capability discovery.
- Implement atomic operation contracts.
- Build adapter conformance tests.
- Implement MongoDB and D1 adapters.
  Session implementation
- Implement secure token generation.
- Implement token hashing.
- Implement session creation, validation and revocation.
- Implement session rotation.
- Implement anonymous-to-authenticated migration.
  Authentication implementation
- Implement authentication use cases.
- Implement password hashing provider.
- Implement email verification.
- Implement password reset.
- Implement MFA workflows.
- Add security-focused tests.
  Fullstack implementation
- Implement client-side authentication screens.
- Implement server-side authentication integration.
- Implement shared contracts.
- Implement Next.js integration.
- Implement TanStack Start integration.
- Verify that client bundles cannot import server-only code.
  Any future architectural change must be reflected in the relevant ADR and reviewed against the acceptance criteria.

F0.1 status: Completed at the architectural decision level.

This status does not imply that package implementations, exports, runtime tests, adapter conformance tests or security tests have already been completed. Those belong to subsequent implementation features.
