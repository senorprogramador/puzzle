# SEO monitoring and continuous-improvement strategy

Plan date: 2026-11-22  
Canonical site: <https://puzzle-ui.com>

## Access and measurement limits

A read-only Google Search Console browser report was reviewed on 2026-11-22
for `sc-domain:puzzle-ui.com`. Although the 16-month range was selected, the
visible chart contained data only from 2026-11-12 through 2026-11-20. Treat
those query and page observations as a preliminary nine-day baseline. No
Google Analytics export, paid keyword-tool data, CrUX export, or field Core
Web Vitals data was available. Search volume, organic conversions, external
citations, and backlink totals remain unmeasured. Never put credentials or
private account exports in this repository.

The measured totals, visible queries, landing pages, and current metadata-page
action are recorded in the [implementation report](./implementation-report.md#17-search-console-findings).
The present snapshot has one relevant position 4–20 query with only five
impressions, so wait for a longer comparable period before making another
content change.

The dated [SEO/GEO performance audit](../seo-geo-performance-audit.md) contains
2026-11-15 Lighthouse lab results for seven routes and mobile/desktop profiles.
It is a historical local-build baseline, not current field data. In particular,
Lighthouse Total Blocking Time is not Interaction to Next Paint.

## Google Search Console workflow

Use the verified `puzzle-ui.com` Domain property (`sc-domain:puzzle-ui.com`);
confirm the property and date filters on each review:

1. Submit `https://puzzle-ui.com/sitemap.xml`; record the submission date and
   processing status.
2. Check indexing and sitemap reports for exclusions, errors, and unexpected
   canonical selection.
3. Use URL Inspection on the homepage, major package overviews, prioritized
   component pages, and newly changed routes. Compare Google's selected
   canonical with the server-rendered canonical.
4. Export Search results by query and page with a consistent period and
   comparison period. Segment brand terms (Puzzle) from non-brand terms.
5. Preserve country, device, search type, and date range when comparing
   average position or CTR. Do not interpret one aggregate position as a
   stable rank.
6. Group queries by the ownership clusters in
   [keyword research](./keyword-research.md), then identify pages with
   substantial impressions, positions 4–20, unusually low CTR, or sustained
   declines.
7. Record the report period and filters without copying personal or
   confidential Search Console data into the repository.

### Position 4–20 review

For each measured opportunity, record:

| Field | Required information |
|---|---|
| Query and cluster | Exact query; brand/non-brand; assigned intent owner |
| Landing page | URL from Search Console; selected canonical; competing Puzzle pages |
| Measurement | Source, date range, country, device, clicks, impressions, CTR, average position |
| Result review | Current visible result types and the date/location/device used for the check |
| Page review | Intent match, title/description, introduction, examples, API completeness, internal links |
| Action | One specific user-benefiting content or technical improvement, or no change |
| Follow-up | Change date, observation period, same filters, resulting metrics, confidence |

Inspect the page and current results before editing. Prioritize a verified
content gap, stale example, misleading snippet, or missing internal route over
position movement alone. Do not rewrite pages solely because an average rank
fluctuates, and do not assume improvement after a change caused the change.

### High impressions and low CTR

Review the query mix and actual position before changing a title or
description. Check intent fit, descriptive accuracy, page/result competition,
brand recognition, and whether a rich-result appearance is eligible. Improve
snippets only when they can be more useful and truthful; avoid clickbait.

## Organic landing-page conversion

The site already offers documentation, Getting Started, GitHub, and npm paths.
A targeted source scan did not identify a configured analytics product for the
site, and no tracking or event was added. If an owner later approves
measurement, review the existing privacy and consent requirements first.
Potential low-data interactions are:

- Open Getting Started from an organic landing page.
- Navigate from a component page to a related package or example.
- Activate an installation instruction or package-manager control.
- Follow an outbound GitHub or npm link.

Use aggregate, privacy-respecting events only when a clear need, retention
period, and consent/legal review are documented. Do not add a tracking
dependency simply to complete this strategy.

## Technical monitoring

Run deterministic site checks after relevant route, metadata, structured-data,
or link changes:

```bash
bun run --filter '@puzzle-ui/site' test:seo
bun run --filter '@puzzle-ui/site' test:sitemap
bun run --filter '@puzzle-ui/site' test:seo:smoke
bun run --filter '@puzzle-ui/site' typecheck
bun run --filter '@puzzle-ui/site' build
```

The endpoint smoke test can target a local production build with
`SITE_URL=http://127.0.0.1:4173`; it is not a production crawl. For a live
check, run the existing endpoint validator against the canonical site
separately and record the date, URL set, HTTP responses, and limitations.
Keep network-dependent checks out of deterministic unit tests.

For public releases, confirm sitemap destinations are canonical, indexable,
and successful; robots references the canonical sitemap; metadata and
structured data are present in initial HTML; links and anchors resolve; and
intended indexable documentation routes are reachable. Keep private, draft,
and utility routes out of the public sitemap.

## Performance and budgets

Google's published field Core Web Vitals “good” thresholds are LCP at or under
2.5 seconds, INP under 200 milliseconds, and CLS under 0.1; use the current
[Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).
These are user-experience targets, not a ranking guarantee.

The repository's 2026-11-15 local Lighthouse report sampled the homepage,
Getting Started, UI overview, Button, SEO, Auth tutorial, and Storage tutorial
in three-run mobile and desktop runs. It reported mobile LCP medians from
2.404 seconds on `/` to 4.955 seconds on `/docs/tutorials/auth`, with zero CLS
in the listed runs. It also documents substantial route/run variance (for
example `/docs/ui` mobile LCP); therefore use the historical measurements as
context, not a universal performance budget. No matching TTFB, INP, or field
data was recorded there.

For future runtime-affecting changes:

1. Re-run the same three-run Lighthouse protocol on representative routes and
   profiles; record browser, throttling, build, route, and median.
2. Treat a greater than 10% median LCP regression on an unchanged route/profile
   as a review trigger, not an automatic failure; repeat noisy runs before
   attributing cause. Keep laboratory CLS below 0.1 and compare it with the
   same-route baseline.
3. Measure TTFB separately using a documented production or comparable
   server setup. Do not infer it from LCP.
4. Use Search Console/CrUX for field LCP, INP, and CLS when enough data exists;
   never label lab TBT as INP.
5. If the route, server, CDN, font, or bundle materially changes, establish a
   new comparable baseline before tightening budgets.

This task changed text, route intent metadata, and npm manifest metadata; it
did not add browser scripts, images, fonts, or runtime dependencies. The
historical Lighthouse baseline was not rerun as part of this content-only
change.

## Reporting cadence

| Cadence | Review |
|---|---|
| Monthly, with Search Console access | Query/page trends by cluster, branded vs. non-branded demand, positions 4–20, high-impression/low-CTR pages, index and sitemap issues, and organic landing paths |
| Quarterly | Competitor product-model changes, content gaps, internal links/orphans, technical SEO, field performance, external mentions, and current priorities |
| Each significant release | Package docs, compatibility, examples, maturity labels, README/manifest metadata, canonical targets, and affected sitemap pages |
| After route/metadata changes | Focused SEO and sitemap tests, local endpoint smoke check, initial HTML, canonical and JSON-LD review |

## Repeatable report template

| Period / source | Cluster and intent | Landing page | Impressions | Clicks | CTR | Avg. position | Country/device | Index status | Action / owner |
|---|---|---|---:|---:|---:|---:|---|---|---|
| Not available | Not measured | Not measured | — | — | — | — | — | Not checked | Configure Search Console with owner access |

Add separate sections for organic landing-page actions, lab performance,
field Core Web Vitals, external mentions, and technical validation. Label
unavailable data; never substitute an estimate for a measurement.
