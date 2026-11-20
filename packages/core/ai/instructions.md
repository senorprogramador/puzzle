# @puzzle-ui/core

Use Core for small framework-neutral utilities and contracts shared by Puzzle
packages. It does not provide React components, routing, application policy, or
browser-only integrations.

Install with `npm install @puzzle-ui/core`. Public entry points are the package
root, `@puzzle-ui/core/rendering`, and `@puzzle-ui/core/resources`. The root
includes helpers such as `cn`, casing and color utilities, responsive-value
utilities, and timing helpers. Import only APIs present in the installed
declarations.

```ts
import { cn } from "@puzzle-ui/core";

const className = cn("card", true && "card-selected");
```

Keep helpers deterministic and runtime-neutral. Do not introduce React,
framework, router, or browser-global dependencies, or import private source
paths. See the [getting-started documentation](https://puzzle-ui.com/docs/getting-started).
