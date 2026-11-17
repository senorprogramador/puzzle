# Puzzle Pieces: Architecture and Section Catalog

`@puzzle-ui/pieces` contains composed, reusable page sections built on Puzzle UI.
This document records the E0 architecture audit, E1 shared foundations, and
the proposed catalog for the upcoming website-section work. The shared
foundations are implemented; the listed complete sections are not.

## E1 shared foundations

E1 adds a small shared contract without turning Pieces into a page builder:

| API | Ownership and use |
| --- | --- |
| `SectionRootProps<C>` | Exported by Pieces; derives semantic element attributes, ARIA, styles, theme, width, and padding options from UI `SectionProps<C>`. Internal `SectionStack` coordination props are omitted. Use it only when a family exposes the common section-root contract. |
| `SectionContentWidth` | Non-nullable alias of UI `ContainerProps["widthPreset"]`; it does not define another width scale. |
| `SectionTheme` | Alias of UI `SectionTheme`; theme colors and backgrounds remain owned by UI/Theme. |
| `SectionAlignment` | Alias of UI `SectionHeaderAlignment`; use only for shared heading/content alignment. |
| UI `SectionHeader` | Exported by `@puzzle-ui/ui`; offers optional eyebrow, heading, description, and action slots. Uses the existing `Heading` and `Text`, returns `null` when empty, forwards native header attributes, and leaves actions/data/routing to consumers. It is Beta while future Pieces families exercise the API. |

Use `Section` for semantic root, themed surface, spacing, and built-in
container behavior; use `Container`, `Grid`, `Stack`, `AspectRatio`, `Card`,
`Image`, `Button`, and `Link` for their existing responsibilities. UI `Section`
now forwards native/ARIA/data attributes and supports its already-typed
polymorphic `as` prop. This corrects the former mismatch between its public
type and rendered root without changing existing defaults.

No universal item, link, CTA, media, spacing, or responsive type is added:
family items remain family-specific, and links/actions/media remain
consumer-provided React nodes unless a family proves a narrower typed contract.
There is no global variant/preset type. A family defines its own discriminated
union when variants genuinely require different props; a preset configures one
shared renderer only when the DOM and behavior are actually shared.

No Core or Hooks extraction was justified: Core already supplies
`ResponsiveValue`/resolvers, and UI already supplies `Grid`, `Accordion`,
`Carousel`, and `Tabs` for their respective responsive/interactive behaviors.
No new hook or competing UI layout primitive was added. The new
`SectionHeader` is in UI because the visual/content composition is generic and
recurs across many families.

`SectionHeader` uses only Theme variables, mobile-first flex layout, and
wrapping actions; no container query, layout measurement, animation, or
reduced-motion behavior is needed. Its tests cover prop forwarding, empty
slots, semantic headings, server markup, theme inheritance, token spacing, and
responsive action layout. The UI docs, site sidebar, catalog, and UI root
README include the new Beta component.

## E0 scope and findings

The audit covered the Pieces package source, public exports, styles, tests,
build and test configuration, all current Pieces documentation, and the
relevant public APIs and package configuration for Core, Hooks, UI, Icons,
Theme, the documentation site, the playground, and the root Bun workspace.

### Scope discrepancy

The requested inventory is described as 48 families, but its lists contain
**49 names**: 10 marketing, 7 SaaS, 6 commerce, 6 editorial, 8 business, 5
application, and 7 specialized families. The catalog and variant matrix below
include every named family. If a separate project scope requires exactly 48,
resolve the discrepancy before implementation rather than silently dropping a
family.

### Package boundaries and compatibility

| Area                | Audited baseline                                                                                                                                                                                                                                                                      | E0 decision                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace           | Bun workspaces; root scripts expose package build, typecheck, tests, and site commands.                                                                                                                                                                                               | Keep validation and package ownership within the current workspace.                                                                                                    |
| `@puzzle-ui/pieces` | React 19 peer dependency; depends on Core, Hooks, Icons, Theme, and UI. `src/index.ts` re-exports component-family indexes. tsdown builds ESM/CJS and declarations, unbundles dependencies, and injects imported CSS. The package has one root export and marks CSS as a side effect. | Add new named exports through their family index and `src/index.ts`. Do not change the root export map, existing names, defaults, or aliases. Do not add dependencies. |
| Core                | Framework-independent helpers: responsive values, class names, string, color, timing, and shared types.                                                                                                                                                                               | Add functionality here only if it is framework-independent and generally reusable beyond sections.                                                                     |
| Hooks               | Public exports are `useKeyboardKeys` and `useRovingFocus`. `useZoomPanPinch` exists in source but is not exported by the package entry point.                                                                                                                                         | Reuse only public hooks when their interaction model fits; do not make a new section depend on the unexported hook.                                                    |
| UI                  | Public React primitives include layout, forms, navigation, data display, overlays, typography, and utilities.                                                                                                                                                                         | Compose with these primitives where they fit; do not duplicate them in Pieces.                                                                                         |
| Icons               | Exports `Icon`; icon collections are managed by the Icons package.                                                                                                                                                                                                                    | Accept icon nodes from consumers or use the public icon API; do not hardwire a collection or icon choice into generic section content.                                 |
| Theme               | Owns typed tokens, Theme/scoped-theme behavior, font utilities, and generated CSS variables.                                                                                                                                                                                          | Consume existing semantic tokens. A section-specific design value is not by itself a reason to expand the global token API.                                            |
| Site                | Pieces documentation is under `apps/site/content/docs/pieces`; `sidebar/pieces.ts` supplies navigation. The site build downloads configured fonts before building.                                                                                                                    | Document every public family in the existing Pieces docs area and keep sidebar routes synchronized.                                                                    |
| Playground          | The Vite starter and Storybook are not currently wired to `@puzzle-ui/pieces`; the app package has no Pieces dependency.                                                                                                                                                              | Treat Playground demos as optional until a specific Epic includes that integration; do not add a dependency just for E0.                                               |

No implementation, package manifest, export, or dependency changes are part of
E0. The unrelated pre-existing root `package.json` and `bun.lock` worktree
changes were left untouched.

## Existing Pieces inventory

The package currently has 45 distinct component implementations, plus 11
backward-compatible aliases (7 Hero aliases and 4 Data Display aliases).
Public APIs are named exports, grouped by family, and re-exported from the
package root. Components primarily compose semantic HTML and accept consumer
content as React nodes; UI primitives are used where they provide real behavior
rather than as mandatory wrappers.

| Family               | Existing components and purpose                                                                                                                                                                                                                                                      | Reuse and API pattern                                                                                                                                                                                                                                                           | Tests and docs                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hero                 | `Hero` is the configurable introduction. Canonical presets are `SplitHero`, `AsymmetricHero`, `CenteredHero`, `FullScreenHero`, `VideoHero`, `ImageHero`, `MinimalHero`, `AgencyHero`, `RestaurantHero`, `DashboardWelcomeHero`, `CampaignHero`, `ComingSoonHero`, and `SearchHero`. | Shared `HeroProps`; configurable semantic root and heading; content, action, media, search, and metadata slots; optional image/video backgrounds. `createHeroPreset` applies defaults while consumer props override them. Presets reuse the renderer instead of copying markup. | Unit, component, preset, media, and Chromium browser coverage. Stable, detailed docs with layout, media, theme, responsive, accessibility, API, and runnable-preview examples. |
| Dashboard            | `DashboardHeader` (title/description/actions), `DashboardStatCard`, `DashboardStatGroup`, `DashboardActivityFeed`, `DashboardProgressCard`, and `DashboardShell` (topbar/sidebar/content composition).                                                                               | Shared dashboard types; slots for consumer-owned content. Progress cards use UI `LinearProgress`; styles use theme variables and responsive CSS.                                                                                                                                | `dashboard.test.tsx`; dashboard docs page (Beta).                                                                                                                              |
| Dashboard navigation | `DashboardNavigation`, `DashboardSidebar`, `DashboardTopbar`, `DashboardUserMenu`, `DashboardMobileNavigation`, and `DashboardBreadcrumbs`.                                                                                                                                          | Shared navigation/item types and consumer-provided links, labels, and actions; no router integration.                                                                                                                                                                           | Navigation and cross-composition browser tests; navigation docs page (Beta).                                                                                                   |
| Data display         | `MetricComparison` compares values; `EmptyStatePanel` composes empty/error-oriented content.                                                                                                                                                                                         | `EmptyStatePanel` reuses UI `EmptyState`/related UI exports; data values and presentation remain consumer-controlled. `StatCard`, `StatGroup`, `ActivityTimeline`, and `ProgressOverview` are aliases of Dashboard components, not new implementations.                         | `data-display.test.tsx`; data-display docs page (Beta).                                                                                                                        |
| Project              | `ProjectStatusBadge`, `ProjectProgress`, `ProjectMembers`, `ProjectCard`, `ProjectGrid`, `ProjectList`, and `ProjectHeader`.                                                                                                                                                         | Shared project types for status, members, cards, and collections; project progress uses UI `LinearProgress`.                                                                                                                                                                    | Project and cross-composition browser tests; project docs page (Beta).                                                                                                         |
| Settings             | `SettingsSection`, `SettingsGroup`, `SettingsRow`, `FormActions`, `ProfileHeader`, and `SecurityMethodCard`.                                                                                                                                                                         | Small typed composition pieces with consumer-provided form controls and actions; no form state or persistence layer.                                                                                                                                                            | Settings tests; settings docs page (Beta).                                                                                                                                     |
| Feedback             | `NotificationItem`, `NotificationList`, `ErrorStatePanel`, and `ConfirmAction`.                                                                                                                                                                                                      | Consumer supplies notification data/actions. `ErrorStatePanel` uses UI `Alert`; `ConfirmAction` composes UI `Button` and `Dialog`.                                                                                                                                              | Feedback tests; feedback docs page (Beta).                                                                                                                                     |

There are seven current Pieces docs pages: Hero plus Dashboard, Dashboard
Navigation, Data Display, Project, Settings, and Feedback. The latter six
describe their compositions as Beta. The package has a dedicated Vitest
configuration with Node unit, jsdom component, and headless Chromium browser
projects. Existing coverage is not uniform across every component; new section
work must add focused coverage rather than assume that a family-level test
covers every public variant.

## Hero audit: reference architecture

Hero is the design and documentation reference, not a requirement to force
every section into one generic renderer.

### API and composition

- `HeroProps` exposes typed layout, media position, alignment, height, theme,
  overlay, and content-width unions, plus semantic-root/heading choices,
  classes, inline style, and ARIA props.
- Content fields and action/media/search/meta slots accept `ReactNode`; the
  consumer owns the actual buttons, forms, router links, and application data.
- Presets share the base renderer and merge defaults with consumer props.
  Existing preset names and the documented aliases are public compatibility
  commitments and must remain intact.
- CSS is scoped under `.puzzle-hero`, uses BEM-like element classes and
  `data-*` layout attributes, and consumes Theme CSS variables.

### DOM, responsive behavior, accessibility, and tests

The root is a semantic section by default. The current composition has an
optional background layer, an inner layout container, a conditional media
wrapper, and a content wrapper with only populated slots rendered. The
background image/video is decorative; normal media is supplied by the
consumer. Hero styles adapt split/asymmetric layouts at tablet/mobile widths,
support mobile reversal, and include reduced-motion handling for video.
Accessibility behavior and browser layout are tested, including keyboard
interaction, decorative media, responsive configuration, video behavior, and
presets.

The Hero docs establish the documentation pattern: installation and named
exports, runnable `<Preview>` examples, layouts and specialized presets,
consumer customization, responsive behavior, accessibility, compatibility,
and a typed API reference. Preserve this page and API; use its information
architecture as the model for new pages, not its full prop surface as a
mandatory shared API.

### Audited follow-up

Hero CSS refers to `--puzzle-color-overlay-subtle` and
`--puzzle-color-overlay-strong`, but those variables are not defined in the
audited Theme source. This E0 plan does not alter Hero or Theme. Before reusing
these names or changing Hero overlays, resolve the mismatch in a separate,
explicitly scoped change and cover it with a regression test.

## UI primitive inventory

Use the public UI package before creating another primitive. Current exports
relevant to section work include:

| Category                 | Available primitives                                                                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions                  | `Button`, `ButtonGroup`, `ToggleGroup`                                                                                                                                                                                                            |
| Data display             | `Alert`, `Avatar`, `Badge`, composable `Card`, `EmptyState`, `DataTable`, `Image`, `ImageBox`, `Paper`, `CircularProgress`, `LinearProgress`, `Rating`, `Skeleton`                                                                                |
| Editors                  | `TextEditor`, `TextEditorToolbar`, `TextRenderer` and document types                                                                                                                                                                              |
| Forms                    | `Autocomplete`, `Checkbox`, `ColorPicker`, `DatePicker`, `FileUpload`, `FormField`, `InputGroup`, `NumberInput`, `TextAreaInput`, `TextInput`, `Label`, `RadioGroup`/`Radio`, `Select`, `Slider`, `Stepper`, `Switch`, `TimePicker`, `TokenInput` |
| Layout                   | `AppBar`, `AspectRatio`, `Background`, `BottomNavigation`, `Breadcrumbs`, `CollapsableSidebar`, `Container`, `Grid`/`GridItem`, `PageLayout`, `ResizablePanels`, `ScrollArea`, `Section`, `SectionStack`, `Separator`, `Sidebar`, `Stack`         |
| Navigation               | `Accordion`, `Carousel`/controller, `Link`, `Pagination`, `Tabs`, `TreeView`                                                                                                                                                                      |
| Overlays                 | `Backdrop`, `Command`, `ContextMenu`, `Dialog`, `Drawer`, `DropdownMenu`, `Notification`, `Popout`, `Portal`, `Popover`, `Tooltip`                                                                                                                |
| Typography and utilities | `Text`, `Heading`, `Preview`, `ScrollLock`, `Transition`                                                                                                                                                                                          |

`Section` already provides a semantic root, theme, full-width/no-padding and
compact-spacing options, and may add a content container depending on its
configuration. `Container`, `Grid`, and `Stack` already solve general
container/layout needs; `Grid` accepts responsive values from Core. Avoid
nesting a second section/container around these without a layout reason.

## Core, Hooks, Icons, and Theme reuse

| Layer | Existing capability                                                                                                                                                                             | Planned use / boundary                                                                                                                                                                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core  | `cn`; `ResponsiveValue` and responsive-value resolvers; safe CSS/string, casing, initials, color, and debounce helpers.                                                                         | Prefer UI primitives for layout. Use Core only for logic reused beyond one section; keep content-specific rendering and CSS in Pieces. Do not add a second class combiner or responsive-value format.                                                                  |
| Hooks | Public `useKeyboardKeys` and `useRovingFocus`.                                                                                                                                                  | Use for genuine keyboard interaction (for example a custom roving tab set) only when a native element/UI primitive is insufficient. Prefer native disclosure, links, buttons, and the UI `Accordion`/`Carousel`/`Tabs` APIs. Do not add hooks for static compositions. |
| UI    | Components in the inventory above, including `Section`, `Container`, `Grid`, `AspectRatio`, `Image`, `Card`, `Button`, `Link`, `Accordion`, `Carousel`, `Tabs`, and form controls.              | Prefer slots/children and existing primitives for semantics and accessible interaction; don't create another design-system version in Pieces.                                                                                                                          |
| Icons | `Icon` and Iconify collection registry.                                                                                                                                                         | Keep icon selection optional and consumer-controlled. Do not make a marketing or dashboard section depend on a specific icon collection.                                                                                                                               |
| Theme | Typed light/dark color schemes; semantic color, typography, spacing, radius, shadow/elevation, border, breakpoint, layout, overlay, motion, and z-index tokens; Theme scopes and font handling. | Use defined `--puzzle-*` variables, preserving theme/scoped-theme behavior. Verify token names in Theme before use; add a shared token only for a demonstrated cross-package design need.                                                                              |

The E0 catalog alone did not justify new Core, Hooks, Icons, or Theme
functionality. E1 adds the generic UI `SectionHeader` for the repeated
eyebrow/title/description/actions composition; complete website compositions
remain in Pieces.

## Proposed architecture and API conventions

### Layer ownership

| Layer  | Owns                                                                                                | Does not own                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Core   | Framework-independent, broadly reused algorithms/types.                                             | React markup, section-specific props, or design composition.                                                     |
| Hooks  | Reusable stateful browser/keyboard interaction.                                                     | Static layout, styling, routing, data fetching, or domain policy.                                                |
| UI     | Generic accessible primitives and token-aware layout/form/navigation behavior.                      | Finished marketing or product-page compositions.                                                                 |
| Pieces | Complete, themed, responsive sections and purposeful presets composed from UI and consumer content. | Application data fetching, router integration, payments, scheduling, persistence, or domain-specific validation. |

### Recommended organization and API

- Keep each family in `src/components/<family>/` with an implementation,
  family-scoped CSS, optional family types, tests, and an `index.ts` following
  the existing layout. Export the family from `src/index.ts`; do not invent
  package subpaths or duplicate exports.
- Use named React function components and explicit `<Family>SectionProps`
  types. Keep semantic roots and useful HTML attributes available. Add shared
  types only after repeated, compatible requirements appear in multiple
  families; do not create a speculative universal `SectionProps`.
- Make content and actions consumer-composable (`ReactNode`) where the
  consumer needs to provide buttons, framework-specific links, forms, charts,
  maps, media, or branded cards. Use typed item data for repeated, structurally
  uniform content, and keep that data shape minimal. Do not prescribe an
  application's product, money, date, user, or routing model.
- Use a small discriminated `variant`/layout union when compositions genuinely
  differ. Share a renderer only when the DOM structure and behavior are
  actually shared; otherwise use clearly named exports/presets around a
  canonical base, as Hero does. Variants must describe use cases, not color,
  arbitrary spacing, or combinations of independent style flags.
- Use CSS classes and data attributes for stable visual/layout variants, scoped
  to the family stylesheet. CSS owns responsive layout; JavaScript should not
  measure the viewport for ordinary responsive behavior.
- Keep actions as native links/buttons or supplied UI components. Do not
  implement routing, network requests, form validation, inventory, pricing
  calculations, availability algorithms, or persistence inside a section.
- Treat media as consumer-owned content unless a family has a demonstrated,
  small, stable media contract. Preserve alt text, image/video fallbacks,
  intrinsic sizing, and reduced-motion behavior where applicable.

## Minimal DOM and accessibility audit

For new sections:

1. Use one semantic section root when the content is a page section. Use
   headings, lists, descriptions, tables, `figure`, `nav`, `address`, and
   footer semantics according to the actual content; do not nest landmarks
   just to gain styles.
2. Do not wrap an existing `Section` in another `Section`, or combine
   `Section` and `Container` when one already provides the necessary content
   constraint. Check whether a UI primitive adds its own wrapper before
   composing it.
3. Render optional slots only when supplied. Add wrappers only for a real
   layout, positioning, clipping, or accessibility purpose. Prefer CSS
   pseudo-elements for purely decorative marks and backgrounds.
4. For repeated content, render the semantic list/table structure directly;
   do not add a layout wrapper around every item unless it is needed.
5. Do not use redundant `role`, ARIA labels, empty headings, hidden content,
   or clickable non-interactive elements. Associate labels and descriptions
   with controls; provide visible focus and keyboard-operable controls.
6. Preserve logical DOM/focus order when CSS changes visual order. Verify
   mobile stacking, zoom/reflow, long labels, and overflow in a real browser.
7. Respect `prefers-reduced-motion` for non-essential motion, including
   auto-advancing or animated content. Do not auto-advance content by default.

## Definitive component catalog and variant matrix

The following are proposed compositional variants and their use cases, not
committed component names or a promise to implement every variation at once.
Two variants are kept when a third would only be a styling toggle. Interaction
and data are called out separately from layout variants. All examples should
remain composable with consumer content.

### Marketing and conversion

| Family                | Meaningful layouts and use cases                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AnnouncementSection` | **Inline notice** for a short site-wide update; **full-width banner** for a prominent campaign; **utility row** when message and one or more actions must coexist. Dismissal is optional behavior, not a separate layout. |
| `LogoCloudSection`    | **Horizontal logo row** for a few partners; **responsive logo grid** for a larger customer set; **featured-plus-grid** when one proof point leads.                                                                        |
| `FeaturesSection`     | **Uniform feature grid** for peers; **media/text split** for one primary feature; **bento layout** when feature importance and content density differ.                                                                    |
| `BenefitsSection`     | **Icon/card grid** for concise benefits; **checklist** for scannable outcome statements; **media-led split** for a benefit that needs demonstration.                                                                      |
| `StatsSection`        | **KPI row** for a compact proof band; **stat-card grid** for several peer metrics; **lead metric plus supporting figures** for an explicit hierarchy.                                                                     |
| `TestimonialsSection` | **Featured quote** for one strong endorsement; **quote grid** for several independent testimonials; **carousel** only when a long set must be navigable in limited space.                                                 |
| `CTASection`          | **Centered action** for one clear next step; **full-width banner** as a page transition; **media split** when the action needs visual context.                                                                            |
| `FAQSection`          | **Single accordion** for one topic; **grouped columns** for distinct topics; **static Q&A list** when all answers should remain visible and printable.                                                                    |
| `HowItWorksSection`   | **Step row** for a short linear process; **vertical timeline** for longer explanatory steps; **media-paired steps** when each step needs a screenshot or illustration.                                                    |
| `ComparisonSection`   | **Semantic comparison table** for many shared attributes; **side-by-side checklists** for a short choice; **featured-option comparison** when one option needs emphasis without hiding alternatives.                      |

### SaaS and product

| Family                   | Meaningful layouts and use cases                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ProductShowcaseSection` | **Product/media split** for one feature; **screenshot gallery** for several views; **UI-led feature grid** for multiple small capabilities.                                                                                          |
| `IntegrationsSection`    | **Logo grid** for breadth; **category groups** for a large ecosystem; **featured integration plus grid** when one connection is the main proof point.                                                                                |
| `UseCasesSection`        | **Audience cards** for distinct customer types; **tabbed scenarios** when only one detailed use case should be shown at a time; **alternating case blocks** for editorial storytelling.                                              |
| `SecuritySection`        | **Trust-badge strip** for concise assurance; **control/compliance grid** for grouped capabilities; **policy-detail list** when evidence and explanations matter.                                                                     |
| `PricingSection`         | **Tier-card grid** for a small number of plans; **semantic comparison table** for feature-heavy plans; **usage/quote layout** for configurable or sales-led pricing. Billing controls/calculations remain consumer-owned.            |
| `CodeShowcaseSection`    | **Single code panel** for one copyable example; **code-and-explanation split** for a tutorial; **file/language tabs** when several snippets are needed. Syntax highlighting and copy behavior must be supplied or explicitly scoped. |
| `RoadmapSection`         | **Chronological timeline** for a public sequence; **status columns** for planned/in-progress/done; **release cards** for milestone summaries.                                                                                        |

### Commerce

| Family                    | Meaningful layouts and use cases                                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductGridSection`      | **Uniform catalog grid** for browsing; **featured product plus grid** for merchandising; **compact list** for constrained or comparison-oriented surfaces. Product cards/data remain composable.                          |
| `CategoriesSection`       | **Category tile grid** for discovery; **horizontal category rail** for compact navigation; **featured category plus tiles** for curated merchandising.                                                                    |
| `ProductGallerySection`   | **Main image with thumbnail rail** for product detail; **editorial image grid** for a collection; **single featured media** for a focused product story. Zoom/lightbox behavior must be explicit and keyboard accessible. |
| `CartSummarySection`      | **Compact totals panel** beside checkout; **itemized cart review** for the cart page; **order summary with fulfillment/payment details** for final review. Never calculate totals or take payment in the section.         |
| `ProductDetailsSection`   | **Media/details split** for standard product detail; **stacked editorial detail** for long descriptions; **configuration-focused detail** when option controls are supplied by the consumer.                              |
| `CommerceBenefitsSection` | **Service-benefit strip** for shipping/returns assurances; **benefit card grid** for several policies; **policy detail rows** when terms need explanation.                                                                |

### Content and editorial

| Family             | Meaningful layouts and use cases                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlogSection`      | **Article card grid** for recent posts; **featured article plus list** for editorial hierarchy; **compact article list** for a sidebar or homepage excerpt.                  |
| `ContentSection`   | **Prose column** for text-first content; **rich-content/media split** for an explainer; **modular content blocks** for flexible editorial sections.                          |
| `GallerySection`   | **Uniform responsive grid** for equal-weight media; **editorial collage** for art-directed emphasis; **controlled carousel** when the media set exceeds the available width. |
| `TimelineSection`  | **Vertical timeline** for readable chronology; **horizontal milestones** for short sequences on wide screens; **grouped timeline** for dates organized by period.            |
| `ChangelogSection` | **Date-grouped feed** for frequent releases; **release cards** for highlights; **compact chronological list** for a small update history.                                    |

### Business and corporate

| Family               | Meaningful layouts and use cases                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AboutSection`       | **Story/media split** for an organization introduction; **mission and metrics** for concise credibility; **full-width editorial story** for a longer narrative.       |
| `TeamSection`        | **Member grid** for a team directory; **leadership feature plus grid** for hierarchy; **compact team list** when space or profile detail is limited.                  |
| `ServicesSection`    | **Service card grid** for peer offerings; **numbered service list** for a linear process; **service/media split** for a featured offering.                            |
| `CaseStudiesSection` | **Featured case plus list** for a primary success story; **case grid** for equal-weight examples; **metrics-led case layout** when outcomes are the main proof.       |
| `ContactSection`     | **Contact details plus supplied form** for general inquiries; **compact contact panel** for a page-side CTA; **location/map-led layout** for in-person contact.       |
| `CareersSection`     | **Employer introduction plus roles** for a hiring landing page; **role directory** for direct job browsing; **department-grouped openings** for larger organizations. |
| `PartnersSection`    | **Partner logo grid** for a directory; **tiered partner groups** for program levels; **featured partner plus directory** for a strategic relationship.                |
| `AwardsSection`      | **Award/logo strip** for concise proof; **award card grid** for contextual descriptions; **chronological awards list** for a history of recognition.                  |

### Application and dashboard

| Family                     | Meaningful layouts and use cases                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardOverviewSection` | **Metric-led overview** for at-a-glance KPIs; **metrics plus chart/activity split** for analysis; **activity-led overview** when recent work is the main task. Charts and data are supplied by the application.       |
| `OnboardingSection`        | **Step-based flow** for sequential setup; **checklist** for self-paced tasks; **welcome plus next action** for a short first-run experience. State and persistence remain consumer-owned.                             |
| `EmptyStateSection`        | **Centered empty state** for a whole page; **inline empty state** for an empty list/table; **action-led onboarding state** when the user needs a first step.                                                          |
| `ActivitySection`          | **Chronological feed** for recent events; **date-grouped stream** for longer histories; **compact semantic list/table** for dense application activity.                                                               |
| `SettingsSection`          | **Single-column forms** for simple settings; **settings navigation plus pane** for many groups; **profile/security panels** for account-centric settings. Controls, validation, and saving stay with the application. |

### Specialized and interactive

| Family            | Meaningful layouts and use cases                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VideoSection`    | **Full-width player** for a media feature; **player/details split** for a contextual explanation; **inline embed card** for article or product content. Playback controls, captions, and provider integration must be explicit.                |
| `BookingSection`  | **Service then availability flow** for appointment selection; **calendar/slot selector with summary** for direct scheduling; **appointment details panel** for reviewing a selected slot. Availability and booking actions are consumer-owned. |
| `LocationSection` | **Map plus location details** for a single place; **location directory** for multiple places; **compact location card** for a nearby/address summary. Map rendering is supplied by the consumer.                                               |
| `WaitlistSection` | **Centered signup form** for a simple launch list; **product/media split** for pre-launch storytelling; **compact signup banner** for an in-page capture point. Form behavior and consent handling are consumer-owned.                         |
| `ResourceSection` | **Resource grid** for browsing; **featured resource plus list** for editorial promotion; **categorized/filterable directory** when a supplied filter/search control is needed.                                                                 |
| `EventSection`    | **Event details plus registration** for one event; **agenda/timeline** for a schedule; **event directory grid/list** for upcoming events. Time-zone and registration policy remain consumer-owned.                                             |
| `FooterSection`   | **Multi-column sitemap** for a full site footer; **brand plus navigation groups** for a smaller site; **compact legal/utility bar** when the main navigation is elsewhere.                                                                     |

## Testing strategy

Use the package's existing test projects; do not introduce a second runner or
new testing dependency.

1. **Unit (`*.unit.test.ts`, Node):** test pure data normalization, variant
   resolution, and small deterministic helpers. Keep rendering and browser
   behavior out of these tests.
2. **Component (`*.test.tsx`, jsdom):** verify default and variant semantics,
   prop forwarding, empty/optional slots, correct headings/lists/tables,
   consumer-provided React nodes, and interaction state/callback boundaries.
   Test accessible names and relationships through Testing Library.
3. **Browser (`*.browser.test.tsx`, Chromium):** cover responsive layout at
   mobile/tablet/desktop widths, keyboard and visible focus, RTL when relevant,
   zoom/reflow, overflow, reduced motion, media failure/fallback, and
   interactive controls. Use the browser layer for properties jsdom cannot
   establish.
4. **Package validation:** run Pieces typecheck/build and focused tests for
   changed families; run package browser tests when CSS/layout/interactions
   change. Check generated declarations and root exports for public API
   additions.
5. **Docs validation:** build the site after editing MDX/navigation so
   frontmatter, previews, links, and sidebar routes are compiled. The current
   site build downloads configured fonts first, so record network/download
   failures distinctly from documentation errors.

Do not treat one representative screenshot as coverage for every variant.
Tests should assert the intended behavior and semantic output of each
implemented public variant.

## Documentation strategy and checklist

Use `apps/site/content/docs/pieces/components/hero.mdx` as the structural
reference and keep the Pieces overview and `sidebar/pieces.ts` in sync. For
each family, verify:

- [ ] Add a page at `apps/site/content/docs/pieces/components/<family>.mdx`
      with accurate `title` and `description` frontmatter.
- [ ] State API maturity honestly; explain beta/stability and compatibility
      expectations without promising production readiness.
- [ ] Show the package import and all public component/preset names documented
      on the page; verify each is exported from `@puzzle-ui/pieces`.
- [ ] Include runnable `<Preview>` examples for the default and meaningful
      layouts. Use consumer-owned, accessible example content; move stateful
      examples to `apps/site/src/components/doc-examples.tsx` when appropriate.
- [ ] Document when to choose each variant, required/optional props, consumer
      responsibilities, and any callback/controlled-state contract.
- [ ] Document responsive behavior, keyboard/focus behavior, media alt text,
      reduced-motion behavior, and accessibility requirements where relevant.
- [ ] Add a concise API reference with exact prop/type unions and default
      values; describe customization through public props and scoped classes.
- [ ] Avoid duplicating FAQ markup or structured data. Add FAQ frontmatter only
      for genuine questions answered by the page.
- [ ] Add the route to the Pieces group in
      `apps/site/src/components/layout/sidebar/pieces.ts`.
- [ ] Build the site and confirm the page, examples, and navigation compile.

The current UI-doc sidebar and examples are not substitutes for the Pieces
documentation route. Do not add a new UI-category page for a Pieces section.

## Implementation sequence

Keep the following as implementation waves; no section implementation is part
of E0.

1. **Foundation / first family:** validate the family folder, stylesheet,
   export, prop, and test pattern with one low-interaction marketing family.
   Extract shared Pieces-only helpers only after actual repeated code proves
   the abstraction.
2. **Marketing and conversion:** implement static compositions first, then
   comparison, FAQ, and carousel/step interactions. This establishes
   consumer-facing layout and action conventions.
3. **Content and editorial:** implement prose, article, gallery, timeline, and
   changelog compositions using semantic content and media structures.
4. **Business and corporate:** build team, service, case-study, partner,
   award, contact, and careers layouts; contact forms remain supplied content.
5. **SaaS and product:** implement product showcase, integrations, use cases,
   security, pricing, code showcase, and roadmap; keep pricing/security claims
   and code behavior consumer-controlled.
6. **Commerce:** implement categories, grid, gallery, details, cart summary,
   and commerce benefits after agreeing on minimal consumer data/slot contracts.
   Do not bake catalog or payment business rules into Pieces.
7. **Application and dashboard:** implement overview, activity, onboarding,
   empty-state, and settings layouts after callbacks and form-state boundaries
   are explicit.
8. **Specialized / interactive:** implement video, booking, location, waitlist,
   resource, and event sections only with documented consumer-supplied media,
   form, availability, map, and registration behavior; implement the footer
   when its navigation/content slots are settled.
9. **For every wave:** add public exports, styles, focused tests and docs;
   preserve existing Hero names and aliases; build/typecheck the package and
   validate site docs before declaring the wave complete.

## Risk analysis

| Risk                                          | Impact                                                                                 | Mitigation                                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Catalog count mismatch (49 listed, 48 stated) | Scope and planning gaps if one family is omitted.                                      | Track all listed names; settle the official count before implementation sequencing.                                                                              |
| A single generic API becomes a page builder   | Hard-to-understand props, sprawling variants, and fragile DOM.                         | Keep family APIs purposeful; share only proven common contracts and renderer structure.                                                                          |
| Duplicate layout or theme primitives          | Inconsistent spacing, token drift, extra wrappers, larger maintenance surface.         | Reuse UI `Section`, `Container`, `Grid`, `Stack`, and semantic UI controls where appropriate; do not force them where they add DOM or semantics that do not fit. |
| Consumers expect app behavior from a section  | Hidden routing, form, pricing, booking, or persistence assumptions break integrations. | Keep application state/services outside Pieces and document all consumer-owned callbacks, data, and controls.                                                    |
| Accessibility lost in highly composed content | Broken headings, names, focus order, disclosure behavior, or media alternatives.       | Preserve semantic markup; use UI primitives/native controls; test relationships and keyboard behavior in component/browser suites.                               |
| Responsive/RTL/long-content failures          | Overflow, inaccessible visual reordering, clipped media, or unusable dense tables.     | Use mobile-first tokenized CSS; test narrow/wide layouts, text expansion, RTL where relevant, and browser zoom.                                                  |
| Theme token mismatch                          | Invisible overlays or values that fail in scoped/dark themes.                          | Verify tokens from Theme source; the existing Hero overlay variable mismatch is an explicit follow-up, not a precedent for new sections.                         |
| CSS/build/tree-shaking regressions            | Styles omitted or duplicated when new family modules are published.                    | Follow CSS import and export patterns; verify package build and built package styles without changing the existing export map.                                   |
| Missing integration surface in Playground     | Sections are harder to inspect interactively before release.                           | Decide separately whether a later Epic needs a deliberate Pieces Storybook dependency and story set; do not make it an E0 prerequisite.                          |
| Site docs fail for environmental reasons      | Font download/network failures can obscure MDX issues.                                 | Report the exact command and distinguish external font retrieval from compilation errors.                                                                        |

## E0 completion record

- [x] Audited the named packages, apps, workspace scripts, exports, builds,
      tests, docs, and relevant section primitives.
- [x] Analyzed Hero's implementation, presets/aliases, types, CSS, test layers,
      and documentation pattern.
- [x] Inventoried current Pieces compositions and UI/Core/Hooks/Icons/Theme
      reuse points.
- [x] Cataloged every family name supplied in the prompt and proposed
      meaningful, use-case-based layouts.
- [x] Recorded layer ownership, API conventions, minimal-DOM and accessibility
      rules, testing/docs checklists, implementation waves, and risks.
- [x] Made no section implementations, package/export changes, or dependency
      additions.

## E1 completion record

- [x] Added typed Pieces section-root, theme, alignment, and content-width
      contracts by reusing UI types.
- [x] Added the reusable UI `SectionHeader` and extended UI `Section` to
      correctly render its typed semantic root and forward native attributes.
- [x] Added compile-time, component, browser, and server-rendering coverage.
- [x] Added UI API documentation, navigation/catalog entries, and updated the
      UI package root README.
- [x] Added no Core or Hooks APIs, duplicate UI primitives, dependencies, or
      complete website sections.
