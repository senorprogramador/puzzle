# SEO keyword and competitor research

Research date: 2026-11-22  
Canonical site: <https://puzzle-ui.com>

## Scope and evidence limits

This is a qualitative opportunity map, not a keyword-volume report. Read-only
Google Search Console data was reviewed on 2026-11-22, but the selected
16-month report contained visible data only for 2026-11-12 through
2026-11-20. The measured query/page observations are recorded below; rankings
outside those rows, monthly search volumes, and numeric keyword difficulty
remain **unverified**. No analytics export or paid keyword database was
available. Do not treat search-result snippets or a competitor's product
claims as evidence of its rankings or traffic.

The competitor review checked first-party product and documentation pages
linked below on 2026-11-22. Public web-search spot checks were used to find
relevant result types and documentation pages; they are not a location-,
device-, or history-controlled Google SERP export. Competitiveness estimates
below are directional hypotheses based on query breadth, established
alternatives, and the match between the query and Puzzle's current material.

Google's guidance is to publish useful, reliable, people-first content, make
links crawlable, and avoid spam practices. Structured data must represent
visible content and does not guarantee a search enhancement. See [Search
Essentials](https://developers.google.com/search/docs/essentials), [helpful
content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content),
[spam policies](https://developers.google.com/search/docs/essentials/spam-policies),
and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
Google may generate title links from multiple page signals and snippets
primarily from page content; a changed title or meta description is not
guaranteed to appear verbatim. See its [title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
and [snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

## Puzzle's verified search-relevant capabilities

- The homepage presents Puzzle as a TypeScript-first React component ecosystem.
- `@puzzle-ui/ui` documents 83 individual component references across actions,
  forms, data display, editors, layout, navigation, overlays, typography, and
  utilities. The 93 UI MDX files also include category and index pages.
- `@puzzle-ui/theme` documents tokens, color schemes, typography, and scoped
  theme providers.
- `@puzzle-ui/pieces` documents 67 section families across ten categories.
  Pieces are composable page sections, not a general page builder or a library
  of complete website templates.
- Other documented areas include Hooks, Icons, SEO, Auth, Session, Storage,
  Fullstack integrations, and the Create application generator.
- Framework claims must stay specific: the UI package targets React 19;
  Create has documented Vite, Next.js, and TanStack Start shapes; SEO and
  Fullstack document their own framework adapters. These do not imply blanket
  compatibility for every package and framework combination.

See the current [package map](../ai/architecture/package-map.md), [site
search-intent map](../../apps/site/src/lib/search-intents.ts), [UI catalog](../../apps/site/content/docs/ui/index.mdx),
and [Pieces catalog](../../apps/site/content/docs/pieces/index.mdx) for
implementation-backed inventory.

## Keyword opportunity and ownership map

Competitiveness is a qualitative estimate, not a tool score. Search Console
observations appear only where available; impressions in that report are not
monthly search volume.

| Keyword / query family | Search intent | Primary target URL | Supporting URLs | Estimated competitiveness | Business relevance | Current ranking | Search volume | Existing Puzzle visibility | Research source | Priority and next action |
|---|---|---|---|---|---|---|---|---|---|---|
| React UI library; React component library; best React component library | Evaluate a reusable React UI ecosystem | `/` | `/docs/ui`, `/docs/getting-started`, `/docs/about` | Very high | Very high: core adoption | Broad query rankings not verified | Not available | Branded query `puzzle ui`: 3 clicks, 5 impressions, average position 1.4; homepage: 5 clicks, 9 impressions, average position 7.2 | [Google Search Console](./implementation-report.md#17-search-console-findings), [Homepage](https://puzzle-ui.com/), [MUI overview](https://mui.com/material-ui/getting-started/), [shadcn/ui docs](https://ui.shadcn.com/docs) | P1: brand visibility is present; broad non-brand visibility remains unverified. Keep the homepage's product choice, differentiation, preview, installation, and documentation paths clear. |
| React UI components; TypeScript React components | Browse component categories, examples, and APIs | `/docs/ui` | `/docs/ui/actions`, `/docs/ui/forms`, `/docs/ui/overlays`, `/docs/getting-started` | High | Very high | Broad query rankings not verified | Not available | Page: 1 click, 2 impressions, average position 46.5 in the snapshot | [Google Search Console](./implementation-report.md#17-search-console-findings), [UI catalog](https://puzzle-ui.com/docs/ui), [Radix introduction](https://www.radix-ui.com/primitives/docs/overview/introduction), [HeroUI getting started](https://heroui.com/en/docs/react/getting-started) | P1: distinguish this API/catalog intent from the homepage's ecosystem overview; maintain crawlable category links and practical examples. |
| React design system; React design tokens; React theming | Learn or configure a reusable token and theme system | `/docs/theme` | `/docs/theme/tokens`, `/docs/theme/colors`, `/docs/ui` | High | High | Not verified | Not verified | Not verified | [Theme guide](https://puzzle-ui.com/docs/theme), [Park UI introduction](https://park-ui.com/docs/introduction), [MUI overview](https://mui.com/material-ui/getting-started/) | P1: keep token and provider examples current; use the homepage only as a supporting ecosystem page. |
| React website sections; React page sections; React landing page components | Find composable, reusable page-level sections | `/docs/pieces` | `/docs/pieces/components/marketing`, `/docs/pieces/components/saas-product`, `/docs/pieces/framework-integration` | Medium-high | High: distinct product fit | Not verified | Not verified | Not verified | [Pieces catalog](https://puzzle-ui.com/docs/pieces), [Magic UI docs](https://magicui.design/docs), [21st.dev](https://21st.dev/) | P1: explain section composition and caller-owned behavior; do not describe Pieces as complete templates or a page builder. |
| React hero section | Find a responsive page-introduction section | `/docs/pieces/components/hero` | `/docs/pieces`, `/docs/pieces/components/features` | High | High | Not verified | Not verified | Not verified | [Hero reference](https://puzzle-ui.com/docs/pieces/components/hero), [Magic UI docs](https://magicui.design/docs), [Aceternity UI](https://ui.aceternity.com/) | P1: keep live previews, responsive behavior, presets, and the API limits explicit. |
| React features section; React pricing section; React testimonials section | Choose a specific marketing section and learn its composition | The matching `/docs/pieces/components/{features,pricing,testimonials}` page | `/docs/pieces/components/marketing`, `/docs/pieces` | Medium-high | High | Not verified | Not verified | Not verified | [Features](https://puzzle-ui.com/docs/pieces/components/features), [Pricing](https://puzzle-ui.com/docs/pieces/components/pricing), [Testimonials](https://puzzle-ui.com/docs/pieces/components/testimonials) | P1: use descriptive titles and component-specific examples. Preserve the facts that callers supply content and business behavior. |
| React FAQ section; React call to action section | Implement an FAQ or conversion section | The matching `/docs/pieces/components/{faq,cta}` page | `/docs/pieces/components/marketing`, `/docs/ui/navigation/accordion` | Medium-high | High | Not verified | Not verified | Not verified | [FAQ](https://puzzle-ui.com/docs/pieces/components/faq), [CTA](https://puzzle-ui.com/docs/pieces/components/cta), [Pieces marketing overview](https://puzzle-ui.com/docs/pieces/components/marketing) | P1: keep accessibility and local-search behavior accurate; do not imply the CTA implements signup, forms, or application flows. |
| React button component | Implement an action or link with button behavior | `/docs/ui/actions/button` | `/docs/ui/actions`, `/docs/ui/navigation/link` | Very high | High | Not verified | Not verified | Not verified | [Button reference](https://puzzle-ui.com/docs/ui/actions/button), [MUI components](https://mui.com/material-ui/getting-started/), [Ant Design components](https://ant.design/components/overview/) | P2: maintain the existing API, loading-state, variant, and link-rendering guidance; prioritize only if impressions or concrete content gaps support it. |
| React date picker component | Select and validate a date in a form | `/docs/ui/forms/date-picker` | `/docs/ui/forms`, `/docs/ui/forms/date-range-picker`, `/docs/ui/forms/form-field` | High | High | Not verified | Not verified | Not verified | [Date Picker reference](https://puzzle-ui.com/docs/ui/forms/date-picker), [Ant Design components](https://ant.design/components/overview/), [HeroUI docs](https://heroui.com/en/docs/react/getting-started) | P1: retain the single-date/time-zone/form integration limitations and verify examples against the exported API. |
| React select component; React select dropdown | Choose one or multiple predefined options | `/docs/ui/forms/select` | `/docs/ui/forms`, `/docs/ui/forms/autocomplete`, `/docs/ui/forms/form-field` | High | High | Not verified | Not verified | Not verified | [Select reference](https://puzzle-ui.com/docs/ui/forms/select), [Chakra installation](https://chakra-ui.com/docs/get-started/installation), [Ant Design components](https://ant.design/components/overview/) | P2: keep the select-only behavior distinct from searchable Autocomplete and native form integration. |
| React dialog component; React modal dialog | Present a focused modal interaction | `/docs/ui/overlays/dialog` | `/docs/ui/overlays`, `/docs/ui/overlays/popover`, `/docs/ui/forms/form-field` | High | High | Not verified | Not verified | Not verified | [Dialog reference](https://puzzle-ui.com/docs/ui/overlays/dialog), [Radix introduction](https://www.radix-ui.com/primitives/docs/overview/introduction), [HeroUI docs](https://heroui.com/en/docs/react/getting-started) | P1: retain controlled state, keyboard and focus limitations, and integration guidance; do not overstate accessibility certification. |
| React rich text editor; React text editor | Edit and render structured rich text | `/docs/ui/editors/text-editor` | `/docs/ui/editors`, `/docs/ui/editors/json-editor`, `/docs/theme/typography` | Medium-high | High: concrete component need | Query `text editor`: average position 7.5, 2 impressions; page aggregate average position 36.5, 8 impressions | Not available | Query filter confirms `/docs/ui/editors/text-editor`; zero clicks in the observed query row | [Google Search Console](./implementation-report.md#17-search-console-findings), [Text Editor reference](https://puzzle-ui.com/docs/ui/editors/text-editor), [UI catalog](https://puzzle-ui.com/docs/ui) | P2: maintain the strong API guide and monitor; the impression count is too small to justify another rewrite. |
| React data table; TypeScript React data table | Render and page structured application data | `/docs/ui/data-display/data-table` | `/docs/ui/data-display`, `/docs/ui/navigation/pagination` | High | High | Not verified | Not verified | Not verified | [DataTable reference](https://puzzle-ui.com/docs/ui/data-display/data-table), [Ant Design components](https://ant.design/components/overview/), [MUI overview](https://mui.com/material-ui/getting-started/) | P1: explicitly disclose that sorting and search apply only to loaded rows and range requests do not transmit sort/search state. |
| React SEO library; React metadata; React JSON-LD | Add metadata, structured data, and crawl endpoints | `/docs/seo` | `/docs/seo/metadata`, `/docs/tutorials/seo`, `/docs/fullstack`, `/docs/multilingual` | Medium-high | High: differentiated package fit | Page: 0 clicks, 10 impressions, average position 79.0 | Not available | Low-volume page-level visibility in the 2026-11-12–20 snapshot | [Google Search Console](./implementation-report.md#17-search-console-findings), [SEO docs](https://puzzle-ui.com/docs/seo), [SEO tutorial](https://puzzle-ui.com/docs/tutorials/seo), [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | P2: keep the package overview distinct from the metadata API page; do not rewrite it based on ten impressions alone. |
| Website metadata; metadata web page | Configure page titles, descriptions, canonicals, robots, and social metadata | `/docs/seo/metadata` | `/docs/seo`, `/docs/seo/robots`, `/docs/seo/frameworks`, `/docs/tutorials/seo` | Medium-high | High: exact documented API fit | `website metadata`: position 39.5 (6 impressions); `metadata web page`: position 14.8 (5 impressions) | Not available | Page: 0 clicks, 20 impressions, average position 27.0; both queries verified to this page | [Google Search Console](./implementation-report.md#17-search-console-findings), [Metadata guide](https://puzzle-ui.com/docs/seo/metadata) | P1: the page had generic title/description despite relevant impressions. Its title and description now name website metadata and canonical URLs; remeasure after deployment. |
| React authentication; TypeScript authentication; React full-stack integrations | Configure auth services or connect them to a supported app | `/docs/auth` for auth core; `/docs/fullstack` for adapters | `/docs/session`, `/docs/storage`, `/docs/tutorials/auth` | High | High | Not verified | Not verified | Not verified | [Auth](https://puzzle-ui.com/docs/auth), [Fullstack](https://puzzle-ui.com/docs/fullstack), [Auth tutorial](https://puzzle-ui.com/docs/tutorials/auth) | P1: keep core policy/services, session lifecycle, browser clients, and server/framework adapters differentiated. |
| TypeScript session management; storage adapters | Manage sessions or database-neutral persistence | `/docs/session` and `/docs/storage` (distinct intents) | `/docs/auth`, `/docs/tutorials/storage` | Medium-high | High for server-side adoption | Not verified | Not verified | Not verified | [Session](https://puzzle-ui.com/docs/session), [Storage](https://puzzle-ui.com/docs/storage), [Storage tutorial](https://puzzle-ui.com/docs/tutorials/storage) | P2: use package-specific pages and avoid implying client-side session storage or universal adapter guarantees. |
| TypeScript headless CMS; content publishing services | Model, validate, and publish application-owned content | `/docs/cms` | `/docs/fullstack/cms`, `/docs/pieces/components/cms` | Medium | Medium-high; CMS package is pre-release | Not verified | Not verified | Not verified | [CMS docs](https://puzzle-ui.com/docs/cms), [CMS section compositions](https://puzzle-ui.com/docs/pieces/components/cms) | P2: explain that the host owns persistence, authorization, tenant context, and scheduling. Label the package's release status. |
| TypeScript media management; provider-neutral media storage | Manage asset metadata, processing contracts, and browser preparation | `/docs/media` | `/docs/media-cloudflare`, `/docs/fullstack/media`, `/docs/storage` | Medium | Medium-high; Media packages are pre-release | Not verified | Not verified | Not verified | [Media docs](https://puzzle-ui.com/docs/media), [Cloudflare adapter](https://puzzle-ui.com/docs/media-cloudflare) | P2: distinguish asset metadata from binary object storage; document framework and provider boundaries and release status. |
| Cloudflare R2 media adapter; Cloudflare Images integration | Integrate a specific object-storage and image-processing provider | `/docs/media-cloudflare` | `/docs/media`, `/docs/fullstack/media` | Medium | Medium; provider-specific adoption | Not verified | Not verified | Not verified | [Cloudflare Media docs](https://puzzle-ui.com/docs/media-cloudflare), [Media package](https://puzzle-ui.com/docs/media) | P2: keep R2/Images capabilities, server-only constraints, and pre-release availability explicit. |
| TypeScript commerce contracts; provider-independent payments | Build orders, payment lifecycles, refunds, and booking logic | `/docs/commerce` | `/docs/payment-providers`, `/docs/fullstack` | Medium | Medium-high | Not verified | Not verified | Not verified | [Commerce docs](https://puzzle-ui.com/docs/commerce), [Fullstack payments](https://puzzle-ui.com/docs/fullstack) | P2: distinguish provider-neutral contracts from adapters and hosted checkout; retain trusted-server and idempotency guidance. |
| TypeScript payment provider adapters | Connect server-side payment providers to Puzzle Commerce contracts | `/docs/payment-providers` | `/docs/commerce`, `/docs/fullstack` | Medium | Medium-high | Not verified | Not verified | Not verified | [Payment provider adapter guide](https://puzzle-ui.com/docs/payment-providers), [Commerce](https://puzzle-ui.com/docs/commerce) | P2: explain server-only exports, supported adapters, and caller-owned secrets; do not imply hosted payments or client-safe credentials. |
| React project generator; Next.js or TanStack Start Puzzle starter | Scaffold an application with supported options | `/docs/create` | `/docs/getting-started`, `/docs/create/configuration`, `/docs/create/deployment` | Medium-high | High: adoption path | Not verified | Not available | No matching query observed in the Search Console snapshot | [Create docs](https://puzzle-ui.com/docs/create), [Getting Started](https://puzzle-ui.com/docs/getting-started) | P1: keep generated shapes and optional features synchronized with tested templates; do not claim unsupported combinations. |
| React hooks; React SVG icon library | Find focused React hooks or icons | `/docs/hooks` and `/docs/icons` (distinct intents) | `/docs/ui`, `/docs/theme`, `/docs/getting-started` | High for broad terms | Medium-high | Not verified | Not verified | Not verified | [Hooks](https://puzzle-ui.com/docs/hooks), [Icons](https://puzzle-ui.com/docs/icons) | P2: monitor package-level query demand before creating more landing pages; keep each overview specific to its API. |
| React 19 UI library; Next.js UI components; Tailwind CSS React components | Check compatibility for a specific runtime or styling stack | Existing package/framework guides; no separate landing page | `/docs/ui`, `/docs/create`, `/docs/pieces/framework-integration`, framework guides | High | Medium: only where support is verified | Not verified | Not verified | Not verified | [Framework compatibility guide](../ai/frameworks/compatibility.md), [Next.js guide](../ai/frameworks/nextjs.md), [Create docs](https://puzzle-ui.com/docs/create) | P2: do not target Tailwind component queries as a general Puzzle claim; publish compatibility statements only from manifests, adapters, and tests. |

## Observed Search Console baseline

Read-only browser report reviewed on 2026-11-22 for the Domain property
`sc-domain:puzzle-ui.com`, Web search type, with no country or device filter.
Although the 16-month range was selected, the chart contained data only from
2026-11-12 through 2026-11-20. Treat this as a nine-day, low-volume baseline,
not a representative seasonal or annual trend.

| Report dimension | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| Property total | 8 | 74 | 10.8% | 27.2 |
| Homepage (`https://puzzle-ui.com/`) | 5 | 9 | 55.6% | 7.2 |
| `/docs/seo/metadata` | 0 | 20 | 0% | 27.0 |
| `/docs/seo` | 0 | 10 | 0% | 79.0 |
| `/docs/ui/editors/text-editor` | 0 | 8 | 0% | 36.5 |
| `/docs/icons` | 0 | 4 | 0% | 6.5 |

Observed query examples:

| Query | Clicks | Impressions | CTR | Average position | Verified landing page |
|---|---:|---:|---:|---:|---|
| `puzzle ui` | 3 | 5 | 60% | 1.4 | Homepage |
| `website metadata` | 0 | 6 | 0% | 39.5 | `/docs/seo/metadata` |
| `metadata web page` | 0 | 5 | 0% | 14.8 | `/docs/seo/metadata` |
| `text editor` | 0 | 2 | 0% | 7.5 | `/docs/ui/editors/text-editor` |
| `site metadata` | 0 | 3 | 0% | 46.0 | Not verified at query level |

The visible query table contains only a subset of property totals; do not sum
visible query rows as if they were complete. Search Console impressions are
not keyword search volume. One query (“metadata web page”) is in positions
4–20, but has only five impressions; the Text Editor query has two
impressions. These are monitoring signals, not sufficient evidence for broad
rewrites.

The HTTP homepage also appears in the Pages report (1 click, 4 impressions,
average position 3.3). A live read-only check confirms the HTTP URL redirects
to the canonical HTTPS homepage in one hop, so no URL migration is indicated.

## Competitor and alternative landscape

These are not interchangeable products. The grouping below is based on
first-party descriptions and documentation checked for this research, not on
rank or market share.

| Product | Model and documented positioning | Relationship to Puzzle and search implication | First-party source |
|---|---|---|---|
| shadcn/ui | Open-code distribution: the CLI adds component source to the consumer's project rather than providing a conventional installed component package. | Direct alternative for developers who want to own and modify component source; explain Puzzle's package-based API model accurately rather than claiming equivalence. | [Docs](https://ui.shadcn.com/docs) |
| Material UI | Prebuilt React component library implementing Material Design, with customization for product design systems. | Direct broad-library alternative; avoid unsupported comparisons about adoption, quality, or bundle size. | [Overview](https://mui.com/material-ui/getting-started/) |
| Mantine | Package-based React component and hook ecosystem with documented setup templates. | Direct broad-library alternative; Puzzle should differentiate on its cross-package ecosystem and actual API boundaries, not on unverified feature counts. | [Getting started](https://mantine.dev/getting-started/) |
| Chakra UI | React package/provider and snippets setup; its installation documentation describes a runtime Emotion styling layer and a phased styling roadmap. | Direct component/theming alternative. Any comparison must be dated because the roadmap may change. | [Installation](https://chakra-ui.com/docs/get-started/installation) |
| Ant Design | Broad catalog organized into general, layout, navigation, data-entry, and data-display components. | Direct alternative for teams needing a comprehensive catalog; its category structure is a useful information-architecture reference, not a claim about rankings. | [Component overview](https://ant.design/components/overview/) |
| daisyUI | Tailwind CSS plugin installed into CSS and used through component class names. | Adjacent styling approach, not a React component package with the same API model. Do not target “Tailwind React components” as if Puzzle were Tailwind-based. | [Install](https://daisyui.com/docs/install/) |
| Storybook | Frontend workshop for developing, testing, and documenting UI components in isolation. | Developer tooling adjacent to Puzzle, not a runtime UI library competitor. | [Docs](https://storybook.js.org/docs) |
| Magic UI | Reusable copy-and-paste components and blocks, particularly for landing pages and user-facing marketing material. | Adjacent to Puzzle UI and Pieces. Compete on practical composability and API documentation, not animation counts or template claims. | [Docs](https://magicui.design/docs) |
| 21st.dev | Community registry and publishing platform for React components, templates, and themes, with previews and install instructions. | Discovery/distribution alternative, not a single package with one component contract. Respect authorship and per-component licensing in any future comparison. | [Site](https://21st.dev/) |
| Aceternity UI | React and Next.js components, blocks, and interaction patterns built around Tailwind CSS and Motion, distributed for copying or CLI installation. | Adjacent to Pieces and visual component searches; don't imply Puzzle supplies the same animation catalog or full templates. | [Site](https://ui.aceternity.com/) |
| React Bits | Open-source animated React components and backgrounds; its introduction describes JavaScript/TypeScript and plain CSS/Tailwind variants. | Adjacent for motion-focused component discovery, not a direct substitute for Puzzle's broader package ecosystem. | [Introduction](https://www.reactbits.dev/get-started/introduction) |
| HeroUI | React component system built on React Aria Components and Tailwind CSS v4, with a compound-component model. | Direct React UI alternative; compatibility and component behavior should be checked against its current major version. | [Getting started](https://heroui.com/en/docs/react/getting-started), [v3 release](https://heroui.com/en/docs/react/releases/v3-0-0) |
| Radix UI | Low-level, unstyled primitives focused on accessibility, customization, and design-system composition. | Adjacent primitive foundation; Puzzle is a higher-level styled component ecosystem. Don't claim Puzzle is built on Radix. | [Introduction](https://www.radix-ui.com/primitives/docs/overview/introduction) |
| Park UI | Designed component system built on Ark UI and Panda CSS, with composability and code distribution. | Adjacent styled-system alternative; compare token and styling models only with current, verifiable evidence. | [Introduction](https://park-ui.com/docs/introduction) |

The review does **not** establish which competitor pages attract traffic, which
queries they rank for, or their backlink totals. Those require external
measurement sources. It does establish that “React component library” mixes
package-based kits, source-copy systems, low-level primitives, registries,
styling plugins, and developer tools. Puzzle's content should help visitors
identify which model they need.

## Component keyword inventory

The following inventory is drawn from the existing public UI catalog. A query
such as “React [component]” is a **candidate intent**, not proof of demand or a
recommendation to create another route. The six UI pages called out in the
opportunity table have explicit primary ownership in
[`searchIntentMap`](../../apps/site/src/lib/search-intents.ts); other component
pages keep their existing route and metadata until measured data or a real
documentation gap justifies further work.

| Category page | Existing component documentation pages (candidate query subject) |
|---|---|
| [`/docs/ui/actions`](https://puzzle-ui.com/docs/ui/actions) | `button`, `button-group`, `toggle-group` |
| [`/docs/ui/data-display`](https://puzzle-ui.com/docs/ui/data-display) | `alert`, `avatar`, `badge`, `card`, `data-table`, `empty-state`, `image-box`, `image`, `media-frame`, `paper`, `progress`, `rating`, `skeleton` |
| [`/docs/ui/editors`](https://puzzle-ui.com/docs/ui/editors) | `json-editor`, `text-editor` |
| [`/docs/ui/forms`](https://puzzle-ui.com/docs/ui/forms) | `autocomplete`, `checkbox`, `color-picker`, `date-picker`, `date-range-picker`, `field-array`, `file-upload`, `form-field`, `image-cropper`, `image-hotspot-editor`, `image-upload`, `input-group`, `label`, `number-input`, `radio-group`, `select`, `slider`, `stepper`, `switch`, `text-area-input`, `text-input`, `time-picker`, `token-input`, `video-upload` |
| [`/docs/ui/layout`](https://puzzle-ui.com/docs/ui/layout) | `app-bar`, `aspect-ratio`, `background`, `bottom-navigation`, `breadcrumbs`, `collapsable-sidebar`, `container`, `grid`, `page-layout`, `resizable-panels`, `scroll-area`, `section-header`, `section-stack`, `section`, `separator`, `sidebar`, `stack` |
| [`/docs/ui/navigation`](https://puzzle-ui.com/docs/ui/navigation) | `accordion`, `carousel`, `link`, `pagination`, `sortable-tree`, `tabs`, `tree-view` |
| [`/docs/ui/overlays`](https://puzzle-ui.com/docs/ui/overlays) | `backdrop`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `notification`, `popout`, `popover`, `portal`, `tooltip` |
| [`/docs/ui/typography`](https://puzzle-ui.com/docs/ui/typography) | `heading`, `text` |
| [`/docs/ui/utilities`](https://puzzle-ui.com/docs/ui/utilities) | `preview`, `rendering`, `scroll-lock`, `transition` |

This is 83 individual component references across nine categories. It is a
coverage inventory, not a 83-keyword publishing plan. Puzzle Pieces has 67
documented section families across ten categories; the initial search-focused
set is Hero, Features, Pricing, Testimonials, FAQ, and CTA. Those section
pages describe composable UI and caller-owned data/actions; do not imply
complete application flows.

## Cannibalization and ownership rules

The current [`searchIntentMap`](../../apps/site/src/lib/search-intents.ts)
assigns distinct primary intents. Keep the following division:

- `/` owns the broad Puzzle/React UI ecosystem overview and library-selection
  intent; it introduces the packages and directs visitors to installation.
- `/docs/ui` owns component browsing, category navigation, examples, and API
  discovery; it is not a second homepage or comparison article.
- `/docs/theme` owns theme-provider, design-token, and theming implementation.
- `/docs/pieces` owns reusable page sections; category pages narrow to a
  section family, and individual references describe their own component.
- Prioritized component references own specific Button, Date Picker, Select,
  Dialog, Text Editor, and DataTable queries.
- `/docs/auth` owns framework-independent authentication concepts;
  `/docs/session` owns session lifecycle; `/docs/fullstack` owns browser/server
  and framework integration.
- `/docs/seo`, `/docs/create`, `/docs/hooks`, `/docs/icons`, and `/docs/storage`
  own their respective package documentation intents.

Do not create a new URL for a singular/plural variation or a competitor name.
Before adding a page, check the existing canonical owner and nearby docs. If
Search Console later shows two Puzzle pages competing for one intent, first
improve their differentiation and contextual links; consolidate only when
their substance is genuinely redundant. Preserve URLs.

## Prioritization

1. **P1 — maintain exact-fit existing pages:** homepage, component overview,
   theme, Pieces overview, selected component pages, SEO/Auth/Fullstack/Create
   package guides. These already have real APIs and examples.
2. **P1 — use Search Console before adding new content:** identify
   impression-bearing queries, especially positions 4–20, and confirm the page
   serves the query before changing it.
3. **P2 — component-page improvements:** prioritize from measured impressions,
   technical completeness, and a concrete information gap; the current
   Button, Date Picker, Dialog, Select, Text Editor, and DataTable references
   are the initial review set, not a claim about their traffic.
4. **P2 — technical tutorials:** extend an existing tutorial only when it
   adds runnable, maintained value beyond the API reference.
5. **Not recommended now:** mass-generated keyword pages, thin competitor
   alternatives, or claims about search volume, popularity, or rankings
   without evidence.

Revisit priorities after authorized Search Console access. Record query,
landing page, country/device, period, metric source, and confidence for every
measured opportunity.
