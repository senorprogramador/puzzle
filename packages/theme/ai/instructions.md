# @puzzle-ui/theme

Use Theme for Puzzle's typed design tokens, CSS variables, provider,
typography, color schemes, component overrides, and scoped theming. Theme owns
the token system consumed by UI and Pieces.

Install with `npm install @puzzle-ui/theme`. Public entry points are the root,
`/components-context`, `/scope-context`, and `/nitro`. Use the root API for
theme configuration and token types; use context or Nitro subpaths only for
their documented runtime.

```ts
import type { ThemeProps, ThemeScope } from "@puzzle-ui/theme";
```

Use semantic tokens and typed overrides instead of hard-coded colors, spacing,
or a parallel theme system. Preserve light/dark/system behavior and keep
server-rendered output deterministic.

Do not import private token source files or access browser-only scope targets
during server rendering. See the [Theme documentation](https://puzzle-ui.com/docs/theme).
