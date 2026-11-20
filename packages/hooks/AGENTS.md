# @puzzle-ui/hooks – AI development instructions

## 1. Responsibility

Reusable React hooks for interaction, state, preferences, visibility, and resource prefetching. Hooks provide behavior, not styled components or application-specific routing and data policy.

## 2. Public API

All supported hooks and public types are re-exported from [`src/index.ts`](./src/index.ts) and `@puzzle-ui/hooks`. There are no documented package subpaths. Verify a hook is exported before using it; source-only hooks are not automatically public.

## 3. Architecture

Sources are grouped under `interactions/`, `state/`, `preferences/`, and `rendering/`. Rendering hooks integrate with Core's framework-neutral contracts and a shared `FoldProvider` visibility/resource registry. Keep package-root exports centralized.

## 4. Dependencies

`@puzzle-ui/core` is the only Puzzle runtime dependency; React 19 is a peer dependency. Do not add UI, router, framework, or data-fetching dependencies.

## 5. Implementation conventions

Follow React hook rules and keep hooks composable and unstyled. Access browser APIs only in safe lifecycle paths and provide conservative server snapshots where needed; inspect existing `"use client"` boundaries before changing a module. Preserve keyboard, focus, reduced-motion, and visibility semantics. Surface async errors to callers rather than hiding them.

## 6. Testing

Tests live next to implementations under `src/` and use Vitest. Cover hook state transitions, cleanup, keyboard behavior, and SSR-safe snapshots; use a browser test only when actual browser behavior is required.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run build`

## 8. Documentation

See [`README.md`](./README.md) and the [Hooks documentation](../../apps/site/content/docs/hooks/index.mdx). Update documented signatures, SSR notes, or accessibility guidance when public behavior changes.

## 9. Common mistakes

- Do not import a hook directly from an internal source path as a substitute for checking its public export.
- Do not create another visibility observer or resource scheduler; use the shared provider and Core contracts.
- Do not assume every hook is safe to call from a server component; follow the module's client and SSR behavior.

## 10. Context-efficient workflow

Start with the export block in [`src/index.ts`](./src/index.ts), then inspect the hook's domain folder and its nearest tests. Read the provider or Core contract only when changing rendering behavior.
