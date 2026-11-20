# Framework compatibility matrix

This matrix distinguishes verified repository integrations from capabilities that are available only through a framework's own APIs or have not been verified in generated output.

| Framework | SSR support | Routing | Theme integration | Pieces | UI | Auth integration | Storage options | SEO integration | Testing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Next.js App Router | Verified in `apps/workspace-next` | App Router | Theme provider; Next `Link` and `Image` overrides verified | Used by Workspace app | Used by Workspace app; Next rendering subpaths available | Fullstack `/auth/next`; Workspace sample uses it | MongoDB in sample; Create offers MongoDB, D1, or custom for full-stack scaffolds | `@puzzle-ui/seo/next` route helpers; app-specific wiring not verified | typecheck, lint, rendering tests, Next build |
| TanStack Start | Verified in Workspace app and site; Nitro server output | File-based TanStack routes | Theme provider; `Link` override with `hrefProp: "to"` verified; image override not verified | Used by Workspace app | Used by Workspace app; TanStack rendering subpaths available | Fullstack `/auth/tanstack`; Workspace sample uses it | MongoDB in sample; Create offers MongoDB, D1, or custom for full-stack scaffolds | `@puzzle-ui/seo/tanstack` route helpers; app-specific wiring not verified | typecheck, rendering tests, Vite build/preview and Nitro start |
| React Router | **Not verified** for final generated SSR/hydration behavior | React Router scaffold supported; generated route details depend on template/version | Theme provider supported; React Router-specific link/image mapping not verified | React-compatible package; generated app integration not verified | React-compatible package; generated app integration not verified | Create Auth scaffold supported; no dedicated Fullstack React Router adapter | Create offers MongoDB, D1, or custom for full-stack scaffold; runtime integration not verified here | `@puzzle-ui/seo/react-router` route helpers | Create E2E scaffold matrix; validate final app SSR/browser behavior separately |
| Basic React/Vite | No SSR in the verified Playground; generated scaffold server behavior not applicable/verified | No Puzzle router integration verified | Theme provider supported; no framework override needed by default | React-compatible; manual package integration | React-compatible; manual package integration | Client auth UI may be scaffolded; secure server auth integration not verified | No database in Basic React template | React SEO components exist; crawler/initial-HTML behavior not verified | Vite build/typecheck; Create E2E; Playground Storybook, no app test script |

## Interpretation

- “Used” means the current application imports the package; it does not mean every feature or deployment target is verified.
- Create's scaffold options are not equivalent to a production deployment certification for every framework/database/runtime combination.
- React Router's `@puzzle-ui/seo/react-router` adapter is distinct from the Next and TanStack adapters. Fullstack does not export a dedicated React Router Auth adapter.
- `@puzzle-ui/ui` and `@puzzle-ui/pieces` are React libraries, not routing or persistence layers.
- Storage choice is an application/server concern. Keep database adapters out of client bundles.

See the [framework overview](./overview.md) and the individual [Next.js](./nextjs.md), [TanStack Start](./tanstack-start.md), [React Router](./react-router.md), and [Basic React/Vite](./react-vite.md) guides before adding an integration.
