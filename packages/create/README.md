# @puzzle-ui/create

Generate a new React application with Puzzle UI and Theme configured. Choose Next.js, TanStack Start, or Basic React (React + Vite + TypeScript), then optionally add Tailwind CSS v4 or Puzzle Auth.

**Documentation:** [https://puzzle-ui.com/docs/create](https://puzzle-ui.com/docs/create)

## Requirements

- Node.js 20.19 or later
- npm, Bun, pnpm, or Yarn
- Internet access to download the framework template and dependencies

## Create a project

Run the interactive generator; it prompts for a project name, framework, Tailwind, and Puzzle Auth. The name is converted to kebab-case. The CLI does not overwrite an existing directory and has no command-line flags.

```bash
npx @puzzle-ui/create
```

Alternatives: `bunx @puzzle-ui/create`, `pnpm dlx @puzzle-ui/create`, or `yarn dlx @puzzle-ui/create` (Yarn 2+; Yarn Classic users can use `npx`).

The generator installs `@puzzle-ui/ui` and `@puzzle-ui/theme`, adds a themed starter page with a Puzzle `Button`, and uses the detected package manager for framework generation and dependency installation. Tailwind is enabled by default; Puzzle Auth is optional and disabled by default.

When Auth is enabled, the CLI adds client auth components and, for Next.js and TanStack Start, an API route and server bootstrap. The generated bootstrap deliberately has no default security providers: configure the required storage, password hashing, rate limiting, sessions, MFA, step-up, cookies, CSRF, and trusted client IP handling before exposing the route. See the [Authentication setup guide](https://puzzle-ui.com/docs/developer/authentication).

See the [Create documentation](https://puzzle-ui.com/docs/create) for framework-specific generated files, Tailwind setup, and Auth requirements.

Review generated applications against your deployment, security, and
accessibility requirements before release.

## Package details

The published command is `create-puzzle`. The package is CLI-only; it does not provide an importable JavaScript API. License: MIT.
