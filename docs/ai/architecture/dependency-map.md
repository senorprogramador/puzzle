# Workspace dependency map

This map records direct dependency relationships among workspaces. The root [`package.json`](../../../package.json) supplies workspace patterns; each matched manifest supplies its actual package name and dependency sections. Arrows in the overview diagram and rows below are consumer → direct dependency, not transitive edges.

## Runtime dependencies on other workspaces

| Consumer directory (`package.json` name) | Direct runtime workspace dependencies |
| --- | --- |
| `apps/playground` (`@puzzle-ui/playground`) | `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, `@puzzle-ui/pieces`, `@puzzle-ui/theme`, `@puzzle-ui/ui` |
| `apps/site` (`@puzzle-ui/site`) | `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, `@puzzle-ui/pieces`, `@puzzle-ui/seo`, `@puzzle-ui/theme`, `@puzzle-ui/ui` |
| `apps/workspace-next` (`workspace-next`) | `@puzzle-ui/auth`, `@puzzle-ui/fullstack`, `@puzzle-ui/pieces`, `@puzzle-ui/session`, `@puzzle-ui/storage`, `@puzzle-ui/storage-mongodb`, `@puzzle-ui/theme`, `@puzzle-ui/ui`, `@puzzle-ui/workspace`, `@puzzle-ui/workspace-ui` |
| `apps/workspace-tanstack` (`workspace-tanstack`) | `@puzzle-ui/auth`, `@puzzle-ui/fullstack`, `@puzzle-ui/pieces`, `@puzzle-ui/session`, `@puzzle-ui/storage`, `@puzzle-ui/storage-mongodb`, `@puzzle-ui/theme`, `@puzzle-ui/ui`, `@puzzle-ui/workspace`, `@puzzle-ui/workspace-ui` |
| `packages/auth` (`@puzzle-ui/auth`) | `@puzzle-ui/session`, `@puzzle-ui/storage` |
| `packages/core` (`@puzzle-ui/core`) | None |
| `packages/create` (`@puzzle-ui/create`) | None |
| `packages/fullstack` (`@puzzle-ui/fullstack`) | `@puzzle-ui/auth`, `@puzzle-ui/session`, `@puzzle-ui/ui` |
| `packages/hooks` (`@puzzle-ui/hooks`) | `@puzzle-ui/core` |
| `packages/icons` (`@puzzle-ui/icons`) | `@puzzle-ui/core` |
| `packages/pieces` (`@puzzle-ui/pieces`) | `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, `@puzzle-ui/theme`, `@puzzle-ui/ui` |
| `packages/seo` (`@puzzle-ui/seo`) | None |
| `packages/session` (`@puzzle-ui/session`) | `@puzzle-ui/storage` |
| `packages/storage` (`@puzzle-ui/storage`) | None |
| `packages/storage-d1` (`@puzzle-ui/storage-d1`) | `@puzzle-ui/storage` |
| `packages/storage-mongodb` (`@puzzle-ui/storage-mongodb`) | `@puzzle-ui/storage` |
| `packages/theme` (`@puzzle-ui/theme`) | `@puzzle-ui/core` |
| `packages/ui` (`@puzzle-ui/ui`) | `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, `@puzzle-ui/theme` |
| `packages/workspace` (`@puzzle-ui/workspace`) | `@puzzle-ui/session`, `@puzzle-ui/storage` |
| `packages/workspace-ui` (`@puzzle-ui/workspace-ui`) | `@puzzle-ui/fullstack`, `@puzzle-ui/pieces`, `@puzzle-ui/ui`, `@puzzle-ui/workspace` |

These edges are resolved by matching dependency names against the current workspace manifests. Published libraries may use semver ranges where private apps use `workspace:*`; the graph reports package identity and dependency type, not the range.

## Development-only workspace dependencies

`packages/workspace` (`@puzzle-ui/workspace`) declares `@puzzle-ui/auth` and `@puzzle-ui/storage-mongodb` in `devDependencies`; these are not runtime imports of the Workspace domain package. No other workspace manifest currently declares a dependency on another workspace only in `devDependencies`.

External development tools—such as TypeScript, `tsdown`, Vite, Vitest, Storybook, and Playwright—are not architectural package edges. Their exact package and version declarations remain in the corresponding manifests.

## Peer and optional framework dependencies

Peer dependencies are supplied by consumers rather than bundled as package runtime dependencies.

| Package | Peer dependency contract |
| --- | --- |
| `apps/site` (`@puzzle-ui/site`) | `typescript` 7.x (private docs app peer). |
| `@puzzle-ui/hooks` | Required `react` 19. |
| `@puzzle-ui/icons` | Required `react` and `react-dom` 19. |
| `@puzzle-ui/pieces` | Required `react` and `react-dom` 19. |
| `@puzzle-ui/theme` | Required `react` and `react-dom` 19. |
| `@puzzle-ui/ui` | Required `react` and `react-dom` 19. |
| `@puzzle-ui/workspace-ui` | Required `react` and `react-dom` 19. |
| `@puzzle-ui/fullstack` | Required `react` and `react-dom` 19; optional peers `next` (15.x or 16.x) and `@tanstack/react-start` 1.x; the manifest marks these framework peers optional. |
| `@puzzle-ui/seo` | `react` 19 is an optional peer. |

No workspace manifest currently declares entries in `optionalDependencies`. Fullstack's framework support is expressed as optional peer dependencies, not runtime dependencies. `@puzzle-ui/seo` exposes `next`, `tanstack`, and `react-router` subpaths, but its manifest does not declare optional peers for those frameworks.

## Other runtime dependencies

Workspace-to-workspace edges do not include third-party package relationships. The package map lists the main external runtime dependencies and integrations, including React/Fumadocs/TanStack in the site, Next.js or TanStack Start and MongoDB in the Workspace apps, SimpleWebAuthn in Auth/Fullstack, Iconify in Icons, MongoDB in its adapter, and Zod in Workspace. Consult each manifest for the complete direct dependency list and supported versions.
