# @puzzle-ui/ui – AI development instructions

## 1. Responsibility

Provides reusable, composable, router-independent React UI primitives. It owns component interaction and presentation, not application routing, business logic, or page-level content sections.

## 2. Public API

Components and types are exported from [`src/index.ts`](./src/index.ts) through the package root. Rendering integrations are separate manifest-listed entry points: `/rendering/deferred`, `/rendering/ssr`, `/rendering/static`, `/rendering/fold`, `/next/client`, `/next/server`, `/tanstack/client`, `/tanstack/server`, and `/tanstack/shared`.

Inspect the actual component API and its root export before using it. Do not rely on an internal source path or assume a component is stable; check its documentation maturity label.

## 3. Architecture

Components are grouped under `src/components/<category>/<component>/`; a typical component keeps implementation, types, scoped CSS, and focused tests together. Rendering adapters live under `components/utilities/rendering/`. Root UI remains framework-independent; Next.js and TanStack-specific behavior belongs only in the matching integration entry points.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/core`, `@puzzle-ui/hooks`, `@puzzle-ui/icons`, and `@puzzle-ui/theme`; React and React DOM 19 are peer dependencies. Use Theme's link/image overrides for framework components rather than importing a router.

## 5. Implementation conventions

Use semantic HTML and native browser behavior first. Preserve keyboard and focus behavior, accessible relationships, disabled/loading/error states, responsive layouts, and reduced-motion preferences. Keep CSS scoped to the component and use existing `--puzzle-*` tokens. Keep UI state limited to interaction; follow each component's documented controlled/uncontrolled API rather than adding application state.

Maintain server/client isolation and SSR-safe initial output. Interactive modules should follow existing client boundaries; do not access browser APIs at module load.

## 6. Testing

Vitest has unit (Node), component (jsdom), and browser (Chromium/Playwright) projects. Put tests beside components. Use browser tests for real layout, focus, keyboard, scrolling, pointer, or streaming behavior that jsdom cannot verify.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run test:unit`
- `bun run test:component`
- `bun run test:browser`
- `bun run test:all`
- `bun run build`

`test:all` includes the streaming-rendering test.

## 8. Documentation

See [`README.md`](./README.md), the [UI documentation index](../../apps/site/content/docs/ui/index.mdx), and the [root guide](../../AGENTS.md). Follow the [mandatory component workflow](../../docs/ai/workflows/component-development.md) for new or significantly changed components; update the corresponding category page, sidebar, preview, registry, tests, and AI guidance as applicable. Use the existing doc-example pattern for reusable/stateful examples.

## 9. Common mistakes

- Do not recreate a component or interaction before checking public exports and docs.
- Do not treat Beta or Experimental APIs as Stable; maturity labels are per component.
- Do not put router or backend logic into a reusable component.
- Do not test keyboard/focus or layout behavior solely with jsdom when a browser test is needed.

## 10. Context-efficient workflow

Read the target component's implementation, CSS, types, tests, and its closest sibling. Check [`src/index.ts`](./src/index.ts) and the component's docs before changing or using its API; inspect the rendering adapter only when that boundary is affected.
