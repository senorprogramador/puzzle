# SEO and GEO Validation Report

Validation date: 2026-11-15  
Production URL: <https://puzzle-ui.com>

## Scope and method

This report records an external crawl of the deployed site and a full crawl of
the current local production build. The local build includes the in-progress
DataTable component and its documentation. The smoke validator checks sitemap
URLs, HTTP status and redirects, canonical/noindex consistency, metadata,
JSON-LD types and references, internal documentation links and anchors,
orphaned documentation pages, robots.txt, and both LLM endpoints.

Commands:

```bash
bun run --filter @puzzle-ui/site build
bun run --filter @puzzle-ui/site test:sitemap
bun run --filter @puzzle-ui/site test:seo:smoke
PORT=4173 HOST=127.0.0.1 bun run --filter @puzzle-ui/site start
SITE_URL=http://127.0.0.1:4173 bun run --filter @puzzle-ui/site test:seo:smoke
```

Run the `start` command in one terminal after building, then run the
`SITE_URL` command in another. The validator requests local paths while still
checking canonical URLs against `https://puzzle-ui.com`.

## Results

| Check | Production | Local production build |
|---|---:|---:|
| Unique sitemap URLs | 117 | 118 |
| Sitemap destinations checked | 117 | 118 |
| Pages returning HTTP 200 without redirects | 117 | 118 |
| Unique page titles and descriptions | 117 / 117 | 118 / 118 |
| Documentation pages in sitemap | 116 | 117 |
| Distinct internal documentation links | 1,800 | 1,826 |
| Orphaned documentation pages | 0 | 0 |
| Robots and LLM endpoints | Passed | Passed |
| `llms.txt` size | 17,153 bytes | 17,321 bytes |
| `llms-full.txt` size | 718,168 bytes | 725,249 bytes |

For every sitemap destination, the validator confirmed the canonical matches
the sitemap URL, the response is not marked `noindex`, and the Open Graph and
Twitter metadata is present and nonempty. JSON-LD parses on all pages and
contains the expected homepage or documentation entity types. Homepage
SoftwareSourceCode author/publisher references resolve, and documentation
articles include author and publisher references.

All internal documentation links in the crawled pages resolve to sitemap
pages, all referenced fragments exist, and every documentation page has an
incoming internal link. The validator also confirmed that `llms.txt` links to
each documentation sitemap URL once and that `llms-full.txt` contains one
source marker for each such URL. Both text endpoints return deterministic,
publicly cacheable `text/plain` responses.

The deterministic SEO suite passed 16 tests across four files, including the
sitemap and robots route tests (2 tests, 9 assertions). Component catalog
coverage passed 6 tests and 275 assertions, including DataTable page and
family coverage. The root `bun run seo:validate` workflow passed, including
site typecheck/build, 17 tutorial examples across four routes, hydration
checks, and the production endpoint smoke test.

## Deployment difference

The only additional local URL is
`https://puzzle-ui.com/docs/ui/data-display/data-table`. It returns 200 in the
local production build and is absent from the live sitemap; the live route
still returns 404. This is the in-scope, uncommitted DataTable work. No
deployment was performed.

Package metadata improvements are present only in the working tree and will
not appear on npm until a separately authorized release. No packages were
published.

## Limits

This validation does not measure rankings, search impressions, AI citations,
or field Core Web Vitals. No CrUX or Search Console data was available, and no
new Lighthouse run was made; the lab measurements in the
[performance audit](./seo-geo-performance-audit.md) are historical and
pre-date the current DataTable build. Passing HTTP, metadata, link-graph, and
structured-data checks does not guarantee indexing or citation.
