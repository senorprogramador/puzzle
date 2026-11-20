# Next.js integration

## 1. Supported Puzzle integrations

The Workspace sample uses the Next.js App Router. Available framework entry points include `@puzzle-ui/ui/next/client`, `/next/server`, `@puzzle-ui/fullstack/auth/next`, and `@puzzle-ui/seo/next`. These are explicit adapters, not imports for generic components.

## 2. Project initialization

Use the interactive `@puzzle-ui/create` CLI or its validated JSON configuration with `framework: "next"`; see the [configuration reference](../../../packages/create/CONFIGURATION.md). Auth is optional. The generator can configure MongoDB, D1, or custom storage. Inspect generated files before changing them; the Workspace sample uses MongoDB.

## 3. Routing

The sample uses the App Router under [`apps/workspace-next/src/app/`](../../../apps/workspace-next/src/app/). Route handlers own framework Request/Response adaptation. Keep shared API and business rules in `@puzzle-ui/workspace/server`, not in duplicated route modules.

## 4. Layout architecture

[`layout.tsx`](../../../apps/workspace-next/src/app/layout.tsx) defines root metadata and document layout. [`providers.tsx`](../../../apps/workspace-next/src/app/providers.tsx) is a client boundary for Theme and Workspace auth providers. Keep layouts server-rendered unless a React hook or browser API requires a client provider.

## 5. Data fetching

Use Server Components and server-side modules for protected data and request-specific work. The sample's MongoDB, session, and auth setup lives in [`src/lib/auth/services.ts`](../../../apps/workspace-next/src/lib/auth/services.ts); the shared Workspace API adapter lives in [`src/lib/workspace/api.ts`](../../../apps/workspace-next/src/lib/workspace/api.ts). Do not move database access into client components.

## 6. Server/client boundaries

Server modules may use Auth, Session, Storage, MongoDB, and secrets. Client components may import only client-safe UI, Theme, and Fullstack client APIs. Do not import `@puzzle-ui/fullstack/auth/server`, `@puzzle-ui/workspace/server`, database modules, or environment secrets from a client component. Avoid `"use client"` on route trees and layouts unless required.

No Server Action usage was established as a general app pattern. Do not introduce Server Actions in place of existing route handlers without checking the installed Next.js documentation and a matching use case.

## 7. Theme integration

The provider configures local fonts and the system color scheme. It maps Next's `Link` and `Image` through Theme's component overrides; see [`providers.tsx`](../../../apps/workspace-next/src/app/providers.tsx). Keep framework imports inside the provider boundary and preserve scoped theme behavior.

## 8. Link and image overrides

Use the existing Theme overrides rather than hard-coding Next imports into shared UI/Pieces. If changing their mapping, inspect the component prop contract and verify both navigation semantics and image behavior in the browser.

## 9. Authentication integration

The catch-all auth route uses `createNextAuthHandler` from `@puzzle-ui/fullstack/auth/next` ([route source](../../../apps/workspace-next/src/app/api/auth/%5B...auth%5D/route.ts)). Keep cookie, CSRF, trusted client IP, and server initialization in server code. Browser auth state is not an authorization boundary.

## 10. Storage integration

The current Workspace app uses `MongoStorageAdapter`, Puzzle Session, and Puzzle Auth. The MongoDB driver and adapter belong in server-only modules. Follow the shared [Workspace app guide](../../workspace/apps.md) and [deployment guide](../../workspace/deployment.md) for database setup and environment values.

## 11. SEO

Use Next metadata at the app boundary and `@puzzle-ui/seo/next` for its verified sitemap/robots route helpers. React SEO components are available, but do not assume every package adapter is wired into the Workspace app.

## 12. Testing

Run `bun run typecheck`, `bun run lint`, `bun run test:rendering`, and `bun run build` from `apps/workspace-next/`. Use rendering tests for SSR/hydration behavior and browser validation for keyboard, layout, or client-provider changes.

## 13. Build and deployment

The app uses standalone Next output and transpiles the Puzzle packages in `next.config.ts`. `bun run dev` performs local MongoDB setup and seeding; `bun run start` serves a production build. Use the [Workspace deployment guide](../../workspace/deployment.md); do not apply local reset/seed behavior to production.
