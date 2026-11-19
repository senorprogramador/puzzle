# TanStack Start integration

## 1. Supported Puzzle integrations

The Workspace app and documentation site use TanStack Start. Available entry points include `@puzzle-ui/ui/tanstack/client`, `/tanstack/server`, `/tanstack/shared`, `@puzzle-ui/fullstack/auth/tanstack`, and `@puzzle-ui/seo/tanstack`.

## 2. Project initialization

Use the interactive `@puzzle-ui/create` CLI or its validated JSON configuration with `framework: "tanstack"`; see the [configuration reference](../../../packages/create/CONFIGURATION.md). It configures a Vite/Start application and can add Tailwind and optional Auth/storage. The current Workspace sample uses MongoDB; inspect generated configuration for the selected runtime and adapter.

## 3. Routing

File-based routes live in `src/routes/`; the root route owns providers and document composition. Keep route-specific Request/Response adaptation in routes and shared Workspace behavior in `@puzzle-ui/workspace/server`.

## 4. Layout architecture

The Workspace root route composes Theme, `WorkspaceAuthProvider`, `HeadContent`, `Outlet`, and `Scripts`. See [`apps/workspace-tanstack/src/routes/__root.tsx`](../../../apps/workspace-tanstack/src/routes/__root.tsx). Keep server and client provider responsibilities distinct.

## 5. Data fetching

Use the installed TanStack Start/Router APIs and existing route patterns for data loading. The Workspace API is delegated to [`src/lib/workspace/api.ts`](../../../apps/workspace-tanstack/src/lib/workspace/api.ts), and auth setup to [`src/lib/auth/services.ts`](../../../apps/workspace-tanstack/src/lib/auth/services.ts). Do not copy Next.js Server Component or Server Action patterns.

## 6. Server/client boundaries

Vite configures TanStack Start, Nitro, and SSR handling for Puzzle packages. Keep database, secrets, session managers, and server handlers out of browser imports. Use explicit client/server/shared package subpaths; do not assume a server function is safe to import from client code.

## 7. Theme integration

Theme is applied at the root route. The app maps TanStack's `Link` using Theme's link override and `hrefProp: "to"`. Do not assume an image override exists; verify the root route and component contract before relying on one.

## 8. Link and image overrides

Keep the `to`-prop mapping in the application provider, not in UI or Pieces. If adding an image override, verify the TanStack app's actual image component, props, and SSR behavior first.

## 9. Authentication integration

Use `createTanStackAuthHandler` from `@puzzle-ui/fullstack/auth/tanstack` in the auth route ([source](../../../apps/workspace-tanstack/src/routes/api/auth/$.ts)). The server config owns cookie/CSRF policy and session validation. Client auth context is for UI, not authorization.

## 10. Storage integration

The current Workspace app uses MongoDB through `MongoStorageAdapter`; Workspace services depend on the database-neutral `StorageAdapter`. Keep adapter setup server-side. See the [Workspace architecture](../../workspace/architecture.md) and [deployment guide](../../workspace/deployment.md).

## 11. SEO

`@puzzle-ui/seo/tanstack` provides route helpers for sitemap and robots responses. Use the app's head integration for route metadata and verify generated metadata in the rendered document; do not assume Next metadata exports.

## 12. Testing

Run `bun run typecheck`, `bun run test:rendering`, and `bun run build` from `apps/workspace-tanstack/`. `bun run preview` and `bun run start` validate the built client and Nitro server. Use rendering tests for SSR/hydration changes.

## 13. Build and deployment

Vite builds the app and Nitro produces `.output/server/index.mjs`; `start` runs that output. `dev` performs local DB setup and seeding first. Follow [`docs/workspace/deployment.md`](../../workspace/deployment.md) and preserve runtime-specific Vite/Nitro configuration.
