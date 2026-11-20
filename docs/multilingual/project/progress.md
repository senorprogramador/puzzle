# Multilingual implementation progress

## Overall

**Status: In Progress.** The pre-release `@puzzle-ui/i18n` toolkit now includes
the requested runtime, framework adapters, compiler/type generation, content
sources, SEO, CLI, diagnostics, AI review workflow, and automated
security/accessibility/performance checks. The backlog in
[`backlog.md`](./backlog.md) records the remaining validation gaps.

## Implemented

- Typed BCP 47 locale registry, negotiation, deterministic fallback, ICU
  translations and interpolation, Intl formatting, lazy namespaces, request
  coalescing, and cancellation-safe waiters.
- React provider/hooks/components for translations, rich text, Intl formatting,
  namespace state, scoped `lang`/`dir`, and accessible native locale selection.
- Safe localized route maps with aliases, parameters, domain origins,
  base-path support, route templates, and automatic adapter diagnostics.
- Localized canonical/Open Graph/hreflang metadata, structured data and
  sitemap helpers, plus diagnostics for reciprocal locale metadata.
- TypeScript AST extraction and transforms, source maps, locale-aware generated
  declarations, Vite diagnostics, and config-driven CLI commands.
- In-memory, TypeScript, HTTP, and Node filesystem catalog sources; versioned
  content resolution and an injected-client Sanity source with a parameterized
  query.
- Next.js App Router/Proxy and TanStack Start/Router fixture applications,
  plus a React Router 7 native static data-router SSR fixture.
- Server-authorized AI suggestions, terminology/context quality scoring,
  human approval, optimistic revision checks, transactional persistence
  adapter, and audit history.
- Route/source/content security tests, axe-based browser accessibility checks,
  locale/keyboard/focus/forced-color checks, runtime/bundle benchmarks, and
  release test coverage.
- Production-built Next.js, TanStack, and React Router fixture apps covering
  direct loads, SSR/hydration, navigation, metadata, actions, and errors.
- User docs, security/accessibility/performance guides, package AI instructions,
  consumer registry, and package/root changelogs.

## Remaining work and blockers

- `E5-F5.5`: automated axe, keyboard, focus, language, reduced-motion, and
  forced-colors checks pass; manual testing with supported screen readers is
  still required.
- `bun run typecheck` currently fails in the unrelated site test
  `apps/site/src/components/theme-studio/theme-studio-model.test.ts` under the
  installed TypeScript 7 compiler. Package and framework-specific typechecks
  pass.
- `bun run seo:validate` currently fails the unrelated homepage carousel
  hydration assertion in `apps/site/scripts/validate-hydration.ts`. The site
  production build and i18n SEO unit tests pass.
- No production publish, live CMS credentials, provider service, or
  application-specific reviewer identity/authorization was exercised; those
  remain consuming-application responsibilities.

## Validation log

| Command | Result |
| --- | --- |
| `bun run --filter @puzzle-ui/i18n typecheck` | Passed. |
| `bun run --filter @puzzle-ui/i18n test:unit` | Passed: 17 files, 112 tests. |
| `bun run --filter @puzzle-ui/i18n test:package` | Passed: 3 package artifact tests. |
| `bun run --filter @puzzle-ui/i18n test:browser` | Passed: axe scan and browser keyboard, focus, locale, safe-text, forced-colors, reduced-motion, and provider-stability checks. |
| `bun run test:frameworks` | Passed: Next.js, TanStack, and React Router typecheck, SSR/render/browser tests, and production builds. |
| `bun run --filter '@puzzle-ui/site' build` | Passed: client, SSR, and server production builds; MDX and navigation validated. |
| `bun run benchmark:i18n` | Passed: root 658 B, React 7,217 B, DevTools 2,436 B; median lookup 0.22 μs; 32 namespace callers coalesced to 1 load. |
| `bun packages/create/src/ai/check.ts --write-index && bun run ai:check` | Passed: 15 public package tarballs and workspace package builds validated. |
| `bun run test:release` | Passed: 34 release workflow tests. |
| `bun run typecheck` | Failed: five TypeScript 7 errors in the unrelated theme-studio model test. |
| `bun run seo:validate` | Failed: unrelated homepage carousel hydration assertion. |
