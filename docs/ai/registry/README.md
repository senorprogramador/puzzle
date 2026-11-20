# Component registry

The generated registries provide a compact discovery index of public React
components from `@puzzle-ui/pieces` and `@puzzle-ui/ui`. They complement, but do
not replace, package documentation or source code.

## Files and schema

- [`schema.json`](./schema.json) defines the versioned registry format.
- [`generated/pieces.json`](./generated/pieces.json) indexes public Pieces.
- [`generated/ui.json`](./generated/ui.json) indexes public UI components.
- [`generated/all.json`](./generated/all.json) combines both packages.
- [`metadata.json`](../../../scripts/component-registry/metadata.json) owns
  curated descriptions, categories, aliases, documentation mappings, and
  component relationships.

Each component records its public entry points and source, plus curated
discovery details where verified. Aliases point to a canonical component and
are not counted as separate implementations. Public hooks and other
non-component exports are verified but excluded from the component inventory.

## Generate and validate

From the repository root:

```sh
bun run registry:generate
bun run registry:check
```

The generator reads the package export maps, combines them with curated
metadata, validates package identities and source/documentation references, and
writes normalized JSON with stable ordering. `registry:check` regenerates the
expected content in memory and fails if a generated file is missing, stale, or
unexpected. CI runs this check after dependency installation.

## Adding or changing a component

Follow the [mandatory component development workflow](../workflows/component-development.md)
for implementation, tests, user-facing docs, visual previews, and AI
documentation synchronization.

1. Export the component through the intended public entry point.
2. Add or update its curated record in `metadata.json`; use existing category,
   use-case, capability, and page-type values.
3. Point to existing documentation and source files. Do not infer behavior or
   props that the implementation does not support.
4. Run `bun run registry:generate`, review the generated changes, then run
   `bun run registry:check`.
5. Update package documentation, tests, previews, and relevant AI guidance
   whenever the component is new or its public behavior changes.

Do not add private implementation details to the registry. The public export
map is the boundary; inspect the component API and documentation before
curating semantic metadata.

## Discovery

Search a package-specific registry first, using `category`, `useCases`,
`pageTypes`, and `capabilities` to narrow candidates. Compare the best matches,
read their `documentation` references, and verify props and exports in the
package source before use. Prefer loading one package registry or filtering by
category over reading the aggregate file. If no Piece fits, search the UI
registry; use ordinary semantic React when a Puzzle component would add
unnecessary complexity.
