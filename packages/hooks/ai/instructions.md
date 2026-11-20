# @puzzle-ui/hooks

Use Hooks for reusable React behavior such as interaction, state, preferences,
visibility, and resource prefetching. Hooks do not provide styled components,
application routing, or application data policy.

Install with `npm install @puzzle-ui/hooks`. The package root
(`@puzzle-ui/hooks`) is its public entry point; verify each hook and its
signature in the installed declarations before use.

```tsx
import { useReducedMotion } from "@puzzle-ui/hooks";

const reducedMotion = useReducedMotion();
```

Follow React's hook rules and keep browser access inside safe lifecycle paths.
Preserve server snapshots and existing client boundaries. Prefer the shared
visibility/resource facilities over adding another observer or scheduler.
Surface asynchronous failures to callers; do not silently suppress them.

Do not import source internals or assume every hook is safe in a server
component. See the [Hooks documentation](https://puzzle-ui.com/docs/hooks).
