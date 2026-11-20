# @puzzle-ui/i18n — internal development instructions

## Responsibility

This package owns framework-neutral locale management, ICU translation lookup,
Intl formatting, catalog validation/type generation, safe locale-prefixed path
helpers, JSON/HTTP/filesystem catalog sources, a validation/typegen CLI, and
data that integrates with Puzzle SEO. React-specific code belongs only in
`src/react/`; optional AI provider contracts belong only in `src/ai/`.

## Public API and boundaries

- `src/index.ts` is the package root export surface.
- Every public subpath must be declared in `package.json` and `tsdown.config.ts`.
- Keep Node-only APIs out of the root and browser-importable subpaths.
- Keep filesystem access in `@puzzle-ui/i18n/sources/node` and CLI process APIs
  under `/cli`; neither belongs in the root or browser source entry.
- Keep React imports in `src/react/`; React is an optional peer.
- Do not add a competing SEO engine. `src/seo/` only produces values accepted by
  `@puzzle-ui/seo`.
- Runtime locale state must be created per translator/provider. Never add a
  process-global mutable active locale.
- Add a framework adapter only when it uses and tests that framework's actual
  public request, route, and rendering APIs.
- AI providers are injected. Never put credentials in the client or overwrite
  an existing translation from a generated suggestion.

## Runtime and security

- Normalize configured tags with `Intl.getCanonicalLocales`; validate all
  locale references before use.
- Keep fallback order deterministic and report missing/fallback events through
  typed callbacks.
- Treat catalog and remote content as untrusted input. Validate message syntax
  before compilation or rendering.
- Validate filesystem paths after resolving symlinks; remote URLs must use
  HTTP(S), reject credentials/fragments, stop redirects, time out, and isolate
  caches by locale and namespace.
- Localized route helpers must reject external and protocol-relative paths.
- Do not render translation or remote-content strings as HTML by default.
- Keep catalog caches scoped to an instance/translator and avoid request state
  in shared objects.

## Tests and documentation

- Add focused tests in `src/tests/` for locale errors, fallbacks, ICU edge cases,
  concurrent locales, route safety, and public exports.
- Type-check the package so generated/public type contracts are exercised.
- Run `bun run build`, `bun run typecheck`, `bun run test:unit`, and
  `bun run test:package` from this package when its public behavior changes.
- Keep the generated package's `puzzle-i18n` binary and all exported source
  paths covered by package-artifact tests.
- Keep [README.md](./README.md), consumer-facing
  [`ai/instructions.md`](./ai/instructions.md), and the site docs aligned with actual
  exports. Do not document framework integrations that are not implemented.
