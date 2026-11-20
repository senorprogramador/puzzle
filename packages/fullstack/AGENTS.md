# @puzzle-ui/fullstack – AI development instructions

## 1. Responsibility

Connects Puzzle Auth to browser clients, React UI, server Request/Response handlers, and Next.js/TanStack Start integrations. It adapts Auth and Session; it does not own authentication policy or persistence.

## 2. Public API

There is intentionally no package-root export. Use only:

- `@puzzle-ui/fullstack/auth/client`
- `@puzzle-ui/fullstack/auth/shared`
- `@puzzle-ui/fullstack/auth/server`
- `@puzzle-ui/fullstack/auth/next`
- `@puzzle-ui/fullstack/auth/tanstack`

Verify which subpath is safe for the importing environment before adding imports.

## 3. Architecture

`src/auth/client/` contains the browser client, React provider/hooks/components, and passkey browser helpers; `/shared` contains serializable contracts; `/server` builds handlers around Auth/Session managers; `/next` and `/tanstack` dispatch the shared route map through framework integrations.

## 4. Dependencies

Runtime dependencies are `@puzzle-ui/ui`, `@puzzle-ui/auth`, `@puzzle-ui/session`, and `@simplewebauthn/browser`. React 19 and React DOM 19 are peers. Next.js 15/16 and TanStack Start 1.x are optional peers for their adapters; do not make them required for framework-neutral subpaths.

## 5. Implementation conventions

Never expose server managers, storage, cookies, or secrets through client/shared exports. Client auth state is not authorization; protect server resources independently. Preserve secure cookies, CSRF/origin protections, no-store responses, typed serializable results, and explicit error behavior. Keep framework-specific dispatch in its adapter subpath.

## 6. Testing

Node tests cover client, server, route, lifecycle, and boundary behavior. Browser tests use Vitest with Chromium/Playwright for auth experience and real interactions. Keep client/server export-boundary tests when adding modules.

## 7. Validation

Verified package scripts:

- `bun run typecheck`
- `bun run test`
- `bun run test:browser`
- `bun run vitest`
- `bun run build`

`vitest` runs the Node suite and the browser-configured Vitest suite.

## 8. Documentation

See [`README.md`](./README.md), the [Fullstack documentation](../../apps/site/content/docs/fullstack/index.mdx), and the [developer authentication guide](../../apps/site/content/docs/developer/authentication.mdx). Document the correct subpath and server/client requirements for each new public API.

## 9. Common mistakes

- Do not import from `@puzzle-ui/fullstack` without a subpath.
- Do not let a client entry transitively import a server module or expose server manager types.
- Do not rely on browser state for access control.
- Do not add framework dependencies to the shared server or client APIs.

## 10. Context-efficient workflow

Inspect the subpath's `src/auth/<area>/index.ts`, then its implementation and boundary tests. Read `tsdown.config.ts` before changing entry points; it builds each supported subpath separately.
