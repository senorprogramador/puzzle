# Multilingual quality gates

## Package gates

Run from the repository root:

```sh
bun run --filter @puzzle-ui/i18n typecheck
bun run --filter @puzzle-ui/i18n test:unit
bun run --filter @puzzle-ui/i18n test:package
bun run --filter @puzzle-ui/i18n test:browser
bun run benchmark:i18n
```

The package gates cover ICU/runtime behavior, locale fallback and concurrent
translator isolation, routing/base-path safety, catalog validation and source
loading, React rendering and lazy namespace behavior, compiler transforms and
generated types, SEO/sitemap validation, Sanity/content preview/version
behavior, AI authorization/quality/review transactions, CLI config execution,
DevTools tree-shaking, artifact contents, axe rules, keyboard/focus behavior,
language attributes, safe text rendering, provider stability, and bundle and
lookup budgets.

## Integration and release gates

| Gate | Command | Result |
| --- | --- | --- |
| Next.js, TanStack, and React Router typecheck, SSR/render/browser tests, production builds | `bun run test:frameworks` | Passed. |
| React Router package-level static loader/action/metadata/SSR contract | `bun run --filter @puzzle-ui/i18n test:unit` | Passed within 17 files and 112 tests. |
| Docs, MDX, and site navigation | `bun run --filter '@puzzle-ui/site' build` | Passed: production client, SSR, and server builds. |
| Package registry and packed consumer guidance | `bun packages/create/src/ai/check.ts --write-index && bun run ai:check` | Passed: 15 public package tarballs and workspace builds. |
| Release/changelog workflow tests | `bun run test:release` | Passed: 34 tests. |
| Root workspace typecheck | `bun run typecheck` | Failed in `apps/site/src/components/theme-studio/theme-studio-model.test.ts` with TypeScript 7 errors; package and app-specific checks pass. |
| Site SEO/hydration validation | `bun run seo:validate` | Failed on the unrelated homepage carousel hydration assertion in `apps/site/scripts/validate-hydration.ts`; package SEO tests pass. |
| Manual screen-reader testing on supported assistive-technology environments | Manual verification | Still open; see [`backlog.md`](./backlog.md). |

Benchmark budgets currently enforced are 64 KiB for the root ESM entry, 32 KiB
for React, 32 KiB for DevTools, 100 μs median warm lookup, and one namespace
source load for 32 concurrent callers. The last run measured 658 B, 7,217 B,
2,436 B, 0.22 μs, and one load, respectively.

Do not mark an item Done until its required checks have been executed and their
results are recorded in [`progress.md`](./progress.md).
