# Basic React/Vite integration

## 1. Supported Puzzle integrations

The `@puzzle-ui/create` Basic React option generates React 19, TypeScript, and Vite. The repository Playground is also client-only React/Vite. Both can consume framework-independent UI, Pieces, Theme, Core, Hooks, and Icons packages.

## 2. Project initialization

Run the interactive Create CLI or use a validated JSON configuration with `framework: "react"`; see the [configuration reference](../../../packages/create/CONFIGURATION.md). Tailwind is optional. The generator creates `dev`, `build`, and `preview` scripts. The Playground has its own Storybook scripts; it is a demo app, not the generated production template.

## 3. Routing

The Basic React template does not establish a server router integration. Add routing only when the application requires it and follow that router's own setup; do not assume Next or TanStack route modules.

## 4. Layout architecture

The app is mounted with React's client root (`createRoot`). Compose a shared React layout in the app entry, and wrap it with Theme. Do not describe this setup as SSR or hydration.

## 5. Data fetching

Use ordinary client-side React/data APIs or an independently configured backend. No server API, data service, or database integration is included in the Basic React template.

## 6. Server/client boundaries

This is a browser application with no verified server runtime or server-only module boundary. Never ship database credentials or server managers in the client bundle. Auth UI alone does not provide a secure auth backend.

## 7. Theme integration

Wrap the application in `Theme` and use `--puzzle-*` tokens through Puzzle components. Theme tokens and UI/Pieces remain independent of Vite.

## 8. Link and image overrides

Use native anchors and image behavior unless an application adds a router or framework component. If custom components are added, configure Theme's link/image overrides at the app boundary; do not couple package components to Vite.

## 9. Authentication integration

Create can include client auth components, but a server authentication backend is not part of the Basic React template and has not been verified. Do not use client state as authorization or store server secrets in browser code.

## 10. Storage integration

There is no database option for Basic React. Storage access must be mediated by an independently deployed server/API; do not import D1 or MongoDB adapters into browser code.

## 11. SEO

React SEO/structured-data components can render in the client, but server-rendered metadata and crawler behavior are not verified for this client-only app. Use a server-capable framework or a separately verified static-generation strategy when initial HTML SEO is required.

## 12. Testing

The Create E2E suite covers the Basic React scaffold shape. The Playground provides Storybook and production build checks but no app-level test script. Use package-level unit/component/browser tests for library behavior and a real browser for app interactions.

## 13. Build and deployment

Use the generated `build` and `preview` scripts; the build runs TypeScript and Vite. Deploy the static client output to a suitable host. Do not assume server routes, Nitro, or a Node server.
