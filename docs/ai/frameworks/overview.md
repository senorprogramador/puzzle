# Framework integration overview

Puzzle's React packages are designed to compose across application frameworks. Keep component and domain behavior framework-independent, then adapt routing, request handling, metadata, rendering, and deployment at the application boundary.

## Choose an architecture

- **Next.js App Router**: use for the verified Workspace Next application and its server/client component tree. Use the Next-specific UI rendering, Fullstack Auth, and SEO subpaths only from their matching server/client locations.
- **TanStack Start**: use for the verified Workspace TanStack app and the documentation site. Use the TanStack-specific integrations, file-based routes, and Nitro deployment setup.
- **React Router**: Create supports a React Router scaffold. There is a dedicated SEO route adapter, but no Fullstack Auth React Router subpath; inspect the generated routes before assuming route wiring, SSR, or hydration behavior.
- **Basic React/Vite**: use for client-only applications and prototypes. Do not assume a server runtime, SSR, routing, API, or persistent storage is included.

See the [compatibility matrix](./compatibility.md) and the focused guides for [Next.js](./nextjs.md), [TanStack Start](./tanstack-start.md), [React Router](./react-router.md), and [Basic React/Vite](./react-vite.md).

For new projects, `@puzzle-ui/create` supports both interactive prompts and a validated JSON configuration. Use the actual framework values and constraints in the [Create configuration reference](../../../packages/create/CONFIGURATION.md); do not infer support for combinations the CLI rejects.

## Keep framework-independent

- `@puzzle-ui/core`: framework-neutral utilities and rendering/resource contracts.
- `@puzzle-ui/theme`: tokens and theme behavior; applications provide framework link/image overrides.
- `@puzzle-ui/ui` and `@puzzle-ui/pieces`: React presentation. They do not own routing, persistence, or application business logic.
- Shared models, validation, and Storage contracts where applicable: keep them free of framework and database-driver coupling.

## Put framework behavior at the boundary

Routing, server handlers/functions, Request/Response translation, framework-specific metadata, and server/client rendering boundaries belong in app route modules or explicit framework adapter subpaths. Do not introduce framework imports into shared packages merely because one application needs an integration.

Theme can accept framework components through its `components` configuration. Verify the framework component's prop names and the actual `ThemeLinkComponentConfig` before mapping `href`/`to`, or supplying an image component. A working override in one framework is not evidence that another integration is configured.

## Auth and storage

`@puzzle-ui/fullstack` exposes dedicated client, shared, server, Next, and TanStack subpaths. It has no React Router adapter; the generic server route-handler API can be composed by an application, but route registration must follow that framework's own API. Never import server managers into client bundles, and never rely on browser auth state for authorization.

Storage contracts are framework-neutral. The Next and TanStack Workspace sample apps currently use MongoDB; Create also scaffolds D1 and custom storage options for full-stack frameworks. A scaffold option is not a blanket guarantee for every deployment/runtime combination—consult the framework guide and generated code.

## Evidence and verification

Use the exact version and generated project in this repository as the source of truth. The [workspace apps guide](../../workspace/apps.md), [workspace architecture](../../workspace/architecture.md), and [Create README](../../../packages/create/README.md) describe the verified samples and generator. Where the matrix says **Not verified**, inspect the generated route/configuration and run its integration/E2E checks before documenting support.
