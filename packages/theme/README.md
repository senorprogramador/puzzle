# @puzzle-ui/theme

Puzzle's theme system: semantic design tokens, light/dark color schemes,
typography, Google Fonts, and configurable link and image components.

> Puzzle is under active development. APIs and framework compatibility may
> change; use it for experimentation and evaluation rather than production.

## Installation

```sh
npm install @puzzle-ui/theme
# or
bun add @puzzle-ui/theme
# or
pnpm add @puzzle-ui/theme
# or
yarn add @puzzle-ui/theme
```

Requires React and React DOM 19 (`^19.0.0`) and a CSS-aware application
bundler. Styles are imported by the package; no separate stylesheet or
Tailwind setup is required.

## Usage

```tsx
import { Theme } from "@puzzle-ui/theme";

export const App = () => (
  <Theme
    theme="system"
    tokens={{ radius: { md: "0.5rem" } }}
  >
    <main>Your application</main>
  </Theme>
);
```

Use one root theme for your application. By default it follows the system
color scheme, emits `--puzzle-*` CSS custom properties, and applies global
styles. Set `globalStyles={false}` to opt out of the global defaults.

## Configuration

| Prop | Purpose |
| --- | --- |
| `theme` | `"light"`, `"dark"`, or `"system"`; defaults to `"system"`. |
| `scope` | `"root"` for document-wide styling or `"local"` for a subtree. |
| `tokens` | Deep-partial overrides of color, typography, spacing, radius, layout, motion, and other design tokens. |
| `colorTheme` | Select a built-in palette, such as `"cobalt-sky"`. |
| `fonts` | Configure Google Fonts for heading, body, and accent roles. |
| `components` | Override link and image rendering. |
| `nonce` | CSP nonce for injected style elements. |

Local themes do not apply global styles. Fonts configured through `fonts`
load external Google Fonts stylesheets; omit this prop to avoid those
requests.

## Use tokens in your styles

```css
.panel {
  color: var(--puzzle-color-text);
  background: var(--puzzle-color-surface);
  padding: var(--puzzle-space-4);
  border-radius: var(--puzzle-radius-md);
}
```

## Router integration

For routers whose links use `to`, configure the destination prop:

```tsx
import { Link } from "@tanstack/react-router";

<Theme components={{ link: { component: Link, hrefProp: "to" } }}>
  <AppContent />
</Theme>;
```

Components using `href` can be passed directly. Use `link: null` or
`image: null` to restore native elements in a subtree.

## Exports

The root exports `Theme`, `GoogleFont`, `createGoogleFontUrl`, `BREAKPOINTS`,
and their configuration types. Context helpers are available through
`@puzzle-ui/theme/components-context` and `@puzzle-ui/theme/scope-context`.

ESM and CommonJS builds with matching TypeScript declarations are included.
CSS imports require a bundler rather than a bare Node.js runtime.

See the repository's [theme documentation](../../apps/site/content/docs/theme)
for token references, fonts, colors, and component overrides.

## Development

```sh
# From the repository root
npm run build --workspace=@puzzle-ui/theme

# From this package directory
bun run vitest
```

`prepack` rebuilds the package before packing or publishing. See the root
[publishing guide](../../README.md#publishing-packages).

## License

MIT. See [LICENSE](../../LICENSE); the published license is at `dist/LICENSE`.
