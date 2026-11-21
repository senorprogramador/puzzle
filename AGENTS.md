# Puzzle — Agent Instructions

These are the repository-wide entry instructions for AI coding agents. Use the architecture indexes for navigation, and package manifests and local instructions as the source of truth for a task.

## 1. Project identity and purpose

Puzzle is a TypeScript and React 19 ecosystem for human developers and AI-assisted application development. It provides reusable UI primitives, composable page sections, design tokens and theming, shared hooks and utilities, authentication and sessions, media asset and headless CMS domains, database-neutral storage contracts and adapters, framework integrations, SEO tooling, and application scaffolding.

## 2. Repository structure

The root `package.json` defines Bun workspaces. Expand its workspace patterns and read each matched `package.json` to discover current applications and packages; directory names and package names are not interchangeable. Use the [package map](docs/ai/architecture/package-map.md) for the current inventory, the [overview](docs/ai/architecture/overview.md) for the larger picture, and the [AI documentation index](docs/ai/README.md) to find cross-cutting references and workflows without loading them all by default.

## 3. Package architecture

Packages are independently adoptable and organized by responsibility: Core provides shared utilities; Hooks and Icons provide React capabilities; Theme owns design tokens; UI provides components; Pieces composes sections; Auth and Session provide identity services; Storage and its adapters persist records; Media owns provider-neutral asset and binary-object contracts; CMS owns content schemas and publishing services; Fullstack adapts Auth, Media, and CMS to browser clients and framework routes; SEO provides metadata and framework integrations; Create scaffolds applications. Private Workspace packages support the sample apps. See the [package map](docs/ai/architecture/package-map.md) and [dependency map](docs/ai/architecture/dependency-map.md) before changing boundaries.

## 4. Application architecture

Applications live under `apps/`: the documentation site, the client-side reference website and Storybook playground, Next.js and TanStack Start Workspace examples, and a React Router SSR/i18n example. The site uses the component packages to document them; the Workspace apps share a private domain package and UI package. They are examples and applications, not package APIs. Confirm current routes, dependencies, and local instructions in the app manifest and package map.

## 5. Dependency boundaries

- Theme is the source of design tokens; UI and Pieces consume its public tokens and components.
- Keep framework-neutral packages independent of React, routers, and database vendors unless their manifest and public API explicitly establish otherwise.
- Storage contracts are separate from database adapters. Auth and Session depend on contracts, not concrete database drivers.
- Store media metadata through `@puzzle-ui/storage`, but store file bytes through `@puzzle-ui/media` object-storage adapters. CMS media fields hold asset references, not object keys or signed URLs.
- UI may use only the browser-safe `@puzzle-ui/media/browser` helpers for local media preparation; keep Media services, object-storage references, and Fullstack server APIs out of UI/Pieces.
- Keep browser and server imports separated. Respect explicit client/server entry points; never pull server handlers, secrets, database drivers, or server-only code into client bundles.
- Use only declared public exports. Do not rely on deep source imports or infer compatibility from a package's directory structure.

## 6. Package and app instruction discovery

This root file applies everywhere. For a task, inspect `AGENTS.md` only in the target package/app directory or its relevant ancestors and subdirectories when present; follow the nearest applicable instructions. Do not read every `AGENTS.md` in the repository. The Workspace Next app has its own Next.js-specific guidance.

The `packages/i18n/AGENTS.md` file adds multilingual package development guidance; consumer-facing instructions are maintained under `packages/i18n/ai/`.

## 7. Task routing

For each task:

1. Identify the target package or application using the package map and changed file path.
2. Inspect its `package.json` for its actual name, exports, dependencies, scripts, and test commands.
3. Read its local `AGENTS.md` when one applies.
4. Identify direct dependencies and consumers relevant to the requested behavior.
5. Read other package instructions only when their implementation or public contract is affected.
6. Inspect the smallest sufficient source and test area.
7. Verify public exports before importing or documenting an API.

For cross-package changes, inspect the instructions and manifests for every package/app whose implementation or public contract changes.

## 8. General coding conventions

- Use TypeScript and follow the target package's established patterns; do not impose React conventions on framework-neutral packages.
- For React components, use functional components, arrow functions, and named exports where that matches the package.
- For component work, inspect the target and one close sibling; reuse public primitives and shared helpers such as `cn` where appropriate. Keep UI generic and router-independent, and avoid needless wrappers or abstractions.
- A new or significantly modified component is incomplete until its implementation, tests, user-facing docs, visual preview where applicable, and AI guidance are synchronized. For public `@puzzle-ui/ui` and `@puzzle-ui/pieces` components, also update and validate the registry. Follow the [mandatory component workflow](docs/ai/workflows/component-development.md).
- Keep styles scoped and follow the package's CSS conventions. Prefer existing `--puzzle-*` theme tokens over hard-coded values; avoid `!important`.
- Use semantic HTML, accessible names and relationships, keyboard support, visible focus, and responsive layouts where relevant. Respect reduced-motion preferences.
- Preserve SSR behavior and isolate browser-only behavior to client boundaries. Do not claim framework compatibility beyond package documentation and tests.
- Preserve existing behavior and backward compatibility. Keep APIs composable and dependencies minimal.
- Add focused tests for meaningful behavior changes and regressions, using the target package's existing test runner.

## 9. Cross-package development

Trace changes through direct dependencies, re-exports, and consuming apps using the dependency map and manifests. Update every affected public contract, implementation, test, and directly related documentation. Build or type-check affected consumers when package outputs or shared contracts change; do not alter unrelated packages.

## 10. Component selection principles

Prefer, in order:

1. `@puzzle-ui/pieces`
2. `@puzzle-ui/ui`
3. Existing shared project components
4. Ordinary React components and semantic HTML

This is a preference, not a rule: do not use a Piece when its composition is unnecessary, duplicate behavior already provided by UI, or create a custom component just to avoid inspecting public exports.

## 11. Website generation principles

For website-generation work, use the [website planning engine](docs/ai/website/README.md)
for the complete workflow, templates, validation checklists, and boundaries
between planning, implementation, and QA. Treat it as a planning method, not a
mandate to use every Puzzle package or build a generator application.

## 12. Testing and validation

Read the relevant manifest before choosing a command. Root checks are `bun run build`, `bun run typecheck`, `bun run test:all`, and `bun run test:reference`. Run `bun run registry:check` and `bun run api-stability:check` to verify component metadata and stability labels. `typecheck` covers packages, the site, and playground, not every application. `test:all` includes package tests, browser tests, MongoDB integration tests, and the reference-site browser suite. `test:reference` builds workspace packages and the playground before testing the production preview. `bun run test:e2e` covers generated project shapes and requires Docker and network access; run it for generator/template changes and changes to packages used by generated projects. Browser tests require Playwright Chromium; MongoDB tests require Docker Compose. Run app-specific checks with their manifest names (currently `workspace-next`, `workspace-tanstack`, and `workspace-react-router`) when those apps are affected. For documentation changes, run `bun run --filter "@puzzle-ui/site" build`; use the [testing guide](apps/site/content/docs/developer/testing.mdx) and [AI quality guides](docs/ai/quality/README.md) for test selection and requirements.

## 13. Context and token efficiency

- Never read the whole repository for a routine task.
- Prefer architecture indexes and targeted symbol searches to broad source inspection.
- Read package-specific instructions only when relevant, and only the smallest sufficient documentation section.
- Reuse context already available; do not repeat or reproduce large documentation excerpts.
- Verify assumptions against manifests, public exports, or source when needed.
- Stop investigating once the required implementation pattern is established.

## 14. Documentation maintenance

Site documentation lives in `apps/site/content/docs/`. Follow the nearby MDX structure and `title`/`description` frontmatter, verify named imports against public exports, and validate docs/navigation changes with the site build. Use `<Preview>` for runnable examples; keep stateful examples page-scoped under `apps/site/src/components/doc-examples/ui/` or `pieces/`, with only small shared helpers under `shared/`. Add pages to the matching sidebar category. Use FAQ frontmatter only for genuine page-specific questions; the site renders the FAQ UI and structured data, so do not duplicate it in MDX.

Keep the architecture indexes current when workspace membership, package exports, dependency boundaries, or application responsibilities change.

## 15. Completion requirements

Report the files and packages changed, important API or boundary decisions, exact checks run and their results, and any checks not run or known limitations. Do not claim a check passed unless it was run.
