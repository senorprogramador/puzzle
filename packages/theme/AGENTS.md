# @puzzle-ui/theme – AI development instructions

## 1. Responsibility

Owns Puzzle's typed design tokens, CSS-variable generation, theme provider, typography/fonts, color schemes, component overrides, and scoped theming. UI and Pieces consume these tokens; they must not implement a parallel theme system.

## 2. Public API

- `@puzzle-ui/theme`: `Theme`, token and font types, breakpoint exports, and Google Font helpers.
- `@puzzle-ui/theme/components-context` and `/scope-context`: focused context APIs.
- `@puzzle-ui/theme/nitro`: Nitro font caching route rules.
- `puzzle-theme`: CLI binary for downloading configured fonts.

Use only manifest-listed entry points.

## 3. Architecture

Typed token definitions and defaults feed CSS-variable generation; `Theme` applies variables, styles, fonts, and light/dark/system behavior. Global and local scopes share the token model. Nitro font route rules and the font CLI are separate environment-specific integrations.

## 4. Dependencies

`@puzzle-ui/core` is the only Puzzle runtime dependency. React and React DOM 19 are peers. Keep the token engine framework-neutral where possible; do not add framework-specific integration to the root entry point.

## 5. Implementation conventions

Treat Theme token definitions and generated CSS variables as the source of truth. Use existing semantic tokens; do not guess token names or hardcode parallel scales. Preserve typed overrides, light/dark/system and scoped behavior, configured font roles, and component overrides. Keep server rendering deterministic; local scope portal targeting has client-side behavior, so verify hydration when changing it.

## 6. Testing

Tests live under `src/` and use Vitest. Cover token-to-variable output, theme modes, nested/local scopes, font behavior, and SSR/hydration-sensitive changes. Test the CLI separately when changing its parsing or download behavior.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run build`

The package requires Node.js 20.19 or later for `puzzle-theme`.

## 8. Documentation

See [`README.md`](./README.md), the [Theme documentation](../../apps/site/content/docs/theme/index.mdx), and the [UI component documentation](../../apps/site/content/docs/ui/index.mdx). Update token, font, scope, or CLI guidance when public behavior changes.

## 9. Common mistakes

- Do not add a one-off component variable when an existing semantic token fits.
- Do not assume a particular color scheme or use palette values in place of semantic roles.
- Do not move Nitro or CLI behavior into the React provider.
- Do not access browser-only scope targets during server rendering.

## 10. Context-efficient workflow

Start with the relevant export in [`src/index.ts`](./src/index.ts), then inspect the typed token/provider implementation and matching tests. Read only the token group or font/scope path involved; use the README for CLI and integration details.
