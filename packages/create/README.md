# @puzzle-ui/create

Generate a new React application with Puzzle UI and Theme configured. Choose Next.js, TanStack Start, React Router, or Basic React (React + Vite + TypeScript), then optionally add Tailwind CSS v4 or Puzzle Auth with a MongoDB or Cloudflare D1 database.

**Documentation:** [https://puzzle-ui.com/docs/create](https://puzzle-ui.com/docs/create)

## Requirements

- Node.js 20.19 or later
- npm, Bun, pnpm, or Yarn
- Internet access to download the framework template and dependencies
- Docker with Compose when selecting MongoDB with Auth

## Create a project

Run the interactive generator; it prompts for a project name, framework, Tailwind, Puzzle Auth, and (for full-stack Auth) a database. The name is converted to kebab-case. The CLI does not overwrite an existing directory and has no command-line flags.

Selecting MongoDB or D1 also prompts for the first application user's email, a masked password (12–1024 characters), and password confirmation. After installing dependencies, the CLI automatically initializes the local database and registers that account using Puzzle Auth's password hashing. MongoDB starts through Docker Compose; D1 uses the same local persisted database as development. Credentials go to the seed process over stdin, not command-line arguments or project files. Puzzle Auth currently has no administrator roles, so this is a normal sign-in account, not a privileged application administrator. MongoDB's database administrator credentials remain separate and randomly generated. Custom databases and Basic React do not prompt for an account.

```bash
npx @puzzle-ui/create
```

Alternatives: `bunx @puzzle-ui/create`, `pnpm dlx @puzzle-ui/create`, or `yarn dlx @puzzle-ui/create` (Yarn 2+; Yarn Classic users can use `npx`).

The generator installs `@puzzle-ui/ui` and `@puzzle-ui/theme`, maps Puzzle `Link` (and `Image` on Next.js) to the framework's components in the theme, adds a starter page that links to the package docs, and uses the detected package manager for framework generation and dependency installation. Tailwind is enabled by default; Puzzle Auth is optional and disabled by default.

When Auth is enabled, the CLI adds client auth components and, for full-stack frameworks, sign-in and sign-up pages, a protected `/dashboard` route, an API route, and server modules wired to the chosen database. MongoDB projects get a `docker-compose.yml` with access control; its administrator and least-privileged application passwords are randomly generated into `.env`, which `docker compose` reads. Run `bun run db:setup` (or your selected package manager) before `dev`. It starts the replica set, checks both accounts and primary readiness, and can initialize missing users on older local volumes without users. It never resets existing passwords or deletes data. If credentials do not match an existing volume, restore its original `.env` or update the user password as an administrator; exported shell variables also override Compose's `.env`. D1 projects get `wrangler.jsonc` and the Cloudflare runtime integration. A `.env` with preview database settings and generated secrets is written for local development. A custom database leaves a storage adapter placeholder. Review the server setup against the [Authentication setup guide](https://puzzle-ui.com/docs/developer/authentication) before production.

After signing in with a password, register a passkey in the dashboard's MFA settings before using it to sign in. Save the recovery codes shown at enrollment. Passkeys are bound to the exact `APP_ORIGIN` and its hostname; use HTTPS in production and update `APP_ORIGIN` for your deployed host.

Every project serves its fonts locally: the CLI writes a default `puzzle-fonts.json`, passes it to `Theme`, and downloads the fonts into `public/fonts`. Run `fonts:download` after changing the configuration. TanStack Start projects that do not use D1 include Nitro for a Node.js server with font cache headers.

To go to production, follow the [Deployment guide](https://puzzle-ui.com/docs/create/deployment) for your framework and database.

See the [Create documentation](https://puzzle-ui.com/docs/create) for framework-specific generated files, Tailwind setup, and Auth requirements.

Review generated applications against your deployment, security, and
accessibility requirements before release.

## End-to-end tests

Contributors can verify every project shape the CLI generates with the end-to-end suite:

```bash
bun run test:e2e
```

The suite builds the workspace and packs the local `@puzzle-ui/*` packages. It then creates 28 projects in a temporary directory: each framework, with and without Tailwind, and each Auth and database option. Every project is installed with Bun, using the packed packages instead of published versions. Each project then:

- downloads its local fonts
- checks the generated `.env`, Docker Compose and Wrangler files
- runs the generated `bun run dev` command and checks the home route and Auth API
- builds and typechecks
- serves the production build

MongoDB projects run `db:setup` and confirm that the database rejects unauthenticated access. A legacy-volume regression verifies data-preserving user initialization, repeated setup, missing application-user recovery, and refusal to reset mismatched administrator or application passwords. MongoDB and D1 projects exercise registration, sessions, sign-out and protected dashboards in development, then sign-up, sign-out, sign-in, cross-site request rejection and protected dashboards in production. TanStack Start projects check their not-found page; Nitro projects also verify the font cache headers. The temporary directory, containers and volumes are removed when the suite finishes.

MongoDB and D1 variants also sign in with the account created during scaffolding in both development and production, verify that rerunning bootstrap cannot overwrite its password, exercise passwords with quotes, shell metacharacters, and Unicode, and test passkey registration and sign-in. TanStack Start with MongoDB additionally exercises passkeys in Chromium with a virtual authenticator.

Requirements: Bun, Node.js, Docker with Compose, Playwright Chromium (`bunx playwright install chromium`; on Linux, use `bunx playwright install --with-deps chromium` to also install system dependencies), and network access to npm and Google Fonts. The Create E2E workflow installs Chromium and its system dependencies before running the suite. The suite uses ports 4310–4377 and 27110–27177 on the host.

| Variable | Purpose |
| --- | --- |
| `PUZZLE_E2E_FILTER` | Comma-separated substrings of scaffold IDs to run, for example `tanstack-auth-d1,next-no-auth`. |
| `PUZZLE_E2E_CONCURRENCY` | Number of test files (frameworks) to run in parallel. Defaults to `4`. |
| `PUZZLE_E2E_SKIP_BUILD` | Set to `1` to reuse existing package builds. |
| `PUZZLE_E2E_KEEP` | Set to `1` to keep generated projects and MongoDB containers for debugging. |

## Package details

The published command is `create-puzzle`. The package is CLI-only; it does not provide an importable JavaScript API. License: MIT.
