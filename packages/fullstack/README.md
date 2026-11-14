# @puzzle-ui/fullstack

[Documentation: https://puzzle-ui.com/docs/fullstack](https://puzzle-ui.com/docs/fullstack)

`@puzzle-ui/fullstack` connects Puzzle Auth to browser clients, React UI, server routes, and framework adapters. Use it when an application needs a ready-to-use browser auth client or Request/Response handlers; configure auth policy, storage, and sessions with the lower-level packages.

## Install

```bash
npm install @puzzle-ui/fullstack react react-dom
```

React and React DOM 19 are required peer dependencies. `next` (15 or 16) and `@tanstack/react-start` are optional peers for their respective adapters. On the server, configure the managers from `@puzzle-ui/auth` and `@puzzle-ui/session` with your storage backend. See the [Auth docs](https://puzzle-ui.com/docs/auth), [Storage docs](https://puzzle-ui.com/docs/storage), and [developer authentication guide](https://puzzle-ui.com/docs/developer/authentication).

## Client

Wrap the application in `AuthProvider`, then use the hooks or exported forms below it:

```tsx
import { AuthProvider, useAuth, useUser } from "@puzzle-ui/fullstack/auth/client";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider options={{ basePath: "/api/auth" }}>{children}</AuthProvider>
);

export const Account = () => {
  const user = useUser();
  const { signOut } = useAuth();

  return user ? <button onClick={() => void signOut()}>{user.email} · Sign out</button> : null;
};
```

The client provides auth state and actions, sign-in/sign-up and MFA components, `AuthExperience` for branded registration flows, locale helpers, and passkey browser helpers. Browser state is not an authorization boundary; protect server resources independently.

## Server and framework adapters

Create one server instance from configured auth and session managers, then register its routes:

```ts
import { createAuthServer, createAuthRouteHandlers } from "@puzzle-ui/fullstack/auth/server";

export const authServer = createAuthServer({
  auth,
  mfa,
  stepUp,
  sessions,
  cookie,
  csrf,
  resolveClientIp,
});

export const authRoutes = createAuthRouteHandlers(authServer);
```

Use `@puzzle-ui/fullstack/auth/next` for Next.js `GET`/`POST` route handlers or `@puzzle-ui/fullstack/auth/tanstack` to create a TanStack Start Request dispatcher. Configure cookies, CSRF, storage and trusted proxy IP resolution in the server layer. Do not expose server managers to browser bundles.

## Entry points

- `@puzzle-ui/fullstack/auth/client` — browser client, React provider/hooks/components, auth experience, localization, and passkey helpers.
- `@puzzle-ui/fullstack/auth/server` — server handlers, route map, session and step-up helpers, lifecycle handlers, readiness checks.
- `@puzzle-ui/fullstack/auth/shared` — serializable public auth contracts (types only).
- `@puzzle-ui/fullstack/auth/next` — Next.js route-handler adapter.
- `@puzzle-ui/fullstack/auth/tanstack` — TanStack Start adapter.

There is no root package export; import a documented subpath. See the [full documentation](https://puzzle-ui.com/docs/fullstack) for API details and production guidance.
