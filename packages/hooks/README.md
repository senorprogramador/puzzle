# @puzzle-ui/hooks

React hooks for keyboard events and roving focus, shared by Puzzle UI
components and available for custom interfaces.

> Puzzle is under active development. APIs may change without notice; use it
> for experimentation and evaluation rather than production applications.

## Installation

```sh
npm install @puzzle-ui/hooks
# or
bun add @puzzle-ui/hooks
# or
pnpm add @puzzle-ui/hooks
# or
yarn add @puzzle-ui/hooks
```

Requires React 19 (`^19.0.0`). No theme provider or stylesheet is required.

## Keyboard events

`useKeyboardKeys` subscribes to window keyboard events and cleans up its
listeners when disabled or unmounted.

```tsx
"use client";

import { useKeyboardKeys } from "@puzzle-ui/hooks";

export const EscapeHint = () => {
  useKeyboardKeys({
    keys: ["Escape"],
    onKeyDown: () => console.log("Escape pressed"),
  });

  return <p>Press Escape to try the keyboard handler.</p>;
};
```

Options include `keys`, `onKeyDown`, `onKeyUp`, `enabled`, `preventDefault`,
and `stopPropagation`. Callbacks receive modifier flags, repeat state, and
the native event. These are global listeners: scope application shortcuts
carefully so they do not interfere with inputs or other controls.

## Roving focus

`useRovingFocus<T>` manages a single tab stop among items identified by stable
IDs. It supports horizontal, vertical, or both orientations, RTL direction,
looping, disabled items, and an initial active ID.

Wire its `getItemRef`, `getItemTabIndex`, `onItemFocus`, and `onItemKeyDown`
helpers to each focusable element. Use `focusItem` for programmatic focus
and `activeId` to inspect the current item.

Focus management does not supply widget semantics or selection state. Add
the appropriate roles, accessible names, and selection behavior yourself.

## Compatibility

Call these hooks in React function components or custom hooks, not in server
components. In React Server Component applications, use a `"use client"`
module for interactive consumers. ESM and CommonJS builds and their
TypeScript declarations are included.

## Development

From an installed repository checkout:

```sh
npm run build --workspace=@puzzle-ui/hooks
```

This package currently has no dedicated test script. `prepack` rebuilds it
before packing or publishing. See the root
[publishing guide](../../README.md#publishing-packages).

## License

MIT. See [LICENSE](../../LICENSE); the published license is at `dist/LICENSE`.
