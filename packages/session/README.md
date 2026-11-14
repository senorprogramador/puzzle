# @puzzle-ui/session

Secure, database-independent session management for Puzzle Auth.

**Documentation:** [https://puzzle-ui.com/docs/auth](https://puzzle-ui.com/docs/auth)

`@puzzle-ui/session` issues, validates, rotates, and revokes server-side
sessions on top of any [`@puzzle-ui/storage`](https://puzzle-ui.com/docs/storage)
adapter. [`@puzzle-ui/auth`](https://puzzle-ui.com/docs/auth) and
[`@puzzle-ui/fullstack`](https://puzzle-ui.com/docs/fullstack) use it for
their session handling; use it directly when you need sessions without the
full authentication stack, such as anonymous carts or custom sign-in flows.

## Features

- Cryptographically secure opaque session tokens.
- SHA-256 token hashing.
- Anonymous and authenticated sessions.
- Idle and absolute expiration.
- Session rotation and revocation.
- Session listing and device metadata.
- Maximum active session policy.
- Namespaced session data with TTL.
- Allowlisted anonymous session migration.
- Secure cookie serialization.
- Origin validation and CSRF protection.

## Requirements

The storage adapter must support:

- Unique constraints.
- Conditional writes.
- Atomic batches.

Session management fails closed when these capabilities are unavailable.

## Installation

```sh
npm install @puzzle-ui/session
# or
bun add @puzzle-ui/session
# or
pnpm add @puzzle-ui/session
# or
yarn add @puzzle-ui/session
```

## Initialization

```ts
import {
  StorageSessionManager,
  initializeSessionStorage,
} from "@puzzle-ui/session";

const sessions = new StorageSessionManager(storage, {
  lifetime: {
    idleTimeoutSeconds: 60 * 60 * 24 * 7,
    absoluteLifetimeSeconds: 60 * 60 * 24 * 30,
  },
  maximumSessionsPerUser: 10,
});

await initializeSessionStorage(storage);
await sessions.initialize();
```

## Create an anonymous session

```ts
const result = await sessions.create({
  kind: "anonymous",
  userId: null,
});

console.log(result.session.id);
console.log(result.token);
```

The token must only be delivered through a secure HttpOnly cookie.

## Create an authenticated session

```ts
const result = await sessions.create({
  kind: "authenticated",
  userId: user.id,
  metadata: {
    userAgent: request.headers.get("user-agent"),
  },
});
```

## Validate a session

```ts
const session = await sessions.validate(token);

if (!session) {
  // Unauthenticated request.
}
```

## Rotate a session

```ts
const rotated = await sessions.rotate({
  sessionId: session.id,
});
```

The old session is revoked as part of the atomic rotation.

## Revoke sessions

```ts
await sessions.revoke(session.id);
await sessions.revokeAll(user.id);
```

## List devices

```ts
const devices = await sessions.list(user.id, session.id);
```

## Session data

```ts
const data = new SessionDataManager(storage, {
  allowedNamespaces: ["cart", "checkout"],
});

await data.initialize();

await data.set(
  session.id,
  "cart",
  "items",
  [{ productId: "product-1", quantity: 2 }],
  60 * 60,
);

const cart = await data.get(session.id, "cart", "items");
```

## Security

- Raw tokens are never persisted.
- Session validation always checks durable storage.
- Session expiration is enforced server-side.
- Anonymous sessions cannot be converted by changing their user ID.
- Migration creates a new identity-bound session.
- Session data namespaces must be explicitly allowlisted.
- Cookie configuration does not expose session tokens to JavaScript.
- Security-critical operations require atomic storage support.
  In-memory storage is intended exclusively for development and tests.
