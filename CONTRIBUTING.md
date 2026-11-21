# Contributing to Puzzle UI

Thank you for considering a contribution. Puzzle UI is a TypeScript and React
monorepo; focused changes with clear rationale, appropriate tests, and current
documentation are especially helpful.

## Before contributing

1. Search [existing issues](https://github.com/senorprogramador/puzzle/issues)
   and [pull requests](https://github.com/senorprogramador/puzzle/pulls) for
   related work.
2. For bugs, use the bug report form and include a minimal reproduction when
   possible. For documentation issues, use the documentation form.
3. Open an issue or start a
   [discussion](https://github.com/senorprogramador/puzzle/discussions) before
   substantial changes. Discuss breaking API changes before implementing them,
   including their impact on existing users and possible migration paths.

There is no required branch-name or commit-message convention documented by
the repository.

## Development requirements

- Git.
- Bun 1.4.4, the version used by CI. Use the repository lockfile when
  installing dependencies.
- Node.js 22 and 24 are exercised by the CI matrix. The published
  `@puzzle-ui/create` and `@puzzle-ui/theme` packages declare Node.js 20.19 or
  later for their supported tooling.
- TypeScript is managed by the workspace lockfile. The documentation site
  declares TypeScript `^7.0.2`; there is no single root-level TypeScript
  requirement for every package.
- Playwright Chromium for browser tests.
- Docker with Compose for MongoDB adapter integration tests.

## Repository structure

| Path | Purpose |
| --- | --- |
| `apps/site/` | Puzzle documentation website |
| `apps/playground/` | Vite playground and Storybook |
| `packages/` | Independently published packages |
| `docs/` | Repository audits and technical notes |
| `scripts/` | Release and benchmark scripts |
| `.github/` | CI workflows, funding information, and GitHub templates |

The packages are grouped by responsibility:

| Package | Responsibility |
| --- | --- |
| `core` | Shared framework-independent utilities |
| `hooks`, `icons` | React hooks and icon components |
| `theme`, `ui`, `pieces` | Theme system, UI components, and composed sections |
| `seo` | Metadata, structured data, sitemap, and robots utilities |
| `auth`, `session`, `fullstack` | Authentication, sessions, media/CMS APIs, and framework integrations |
| `storage`, `storage-d1`, `storage-mongodb` | Record storage contracts and adapters |
| `media` | Media asset, binary object-storage, and processing contracts |
| `cms` | Content schemas, entries, revisions, and publishing services |
| `create` | Interactive application generator |

## Getting started

Clone the repository and install dependencies:

```bash
git clone https://github.com/senorprogramador/puzzle.git
cd puzzle
bun install
```

Useful development commands from the repository root:

```bash
bun run site       # Documentation website
bun run dev        # Component playground
bun run storybook  # Storybook
```

## Build, typecheck, and tests

Run the same broad checks used by CI:

```bash
bun run build
bun run typecheck
bun run test:all
bun run --filter "@puzzle-ui/site" build
```

`test:all` includes package tests, Playwright browser tests, and MongoDB
integration tests. Install Playwright Chromium before browser tests; Docker
with Compose must be available for the MongoDB adapter tests. CI installs
Chromium with `bunx playwright install --with-deps chromium`.

For a focused change, use the affected package's scripts. For example:

```bash
bun run --filter "@puzzle-ui/ui" test:unit
bun run --filter "@puzzle-ui/ui" test:component
bun run --filter "@puzzle-ui/ui" test:browser
bun run --filter "@puzzle-ui/create" test
```

For changes to the project generator, its templates, or packages that
generated projects use, run the end-to-end suite. It creates, installs, builds
and serves every project shape, and needs Docker with Compose and network
access:

```bash
bun run test:e2e
```

For documentation changes, verify imports and links and build the site:

```bash
bun run --filter "@puzzle-ui/site" typecheck
bun run --filter "@puzzle-ui/site" build
```

Run the narrowest relevant check first. Run broader checks when a change affects
shared packages, public APIs, or multiple workspace packages.

## Code and package conventions

- Follow the target package's existing structure and nearby implementations.
- Use TypeScript, named exports, and functional React components where those
  patterns apply.
- Keep UI components generic and router-independent. Prefer semantic HTML and
  native browser behavior.
- Preserve package boundaries and public APIs. Avoid adding dependencies for
  small features.
- Use existing theme tokens instead of introducing arbitrary design values.
- Account for keyboard use, visible focus, screen readers, reduced motion, and
  responsive layouts when the change affects interaction or presentation.
- Treat server and browser code as separate package boundaries. Do not imply
  framework or SSR compatibility beyond the package documentation and tests.

## Tests and documentation

Add or update tests for meaningful behavior changes and regression fixes when
the package has suitable test infrastructure. Choose unit, component, browser,
or integration tests based on the behavior being changed. For interaction
changes, include browser coverage where practical.

Update the documentation when a public API, package behavior, setup step, or
important limitation changes. Site documentation lives under
`apps/site/content/docs/`; follow the relevant category's MDX conventions and
run the site build to validate examples and navigation.

## Pull requests

Keep pull requests focused and describe:

- The problem and motivation.
- The affected package names and public APIs.
- Tests and checks performed, including any not run.
- Documentation impact, breaking changes, and known limitations.

Use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). There is no
documented review-time guarantee.

## Changesets and releases

The repository does not use a Changesets workflow. Packages are versioned in
lockstep by the maintainer's `scripts/release.mjs` helper, which updates the
package changelogs and publishes the packages. The helper provides
`bun run release:dry-run` for a dry run; `bun run release` performs release
operations and is intended for maintainers.

Package-level release history is kept in each package's `CHANGELOG.md`. Do not
manually change package versions or publish packages as part of an ordinary
pull request.
