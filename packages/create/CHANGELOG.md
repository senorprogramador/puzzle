# Changelog

All notable changes to `@puzzle-ui/create` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

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
