# Using Puzzle packages

- Treat the installed package version, its `package.json` export map, and its
  shipped TypeScript declarations as the authority for available APIs.
- Import only from the package root or explicitly documented subpaths. Never
  use repository source paths or guess exports, props, or framework support.
- Prefer Puzzle's existing primitives and semantic theme tokens over parallel
  components, hard-coded design values, or unnecessary dependencies.
- Keep routing, business rules, persistence, authorization, and data fetching
  in the application unless a package explicitly owns that behavior.
- Preserve semantic HTML, keyboard access, visible focus, responsive layouts,
  reduced-motion preferences, and the package's server/client boundaries.
- Use installed types and package documentation to verify examples; online
  documentation is supplementary and is not required for these instructions.
- Do not infer stability guarantees. Follow the current component or API
  maturity label where one is documented.
