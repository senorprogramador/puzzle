# Puzzle

**Puzzle is an early-stage React UI component library and design
system.**

It is being built to help developers create consistent, responsive
interfaces using reusable components, hooks, and theme utilities.

> \[!WARNING\] **Puzzle is not ready for production use.**
>
> This project is under active development. APIs, component props,
> package exports, styling, and internal implementation may change
> without notice. Components may be incomplete, and testing,
> accessibility, documentation, and framework compatibility are not yet
> guaranteed. Use it for experimentation and evaluation only---not for
> production applications.

## Project status

Puzzle is a work in progress. The current focus is on establishing the
foundations of the library, including:

- Reusable React UI components
- Theme and design-token utilities
- Shared hooks and utilities
- Responsive layout primitives
- A Storybook-based development and preview environment

Features and package boundaries may change as the project evolves. Do
not assume that an existing component or API is stable.

## Repository structure

The repository is organised as a Bun workspace monorepo. Its packages
and applications currently include:

Package / app Purpose

---

`"@puzzle-ui/core` Core UI components and shared primitives
`"@puzzle-ui/theme` Theme and design-token functionality
`"@puzzle-ui/hooks` Reusable React hooks
`"@puzzle-ui/playground` Playground and component exploration

The exact structure and package responsibilities may evolve during
development.

## Tech stack

The project is built around:

- React and TypeScript
- Bun workspaces
- Tailwind CSS
- Storybook
- Playwright for browser-level testing

Individual packages and development tooling may use additional
technologies.

## Getting started

### Prerequisites

Install a recent version of [Bun](https://bun.sh/) that supports the
version and workspace setup used by this repository.

### Install dependencies

Clone the repository and install its dependencies:

```bash
git clone https://github.com/senorprogramador/puzzle.git
cd puzzle
bun install
```

### Development

Development and Storybook commands may change while the project is being
built. Check the relevant `package.json` files and workspace scripts for
the commands currently available:

```bash
cat package.json
```

For package-specific commands, inspect the `package.json` in the
relevant workspace.

### Tests

Run all package test suites from the repository root:

```bash
bun run vitest
```

This builds the packages first because some tests import compiled output,
then runs the workspace suites, CLI tests, and UI browser tests. MongoDB
conformance tests require Docker with Compose; their runner starts and
removes a dedicated test container and its volume. Browser tests require
Playwright's Chromium browser.

## Design principles

Puzzle aims to provide a foundation for interfaces that are:

- **Consistent** --- shared components and theme tokens help keep
  visual decisions aligned.
- **Composable** --- components should be reusable and fit into
  different application layouts.
- **Responsive** --- layout primitives should adapt to different
  screen sizes.
- **Accessible** --- semantic HTML and appropriate accessibility
  attributes are important design goals.
- **Developer-friendly** --- TypeScript types and component previews
  should make APIs easier to understand.

These are project goals, not a claim that every component currently
meets them.

## Compatibility

Compatibility with specific React frameworks, rendering modes, and build
setups is still being developed and verified. Do not assume that every
component works in every environment, including server-side rendering
(SSR), Next.js App Router, or TanStack Start, unless that support has
been tested for the specific component and release.

## Contributing

Contributions, bug reports, and suggestions are welcome. Since the
project is still evolving, please open an issue or discussion before
investing in a large change so that the proposed direction can be agreed
upon.

When reporting a bug, include:

- The package and component involved
- A minimal reproduction
- Expected behaviour and actual behaviour
- Relevant framework and runtime versions

## Versioning and breaking changes

Until Puzzle reaches a more stable stage:

- Public APIs may change at any time.
- Breaking changes may be introduced without a migration guide.
- Documentation may lag behind implementation.
- Tests and examples may not cover every use case.

Pin versions or use a specific commit if you are experimenting with the
project.

### Publishing packages

The library packages are published separately as public packages on npmjs.
The repository root and applications are private and are not published.

From the repository root, validate a package's build and tarball without
publishing it:

```bash
npm pack --workspace=@puzzle-ui/core --dry-run
npm publish --workspace=@puzzle-ui/core --dry-run
```

Every library package runs `tsdown` in `prepack`, so packing and publishing
rebuild its JavaScript, ESM/CommonJS declarations, styles where applicable,
and included MIT license. Runtime dependencies use registry-compatible
version ranges; consumers do not need Bun or workspace links.

### Releasing

Release all library packages together from the repository root:

```bash
npm run release
```

The script requires a clean git working tree and asks whether the release is
`major`, `minor`, or `patch`. It then:

1. Updates the version and internal `@puzzle-ui/*` dependency ranges of every
   library package, and refreshes `bun.lock`.
2. Type checks all packages and the documentation site.
3. Runs all package tests, including the UI browser tests.
4. Builds all packages.
5. Publishes core, theme, hooks, icons, UI, and create in that order, prompting for
   npm login, one-time passwords, or browser authentication when needed.
6. Commits the version changes as `Release v<version>` and creates the
   annotated tag `v<version>`.

The script stops at the first failing type check, test, build, or publish. If it stops
before anything is published, the version changes are restored. Push the
release afterwards with `git push --follow-tags`.

Run `npm run release:dry-run` to perform every step with `npm publish
--dry-run`, without publishing, committing, or tagging. Releasing requires Bun,
Git, npm, Playwright's Chromium browser, and publish access to the
`@puzzle-ui` scope.

## License

See the [`LICENSE`](./LICENSE) file for the project's current license.
