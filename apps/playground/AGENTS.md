# Playground – AI development instructions

## Purpose and architecture

This is a client-side Vite/React application for quickly exploring Puzzle packages. Its bootstrap is [`src/main.tsx`](./src/main.tsx); it uses `ReactDOM.createRoot` and does not provide SSR or hydration. The current app entry is a demo, not a production application.

## Demos and Storybook

Use the configured Storybook for isolated component examples and the Vite app for interactive combinations. Follow the nearest existing story and use public Puzzle package exports. Wrap examples in `Theme` when testing theme-dependent components; exercise light/dark and scoped themes when relevant.

Keep demonstrations disposable and representative. A playground example is not a package implementation or public API. If behavior belongs in a reusable component, implement it in the owning package and test it there. Do not add a package dependency or change package boundaries merely to make a demo convenient.

## Accessibility and browser behavior

Use semantic elements and accessible names in stories and demos. Check keyboard operation, visible focus, contrast across theme modes, responsive behavior, and reduced motion where applicable. Storybook, Vitest, and Playwright-related tooling is present, but this app has no app-level test script; do not claim automated accessibility coverage unless an existing check is configured and run.

## Validation

Run commands from `apps/playground/`:

- `bun run typecheck`
- `bun run build`
- `bun run dev`
- `bun run preview`
- `bun run storybook`
- `bun run build-storybook`

`build` runs TypeScript checking before Vite production bundling. Use Storybook and a browser for visual and interaction checks; package-level tests remain authoritative for package behavior.

## Context-efficient workflow

Read [`package.json`](./package.json), `src/main.tsx`, the relevant demo/story, and its closest sibling. Inspect Storybook or Vite configuration only when changing those tools; keep package source and API changes in the owning `packages/*` workspace.
