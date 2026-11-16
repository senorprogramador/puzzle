# Changelog

All notable changes to `@puzzle-ui/create` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.10.1 - 2026-11-16

- Fixed MFA in scaffolded Auth projects: generated servers now configure WebAuthn passkeys (relying party and origin derived from `APP_ORIGIN`) and expose the passkey, TOTP enrollment, factor management and recovery-code endpoints.
- Added an `MfaSettings` panel to the generated dashboard so users can enroll passkeys and TOTP, manage factors and regenerate recovery codes.
- Fixed TanStack Start with Nitro and Auth builds by inlining dynamic imports so WebAuthn's metadata polyfill loads before its certificate dependencies.
- Documented passkey setup and `APP_ORIGIN` requirements, and extended the end-to-end suite with passkey registration and sign-in checks, including a Chromium virtual authenticator for TanStack Start with MongoDB (requires Playwright Chromium).

## 0.10.0 - 2026-11-16

- Added a prompt for the first application user (email, masked password of 12–1024 characters, and confirmation) when MongoDB or D1 is selected with Auth. The CLI creates that account after install through Puzzle Auth's password hashing, and sends credentials over stdin rather than as command-line arguments or project files.
- Added a `db:setup` script to generated MongoDB projects. It starts the replica set, checks both accounts and primary readiness, and initializes missing users on older local volumes without resetting existing passwords or deleting data. The next steps now say to run `db:setup` instead of `docker compose up -d --wait`.
- Added a `Page not found` route to generated TanStack Start projects.
- Command runner now supports passing input to a child process over stdin.
- Docker with Compose is now documented as a requirement when selecting MongoDB with Auth.
- Expanded the end-to-end suite to cover dev-server checks, legacy MongoDB volumes, initial-user sign-in, and passwords with special characters.

## 0.9.0 - 2026-11-16

- MongoDB projects now run with access control: `.env` gets randomly generated administrator and application passwords, `docker compose` reads them from `.env`, the replica set uses a generated keyfile, the application user is limited to `readWrite` on the project database, and the port is bound to `127.0.0.1`.
- Every project now gets a default `puzzle-fonts.json`, passes it to `Theme` with `fontSource="local"`, adds a `fonts:download` script, and downloads the fonts during setup.
- TanStack Start projects that do not use D1 now include Nitro, a `start` script, and font cache headers from `@puzzle-ui/theme/nitro`.
- Added a deployment guide for every framework and database at https://puzzle-ui.com/docs/create/deployment.
- Added an end-to-end suite (`bun run test:e2e`) that creates, installs, builds, serves and tests every project shape against the local packages, including the MongoDB and D1 authentication flows.

## 0.8.0 - 2026-11-16

- Added React Router (framework mode) as a project template alongside Next.js, TanStack Start, and Basic React.
- Added a database prompt for full-stack Puzzle Auth projects, with MongoDB, Cloudflare D1, and Custom storage options.
- Generated Auth projects now include sign-in and sign-up pages, a protected `/dashboard` route, an API route, and server modules wired to the chosen database.
- MongoDB projects get a `docker-compose.yml` replica set, and the next steps now include `docker compose up -d --wait`.
- D1 projects get `wrangler.jsonc`, the Cloudflare runtime integration (OpenNext for Next.js, the Cloudflare Vite plugin for TanStack Start and React Router), and a `cf-typegen` run after install.
- Auth projects write a `.env` with preview database settings and generated secrets for local development.
- The generated theme now maps Puzzle `Link` (and `Image` on Next.js) to the framework's components, and the starter page links to the package docs.
- Tailwind setup now keeps the existing layout of the Vite `plugins` array and supports React Router projects.
- Dependency installation uses the detected package manager, including dev dependencies for Cloudflare tooling.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

### Added

- Added optional Puzzle Auth scaffolding for supported server frameworks, including client providers, sign-in/sign-up pages, API routes, and an application-owned server configuration boundary.

### Changed

- Added pnpm and Yarn support and made the detected package manager drive framework setup and dependency installation.

## 0.4.0 - 2026-11-09

### Fixed

- Handled missing CSS import paths safely while configuring Tailwind for TanStack Start.

## 0.3.0 - 2026-11-08

### Added

- Introduced the interactive `create-puzzle` CLI for scaffolding Next.js, TanStack Start, and Vite React/TypeScript projects.
- Added project-name normalization, Puzzle UI and Theme setup, and optional Tailwind CSS configuration.
