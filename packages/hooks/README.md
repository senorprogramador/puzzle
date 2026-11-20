# @puzzle-ui/hooks

Reusable React hooks for keyboard behavior, accessible focus, list filtering,
reduced-motion preferences, async action state, visibility-driven rendering,
and shared resource prefetching. Use these hooks when an application needs
interaction logic without taking on a component or styling dependency.

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
`useColorScheme` reads an element's computed light or dark color scheme and
updates when its class, style, or `data-theme` attribute changes.
`useFold` and `useVisibility` provide shared viewport and proximity tracking;
the related state hooks subscribe to individual boundaries. `useResourcePrefetch`
uses the `FoldProvider` scheduler to queue abortable, deduplicated loading
without mounting components. `useFoldOptimization` reads the provider's
normalized optimization profile settings.

Set `onDiagnosticEvent` on `FoldProvider` to observe the typed rendering
lifecycle locally. Diagnostics are off by default; the callback explicitly
enables them, and no data is sent anywhere unless the application callback does
so. Events include the effective profile and configuration, visibility and
strategy decisions, activation and mount timing, resource/prefetch state, and
load failures. `diagnostics` also enables decision details on `useFold`; pass
`diagnostics={false}` to disable events, including inherited diagnostics, in a
subtree.

All hooks and public types are exported from the package root; React is the
only peer dependency.

## Exports

| Hook | Use |
| --- | --- |
| `useKeyboardKeys` | Subscribe to selected global keyboard events. |
| `useRovingFocus` | Coordinate arrow-key navigation and roving tab stops. |
| `useListFilter` | Filter a typed collection by query and category. |
| `useReducedMotion` | Track `prefers-reduced-motion` with SSR-safe behavior. |
| `useColorScheme` | Read a target element's computed light or dark color scheme. |
| `useAsyncAction` | Track an async action and expose its result state/error. |
| `useFold` | Track a rendering boundary and control one-shot or persistent activation. |
| `useFoldOptimization` | Read immutable, normalized profile settings from the nearest `FoldProvider`. |
| `useVisibility` | Observe a target's viewport and proximity state. |
| `useFoldState` | Subscribe to a registered boundary by ID. |
| `useIsVisible` | Read whether a registered boundary intersects the viewport. |
| `useIsNearby` | Read whether a registered boundary is near or inside the viewport. |
| `useResourcePrefetch` | Prefetch modules or caller-managed data by visibility, proximity, idle time, or explicit request. |

See the [hooks documentation](https://puzzle-ui.com/docs/hooks) for complete
signatures, options, return values, examples, SSR guidance, and accessibility
notes.
