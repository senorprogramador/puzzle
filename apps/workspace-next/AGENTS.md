<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Workspace application boundaries and validation

This app uses the Next.js App Router under `src/app/`. The root layout defines static metadata; `src/app/providers.tsx` is the client boundary for Theme and Workspace auth. Keep route/layout modules server-rendered unless browser hooks or state require `"use client"`.

Server auth/session/storage configuration belongs in `src/lib/auth/services.ts`; Workspace request behavior belongs in `src/lib/workspace/api.ts` and the shared `@puzzle-ui/workspace/server` handler. The app currently uses MongoDB. Do not import these server modules, database clients, or secrets into client components, and do not treat browser auth state as authorization.

The catch-all auth route uses `createNextAuthHandler` from `@puzzle-ui/fullstack/auth/next`. No general Server Action pattern was established; preserve the existing route-handler approach unless a verified use case requires otherwise. Use Next metadata at the app boundary and route-level loading/error UI for pending or failed navigation/data.

Run `bun run typecheck`, `bun run lint`, `bun run test:rendering`, and `bun run build` from this app. `bun run dev` initializes and seeds the local MongoDB environment; never apply local reset/seed behavior to production. See [`docs/workspace/deployment.md`](../../docs/workspace/deployment.md) for deployment and environment requirements, and the [Next.js framework guide](../../docs/ai/frameworks/nextjs.md) for cross-package integrations and client/server rules. Preserve the existing instruction to verify Next-specific APIs against the installed Next.js documentation.
