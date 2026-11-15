# SEO, GEO and Performance Audit

Measurement date: 2026-11-15

## 1. Executive summary

The repository and deployed site were inspected before implementation. The
deployed homepage and documentation return server-rendered HTML with canonical
URLs, metadata and valid JSON-LD. The deployed sitemap is well-formed and every
listed URL returned HTTP 200 with a matching canonical during this audit. The
implementation now adds complete AI-readable documentation, repairs homepage
package discovery, and makes author and publisher entities consistent.

The baseline identified a missing `/llms-full.txt` endpoint, a homepage
Authentication link that points to Fullstack, missing Storage and Fullstack
ecosystem entries, and author metadata that identifies Puzzle UI rather than
the configured author. The initial source comparison counted only `.mdx`
files; `/docs/observability` and `/docs/production-release` are present as
`.md` sources and are included by the documentation source.

All implementation checks passed. Three-run post-change Lighthouse
measurements are complete. No ranking, AI-citation or real-user performance
improvement is claimed.

## 2. Technical SEO audit

| Area | Status | Evidence and limitations |
|---|---|---|
| Metadata | Present in initial HTML; sampled pages have unique title, description, Open Graph and Twitter values. The author meta tag said `Puzzle UI`; it now defaults to the configured Person name. | Baseline live responses; post-change hydration checks author, title, description, canonical, Open Graph and Twitter metadata on the homepage and documentation routes. |
| Canonical URLs | Present and HTTPS on all 117 deployed sitemap pages; each matched its sitemap URL. | Live sitemap and page responses; no redirects or missing canonicals were observed. |
| Sitemap | Valid XML with 117 unique URLs: homepage plus 116 documentation URLs. The earlier comparison counted only `.mdx`; the two noted routes are `.md` sources. Post-change local sitemap still has 117 unique URLs and includes every full-doc source URL. | Baseline live response and current production-build endpoint checks. |
| Robots.txt | HTTP 200, `text/plain; charset=utf-8`, permissive `Allow: /`, and references `https://puzzle-ui.com/sitemap.xml`. | Baseline live response; current production-build endpoint test verifies status, content type and sitemap reference. |
| Open Graph and Twitter | Present on sampled homepage and documentation pages; values match page titles/descriptions. | Live initial HTML. |
| Structured data | Baseline homepage SoftwareSourceCode lacked description, programming language, runtime platform and license. It now includes these values plus repository and shared Person/Organization references; documentation TechArticle nodes use the same author and publisher IDs. | Production-build hydration test parses JSON-LD and asserts these fields and relationships. |
| SSR and hydration | Page content and JSON-LD are server-rendered. Navigation, browser history and reload preserve metadata and structured data without hydration errors. | `bun run --filter '@puzzle-ui/site' test:hydration` passed. |
| Documentation discoverability | `llms.txt` now highlights package overviews and tutorials without duplicate links and points to `llms-full.txt`. The full endpoint returns 116 unique public documentation pages, preserving code fences and canonical links. | Current production-build endpoint and hydration checks; `/llms.txt` is 17,153 bytes and `/llms-full.txt` is 717,550 bytes in the local, uncompressed build. |

The deployed Getting Started page no longer contains the old “APIs changing
without notice” warning. One H1 was observed on the homepage and the sampled
documentation pages. Links across every page have not yet been exhaustively
crawled.

## 3. Homepage improvements

### Baseline

- The homepage presents eight ecosystem items.
- Authentication links to `/docs/fullstack`, although `/docs/auth` is the
  authentication package reference.
- Storage and a separate Fullstack item are missing.
- The homepage has one H1 and a canonical URL.
- Its description and social metadata describe the TypeScript-first React
  design system and broader ecosystem, but omit Storage.
- The SoftwareSourceCode node already references the existing Person,
  Organization and GitHub repository entities.

### Implementation and verification

- Centralized ten ecosystem links and descriptions in `apps/site/src/lib/homepage.ts`.
- Authentication links to `/docs/auth`; Fullstack links independently to
  `/docs/fullstack`; Storage has its own entry. Tests assert unique names and
  links, descriptions, and existing documentation targets.
- Updated the site description to mention Storage and the wider developer
  ecosystem; the homepage keeps one H1 and exposes ten discoverable package
  areas.
- Expanded SoftwareSourceCode JSON-LD with verified project facts: repository,
  TypeScript, React and the MIT license URL. Its author and publisher link to
  the same Person and Organization nodes used elsewhere.

## 4. GEO improvements

### Baseline

- `llms.txt` is generated from `source.getPages()`, uses absolute canonical
  URLs, and includes the source repository and API maturity note.
- The deployed `llms.txt` does not reference `llms-full.txt`.
- The deployed `llms-full.txt` endpoint returns 404.
- Root and documentation author metadata currently use “Puzzle UI”, while
  structured data identifies Sjoerd van den Berg and Señor Programador.
- Package overviews and SEO, Auth and Storage tutorials exist in the current
  source tree.

### Implementation and verification

- `/llms.txt` features the Getting Started page, package overviews, and
  tutorials, then lists remaining documentation once in deterministic order.
  It links to `/llms-full.txt`.
- Added a cached `/llms-full.txt` text endpoint generated from all public
  Fumadocs pages. The exporter handles both `.md` and `.mdx` source files,
  strips frontmatter and MDX-only syntax, preserves Markdown structure, code,
  tables and links, and canonicalizes internal links.
- Post-build checks found 116 unique source URLs; all are included in the
  117-entry sitemap. Repeat requests return identical full-document output.
- Root and documentation JSON-LD reference shared author and publisher IDs;
  root metadata author now matches the configured Person.

## 5. Performance methodology

Lighthouse 13.6.0 ran against the local production build using Chromium 158,
with three runs per route and device; tables show medians. Mobile uses
Lighthouse's simulated mobile profile (150 ms RTT, 1,638 Kbps throughput, 4x
CPU slowdown); desktop uses the desktop preset. The seven representative routes
are the homepage, Getting Started, UI overview, Button, SEO, Auth tutorial and
Storage tutorial.

The local Nitro server does not compress responses; Lighthouse transfer sizes
are therefore not directly comparable to live CDN gzip transfer. These are
lab measurements, not CrUX/Search Console field data. The baseline Vite build
reported a 1,563.45 kB `seo` JavaScript chunk (288.81 kB gzip) and a chunk-size
warning. The post-change build reports 1,563.64 kB (288.89 kB gzip), not a
meaningful size change. Accessibility scores were 96–100 across the sample;
Best Practices and SEO scores were 100 throughout.

| Item | Result |
|---|---|
| Measurement date | 2026-11-15 |
| Environment and browser | macOS host; Chromium 158 |
| Lighthouse version | 13.6.0 |
| Build | `bun run --filter '@puzzle-ui/site' build` passed before and after changes |
| Device profiles and routes | Simulated mobile and desktop; seven routes listed above |
| Runs and median | Three runs per route/device; median reported |
| Lab or field data | Lighthouse lab data only; no CrUX/Search Console field data |

## 6. Performance baseline

Baseline results from the unchanged production build. LCP, TBT and Speed Index
are milliseconds; CLS is unitless. Large LCP variation on `/docs/ui` and
`/docs/seo` indicates noisy local lab measurements.

| Route | Device | Performance | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|
| `/` | Mobile | 75 | 2,404 | 0 | 13 | 2,402 |
| `/` | Desktop | 100 | 562 | 0 | 0 | 562 |
| `/docs/getting-started` | Mobile | 84 | 3,453 | 0 | 0 | 3,453 |
| `/docs/getting-started` | Desktop | 100 | 683 | 0 | 0 | 682 |
| `/docs/ui` | Mobile | 68 | 13,655 | 0 | 0 | 3,303 |
| `/docs/ui` | Desktop | 100 | 683 | 0 | 0 | 683 |
| `/docs/ui/actions/button` | Mobile | 78 | 3,604 | 0 | 242 | 3,604 |
| `/docs/ui/actions/button` | Desktop | 99 | 734 | 0 | 21 | 734 |
| `/docs/seo` | Mobile | 85 | 3,306 | 0 | 0 | 3,306 |
| `/docs/seo` | Desktop | 87 | 2,407 | 0 | 0 | 683 |
| `/docs/tutorials/auth` | Mobile | 69 | 4,955 | 0 | 0 | 4,954 |
| `/docs/tutorials/auth` | Desktop | 98 | 925 | 0 | 0 | 924 |
| `/docs/tutorials/storage` | Mobile | 80 | 3,756 | 0 | 0 | 3,754 |
| `/docs/tutorials/storage` | Desktop | 99 | 723 | 0 | 0 | 723 |

## 7. Performance improvements

No performance optimization was made without evidence that it would address a
user-facing bottleneck. Script transfer sizes changed by at most 228 bytes per
route and stylesheet transfer sizes were unchanged. The `seo` chunk warning
remains a follow-up for bundle analysis rather than an assumed regression.

## 8. Before/after measurements

Each cell shows the three-run median as baseline → post-change. LCP, TBT and
Speed Index are milliseconds; CLS is unitless.

| Route | Device | Performance | LCP | CLS | TBT | Speed Index |
|---|---|---:|---:|---:|---:|---:|
| `/` | Mobile | 75 → 93 | 2,404 → 2,553 | 0 → 0 | 13 → 8 | 2,402 → 2,553 |
| `/` | Desktop | 100 → 100 | 562 → 563 | 0 → 0 | 0 → 0 | 562 → 562 |
| `/docs/getting-started` | Mobile | 84 → 84 | 3,453 → 3,455 | 0 → 0 | 0 → 0 | 3,453 → 3,454 |
| `/docs/getting-started` | Desktop | 100 → 100 | 683 → 683 | 0 → 0 | 0 → 0 | 682 → 683 |
| `/docs/ui` | Mobile | 68 → 85 | 13,655 → 3,306 | 0 → 0 | 0 → 0 | 3,303 → 3,306 |
| `/docs/ui` | Desktop | 100 → 100 | 683 → 686 | 0 → 0 | 0 → 0 | 683 → 684 |
| `/docs/ui/actions/button` | Mobile | 78 → 77 | 3,604 → 3,604 | 0 → 0 | 242 → 257 | 3,604 → 3,604 |
| `/docs/ui/actions/button` | Desktop | 99 → 87 | 734 → 2,447 | 0 → 0 | 21 → 25 | 734 → 724 |
| `/docs/seo` | Mobile | 85 → 85 | 3,306 → 3,305 | 0 → 0 | 0 → 0 | 3,306 → 3,305 |
| `/docs/seo` | Desktop | 87 → 87 | 2,407 → 2,406 | 0 → 0 | 0 → 0 | 683 → 684 |
| `/docs/tutorials/auth` | Mobile | 69 → 69 | 4,955 → 4,953 | 0 → 0 | 0 → 0 | 4,954 → 4,953 |
| `/docs/tutorials/auth` | Desktop | 98 → 98 | 925 → 932 | 0 → 0 | 0 → 0 | 924 → 923 |
| `/docs/tutorials/storage` | Mobile | 80 → 80 | 3,756 → 3,755 | 0 → 0 | 0 → 0 | 3,754 → 3,755 |
| `/docs/tutorials/storage` | Desktop | 99 → 99 | 723 → 724 | 0 → 0 | 0 → 0 | 723 → 724 |

Across the seven selected routes, the median route-level performance score
changed from 78 to 84 on mobile and from 100 to 99 on desktop. Treat these
differences cautiously: `/docs/ui` mobile LCP was 13.7 s in two baseline runs
but about 3.3 s in all post-change runs; Button desktop LCP was about 2.4 s in
two post-change runs and in one baseline run. This variability is not evidence
that the SEO changes caused a performance gain or regression.

## 9. Core Web Vitals

No field data from CrUX or Search Console was collected. The 75th-percentile
LCP, INP and CLS status is therefore unavailable. Lighthouse lab measurements,
including Total Blocking Time, will not be represented as field INP.

## 10. Test results

| Check | Baseline result |
|---|---|
| Production site build | Passed |
| Live sitemap XML parsing | Passed; 117 unique entries |
| Live sitemap URL status/canonical check | Passed; all 117 returned 200, with no redirects and matching canonicals |
| Live robots.txt | Passed; permissive rule and correct sitemap URL |
| Live `llms.txt` | Passed for status/content type; missing full-document link |
| Live `llms-full.txt` | Failed; endpoint returns 404 |
| Live JSON-LD parsing | Passed for homepage and sampled documentation pages |
| Hydration, typecheck and site tests | Not run at baseline |

Post-change checks:

| Check | Result |
|---|---|
| Production site build | Passed |
| Site typecheck | Passed |
| SEO, homepage and Markdown tests | Passed; 14 tests |
| Tutorial validation | Passed; 17 TypeScript examples, four tutorial routes, metadata, navigation and reference links |
| Production hydration and structured data | Passed; metadata, author/publisher IDs, SoftwareSourceCode fields, navigation, history and reload |
| Discoverability endpoints | Passed; unique `llms.txt` links, deterministic 116-page `llms-full.txt`, preserved code and canonical links |
| Sitemap and robots | Passed; all 116 documentation source URLs plus homepage match the unique sitemap; robots references sitemap |
| Diff whitespace check | Passed |

Database tutorial examples were not executed because an isolated
`TUTORIAL_MONGODB_URI` was not configured.

## 11. Outstanding recommendations

- **P0:** None identified in the checks performed.
- **P1:** Deploy these changes, then repeat endpoint, canonical, metadata,
  structured-data and performance checks against the deployed site.
- **P2:** Inspect the emitted JavaScript chunk warning for route-level impact
  before optimizing. Exhaustively validate internal documentation
  destinations.
- **P3:** Collect CrUX or Search Console field data if available; do not infer
  it from lab scores.

## 12. Final assessment

Implementation, regression checks and three-run lab measurements are complete.
Performance scores were broadly similar with route-level outliers; the
discoverability and metadata fixes have no demonstrated field-performance
effect. Search rankings, AI citations and real-user Core Web Vitals have not
been measured.

## Follow-up validation — DataTable working-tree build

The subsequent SEO/GEO completion work added deterministic sitemap and robots
route tests and an external endpoint validator. The site build and typecheck
passed. The validator passed against both production and the local production
build:

| Check | Live production | Local production build |
|---|---:|---:|
| Sitemap URLs | 117 | 118 |
| Pages checked; all 200 with matching canonical and no redirects | 117 | 118 |
| Unique titles/descriptions | 117 / 117 | 118 / 118 |
| Documentation pages; orphan pages | 116; 0 | 117; 0 |
| Distinct internal documentation links | 1,800 | 1,826 |
| Robots, `llms.txt`, and `llms-full.txt` | Passed | Passed |

The sole local-only sitemap URL is
`/docs/ui/data-display/data-table`; it remains a production 404. No deployment
was attempted. These endpoint checks do not replace Lighthouse or field
measurements. Lighthouse was not rerun because the existing seven-route lab
sample does not include DataTable and no performance regression has been
established. The existing Lighthouse results remain lab-only and no CrUX or
Search Console data was collected. Detailed endpoint methodology and
limitations are in the [validation report](./seo-geo-validation-report.md).
