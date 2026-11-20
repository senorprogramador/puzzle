# Playground – AI development instructions

## Purpose and architecture

This is a client-side Vite/React reference website and Storybook playground for demonstrating Puzzle packages together. Its bootstrap is [`src/main.tsx`](./src/main.tsx); it uses `ReactDOM.createRoot` and does not provide SSR or hydration. The reference site is a maintained QA fixture, not a production service.

The reference content is static and illustrative. Its contact form demonstrates native validation and a local confirmation only; it does not send or persist data. Do not add authentication, a database, customer claims, or other service behavior without a real requirement.

## Demos and Storybook

Use the configured Storybook for isolated component examples and the reference site for integrated, multi-page compositions. Follow the nearest existing story and use public Puzzle package exports. Wrap examples in `Theme` when testing theme-dependent components; exercise light/dark and scoped themes when relevant.

Keep the reference site's routes, navigation, content, and browser tests synchronized. A playground example is not a package implementation or public API. If behavior belongs in a reusable component, implement it in the owning package and test it there. Add package dependencies only when the reference app actually demonstrates that package.

## Accessibility and browser behavior

Use semantic elements and accessible names in stories and pages. Check keyboard operation, visible focus, contrast across theme modes, responsive behavior, and reduced motion where applicable. The reference-site Playwright suite checks navigation, interactive controls, form labels and validation, browser diagnostics, and horizontal overflow at the documented viewport matrix. Storybook's a11y addon is configured with `test: "todo"` and reports findings in its test UI; it is not configured to fail CI.

## Validation

Run commands from `apps/playground/`:

- `bun run typecheck`
- `bun run build`
- `bun run test:e2e` (requires a production build; run `bun run build` at the repository root and `bun run build` here first)
- `bun run dev`
- `bun run preview`
- `bun run storybook`
- `bun run build-storybook`

`build` runs TypeScript checking before Vite production bundling. From the repository root, `bun run test:reference` builds packages and the app before running its browser suite. Use the visual QA guides in [`docs/ai/quality/`](../../docs/ai/quality/); package-level tests remain authoritative for package behavior.

## Context-efficient workflow

Read [`package.json`](./package.json), `src/main.tsx`, the relevant demo/story, and its closest sibling. Inspect Storybook or Vite configuration only when changing those tools; keep package source and API changes in the owning `packages/*` workspace.
