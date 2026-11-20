# @puzzle-ui/fullstack

Use Fullstack to connect Puzzle Auth with browser clients, server handlers, and
framework adapters. It adapts the Auth and Session packages; it does not own
authentication policy or persistence.

Install with `npm install @puzzle-ui/fullstack`. There is intentionally no
package-root import. Use only the published entry points:

- `@puzzle-ui/fullstack/auth/client` for browser-facing APIs.
- `@puzzle-ui/fullstack/auth/shared` for serializable shared contracts.
- `@puzzle-ui/fullstack/auth/server` for server handlers.
- `@puzzle-ui/fullstack/auth/next` or `/tanstack` only in the matching framework.

Keep server managers, cookies, storage, and secrets out of client imports.
Protect server resources independently of browser auth state. Next.js and
TanStack Start integrations are optional peers; do not make a framework
integration a requirement for the shared APIs.

Do not import `@puzzle-ui/fullstack` without a subpath or deep-import source
files. See the [Fullstack documentation](https://puzzle-ui.com/docs/fullstack).
