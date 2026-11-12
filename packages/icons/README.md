# @puzzle-ui/icons

React icon components backed by Iconify. Use named icons in your application
or alongside Puzzle UI components.

> Puzzle is under active development. APIs and framework compatibility may
> change; use it for experimentation and evaluation rather than production.

## Installation

```sh
npm install @puzzle-ui/icons
# or
bun add @puzzle-ui/icons
# or
pnpm add @puzzle-ui/icons
# or
yarn add @puzzle-ui/icons
```

Requires React and React DOM 19 (`^19.0.0`). No theme provider is required.

## Usage

```tsx
import { Icon } from "@puzzle-ui/icons";

export const HomeIcon = () => (
  <Icon name="lucide:house" size={24} aria-hidden="true" />
);
```

`Icon` accepts a collection-prefixed `name`, optional numeric `size` in
pixels, optional `color`, and SVG attributes. Without an explicit color,
it can inherit the surrounding text color.

For icon-only controls, label the control and keep its icon decorative:

```tsx
<button type="button" aria-label="Search">
  <Icon name="lucide:search" aria-hidden="true" />
</button>
```

Icon loading can make external requests to Iconify. Account for network
availability and your Content Security Policy. Framework compatibility is
still being evaluated.

## Exports

- `Icon`, `IconProps`

Import from `@puzzle-ui/icons`; generated internal icon-set files are not
exported package entry points. ESM and CommonJS builds and TypeScript
declarations are included.

## Development

```sh
# From the repository root
npm run build --workspace=@puzzle-ui/icons

# From this package directory
bun run vitest
```

`prepack` rebuilds the package before packing or publishing. See the root
[publishing guide](../../README.md#publishing-packages).

## License

Package code is MIT; see [LICENSE](../../LICENSE), also included at
`dist/LICENSE` in published packages. Individual icon collections may carry
their own licenses; check the collection's terms before using its artwork.
