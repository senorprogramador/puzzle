# @puzzle-ui/ui

Composable React UI components for Puzzle: actions, forms, data display,
layout, navigation, overlays, typography, and utilities.

> Puzzle is under active development and is not ready for production use.
> APIs, styling, accessibility coverage, and framework compatibility may
> change. Use it for experimentation and evaluation.

## Installation

Install the UI library and its theme provider:

```sh
npm install @puzzle-ui/ui @puzzle-ui/theme
# or
bun add @puzzle-ui/ui @puzzle-ui/theme
# or
pnpm add @puzzle-ui/ui @puzzle-ui/theme
# or
yarn add @puzzle-ui/ui @puzzle-ui/theme
```

Requires React and React DOM 19 (`^19.0.0`) and a bundler that supports CSS
imports, such as Vite. Consumers do not need Bun.

## Usage

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button } from "@puzzle-ui/ui";

export const App = () => (
  <Theme>
    <main>
      <h1>Hello, Puzzle</h1>
      <Button onClick={() => window.alert("Hello!")}>
        Get started
      </Button>
    </main>
  </Theme>
);
```

`Theme` supplies the design tokens and global defaults. Component CSS is
imported automatically; no separate Puzzle stylesheet or Tailwind setup is
required. Customize colors, fonts, spacing, and other tokens through
[`@puzzle-ui/theme`](../theme/README.md).

## Components and imports

Use named imports from `@puzzle-ui/ui`. Components include buttons, cards,
inputs, dialogs, tabs, navigation, layout primitives, and typography.
Internal component paths are not exported package entry points.

Browse the repository's
[component documentation](../../apps/site/content/docs/components/ui) for
examples, props, and accessibility guidance. Interactive components need a
client boundary in React Server Component applications.

The package ships ESM and CommonJS builds with matching TypeScript
declarations. Its CSS requires a CSS-aware bundler rather than bare Node.js.
Test your chosen components in your framework; compatibility is still being
evaluated.

## Development

From an installed repository checkout:

```sh
npm run build --workspace=@puzzle-ui/ui
```

`prepack` rebuilds the package before packing or publishing. See the root
[publishing guide](../../README.md#publishing-packages).

## Tests

Three layers, selected by file name and run by Vitest projects (see `vitest.config.ts`):

| Layer     | File pattern          | Environment      | Script                   |
| --------- | --------------------- | ---------------- | ------------------------ |
| Unit      | `*.unit.test.ts`      | Node, no DOM     | `bun run test:unit`      |
| Component | `*.test.tsx` / `.ts`  | jsdom            | `bun run test:component` |
| Browser   | `*.browser.test.tsx`  | Chromium (Playwright) | `bun run test:browser` |

- **Unit**: pure logic (utilities, normalizers).
- **Component**: rendering, ARIA and interaction with Testing Library.
- **Browser**: behavior that needs real layout, computed styles, focus or pointer input.

`bun run vitest` runs unit and component; `bun run test:all` runs everything. The first browser run needs `bunx playwright install chromium`.

Run these test commands from this package directory in a repository
checkout, after installing workspace dependencies.

## License

MIT. See [LICENSE](../../LICENSE); the published license is at `dist/LICENSE`.
