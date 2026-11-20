# @puzzle-ui/core – AI development instructions

## 1. Responsibility

Framework-independent, dependency-free utilities and contracts shared across Puzzle. Core does not own React components, browser integrations, routing, or application policy.

## 2. Public API

- `@puzzle-ui/core`: shared helpers including `cn`, casing, color, responsive-value, and timing utilities.
- `@puzzle-ui/core/rendering`: framework-neutral rendering and optimization contracts and policy helpers.
- `@puzzle-ui/core/resources`: framework-neutral resource scheduling contracts and implementation.

The package exports only these manifest paths. Inspect the matching entry point before importing or extending an API.

## 3. Architecture

Source is grouped by concern under `src/`; root exports are centralized in [`src/index.ts`](./src/index.ts), with dedicated rendering and resources entry points. Keep rendering policy and scheduler contracts independent from the React hook and UI adapters that consume them.

## 4. Dependencies

There are no runtime dependencies. Do not add React, browser globals, a router, or a framework to this package; consumers supply loaders and environment-specific behavior.

## 5. Implementation conventions

Keep helpers small, deterministic, typed, and safe in Node, Bun, browser, and edge runtimes. Reuse shared responsive constants and utilities instead of adding competing implementations. Preserve conservative SSR defaults and immutable per-call configuration; do not add mutable process-global state.

## 6. Testing

Tests live alongside source under `src/`. Cover pure helper behavior, invalid inputs, and rendering/resource policy boundaries without requiring a browser unless the behavior actually needs one.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run build`

`vitest` is configured to pass when no matching tests exist.

## 8. Documentation

See [`README.md`](./README.md), the [architecture overview](../../docs/ai/architecture/overview.md), and the [getting-started documentation](../../apps/site/content/docs/getting-started.mdx). Update API documentation when changing a public helper or contract.

## 9. Common mistakes

- Do not infer a public API from a source file; check the root or subpath entry point.
- Do not move browser geometry or visibility observation into Core; those belong in the React Hooks layer.
- Do not make policy decisions that require router, component, or application context.

## 10. Context-efficient workflow

Read the relevant export in [`src/index.ts`](./src/index.ts), `src/rendering/index.ts`, or `src/resources/index.ts`, then inspect only its implementation and nearby tests. Check the package manifest before changing exports or validation commands.
