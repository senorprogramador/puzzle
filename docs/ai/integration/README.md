# Puzzle AI integration

Puzzle separates repository development instructions from consumer guidance.
Package `AGENTS.md` files and repository Copilot instructions remain
development-only. Consumer instructions live in each public package's `ai/`
directory and are included in that package's npm publication.

## Architecture

- Each public package owns `ai/manifest.json` and `ai/instructions.md`.
  The manifest identifies its schema and instruction version, published
  content, documentation URL, and optional instruction dependencies.
- `packages/create/ai/shared.md` is the shared consumer layer. The Create CLI
  package publishes it alongside its own package instructions.
- `create-puzzle ai` discovers direct public `@puzzle-ui/*` dependencies in
  `package.json` files under the selected project, resolves declared
  instruction dependencies from installed package contents, and de-duplicates
  identical package/version/content.
- `docs/ai/integration/registry.json` is generated from package manifests. It
  is a catalog for maintainers and validation; package metadata remains the
  runtime source of truth.
- Generated instructions are data. The installer does not execute package
  scripts, access the network, or import consumer project code.

Run the CLI from an application or workspace directory to scope discovery and
output to that project. Dependency discovery supports npm, pnpm, Bun, and Yarn
projects that use a `node_modules` installation. Yarn Plug'n'Play without
`node_modules` is not currently supported.

## Add a package

1. Add a consumer-focused `ai/instructions.md`; do not copy package
   `AGENTS.md` development rules.
2. Add `ai/manifest.json` with the package name, instruction schema/version,
   content file, public documentation URL, and only necessary instruction
   dependencies.
3. Add `"ai"` to the package's `files` list.
4. Ensure examples use actual public exports and are validated against the
   built package declarations.
5. Run `bun run ai:check` from the repository root. This builds the workspace,
   typechecks Markdown TypeScript examples, packs every public package, reads
   required instruction files back from the actual tarballs, checks for
   development files, and verifies the generated registry.
6. If the registry is stale after a deliberate package change, regenerate it
   with `bun packages/create/src/ai/check.ts --write-index`, then run
   `bun run ai:check` again.

Private workspace packages are excluded from npm consumer guidance. A package
dependency should be added to `instructionDependencies` only when its guidance
is needed to use the current package correctly; runtime dependencies alone do
not automatically pull in their full instruction sets.

## Add an agent

Update the typed agent list and generator in `packages/create/src/ai/`, add
frontmatter validation and focused tests, document its discovery and output
format in the consumer guide, and verify that existing user configuration is
preserved. Never append frontmatter after a document body or overwrite an
unmanaged file.

## Validation and release

The root `ai:check` command runs after the workspace build in CI. The CI job
also checks project type safety and site MDX separately. Keep the root and
package scripts, the generated registry, published package contents, CLI
documentation, and maintained instructions synchronized.
