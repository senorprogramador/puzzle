# Puzzle

**Puzzle is an early-stage React UI library and application toolkit.**

It provides reusable UI components, design tokens, theme utilities, composed interface sections, and tools for building React applications.

> [!WARNING]
> **Puzzle is not ready for production use.**
>
> The project is under active development. APIs, component props, package exports, styling, and package boundaries may change without notice. Components may be incomplete, and testing, accessibility, documentation, and framework compatibility are not guaranteed. Use Puzzle for experimentation and evaluation only, not for production applications.

## Project status

Puzzle is a work in progress. Its current focus includes:

- Reusable React UI components.
- Shared design tokens and theme utilities.
- Composed UI sections and larger building blocks.
- Authentication and session infrastructure.
- Framework integrations.
- A project generator and developer tooling.
- Documentation and component previews.

Do not assume that every package or API is stable.

## Packages

Puzzle is organized as a Bun workspace monorepo.

### UI and design system

| Package                        | Purpose                                               |
| ------------------------------ | ----------------------------------------------------- |
| <code>@puzzle-ui/core</code>   | Framework-independent utilities                       |
| <code>@puzzle-ui/hooks</code>  | Reusable React hooks                                  |
| <code>@puzzle-ui/icons</code>  | Icon components and utilities                         |
| <code>@puzzle-ui/theme</code>  | Theme provider, design tokens, colors, and typography |
| <code>@puzzle-ui/ui</code>     | Reusable React UI components                          |
| <code>@puzzle-ui/pieces</code> | Composed UI sections and larger building blocks       |

### Developer tooling

| Package                        | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| <code>@puzzle-ui/create</code> | Interactive React application generator |

### Authentication and storage

| Package                                 | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| <code>@puzzle-ui/auth</code>            | Framework-independent authentication core                 |
| <code>@puzzle-ui/fullstack</code>       | Authentication client, server, and framework integrations |
| <code>@puzzle-ui/session</code>         | Session management                                        |
| <code>@puzzle-ui/storage</code>         | Storage contracts                                         |
| <code>@puzzle-ui/storage-d1</code>      | Cloudflare D1 storage adapter                             |
| <code>@puzzle-ui/storage-mongodb</code> | MongoDB storage adapter                                   |

### Applications

| Path                         | Purpose                            |
| ---------------------------- | ---------------------------------- |
| <code>apps/site</code>       | Documentation website              |
| <code>apps/playground</code> | Storybook and component playground |

## Tech stack

- React 19 and TypeScript.
- Bun workspaces.
- tsdown for package builds.
- Vite and TanStack Start.
- Fumadocs for documentation.
- Vitest and Node's test runner.
- Playwright for browser-level testing.
- Docker Compose for MongoDB integration tests.

Individual packages may use additional dependencies.

## Getting started

### Create a new application

The easiest way to start a new application is the interactive project generator.

With npm:

```bash
npx @puzzle-ui/create
```

With Bun:

```bash
bunx @puzzle-ui/create
```

With pnpm:

```bash
pnpm dlx @puzzle-ui/create
```

With Yarn 2 or later:

```bash
yarn dlx @puzzle-ui/create
```

The generator supports:

- Next.js App Router.
- TanStack Start.
- Basic React with Vite and TypeScript.

It configures the Puzzle theme and optionally installs Tailwind CSS v4.

The generator requires Node.js 20.19 or later.

See the [Create a Project guide](https://github.com/senorprogramador/puzzle/tree/main/apps/site/content/docs/developer) for details.

### Install Puzzle manually

For an existing React application, install the UI and theme packages.

```bash
npm install @puzzle-ui/ui @puzzle-ui/theme
```

Wrap your application in the theme provider.

```tsx
import { Theme } from "@puzzle-ui/theme";
import { Button } from "@puzzle-ui/ui";

const App = () => (
  <Theme theme="system">
    <main>
      <h1>Welcome to Puzzle</h1>
      <Button>Get started</Button>
    </main>
  </Theme>
);

export default App;
```

Your bundler must support CSS imports. Puzzle's component styles are imported by the components themselves.

See the [Getting Started documentation](https://github.com/senorprogramador/puzzle/tree/main/apps/site/content/docs/getting-started.mdx).

## Development

### Requirements

- Git.
- Bun 1.4.4 or a compatible newer version.
- Node.js 20.19 or later for the project generator and related tooling.
- Docker with Compose for MongoDB integration tests.

### Clone the repository

```bash
git clone https://github.com/senorprogramador/puzzle.git
cd puzzle
bun install
```

### Run the documentation site

```bash
bun run site
```

The documentation site serves `/sitemap.xml`, generated from the homepage and
all Fumadocs pages (including documentation indexes). URLs use the request's
origin, so reverse proxies should preserve the public host and scheme.
The generated XML is cached in each server process for 24 hours and sent with
`Cache-Control: public, max-age=86400, s-maxage=86400` for browser and shared caches.
The process cache is refreshed on expiry, an origin change, or a server restart.

Run the sitemap tests with `bun run --filter @puzzle-ui/site test:sitemap`.

### Run the playground

```bash
bun run dev
```

### Run Storybook

```bash
bun run storybook
```

### Build packages

```bash
bun run build
```

### Type check packages and documentation

```bash
bun run typecheck
```

### Run the repository test command

```bash
bun run vitest
```

This command builds the packages first, runs package test scripts, runs the project generator tests, and runs the UI browser tests.

MongoDB integration tests require Docker with Compose. Browser tests require Playwright's Chromium browser.

See the [Testing guide](https://github.com/senorprogramador/puzzle/tree/main/apps/site/content/docs/developer/testing.mdx) for package-specific commands.

## Design principles

Puzzle aims to provide interfaces that are:

- **Consistent** — shared components and tokens keep visual decisions aligned.
- **Composable** — components should fit different application layouts.
- **Responsive** — layout primitives should adapt to different screen sizes.
- **Accessible** — semantic HTML and appropriate accessibility behavior are core requirements.
- **Developer-friendly** — TypeScript types, documentation, examples, and tooling should make APIs easier to understand.

These are project goals, not a claim that every component currently meets them.

## Compatibility

Puzzle targets React 19.

Compatibility with specific React frameworks, rendering modes, and build setups is still being developed and verified. Do not assume that every component works in every environment, including server-side rendering, Next.js App Router, or TanStack Start, unless that support has been tested for the specific component and release.

## Contributing

Contributions, bug reports, and suggestions are welcome.

Before investing in a large change, open an issue or discussion so that the proposed direction can be agreed upon.

When reporting a bug, include:

- The package and component involved.
- A minimal reproduction.
- Expected behavior and actual behavior.
- Relevant framework and runtime versions.

Follow the repository conventions in <code>AGENTS.md</code>.

## Versioning and releases

Until Puzzle reaches a more stable stage:

- Public APIs may change.
- Breaking changes may be introduced.
- Documentation may lag behind implementation.
- Tests and examples may not cover every use case.

Pin versions or use a specific commit if you are experimenting with the project.

The release script currently publishes the following packages together:

- <code>@puzzle-ui/core</code>
- <code>@puzzle-ui/theme</code>
- <code>@puzzle-ui/hooks</code>
- <code>@puzzle-ui/icons</code>
- <code>@puzzle-ui/ui</code>
- <code>@puzzle-ui/create</code>

Run a release dry run:

```bash
npm run release:dry-run
```

Run a release:

```bash
npm run release
```

The release script requires a clean Git working tree. It updates package versions and workspace dependency ranges, refreshes the lockfile, validates types, runs tests, builds packages, publishes them, commits the release, creates a tag, and pushes the release.

The release script publishes only the packages listed above. Other packages in the repository are not included in its current release sequence.

## License

See the [LICENSE](./LICENSE) file for the project's current license.
