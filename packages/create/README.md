# @puzzle-ui/create

Generate a new React application with Puzzle UI and Theme configured. Choose Next.js, TanStack Start, React Router, or Basic React (React + Vite + TypeScript), then optionally add Tailwind CSS v4 or Puzzle Auth with a MongoDB or Cloudflare D1 database.

**Documentation:** [https://puzzle-ui.com/docs/create](https://puzzle-ui.com/docs/create)

## Requirements

- Node.js 20.19 or later
- npm, Bun, pnpm, or Yarn
- Internet access to download the framework template and dependencies

## Create a project

Run the interactive generator; it prompts for a project name, framework, Tailwind, Puzzle Auth, and (for full-stack Auth) a database. The name is converted to kebab-case. The CLI does not overwrite an existing directory and has no command-line flags.

```bash
npx @puzzle-ui/create
```

Alternatives: `bunx @puzzle-ui/create`, `pnpm dlx @puzzle-ui/create`, or `yarn dlx @puzzle-ui/create` (Yarn 2+; Yarn Classic users can use `npx`).

The generator installs `@puzzle-ui/ui` and `@puzzle-ui/theme`, maps Puzzle `Link` (and `Image` on Next.js) to the framework's components in the theme, adds a starter page that links to the package docs, and uses the detected package manager for framework generation and dependency installation. Tailwind is enabled by default; Puzzle Auth is optional and disabled by default.

When Auth is enabled, the CLI adds client auth components and, for full-stack frameworks, sign-in and sign-up pages, a protected `/dashboard` route, an API route, and server modules wired to the chosen database. MongoDB projects get a `docker-compose.yml`; D1 projects get `wrangler.jsonc` and the Cloudflare runtime integration. A `.env` with preview database settings and generated secrets is written for local development. A custom database leaves a storage adapter placeholder. Review the server setup against the [Authentication setup guide](https://puzzle-ui.com/docs/developer/authentication) before production.

See the [Create documentation](https://puzzle-ui.com/docs/create) for framework-specific generated files, Tailwind setup, and Auth requirements.

Review generated applications against your deployment, security, and
accessibility requirements before release.

## Package details

The published command is `create-puzzle`. The package is CLI-only; it does not provide an importable JavaScript API. License: MIT.
