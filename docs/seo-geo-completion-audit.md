# SEO, GEO and Discoverability Completion Audit

Audit date: 2026-11-15  
Repository: `senorprogramador/puzzle`  
Repository commit: `8e10e98ec08593ee965513fa2349bc4ae67904df`  
Production URL: <https://puzzle-ui.com>

## Scope and method

This is the pre-implementation audit required by the SEO/GEO completion
mission. It combines the existing [SEO/GEO performance audit](./seo-geo-performance-audit.md)
and [API stability audit](./api-stability-audit.md), targeted source inspection
of the site SEO routes, `@puzzle-ui/seo`, package documentation/exports, and
the current DataTable changes. It separately records the production responses
and a production build of the current working tree.

The working tree is not clean. At the start of this audit, the DataTable
component, its public export, site sidebar entry, and documentation were
uncommitted/untracked. The user confirmed these changes are in scope. The local
build below therefore represents the working tree, not only the recorded
commit. No deployment was attempted.

## Existing functionality

- The site generates metadata, canonical URLs, sitemap and robots responses
  from shared site SEO helpers and the Fumadocs page source. Documentation
  routes provide server-rendered metadata and WebPage, TechArticle, and
  BreadcrumbList JSON-LD.
- `/llms.txt` and `/llms-full.txt` are implemented. The full-document endpoint
  exports public MD and MDX pages as Markdown.
- The homepage presents ten package areas, including distinct Auth, Fullstack,
  Storage, and Create entries. The production homepage has one H1.
- The existing performance audit records three-run Lighthouse medians for
  seven representative routes and both device profiles. It reports no CrUX or
  Search Console field data and no evidence-based reason to optimize the SEO
  JavaScript chunk.
- The DataTable working-tree feature includes an exported component, unit,
  component, and browser tests, a documentation page, and sidebar navigation.
  It supports range loading, local sorting/search, pagination, loading/error
  states, and semantic table markup.

## Baseline A — repository and local production build

Executed against the current working tree:

| Check | Result |
|---|---|
| `bun run --filter '@puzzle-ui/site' build` | Passed |
| Site SEO/homepage/Markdown tests | Passed: 14 tests |
| Site typecheck | Passed |
| Tutorial validation | Passed: 17 TypeScript examples and four routes; optional MongoDB examples were skipped because `TUTORIAL_MONGODB_URI` was not configured |
| Production hydration validation | Passed: navigation, history, reload, metadata, and JSON-LD |
| Local sitemap | 118 unique URLs; all 118 pages returned 200 locally with unique titles/descriptions and matching canonicals |
| Local robots and GEO endpoints | 200 with expected text content types |

The current working-tree build contains the DataTable documentation route.

## Baseline B — live production

Checked on 2026-11-15:

| Check | Result |
|---|---|
| `/sitemap.xml` | 200, `application/xml; charset=utf-8`; valid XML; 117 unique absolute HTTPS canonical-host URLs |
| Sitemap destinations | All 117 returned 200, had no redirects, no query/fragment, no `noindex`, and exactly matching canonicals |
| Initial-HTML metadata | All 117 pages had unique titles and descriptions; each had one description, Open Graph title/description, and Twitter card/title/description; canonicals matched the sitemap |
| JSON-LD syntax | No JSON parse errors among the 117 sitemap pages; this check does not establish full Schema.org semantic validity |
| `/robots.txt` | 200, `text/plain; charset=utf-8`; `User-agent: *` allows all paths and references the canonical sitemap |
| `/llms.txt` | 200, `text/plain; charset=utf-8`; 17,153 bytes |
| `/llms-full.txt` | 200, `text/plain; charset=utf-8`; 718,168 bytes; contains 116 unique documentation URLs, covering every live sitemap documentation URL |
| Homepage | One H1; includes the ten intended package links and correct separate Auth, Fullstack, and Storage destinations |

The wildcard robots rule does not distinguish search crawlers, training
crawlers, or user-triggered fetchers. It therefore grants the same robots.txt
permission to crawlers that honor this rule. Robots directives are crawl
preferences, not access control. No crawler-specific rule change is justified
by this audit; any later policy change should be an explicit publisher
decision.

## Deployment difference

The local working-tree build has 118 sitemap URLs; live production has 117.
The only URL in the local sitemap but absent from production is:

`https://puzzle-ui.com/docs/ui/data-display/data-table`

The route returns 200 in the local build and 404 in production. The extra page
also appears in the local `llms.txt` and `llms-full.txt`; no live sitemap URL
is missing from the local sitemap. The local and live responses otherwise have
the same robots content, while the generated sitemap and GEO files differ in
size because the local documentation includes this page. This is an
undeployed working-tree change, not evidence that a deployment should be made.

## Confirmed bugs and coverage gaps

1. **DataTable documentation overstates server-side filtering/sorting.** The
   component's `requestItems(start, end)` API receives no sort/search state,
   and sorting/search operate on items already loaded. The documentation
   suggests a server-backed data source can implement global sorting/filtering
   through the component, which the current API does not support. Clarify the
   limitation without introducing an unrequested API change.
2. **Endpoint regression coverage is incomplete.** Existing site tests cover
   SEO helpers, homepage links, and Markdown extraction, but do not directly
   assert sitemap, robots, and GEO route responses or source-page coverage.
   The tutorial and hydration scripts cover some built-site behavior but are
   not a standalone full sitemap smoke test.
3. **Internal links are not exhaustively crawled.** Existing reports note
   corrected stale links, but do not establish current link/anchor integrity,
   redirects, orphan pages, or page-to-page graph coverage for every public
   route.
4. **Structured-data syntax is not the whole schema audit.** Live JSON-LD
   parses, and existing hydration checks cover key entity relationships, but
   full property/type/reference validation across all pages remains to be
   automated.
5. **Working-tree DataTable route is not deployed.** Its production 404 is
   expected until the component/docs changes are reviewed, committed, and
   deployed through the normal release process.

## Potential improvements

- Add deterministic automated coverage for sitemap source inventory and
  uniqueness, robots content type/policy, metadata uniqueness, JSON-LD
  relationships, and both LLM endpoints.
- Add a separately invoked external smoke check for production sitemap URL
  status, redirects, canonical/noindex consistency, and robots policy; keep
  network calls out of ordinary unit tests.
- Crawl documentation links and anchors to identify broken, redirecting, and
  orphaned routes, then add contextual package cross-links where needed.
- Re-run representative Lighthouse measurements after the DataTable addition
  only if its route or bundle materially changes the selected baseline. Do not
  treat TBT as INP or lab metrics as field data.
- Compare official crawler policies before making any robots.txt policy
  changes; distinguish search indexing from user-triggered fetches and model
  training.

## Priorities

| Priority | Finding/action |
|---|---|
| **P0** | None identified in the checked live indexing endpoints. Sitemap destinations, page metadata, robots, and GEO endpoints are currently available and internally consistent. |
| **P1** | Correct the DataTable documentation limitation; add endpoint/source-inventory regression tests and an external sitemap smoke script; preserve the explicit production 404/deployment difference until the in-scope feature is released. |
| **P2** | Complete a full internal-link/anchor/orphan crawl and automate structured-data entity/property checks across all public pages. |
| **P3** | Obtain CrUX or Search Console field metrics if access is available; monitor search discovery, AI citations, and external authority through human-managed channels. |

## Tests required before completion

- Build and typecheck the site and UI packages.
- Run DataTable unit/component/browser tests and validate its documentation
  examples and navigation.
- Test sitemap/robots/LLM route behavior and documentation-source coverage
  locally without external network dependencies.
- Run the dedicated production smoke script against the canonical site and
  report HTTP status, redirects, and canonical/noindex outcomes per sitemap
  URL.
- Validate metadata uniqueness, JSON-LD syntax and relationships, hydration,
  and internal documentation links.
- Run the established performance measurements or clearly identify which
  results are reused from the existing report and which routes/builds they
  represent.

## Validation update — 2026-11-15

The endpoint and documentation checks now pass against both the live site and
the current local production build. See the [validation report](./seo-geo-validation-report.md)
for exact counts and methodology.

| Check | Result |
|---|---|
| Site SEO tests | Passed: 16 tests, including deterministic sitemap and robots coverage |
| Site typecheck and production build | Passed |
| Tutorial validation | Passed: 17 TypeScript examples and four routes; optional MongoDB examples were skipped because `TUTORIAL_MONGODB_URI` was not configured |
| Hydration validation | Passed: navigation, history, reload, metadata, and JSON-LD |
| Component catalog coverage | Passed: 6 tests and 275 assertions, including DataTable page and family coverage |
| Production endpoint smoke test | Passed: 117 sitemap URLs and 116 documentation pages |
| Local production endpoint smoke test | Passed: 118 sitemap URLs and 117 documentation pages |
| DataTable component tests | Passed previously: 17 component tests and two targeted browser tests |
| Performance and field data | No new Lighthouse run; no CrUX or Search Console data was available |

The local-only DataTable route still returns 404 in production. No deployment
or npm publication was attempted. The component-catalog test had identified
that the new component was not yet included in the catalog inventory. The
catalog now includes DataTable in the data-display family, and the focused
correction passes the page, export-family, and icon/label assertions.
