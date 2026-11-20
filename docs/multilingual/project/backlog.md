# Multilingual implementation backlog

Status reflects implementation and required evidence, not design intent. A
feature is **Done** only when its acceptance criteria, tests, documentation,
exports, and build requirements are all satisfied. Current scope is deliberately
kept in one public workspace package with isolated subpaths; future framework
adapters or sources may become independent packages if dependency boundaries
require them.

| ID | Epic / feature | Status | Acceptance criteria | Dependencies | Tests and documentation |
| --- | --- | --- | --- | --- | --- |
| E1-F1.1 | Repository discovery | Done | Workspace, package, SEO, docs, build, and test conventions are recorded against current manifests and indexes. | — | Repository manifests and architecture maps reviewed; keep maps synchronized. |
| E1-F1.2 | Architecture design | Done | Package boundary, public subpaths, client boundary, ICU dependency, and SEO relationship are documented. | E1-F1.1 | `architecture-decisions.md`, `dependency-graph.md`. |
| E1-F1.3 | Project foundation | Done | Workspace package builds ESM/CJS declarations with explicit subpaths and optional React peer; current package artifacts and exports are validated. | E1-F1.2 | `@puzzle-ui/i18n` typecheck/build/package tests; package README. |
| E1-F1.4 | Documentation foundation | Done | User docs, consumer AI guidance, internal package guidance, site navigation, and AI indexes cover all currently shipped APIs and limitations. | E1-F1.2, E1-F1.3 | Site build, `ai:check`, generated package registry. |
| E1-F1.5 | Quality infrastructure | In Progress | Package tests, typecheck, build, package artifacts, docs, AI pack, framework fixtures, performance, accessibility, and release tests pass; root workspace typecheck and the site SEO/hydration suite still fail in unrelated site checks. | E1-F1.3, E1-F1.4 | Package, framework, browser, release, root typecheck, and site validation commands; see `QUALITY-GATES.md`. |
| E2-F2.1 | Locale registry | Done | Canonical BCP 47 tags, aliases, metadata, defaults, and supported locale lookup are validated. | E1-F1.3 | `src/tests/locale.test.ts`; locale guide. |
| E2-F2.2 | Locale resolution | Done | Explicit, URL, user preference, cookie, Accept-Language, browser, and default sources resolve in documented priority order. | E2-F2.1 | Priority, q-value, invalid-input tests; locale guide. |
| E2-F2.3 | Fallback engine | Done | Regional/base, explicit, fallback, and default locales resolve deterministically without cycles. | E2-F2.1 | Fallback chain and missing/fallback callback tests; runtime guide. |
| E2-F2.4 | Translation runtime | Done | Typed nested keys and ICU messages resolve with fallback and missing-key behavior; lazy namespace loading merges immutable catalogs and surfaces loading failures. | E2-F2.1, E2-F2.3, E3-F3.1 | Runtime, React hook, and namespace tests; translations guide. |
| E2-F2.5 | SSR-safe runtime | Done | Translators are immutable per locale and concurrent lookups stay isolated; framework SSR/hydration, cancellation, and request-scoped cache behavior are exercised by runtime and native fixture tests. | E2-F2.4, E5-F5.1 | Runtime, React SSR, Next.js, and TanStack rendering tests; framework guide. |
| E3-F3.1 | Message syntax | Done | ICU syntax, interpolation, plural/select, number/date/time styles, and typed React rich-text rendering use FormatJS; catalog validation reports malformed messages. | E2-F2.4 | Runtime, React rich-text, and compiler diagnostics tests; translations guide. |
| E3-F3.2 | International formatting | Done | Number, currency, date, relative-time, and list formatting delegate to platform `Intl`. | E2-F2.1 | Add boundary/timezone tests; API reference. |
| E3-F3.3 | Compiler | Done | Catalog checks, TypeScript AST extraction/transforms, unused/missing-key scans, catalog pruning, and Vite validation work with source maps and actionable diagnostics. | E3-F3.1 | Compiler/Vite tests; compiler integration guide. |
| E3-F3.4 | Type generation | Done | Runtime keys and required placeholders are typed; generated declarations preserve locale-specific shapes and common keys across locale differences. | E2-F2.4, E3-F3.3 | Type-contract tests and generated consumer fixture compilation. |
| E3-F3.5 | Compiler integrations | Done | The Vite plugin watches configured catalogs/source paths, reruns checks in builds, and emits actionable diagnostics; it does not transform source, so source maps are unchanged. | E3-F3.3, E3-F3.4 | Real Vite build test and compiler reference. |
| E4-F4.1 | Routing foundation | Done | Locale prefixes, default-prefix policy, URL parsing/generation, route matching, domain origins, and validated base paths work on safe paths. | E2-F2.1 | Routing and request-adapter tests; route guide. |
| E4-F4.2 | Advanced routing | Done | Typed route maps support locale-specific slugs, whole-segment parameters, aliases, canonical redirect targets, alternate links, and locale origins while preserving queries/hashes. | E4-F4.1 | Routing/security tests and localized-routing guide. |
| E4-F4.3 | SEO routing | Done | Canonical/hreflang metadata, localized sitemap entries, locale-specific origins, Puzzle SEO serialization, Open Graph values, and framework metadata integration are implemented. | E4-F4.1, E7-F7.1 | SEO/sitemap and framework metadata tests; docs. |
| E4-F4.4 | Routing security | Done | External, protocol-relative, malformed, traversing, and out-of-base paths are rejected; redirect and host behavior is explicit and tested. | E4-F4.1, E4-F4.2 | Adversarial route tests and security guide. |
| E5-F5.1 | React provider | Done | A provider factory gives a render tree its own stable locale translator without global state; nested providers, overlapping streaming SSR, and framework hydration are tested. | E2-F2.4, E2-F2.5 | React SSR/concurrency tests and provider docs. |
| E5-F5.2 | React hooks | Done | Typed translation/locale hooks, formatter hooks, rich translation, namespace state, and locale diagnostics are implemented. | E5-F5.1, E3-F3.2 | Hook tests and React API docs. |
| E5-F5.3 | React components | Done | Accessible locale selection, typed translation/rich-text components, and locale-bound Intl formatting components are implemented. | E5-F5.1, E3-F3.1 | Component behavior tests and examples. |
| E5-F5.4 | Performance | Done | Lookup, provider stability, lazy-load coalescing, formatter memoization, and bundle sizes meet measured budgets. | E2-F2.4, E5-F5.1 | Benchmark, browser provider-stability test, and performance docs. |
| E5-F5.5 | Accessibility | In Progress | Axe, accessible-name, keyboard typeahead, focus, language/direction, reduced-motion, forced-colors, and safe-text browser checks pass; manual assistive-technology testing remains. | E5-F5.3 | Browser accessibility tests and accessibility guide. |
| E6-F6.1 | Next.js integration | Done | App Router params, Proxy locale resolution, metadata, static generation, request caching, and streaming work in a real fixture. | E2-F2.5, E4-F4.2, E5-F5.1, E7-F7.1 | Next fixture type/build/SSR/hydration tests and guide. |
| E6-F6.2 | TanStack integration | Done | Start/Router context, loaders, server functions, SSR, navigation, and search params use supported native APIs. | E2-F2.5, E4-F4.2, E5-F5.1 | TanStack fixture type/build/SSR tests and guide. |
| E6-F6.3 | React Router integration | Done | Loaders, actions, metadata, static SSR, navigation, and localized route matching work with React Router 7 native APIs. | E2-F2.5, E4-F4.2, E5-F5.1 | React Router static fixture and compatibility guide. |
| E6-F6.4 | Framework compatibility | Done | Next.js, TanStack, and React Router fixture apps verify direct loads, route changes, SSR/hydration, metadata, actions, and error behavior through production builds. | E6-F6.1, E6-F6.2, E6-F6.3 | `bun run test:frameworks` production-build and browser/rendering matrix. |
| E7-F7.1 | SEO integration | Done | Localized canonical, hreflang, Open Graph, and framework metadata feed Puzzle SEO without a second SEO engine. | E4-F4.3 | SEO package compatibility tests and metadata docs. |
| E7-F7.2 | Structured data | Done | Schema.org `inLanguage` is canonicalized, conflicts are rejected, and entity URLs are checked against canonical metadata. | E7-F7.1 | Structured-data tests and docs. |
| E7-F7.3 | Sitemap | Done | Localized URLs and reciprocal alternates are generated through Puzzle SEO; external locale origins require explicit permission. | E4-F4.2, E7-F7.1 | Sitemap generation/validation tests and docs. |
| E7-F7.4 | SEO validation | Done | Missing locale paths, unsupported locale keys, unsafe paths, prefix mismatches, duplicate canonicals, canonical conflicts, and hreflang mismatches are diagnosed. | E7-F7.1, E7-F7.2, E7-F7.3 | SEO diagnostics tests and docs. |
| E8-F8.1 | Local content | Done | In-memory, Node filesystem JSON, and TypeScript catalog sources support schema validation; locale fallback and localized slugs resolve deterministically. | E2-F2.4, E4-F4.2 | Source and content-resolution tests/docs. |
| E8-F8.2 | Remote sources | Done | HTTP JSON loading supports caller headers, timeout, cache, invalidation, retries, abort signals, explicit errors, and an injected-client Sanity content source. | E8-F8.1 | HTTP/CMS behavior and security tests/docs. |
| E8-F8.3 | Content resolution | Done | Locale fallback, version matching, publication/draft filtering, missing content, and preview behavior are deterministic through an injected CMS source. | E8-F8.1, E8-F8.2 | Resolution tests and content guide. |
| E8-F8.4 | Content security | Done | Catalogs and CMS records are validated/frozen, HTTP and filesystem boundaries are constrained, preview authorization remains host-owned, and untrusted interpolation renders as text. | E8-F8.2, E8-F8.3 | Source/content security tests and security guide. |
| E9-F9.1 | CLI foundation | Done | The package binary parses arguments, prints help/version, returns meaningful exit codes, and is verified from the built package. | E1-F1.3 | CLI and package artifact tests. |
| E9-F9.2 | Initialization | Done | Framework detection and initialization create a JSON config and locale catalogs without overwriting existing target files. | E9-F9.1, E6-F6.4 | CLI fixture tests and getting-started docs. |
| E9-F9.3 | CLI validation | Done | CLI validates catalogs, generates declarations, scans static source keys, reports missing/unused/dynamic keys, and loads validated project config by default. | E3-F3.3, E3-F3.4, E9-F9.1 | CLI and packaged execution tests. |
| E9-F9.4 | DevTools | Done | The separate React diagnostics panel records runtime events; request adapters report configured route outcomes with parameter-free templates. | E2-F2.4, E4-F4.2, E5-F5.1 | Diagnostic, production-bundle, and package-boundary tests/docs. |
| E9-F9.5 | CLI documentation | Done | Initialization, config loading, validation/typegen, scanning, troubleshooting, migration, and limitations are documented. | E9-F9.1, E9-F9.2, E9-F9.3 | CLI docs, site build, and links. |
| E10-F10.1 | AI provider abstraction | Done | Providers are injected, browser calls are blocked, concurrency is rate-limited, failures are classified, and an authorization wrapper fails closed; identity remains application-owned. | E3-F3.1 | Provider contract tests and security docs. |
| E10-F10.2 | Translation assistance | Done | Suggestions validate ICU syntax and placeholder parity, provide terminology/context quality scoring, and never auto-apply. | E10-F10.1 | Suggestion and quality tests; AI guide. |
| E10-F10.3 | Review workflow | Done | Human approval, optimistic revision checks, change records, and audit history support in-memory and transactional persistence adapters; reviewer identity remains application-owned. | E10-F10.2, E8-F8.3 | Workflow, persistence, authorization, and audit tests/docs. |
| E10-F10.4 | Quality and release | In Progress | Quality scoring, performance/bundle baselines, changelogs, package artifacts, and release workflow checks pass; root workspace typecheck and site SEO/hydration gates remain blocked by unrelated site errors. | E3-F3.5, E6-F6.4, E10-F10.3 | Package/framework matrix, benchmarks, artifact and release checks, migration/release docs. |

## Definition of done for every task

- Production implementation is complete, typed, explicit, and within its package
  boundary; no placeholder or success-shaped fallback remains.
- Focused unit/type/integration/security/accessibility/performance tests exist
  where relevant and pass.
- Public exports, package artifacts, user docs, AI instructions, and examples
  match the implementation.
- Relevant package and consumer builds pass; exact validation commands/results
  are recorded in [`progress.md`](./progress.md).
