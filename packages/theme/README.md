# @puzzle-ui/theme

Design tokens, color themes, typography, fonts, and theme scoping for Puzzle.

**Documentation:** [https://puzzle-ui.com/docs/theme](https://puzzle-ui.com/docs/theme)

See the [theme documentation](https://puzzle-ui.com/docs/theme) for API
maturity and compatibility details.

`@puzzle-ui/theme` is the source of truth for Puzzle's visual design. Its
`Theme` provider turns a typed token object into CSS custom properties
(`--puzzle-*`), loads configured fonts, resolves light, dark, and system color
schemes, and can scope a theme to the whole document or a single subtree.
All [`@puzzle-ui/ui`](https://puzzle-ui.com/docs/ui) components consume these
variables, so a single provider styles your application.

## Install

```bash
npm install @puzzle-ui/theme
# or
bun add @puzzle-ui/theme
# or
pnpm add @puzzle-ui/theme
# or
yarn add @puzzle-ui/theme
```

React and React DOM 19 are peer dependencies.

## Usage

Wrap your application once at the root:

```tsx
import { Theme } from "@puzzle-ui/theme";

export const App = () => (
  <Theme>
    <YourApp />
  </Theme>
);
```

Customize the color scheme, color theme, fonts, and tokens:

```tsx
<Theme
  theme="system"
  colorTheme="cobalt-sky"
  fonts={{
    heading: { family: "Sora" },
    body: { family: "Inter" },
  }}
  tokens={{
    radius: { md: "0.5rem" },
  }}
>
  <YourApp />
</Theme>
```

## Features

| Area                 | Description                                                                                       | Docs                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Theme provider       | Injects token CSS variables, loads fonts, and applies global styles at root or local scope.       | [Theme Provider](https://puzzle-ui.com/docs/theme/theme-provider)   |
| Design tokens        | Typed token groups for spacing, radius, shadows, elevation, borders, layout, motion, and z-index. | [Design Tokens](https://puzzle-ui.com/docs/theme/tokens)            |
| Colors               | Semantic color roles, light/dark color schemes, and built-in color themes.                        | [Colors](https://puzzle-ui.com/docs/theme/colors)                   |
| Typography and fonts | Named typography roles, fluid font sizes, Google Fonts, and self-hosted fonts.                    | [Typography and Fonts](https://puzzle-ui.com/docs/theme/typography) |
| Breakpoints          | Shared responsive breakpoints for JavaScript and CSS.                                             | [Breakpoints](https://puzzle-ui.com/docs/theme/breakpoints)         |
| Component overrides  | Global link and image components for router and framework integration.                            | [Component Overrides](https://puzzle-ui.com/docs/theme/components)  |

## Self-host fonts with the theme CLI

The `@puzzle-ui/theme` package includes the `puzzle-theme` executable.
It requires Node.js 20.19 or later.

```bash
npm install @puzzle-ui/theme
npm exec -- puzzle-theme --help
```

Create `puzzle-fonts.json` in your application's working directory:

```json
{
  "body": {
    "family": "Inter",
    "weights": [400, 700]
  }
}
```

Download the fonts with either package manager:

```bash
npm exec -- puzzle-theme fonts download
# Or, with the package installed using Bun:
bun run puzzle-theme fonts download
```

The command writes WOFF2 files and `puzzle-fonts.css` to `public/fonts`.
Use `--config <path>` or `--out-dir <path>` to change these locations.
Unchanged downloads are skipped; `--force` downloads them again.

For variable fonts, use `"weightRange": [300, 700]` instead of `weights`
to request a continuous range. Only use ranges supported by the font family.
Discrete `weights` remain supported; when both are provided, the range is used.

The downloader keeps all language subsets by default. Pass
`--subsets latin,latin-ext` to retain only Latin and Latin Extended;
missing requested subsets produce an error. Other scripts will use fallback
fonts. Subset choices are included in the download cache key.

To load the generated stylesheet, set `fontSource="local"` on `Theme`
and pass the same configuration to its `fonts` prop. The default local
stylesheet URL is `/fonts/puzzle-fonts.css`.

When using local fonts, Puzzle automatically preloads the normal Latin
variant of the body font. Use `fontPreload="heading"` or
`fontPreload="accent"` to preload another configured role, or
`fontPreload={false}` to disable preloading.

The generated stylesheet and preload link use the same font URL, avoiding
duplicate downloads. Preloading only applies to local fonts and only one
font is preloaded per Theme instance.

## Related packages

- [`@puzzle-ui/ui`](https://puzzle-ui.com/docs/ui) — components styled by this theme.
- [`@puzzle-ui/core`](https://www.npmjs.com/package/@puzzle-ui/core) — shared utilities such as `cn` and responsive helpers.
