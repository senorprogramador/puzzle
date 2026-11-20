# @puzzle-ui/ui

Use UI for reusable, composable, router-independent React components. It owns
interaction and presentation, not routing, business logic, or page-level
sections.

Install with `npm install @puzzle-ui/ui`. Components and types are named exports
from the package root. Rendering and framework integrations use explicit
subpaths: `/rendering/deferred`, `/rendering/ssr`, `/rendering/static`,
`/rendering/fold`, `/next/client`, `/next/server`, `/tanstack/client`,
`/tanstack/server`, and `/tanstack/shared`.

```tsx
import { Button } from "@puzzle-ui/ui";
```

Confirm each component's current props, maturity label, and docs before use.
Prefer semantic HTML, keyboard-accessible native behavior, visible focus,
existing Theme tokens, and the documented controlled/uncontrolled API. Keep
server/client imports separate and do not access browser APIs at module load.

Do not deep-import source, add routing or business logic, or treat Beta and
Experimental APIs as Stable. See the [UI documentation](https://puzzle-ui.com/docs/ui).
