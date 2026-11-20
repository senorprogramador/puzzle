# @puzzle-ui/icons – AI development instructions

## 1. Responsibility

Provides a consistent React SVG `Icon` component backed by Iconify. It does not own an application icon registry, icon artwork, or a general icon-design system.

## 2. Public API

The package root exports `Icon` and `IconProps` only. Pass an Iconify `prefix:name` string. Files under `src/sets/` are implementation/documentation helpers, not package subpath exports.

## 3. Architecture

[`src/icon.tsx`](./src/icon.tsx) wraps Iconify and exposes sizing, color, loader, and SVG attributes. Icon set wrappers compose this component internally; they are not separately published entry points.

## 4. Dependencies

Runtime dependencies are `@iconify/react`, `@iconify/utils`, and `@puzzle-ui/core`; React and React DOM 19 are peer dependencies. Do not add a competing SVG renderer or bundle React.

## 5. Implementation conventions

Default to `1em` and inherited `currentColor` so icons compose with text and theme styles. For icon-only controls, label the control and mark a decorative icon `aria-hidden`. Preserve the opt-in, reduced-motion-aware loader behavior. Consider network availability, CSP, and the license of each icon collection; do not add artwork without checking its terms.

## 6. Testing

Tests are under `src/` and use Vitest. Cover name/size/attribute forwarding, loading behavior, and accessibility-relevant output without snapshotting irrelevant SVG internals.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run vitest`
- `bun run build`

## 8. Documentation

See [`README.md`](./README.md) and the [Icons documentation](../../apps/site/content/docs/icons/index.mdx). Document any public prop or network/loading behavior change.

## 9. Common mistakes

- Do not assume individual icon components or set files are importable package APIs.
- Do not treat an icon's presence in a collection as a license grant.
- Do not make an icon appear as meaningful content without an accessible name or a labeled control.

## 10. Context-efficient workflow

Read [`src/icon.tsx`](./src/icon.tsx), its public export, and the nearest test. Check the package export map before changing collection or subpath behavior.
