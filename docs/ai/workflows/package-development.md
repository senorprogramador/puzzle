# Package development workflow

1. Locate the workspace in the [package map](../architecture/package-map.md).
   Read its manifest and nearest `AGENTS.md`; confirm the package name,
   scripts, export map, and direct dependencies.
2. State whether the change is internal or public. For public behavior, inspect
   the package entry point and tests that establish the existing contract.
   Never rely on an undocumented deep import.
3. Make the smallest change in the package that owns the responsibility.
   Preserve framework-neutral boundaries and avoid new dependencies unless
   the need is established.
4. Update relevant tests and usage/architecture docs with public contract
   changes. Keep examples aligned with exports and actual capabilities.
5. Run the focused test, typecheck, and build scripts that exist in that
   package. For cross-package consumers, follow the
   [cross-package workflow](./cross-package-changes.md).

Use the package's own manifest for exact commands, not a presumed monorepo
script pattern. At minimum, verify a changed public entry point and its
consumer where feasible. Follow [Contributing](../../../CONTRIBUTING.md) for
repository-wide validation and release conventions; do not change versions or
publish packages as part of ordinary implementation work.
