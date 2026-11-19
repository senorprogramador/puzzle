# React Router integration

## 1. Supported Puzzle integrations

`@puzzle-ui/create` can scaffold React Router. Puzzle also provides `@puzzle-ui/seo/react-router` route helpers. No dedicated React Router Fullstack Auth adapter is exported; do not describe the Next or TanStack auth adapters as React Router integrations.

## 2. Project initialization

Run the interactive Create CLI or pass a validated JSON configuration with `framework: "react-router"`; see the [configuration reference](../../../packages/create/CONFIGURATION.md). The generator invokes `create-react-router`, configures the app, and can add optional Auth and Tailwind. Inspect the generated files and package versions before adding framework-specific behavior.

## 3. Routing

Use React Router's generated route configuration and route modules. The generator uses the React Router Vite plugin; the final route organization is template/version-dependent, so follow the scaffold rather than assuming Next App Router or TanStack file-route conventions.

## 4. Layout architecture

Keep shared visual composition in React components and route-specific layout in the generated router. Place Theme at the appropriate app root. Do not assume the Workspace Next or TanStack root-route structure exists in this scaffold.

## 5. Data fetching

Use the loader/action APIs provided by the installed React Router framework mode when the generated app supports them. The generator configuration alone is not evidence for a particular data API; verify it in the generated route and installed version.

## 6. Server/client boundaries

The generator configures React Router's Vite plugin and SSR package handling, with optional Cloudflare support. The scaffold's final SSR/hydration behavior is not verified here. Keep browser-only code in client-safe modules and storage/secrets in server-only routes; do not import Next Server Actions or TanStack server functions.

## 7. Theme integration

`@puzzle-ui/theme` and its token system are framework-independent. Supply router-specific link/image components through Theme's `components` configuration. No Puzzle React Router-specific Theme override has been verified; inspect the component prop contract rather than assuming `href` and `to` are interchangeable.

## 8. Link and image overrides

Map React Router's link component at the application boundary when needed. Use the Theme configuration to adapt its destination prop; verify active-link, ref, and accessibility behavior. Do not add router imports to shared UI or Pieces.

## 9. Authentication integration

Create offers Auth scaffolding, but there is no dedicated Fullstack React Router adapter. `@puzzle-ui/fullstack/auth/server` exposes framework-neutral Request/Response handlers; route registration and cookie/CSRF behavior must be implemented using the generated router's supported APIs. Test the generated flow rather than copying Next/TanStack route handlers.

## 10. Storage integration

Storage adapters are framework-neutral server dependencies. Create offers MongoDB, D1, or custom storage for full-stack framework scaffolds; deployment/runtime compatibility depends on the selected adapter and generated configuration. Basic React/Vite does not provide a database.

## 11. SEO

`@puzzle-ui/seo/react-router` exports React Router sitemap/robots route helpers. Use React Router's own route metadata mechanism for page metadata, and verify how the selected SSR mode renders it.

## 12. Testing

The Create E2E matrix covers generated React Router project shapes. Run `bun run test:e2e` in `packages/create/` with its documented Docker, Chromium, and network requirements. Generated scaffold SSR/hydration behavior is not verified by claiming the generator ran; validate it in the target deployment.

## 13. Build and deployment

Create configures Vite with React Router and optional Cloudflare support. Build and deploy using the generated app's scripts and selected runtime; do not copy Next standalone or TanStack Nitro deployment assumptions.
