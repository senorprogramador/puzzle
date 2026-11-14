# @puzzle-ui/hooks

Reusable React hooks for keyboard shortcuts and accessible roving focus. Use this package when an application needs low-level keyboard or focus behavior without taking on a component or styling dependency.

**Documentation: [puzzle-ui.com/docs/hooks](https://puzzle-ui.com/docs/hooks)**

## Install

```sh
npm install @puzzle-ui/hooks
# or: bun add @puzzle-ui/hooks
# or: pnpm add @puzzle-ui/hooks
# or: yarn add @puzzle-ui/hooks
```

Requires React `^19.0.0` as a peer dependency.

## Usage

```tsx
import { useKeyboardKeys } from "@puzzle-ui/hooks";

function EscapeShortcut({ close }: { close: () => void }) {
  useKeyboardKeys({
    keys: ["Escape"],
    onKeyDown: () => close(),
    enabled: true,
  });

  return null;
}
```

`useKeyboardKeys` subscribes to selected global keydown/keyup events and reports modifier state. `useRovingFocus` provides roving `tabIndex`, element refs, focus management, and arrow/Home/End navigation for composite widgets. Both hooks and their public types are exported from the package root; React is the only peer dependency.

See the [hooks documentation](https://puzzle-ui.com/docs/hooks) for complete signatures, options, return values, examples, SSR guidance, and accessibility notes.
