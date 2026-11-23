# SEO discoverability implementation report

Report date: 2026-11-22  
Canonical site: <https://puzzle-ui.com>

## 1. Executive summary

Puzzle already had server-rendered metadata, canonical normalization, sitemap
and robots handlers, structured data, AI-readable docs endpoints, and broad
documentation coverage. This update extended those systems rather than
replacing them. It clarifies homepage positioning, assigns distinct search
intents to selected component and package pages, improves package and
documentation discoverability, corrects the machine-readable package list,
and records evidence-limited keyword, authority, and monitoring plans.

No ranking, search-volume, traffic, backlink, or AI-citation improvement is
claimed. The site was built and crawled locally; no deployment or external
account change was performed.

## 2. Initial findings

- The homepage already used a real component preview and links to Getting
  Started, UI docs, and GitHub, but had no npm link and omitted Media, CMS,
  Commerce, and payment-provider areas from its ecosystem cards.
- Homepage and UI overview copy overlapped on broad component-library intent.
  The map did not explicitly assign query ownership to important individual
  component pages or several package overviews.
- About content described Pieces as only Hero layouts, despite the catalog
  documenting 67 section families.
- Several npm homepage URLs were less relevant than existing package overview
  routes; the payment-provider manifest pointed to a nonexistent `/docs/payments`
  route instead of `/docs/payment-providers`.
- `/.well-known/puzzle.json` omitted the published `@puzzle-ui/commerce` and
  `@puzzle-ui/payment-providers` packages. The package-information test exposed
  the gap; the endpoint now includes both and explicitly tests the unpublished
  Media/CMS workspace status.
- Existing SEO/GEO reports describe earlier dated builds and are retained as
  historical evidence, not current production measurements.

## 3. Keyword research highlights

The qualitative opportunity map and full UI component inventory are in
[keyword-research.md](./keyword-research.md). It distinguishes package-based
libraries, source-copy systems, unstyled primitives, community registries,
Tailwind plugins, and component-development tools. It prioritizes real,
documented Puzzle capabilities and avoids thin comparison pages.

## 4. Competitor analysis

First-party positioning and documentation were reviewed for shadcn/ui, MUI,
Mantine, Chakra UI, Ant Design, daisyUI, Storybook, Magic UI, 21st.dev,
Aceternity UI, React Bits, HeroUI, Radix UI, and Park UI. The sources and
product-model distinctions are recorded in [keyword research](./keyword-research.md).
The review does not establish competitor rankings, traffic, or backlink totals.

## 5. Existing SEO functionality

Preserved and reused:

- SSR metadata, Open Graph/Twitter metadata, canonical URL normalization, and
  English-only locale behavior in the site.
- Shared `@puzzle-ui/seo` graph and framework integrations.
- Sitemap and robots handlers sourced from the public Fumadocs page inventory.
- Documentation WebPage, TechArticle, BreadcrumbList, and declared FAQ schema.
- `/llms.txt`, `/llms-full.txt`, and `/.well-known/puzzle.json`.
- Existing route, link, anchor, sitemap, metadata, structured-data, and orphan
  checks in the local production smoke validator.

No new SEO package, schema framework, crawler policy, or route was added.

## 6. Improvements implemented

- Refocused homepage title/H1/description on a TypeScript-first React
  component library while retaining the broader ecosystem overview.
- Added four ecosystem cards for pre-release Media and CMS, Commerce, and
  payment-provider adapters, with release status stated accurately.
- Added contextual footer links to package areas, GitHub, and `@puzzle-ui/ui`
  on npm.
- Clarified that Pieces composes sections and does not provide complete
  website templates.
- Added query ownership for selected Button, Date Picker, Select, Dialog,
  Text Editor, DataTable, Hero, Features, Pricing, Testimonials, FAQ, and CTA
  references, plus About, Architecture, Commerce, CMS, Media, Cloudflare Media,
  and payment-provider pages.
- Updated package descriptions and documentation links where the manifests
  were too narrow or pointed to a less relevant route; synchronized affected
  package README links and descriptions.
- Used Search Console query-to-page evidence to improve the title and
  description for the existing metadata reference without changing its URL.
- Added a regression assertion that every non-private package homepage points
  to a real Puzzle documentation route.

## 7. New and updated pages

New strategy documents:

- [Keyword research](./keyword-research.md)
- [External authority strategy](./external-authority-strategy.md)
- [Monitoring strategy](./monitoring-strategy.md)

Updated site docs include the About page, UI and editor overviews, Fullstack
overview, metadata reference, and selected Pieces section references. Existing
URLs were preserved. No tutorial or competitor-comparison page was added.

## 8. Metadata changes

- Homepage search metadata is now `React Component Library and Design System`;
  the rendered title is `Puzzle UI | React Component Library and Design System`.
- Homepage H1 is “A TypeScript-first React component library.”
- `/docs/seo/metadata` now uses `Website Metadata and Canonical URLs`, matching
  measured query intent; the route and canonical are unchanged.
- UI overview now owns React UI component browsing rather than broad library
  selection; selected component and package pages have distinct primary
  intents and canonical mappings.
- Site-wide project description now includes the broader application package
  areas.
- `@puzzle-ui/core`, `@puzzle-ui/session`, `@puzzle-ui/pieces`, and
  `@puzzle-ui/payment-providers` now link to the most relevant existing
  documentation route. Storage and Fullstack descriptions/keywords now reflect
  their current wider responsibilities. Core, Session, Storage, Pieces, and
  Payment Providers README entry points now agree with those routes and the
  current package/documentation scope.

Package versions were not changed and no package was published.

## 9. Structured data

No Schema.org type or graph behavior changed. The shared site description
continues to feed the existing structured-data graph. The project-information
JSON endpoint now lists the two published packages that were missing; its
availability handling remains explicit for unpublished workspace packages.
Local tests validate package facts and public response shape. No rich result
or ranking is promised.

## 10. Technical SEO

Existing canonical, robots, sitemap, server rendering, JSON-LD, and
AI-readable endpoint implementations were reused. The component/package
search-intent map and tests now cover more high-priority pages. The local
production smoke crawl verified that the changed content did not create
canonical, indexing, metadata, structured-data, broken-link, or orphan-page
regressions.

## 11. Internal linking

The homepage package grid now links to all major documented ecosystem areas;
the footer adds contextual package links plus GitHub and npm. Package overview
tests now verify manifest homepage routes. The production smoke crawl found
7,737 distinct internal edges and zero orphaned documentation pages in the
local build.

## 12. Component acquisition

The inventory covers 83 individual UI component references and the Pieces
catalog's 67 documented section families. Explicit component-level ownership
was added for six UI pages and six high-intent page-section references.
Representative component pages already provide API examples, previews,
accessibility notes, and related links; they were not rewritten without
measured evidence of a content gap.

## 13. Performance measurements

- This change adds text and links only; it adds no browser script, image, font,
  or dependency.
- The built local homepage returned HTTP 200 with a one-request loopback TTFB
  of 0.131 seconds and total response time of 0.133 seconds. This is a local
  smoke measurement, not production or field performance.
- The dated 2026-11-15 Lighthouse audit remains the available lab baseline:
  three-run mobile/desktop measurements across seven routes, with mobile LCP
  medians ranging from 2.404 seconds on `/` to 4.955 seconds on
  `/docs/tutorials/auth`, and zero CLS in the listed runs.
- No new Lighthouse run was made because the implementation did not change
  runtime behavior. Field LCP/INP/CLS, current production TTFB, and CrUX data
  remain unavailable. Lighthouse TBT is not INP.
- The production build still reports the repository's existing >500 kB chunk
  warning; no SEO-specific JavaScript was added.

## 14. npm and GitHub

Local package metadata was audited and improved without publishing. Registry
checks confirmed that `@puzzle-ui/commerce` and `@puzzle-ui/payment-providers`
are published; the latter's docs identify its current stage release. GitHub
description, topics, repository settings, and external npm rendering were not
changed. Recommendations requiring authenticated account access are in the
[external authority strategy](./external-authority-strategy.md).

## 15. External authority

The [external authority strategy](./external-authority-strategy.md) records
known first-party channels, owner-reviewed GitHub/npm tasks, relevant
communities, technical article ideas, and open-source contribution options.
No outreach, submission, account creation, link exchange, or profile update
was performed.

## 16. GEO and entity consistency

The existing `/llms.txt`, `/llms-full.txt`, Schema.org graph, and
`/.well-known/puzzle.json` remain in place. The project-information inventory
now includes all non-private workspace packages and distinguishes unpublished
workspace packages from npm releases. Full current production verification
still requires deployment and a live crawl.

## 17. Search Console findings

Read-only Search Console access was available for
`sc-domain:puzzle-ui.com`. The Web report had no country/device filter. With a
16-month range selected, it showed data only from 2026-11-12 through
2026-11-20, so this is a low-volume, nine-day baseline rather than a seasonal
trend. The visible table contained 19 queries and 26 pages.

| Landing page / query | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| Property total | 8 | 74 | 10.8% | 27.2 |
| Homepage | 5 | 9 | 55.6% | 7.2 |
| Branded query `puzzle ui` | 3 | 5 | 60% | 1.4 |
| `/docs/seo/metadata` | 0 | 20 | 0% | 27.0 |
| Query `website metadata` → `/docs/seo/metadata` | 0 | 6 | 0% | 39.5 |
| Query `metadata web page` → `/docs/seo/metadata` | 0 | 5 | 0% | 14.8 |
| `/docs/seo` | 0 | 10 | 0% | 79.0 |
| Query `text editor` → `/docs/ui/editors/text-editor` | 0 | 2 | 0% | 7.5 |

The Search Console query filter confirmed that both website-metadata queries
land on `/docs/seo/metadata`. That page's title and description were
subsequently made more descriptive and aligned with its actual API. The
`metadata web page` query is a position 4–20 candidate, but five impressions
are too few to support a broad rewrite. The existing Text Editor guide already
serves its query; its two impressions do not justify another content change.
Most other query/page rows had one to four impressions.

The report was Web search with no country or device filter. GSC's visible query
rows are not a complete substitute for search volume. The HTTP homepage also
appears in GSC, but a live check confirms it redirects to the HTTPS canonical
homepage in one hop.

## 18. Position 4–20 opportunities

The only clearly relevant query in positions 4–20 is `metadata web page`
(average position 14.8, five impressions, landing page
`/docs/seo/metadata`). It received a small, user-oriented metadata improvement;
measure it again after deployment over a longer interval before further
changes. `website metadata` averaged position 39.5 on six impressions, while
`text editor` averaged position 7.5 on two impressions. Neither justifies
additional page rewrites now. The repeatable workflow and reporting fields
remain in [monitoring strategy](./monitoring-strategy.md).

## 19. Validation performed

| Exact command or check | Result |
|---|---|
| `bun run --filter '@puzzle-ui/site' test:seo` | Passed: 33 tests, 1,662 assertions |
| `bun run --filter '@puzzle-ui/site' test:sitemap` | Passed: 2 tests, 9 assertions |
| `bun run --filter '@puzzle-ui/site' test:mdx` | Passed: 13 tests, 3,498 assertions |
| `bun run --filter '@puzzle-ui/site' typecheck` | Passed |
| `bun test apps/site/src/lib/project-information.test.ts` | Passed: 1 test, 197 assertions |
| `bun run --filter '@puzzle-ui/site' build` | Passed; existing large-chunk warning remains |
| `SITE_URL=http://127.0.0.1:4173 bun run --filter '@puzzle-ui/site' test:seo:smoke` | Passed on local production build: 292 unique URLs, 290 documentation pages, 7,737 internal edges, 0 orphans; robots and GEO endpoints passed |
| Browser inspection of local production homepage | Passed at desktop and narrow/mobile viewport: one H1, 18 package cards, npm link present, no horizontal overflow |
| SEO strategy document link check | Passed: Puzzle docs links resolve in all four strategy and report documents |
| Local SSR metadata check | Passed: updated title, description, and canonical were present in `/docs/seo/metadata` HTML |

These are local source/build checks, not a production crawl or Google-indexing
result.

## 20. Limitations

- Search Console data covered only nine visible days and is too sparse for
  stable trend or volume estimates. Analytics, paid keyword difficulty, CrUX,
  field Core Web Vitals, and backlink data were not available.
- The competitor review describes official product models; it does not
  establish organic traffic or rankings.
- Homepage package, metadata, and docs changes are not deployed.
- npm manifest edits appear on npm only after the normal reviewed release.
- Current production HTTP status, rendered metadata, and performance were not
  re-checked during this task.

## 21. Recommended next steps

1. Review Search Console sitemap, indexing, and field Core Web Vitals reports;
   those were not part of this performance-query review.
2. Deploy through the normal process, then measure the metadata page and
   component queries over a longer comparable interval.
3. Use sustained positions 4–20 and component-page impressions to prioritize
   the next content change.
4. Repeat live endpoint/canonical checks and validate npm metadata after any
   approved releases.
5. Re-run comparable lab/field performance checks after a runtime-affecting
   release.
6. Review the external authority opportunities quarterly; participate only
   when there is a useful, reviewed contribution.

## 22. External actions requiring owner authorization

- GitHub description, topics, and security settings.
- Package release and npm metadata publication.
- Community posts, directory submissions, technical article publication, and
  all outreach.
- Deployment and production crawl.

No commits, pushes, releases, deployments, external account changes, or
submissions were performed.
