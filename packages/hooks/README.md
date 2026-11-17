# @puzzle-ui/hooks

Reusable React hooks for keyboard behavior, accessible focus, list filtering,
reduced-motion preferences, and async action state. Use these hooks when an
application needs interaction logic without taking on a component or styling
dependency.

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

`useKeyboardKeys` subscribes to selected global keydown/keyup events and
reports modifier state. `useRovingFocus` provides roving `tabIndex`, element
refs, and arrow/Home/End navigation. `useListFilter` manages query and
category state for typed collections. `useReducedMotion` subscribes to the
browser preference with a conservative SSR snapshot. `useAsyncAction` manages
pending, success, and error state while exposing the error to the caller.

All hooks and public types are exported from the package root; React is the
only peer dependency.

## Exports

| Hook | Use |
| --- | --- |
| `useKeyboardKeys` | Subscribe to selected global keyboard events. |
| `useRovingFocus` | Coordinate arrow-key navigation and roving tab stops. |
| `useListFilter` | Filter a typed collection by query and category. |
| `useReducedMotion` | Track `prefers-reduced-motion` with SSR-safe behavior. |
| `useAsyncAction` | Track an async action and expose its result state/error. |

See the [hooks documentation](https://puzzle-ui.com/docs/hooks) for complete
signatures, options, return values, examples, SSR guidance, and accessibility
notes.
