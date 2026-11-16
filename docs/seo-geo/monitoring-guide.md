# SEO/GEO monitoring guide

This guide separates observable search and performance data from directional
AI-discovery observations. Repository tests verify implementation; they do not
prove indexing, rankings, citations, or field Core Web Vitals.

## Google Search Console

1. Verify the canonical domain property `puzzle-ui.com` using an authorized
   DNS record or another supported verification method.
2. Submit `https://puzzle-ui.com/sitemap.xml`.
3. Review Page indexing and sitemap processing for exclusions and errors.
4. Use URL Inspection to diagnose representative homepage, documentation, and
   new landing-page URLs; compare Google's selected canonical with the
   canonical served by the site.
5. Review Search results by query and page, using consistent date ranges and
   separating branded from non-branded searches.
6. Review Core Web Vitals field data when available. Record sample coverage and
   URL groups; do not substitute lab measurements for field data.
7. Record verification status and observations without copying credentials or
   private account data into the repository.

No Search Console access or data was available during this implementation.

## Repeatable local validation

From the repository root:

```bash
bun run --filter '@puzzle-ui/site' test:seo
bun run --filter '@puzzle-ui/site' test:sitemap
bun run --filter '@puzzle-ui/site' typecheck
bun run --filter '@puzzle-ui/site' build
```

For the endpoint smoke test, first build and run the site in one terminal:

```bash
bun run --filter '@puzzle-ui/site' build
PORT=4173 HOST=127.0.0.1 bun run --filter '@puzzle-ui/site' start
```

Then, in another terminal:

```bash
SITE_URL=http://127.0.0.1:4173 bun run --filter '@puzzle-ui/site' test:seo:smoke
```

The smoke test checks generated endpoints and linked pages from the local
production build. The root `bun run seo:validate` workflow additionally
performs the repository's configured SEO validation; consult the current
package scripts before using it where network access or a live-site request
matters.

## Performance and privacy

- Use the existing Lighthouse procedure in
  [the performance audit](../seo-geo-performance-audit.md) for repeatable lab
  comparisons. Record browser, version, route, device profile, throttling,
  build, and run count.
- Track LCP, CLS, and available responsiveness measures, but do not label Total
  Blocking Time as INP.
- Use CrUX or Search Console for field metrics when eligible data exists.
- Inspect the current analytics and consent policy before adding events or
  providers. Do not add a tracking dependency without a documented privacy
  need, data-retention policy, and consent review.
- Useful, privacy-conscious events may include documentation navigation,
  Getting Started activation, and outbound GitHub/npm links only when the
  existing analytics policy permits them.
- Do not infer traffic or adoption from clicks without appropriate context.

## Manual GEO observation log

Ask a fixed set of questions periodically across multiple AI search or
assistant platforms. Record the exact prompt and platform; answers vary and a
single response is not a representative score.

| Date | Platform/model | Exact question | Mentioned? | Description accurate? | Official site cited? | Sources/evidence |
|---|---|---|---|---|---|---|
| YYYY-MM-DD |  | What is Puzzle UI? |  |  |  |  |
| YYYY-MM-DD |  | Which TypeScript-first React component libraries provide design tokens? |  |  |  |  |
| YYYY-MM-DD |  | What React libraries provide authentication infrastructure? |  |  |  |  |
| YYYY-MM-DD |  | What React libraries provide typed Schema.org metadata? |  |  |  |  |
| YYYY-MM-DD |  | What are alternatives to MUI, and when might each fit? |  |  |  |  |

Treat these as qualitative observations, not rankings or guaranteed citation
metrics. Record incorrect descriptions with the exact source cited and a
specific first-party page that could clarify the fact.

## Reporting cadence and metrics

| Cadence | Review |
|---|---|
| Each release | Package metadata, versions, changelog, documentation links, and compatibility statements |
| Monthly | Search Console indexing issues and query/page trends, if access exists |
| Quarterly | Field performance, referrers, public mentions, and the GEO observation log |
| After route/metadata changes | Sitemap, canonical, robots, SSR metadata, JSON-LD, and internal-link smoke checks |

Report actual indexed pages, impressions, clicks, queries, organic landing
pages, field Core Web Vitals, referring domains, GitHub activity, npm
downloads, AI mentions, and AI citations only when measured. Label estimates
and unavailable data explicitly; do not award an SEO/GEO score based on
unverified external outcomes.
