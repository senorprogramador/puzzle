# Workspace TanStack app – AI development instructions

## Purpose and architecture

This is the TanStack Start implementation of the Workspace sample application. It shares domain, UI, auth, and storage packages with the Next.js app, but its routing, server execution, and build behavior are TanStack-specific. Do not copy Next.js conventions into this app.

## Routing and rendering

File-based routes live under [`src/routes/`](./src/routes/); the root route composes `Theme`, `WorkspaceAuthProvider`, `HeadContent`, `Outlet`, and `Scripts`. Vite configures TanStack Start, React, Nitro, SSR handling for Puzzle packages, and font route rules. Keep route modules and server-only code in the framework's established boundaries.

Use route loaders or server functions only where the installed TanStack Start version and a nearby app example establish the correct API. Do not assume Next.js Server Components, Server Actions, or route-handler signatures apply. Rendering and hydration are tested separately from unit-level domain behavior.

## Data, auth, and storage

The app's server auth setup is in [`src/lib/auth/services.ts`](./src/lib/auth/services.ts); the auth route uses the dedicated `@puzzle-ui/fullstack/auth/tanstack` integration. Workspace API routes delegate to `createWorkspaceApiHandler` from `@puzzle-ui/workspace/server`. Keep identity derived from the verified server session; browser auth state is not authorization.

The current sample uses `MongoStorageAdapter` and the shared `@puzzle-ui/session`, `@puzzle-ui/auth`, and `@puzzle-ui/workspace` contracts. Do not add database access to client modules or treat the current MongoDB setup as a new Storage contract. Follow the app's local environment example and [`docs/workspace/deployment.md`](../../docs/workspace/deployment.md) for environment and deployment values; never commit `.env` secrets.

## Theme, fonts, and UI

The root route supplies TanStack's `Link` through the Theme component override using its `to` prop. Do not assume an image override is configured here; verify the root route before relying on one. Font settings are in [`src/puzzle-fonts.json`](./src/puzzle-fonts.json); `bun run dev` and `bun run build` have separate font-download commands available.

## Database lifecycle and validation

`bun run dev` runs `db:setup` and `db:seed` before Vite. Review the setup script and deployment guide before changing local database behavior; preserve production data and secrets.

Verified commands from this app directory:

- `bun run typecheck`
- `bun run test:rendering`
- `bun run fonts:download`
- `bun run db:setup`
- `bun run db:seed`
- `bun run build`
- `bun run preview`
- `bun run start`

Use `bun run test:rendering` for SSR/hydration changes. The production build is `vite build`; `start` runs the Nitro server output. See the [Workspace app guide](../../docs/workspace/apps.md) and [deployment guide](../../docs/workspace/deployment.md).

## Context-efficient workflow

Start with the target route and its closest route sibling, then inspect the shared service it calls. For auth, storage, Workspace policy, or UI contract changes, read the corresponding package guide and change the owning package rather than duplicating behavior in a route.
