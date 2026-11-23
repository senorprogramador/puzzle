# External authority and community strategy

Review date: 2026-11-22  
Canonical site: <https://puzzle-ui.com>

This is a human-reviewed opportunity list, not authorization to create
accounts, change repository settings, publish content, or contact communities.
No outreach, submission, external profile change, package publication, or
backlink acquisition was performed for this work.

## Existing first-party presence

| Destination | Current evidence | Recommended owner review |
|---|---|---|
| [Puzzle website](https://puzzle-ui.com) | Canonical URL is configured in the site and repository docs. | Keep package links, maturity labels, installation examples, and framework claims consistent with source and tests. |
| [GitHub repository](https://github.com/senorprogramador/puzzle) | Repository URL appears in package manifests and README. Repository presentation settings were not changed or verified in this task. | Manually verify the description, website URL, topics, README entry points, contribution guide, security policy, and release links while authenticated. |
| [npm UI package](https://www.npmjs.com/package/@puzzle-ui/ui) | The package manifest and root README identify the published `@puzzle-ui` package ecosystem. Local manifest changes do not update npm until a reviewed release. | Before a release, review the package description, keywords, repository, homepage, README, install command, and version; after publishing, verify npm's rendered page. |
| [npm Pieces package](https://www.npmjs.com/package/@puzzle-ui/pieces) | Manifest describes composable React page sections; the public docs clarify that these are not complete site templates. | Keep that limitation visible in package and documentation descriptions. |
| [npm SEO package](https://www.npmjs.com/package/@puzzle-ui/seo) | Manifest and docs describe metadata, canonical URLs, sitemaps, robots, Schema.org, and JSON-LD. | Verify all documented subpaths and framework adapters against package exports during release review. |
| Other social/editorial profiles | No independently controlled profiles were verified in this repository review. | Do not imply profiles or endorsements exist; record verified URLs only after an owner confirms control. |

The prior [SEO/GEO audit](../seo-geo/implementation-audit.md) records that
authenticated GitHub settings were unavailable during that audit. Treat GitHub
description, topics, and security settings as **unverified**, not as missing.

## Recommended opportunities

Effort is a planning estimate (S/M/L), not a promise of links or ranking impact.
“Link likely” describes the natural editorial format, not a guaranteed outcome.

| Priority | Target / audience | Why Puzzle is relevant | Useful contribution or content | Link expectation | Effort | Status |
|---|---|---|---|---|---|---|
| P1 | GitHub repository visitors | Repository is the canonical source for an open-source package ecosystem. | Improve repository description/topics and README navigation after maintainer review; keep the current URLs and supported-framework boundaries accurate. | Official repository/site links; not a third-party backlink | S | Recommended; requires authenticated owner review |
| P1 | npm package consumers | Package pages are high-intent installation and maintenance destinations. | Align package descriptions, keywords, homepage links, README install steps, and changelogs; verify in npm after the normal release. | Official package-to-doc links | S | Three manifest descriptions/homepage links were improved locally; not published |
| P1 | React documentation and tutorial readers | Puzzle has real, tested component, theme, sections, SEO, Auth, and generator APIs. | Publish only runnable technical tutorials that solve a specific problem and link to the corresponding reference. | Editorial link possible where useful | M | Candidate; no article published |
| P2 | Reactiflux community ([Reactiflux](https://www.reactiflux.com/)) | React developers discuss implementation questions where a factual, relevant answer may help. | Answer a concrete question first; mention Puzzle only when it directly solves that question and disclose maintainer affiliation. | Not expected; usefulness is the goal | S per participation | Owner review required; no posts made |
| P2 | React developers on [r/reactjs](https://www.reddit.com/r/reactjs/) | Relevant audience for component and architecture questions. | Share a focused lesson or answer within community rules; do not submit generic promotion or request votes/links. | Not expected | S per participation | Owner review required; no posts made |
| P2 | Technical discussion on [Hacker News](https://news.ycombinator.com/) | A substantive open-source release or original technical article may be relevant to developer discussion. | Submit only a genuinely useful artifact or release when it exists; be transparent about affiliation and participate in discussion. | Possible editorial reference, never guaranteed | M | Future opportunity; no submission made |
| P2 | Developer authors on [DEV](https://dev.to/) and other technical publications | Detailed React implementation examples can reach practitioners beyond package discovery. | Consider articles on typed theming, accessible component APIs, package boundaries, or server-rendered SEO; test code and identify the author/editor. | Possible canonical article link | M | Candidate topics; no content published |
| P2 | Open-source maintainers and framework communities | Puzzle uses and integrates with React, TanStack, Fumadocs, and related tools. | Contribute bug fixes, docs, or examples upstream when independently useful; follow each project's process and do not request links in exchange. | Incidental mention only | M/L | Ongoing, only when a real contribution is available |
| P3 | Curated React/design-system directories | Relevant directories can help developers discover maintained projects. | Check editorial criteria, maintenance, and audience before requesting inclusion; submit exact facts and current links only. | Directory listing may include a link | S/M | Not researched as an individual submission target |
| P3 | Independent component-library guides and reviews | Product-model distinctions are useful to developers choosing between packages, source registries, primitives, and section libraries. | Offer verifiable product facts, a working demo, and clear limitations; do not ask for positive coverage or exact-match anchors. | Editorial reference possible | M | Candidate; no outreach made |

## First-party assets worth making referenceable

Only pursue assets that can stand on their own without a backlink:

- A maintained architecture diagram showing package responsibilities and
  client/server boundaries.
- Runnable component examples demonstrating keyboard behavior and limitations.
- A practical guide distinguishing installed packages, copied-source
  components, unstyled primitives, registries, styling plugins, and isolated
  component-development tools.
- Focused migration or integration examples for frameworks that Puzzle
  explicitly supports.
- Small open-source utilities or upstream contributions with independent
  value.

The existing [architecture overview](../ai/architecture/overview.md),
[framework compatibility guide](../ai/frameworks/compatibility.md), and
documentation previews are preferable to duplicate pages until a concrete
gap is identified.

## Safeguards and measurement

- Follow [Google Search Essentials](https://developers.google.com/search/docs/essentials)
  and its [spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
- Do not buy links, exchange links at scale, automate outreach, manufacture
  testimonials, or post promotional material without review.
- A mention without a hyperlink can still help awareness; do not treat every
  interaction as a link-building opportunity.
- Record the destination, date, exact action, maintainer relationship, and
  public evidence for approved outreach. Separate external outcomes from
  repository changes.
- Report referring domains or acquired links only from a measured source.
  No backlink counts, domain scores, rankings, or traffic estimates are
  available in this repository.
