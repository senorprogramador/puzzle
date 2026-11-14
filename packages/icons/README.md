# @puzzle-ui/icons

React `Icon` component backed by Iconify. Render an icon by passing an Iconify `prefix:name` identifier, and style it with CSS, `currentColor`, or Puzzle theme tokens. Use it when you want a consistent SVG component API without importing individual icon files.

**Documentation: [puzzle-ui.com/docs/icons](https://puzzle-ui.com/docs/icons)**

## Install

```sh
npm install @puzzle-ui/icons
# or: bun add @puzzle-ui/icons
# or: pnpm add @puzzle-ui/icons
# or: yarn add @puzzle-ui/icons
```

Requires React and React DOM `^19.0.0` as peer dependencies. No theme provider is required.

## Usage

```tsx
import { Icon } from "@puzzle-ui/icons";

export const HomeIcon = () => (
  <Icon name="lucide:house" size={24} aria-hidden="true" />
);
```

`Icon` accepts a required `name`, optional pixel `size`, CSS `color`, an optional `showLoader`, and standard SVG attributes. By default, it uses `1em` sizing and inherits `currentColor`. For icon-only controls, label the control and mark the icon decorative with `aria-hidden="true"`.

## Exports and runtime

The package root exports `Icon` and `IconProps`; it does not export each icon as a separate component or expose generated collection files as subpaths. ESM, CommonJS, and TypeScript declarations are included. Iconify may load icon data over the network, so consider network availability and your Content Security Policy. Check the relevant icon collection's license before using its artwork.

## Development

```sh
# From the repository root
npm run build --workspace=@puzzle-ui/icons

# From this package directory
bun run vitest
```

`prepack` rebuilds the package before packing or publishing. See the root [publishing guide](../../README.md#publishing-packages).

## License

Package code is MIT; see [LICENSE](../../LICENSE), also included at `dist/LICENSE` in published packages. Individual icon collections may carry their own licenses; check the collection's terms before use.
