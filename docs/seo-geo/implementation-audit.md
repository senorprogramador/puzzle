# SEO/GEO implementation audit

Audit date: 2026-11-16  
Repository: `senorprogramador/puzzle`  
Canonical website: <https://puzzle-ui.com>

## Scope and implementation facts

The brief's SolidJS/SolidStart constraint does not match this repository. The
website uses TanStack Start/Router and Fumadocs; keep new work within that
existing architecture. The site currently publishes English content only.
Do not create locale alternates for `/nl`, `/es`, or `/de` until translated
pages exist.

The repository already has substantial SEO/GEO functionality. This task should
extend it rather than add another metadata or JSON-LD system.

| Area | Existing implementation | Evidence and limitations |
|---|---|---|
| Metadata and SSR | Shared site metadata helpers and TanStack head descriptors produce server-rendered titles, descriptions, canonical, robots, Open Graph, and Twitter metadata. | `apps/site/src/lib/seo.ts`; `apps/site/src/routes/__root.tsx`; documentation route metadata in `apps/site/src/routes/docs/$.tsx`. |
| Canonical URLs | Canonical normalization fixes the production origin, removes query/fragment values, and follows a no-trailing-slash policy except for `/`. | `apps/site/src/lib/seo.ts`; covered by `apps/site/src/lib/seo.test.ts`. |
| Sitemap and robots | Existing route handlers use the shared `@puzzle-ui/seo` utilities. Sitemap sources are the homepage and Fumadocs pages; robots allows crawling and advertises the canonical sitemap. | `apps/site/src/lib/seo-routes.ts`; route tests in `apps/site/src/lib/seo-routes.test.ts`. |
| Structured data | Shared site graph includes Organization, Person, WebSite, and homepage WebPage. Documentation pages provide WebPage, TechArticle, BreadcrumbList, and page-specific FAQPage when declared. | `apps/site/src/routes/__root.tsx`; `apps/site/src/routes/docs/$.tsx`; implementation and validation support in `packages/seo`. |
| AI-readable documentation | `/llms.txt` and `/llms-full.txt` are generated from public documentation pages. | Existing reports: [SEO/GEO validation](../seo-geo-validation-report.md) and [completion audit](../seo-geo-completion-audit.md). Historical counts must be refreshed before reuse. |
| Machine-readable project facts | `/.well-known/puzzle.json` serves public project and package information sourced from package manifests through an allowlist. | `apps/site/src/lib/project-information.ts`; `apps/site/src/routes/[.]well-known.puzzle[.]json.ts`; `apps/site/src/lib/project-information.test.ts`. |
| Homepage and package discovery | The homepage links to ten distinct ecosystem areas; the repository README describes independently installable packages, maturity, and framework boundaries. | `apps/site/src/lib/homepage.ts`; `README.md`; `apps/site/src/lib/homepage.test.ts`. |
| Documentation maturity | Stable, Beta, and Experimental distinctions are documented; Beta does not promise production readiness. | `apps/site/content/docs/tutorials/index.mdx`; [API stability audit](../api-stability-audit.md). |
| Trust and maintenance | MIT license, contribution guide, security policy, changelog, roadmap, and package-level release histories exist. | `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `ROADMAP.md`. |
| Localization | English (`en-US`) is configured. No translated routes or alternate-language URLs are currently advertised. | `apps/site/src/lib/seo.ts`; current metadata and page source inventory. |
| Performance and measurement | A Lighthouse lab audit and a production/local endpoint report exist. No Search Console or CrUX field data is available in the repository. | [Performance audit](../seo-geo-performance-audit.md); [validation report](../seo-geo-validation-report.md). |

## Findings and decisions

1. Added narrative About and Architecture pages, a Page Sections overview, and
   a Developer Tools overview. Existing UI, Theme, Authentication, and SEO
   documentation already addresses those product intents; separate
   `/react-*` copies were not added because they would substantially duplicate
   authoritative package guides.
2. The homepage, header, and documentation navigation now link to the new
   overview content. The architecture page distinguishes package boundaries,
   app responsibilities, and API maturity.
3. Added `/.well-known/puzzle.json` as a stable public JSON resource generated
   from allowlisted package manifest facts. Do not include private build
   settings or infer downloads, pricing, adoption, or release details.
4. `SoftwareApplication` is supported by `@puzzle-ui/seo`, but was not added
   to the site graph: Puzzle is an open-source package ecosystem rather than a
   hosted application listing. Existing Organization, WebSite, WebPage, and
   SoftwareSourceCode representations are more precise; no availability,
   offer, rating, or download claim is needed.
5. Keep the existing reports' production and local counts date-scoped. The
   November 15, 2026 reports describe a local-only DataTable route; those
   counts and deployment observations are not current production evidence.
6. The GitHub CLI in the current environment is unauthenticated, so repository
   description, topics, and settings cannot be verified or changed here.
7. Search Console, CrUX, external AI citations, npm traffic, and field Core Web
   Vitals are unavailable. Do not infer rankings, citations, or adoption from
   repository changes.
8. Locale support is English-only. Hreflang and translated canonical behavior
   should remain dormant until actual translated pages are maintained.
9. Existing metadata, sitemap, robots, and package validation is strong, but
   results should be refreshed against the current build before a release.
10. The new JSON endpoint and content pages are in the local source build; they
    require the normal site deployment before they are available on production.

## Validation

| Command | Result |
|---|---|
| `bun run --filter '@puzzle-ui/site' test:seo` | Passed after implementation: 20 tests, 72 assertions |
| `bun run --filter '@puzzle-ui/site' test:sitemap` | Passed: 2 tests, 9 assertions |
| `bun run --filter '@puzzle-ui/seo' test:unit` | Passed: 391 tests |
| Focused content and homepage tests | Passed: 4 tests, 137 assertions |
| `bun test apps/site/src/lib/project-information.test.ts` | Passed |
| `bun run --filter '@puzzle-ui/site' typecheck` | Passed |
| `bun run --filter '@puzzle-ui/site' build` | Passed |
| `SITE_URL=http://127.0.0.1:4173 bun run --filter '@puzzle-ui/site' test:seo:smoke` | Passed against local production build: 128 unique canonical URLs and metadata sets; 127 documentation pages; 2,139 internal edges; 0 orphan pages; robots and GEO endpoints passed. |
| `git diff --check` | Passed |

The endpoint smoke test used the local production server; it is not a live
production crawl or field-performance measurement. See the
[implementation report](./implementation-report.md) for completed work,
evidence-based scores, and remaining actions.
