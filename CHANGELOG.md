# Changelog

All notable changes to Puzzle packages are documented in this file. Packages
are released in lockstep; packages without changes are omitted from each release.
Individual package changelogs contain their own history.

### Deprecated

### Removed

### Security

## 0.19.1 - 2026-11-24

### `@puzzle-ui/ui`

- Fixed modal `Dialog` and `Drawer` losing input focus while typing in controlled inputs. `Backdrop` now calls the latest `onClose` handler without re-registering its overlay, so focus is no longer reset on each re-render.

## 0.19.0 - 2026-11-24

### `@puzzle-ui/storage`

- Added validated dotted-path field filtering and sorting for nested JSON objects in the query AST, with exported scalar field-path types and path validation utilities.
- Added case-insensitive substring and scalar array-element membership semantics to the `contains` operator, and extended the conformance tests to cover nested paths, null handling, and cursor pagination.

### `@puzzle-ui/cms`

- Breaking: rewrote the package as a code-first CMS. Define schemas statically with `defineCMS`, `collection`, `collection.singleton` and the `fields` factories, replacing runtime content-type registration.
- Added a request-scoped `createCms` instance that binds trusted tenant and actor context, with typed collection services for `find`, `findById`, `findBySlug`, `create`, `update`, `delete` and `purge`.
- Added a typed field catalog covering text, number, boolean, date, slug, select, media, relationship, rich text, JSON, array, object, blocks, computed and custom fields, plus `toCmsFieldDefinition` for serializable field definitions.
- Added opt-in drafts, timestamps, localization with explicit locale fallbacks, publishing, scheduling, archiving and revision restore, plus per-collection access policies and server-side `beforeChange`/`afterChange` hooks.
- Added `toCmsPresentation` to derive a serializable, callback-free collection schema for authoring UIs.
- Added schema-checked query paths, schema migrations, named custom validators, media-reference validation, relationship purge guards, and opt-in change events exposed through `cms.events`.
- Hardened webhook handling: validated endpoint and event ID inputs, and made subscription, delivery and change-event lookups tenant-scoped at query time.
- Added ADR-001 and rewrote the README and AI instructions for the code-first API; the new API is not yet published to npm.

### `@puzzle-ui/ui`

- Added `prefixIcon` and `suffixIcon` options to `AppBar` navigation items, accepting an icon name or a custom node, with matching layout styles.

### `@puzzle-ui/pieces`

- Breaking: removed `ContentTypeBuilder`, its types, and its documentation page, because content types are now defined in code with `@puzzle-ui/cms`.
- Updated the CMS authoring components (`ContentList`, `ContentEditor`, `BlockEditor`, `LocalizationEditor`, `RelationshipField`, `RevisionHistory` and the JSON field) to use the code-first CMS field and presentation model.
- Added exported types `CmsCollectionPresentation`, `CmsFieldMap`, `CmsFieldRow`, `CmsFieldRows`, `FieldDescriptor`, `FieldValue` and `FieldsValue`.
- Updated the CMS documentation and AI guidance for the code-first schema and presentation-safe schema projections.

### `@puzzle-ui/create`

- Added Tailwind generation of Puzzle responsive variants (`compact:`, `tablet:`, `desktop:` and `hd:`), `puzzle-` semantic color utilities, and theme-token utilities for spacing, radius, elevation, typography, container sizes, z-index, motion and borders.
- Fixed Tailwind setup to rethrow filesystem errors other than a missing file, and to add the missing Puzzle blocks to an existing stylesheet without duplicating them.

### `@puzzle-ui/storage-d1`

- Added support for nested dotted-path filters and sorts, case-insensitive `contains` matching for strings and arrays, and query validation.
- Fixed null handling in `notEquals`, `in`, `notIn`, `exists` and cursor pagination.
- Fixed an empty `or` group so it matches nothing, and added validation of cursor shape and scalar values.

### `@puzzle-ui/storage-mongodb`

- Added support for nested dotted-path filters and sorts, and case-insensitive `contains` matching for strings and arrays.
- Hardened cursor pagination with scalar-value validation and date-safe cursor encoding.

### `@puzzle-ui/fullstack`

- Breaking: rewrote the CMS client, shared contracts and server handlers around code-first collections and singletons, with flat JSON-safe `CmsApiDocument` records and `where`/`sort`/`limit`/`page`/`locale` queries.
- Added a client API of `cms.collection(key)` and `cms.singleton(key)` with `find`, `create`, `update`, `delete`, `purge`, publishing, scheduling, revision, locale-variant and translation methods, and a separate `.public` client for published reads.
- Added routes derived from the static CMS config, including a scheduler worker route that derives tenant context from the host, plus Next.js and TanStack Start handlers.
- Added opt-in webhook management and change-event routes and client methods, with sanitized DTOs that never expose secrets, secret references or delivery lease tokens.

## 0.18.0 - 2026-11-23

### `@puzzle-ui/theme`

- Adjusted shared theme CSS for the updated component styling.

### `@puzzle-ui/ui`

- Added `role="alertdialog"` support to `Dialog` through a new `role` prop (defaults to `dialog`).
- Added `aria-label` and `aria-labelledby` support to `Tabs`, applied to the tablist.
- Fixed `Autocomplete` so `readOnly` prevents option selection and renders options as disabled.
- Fixed `DatePicker` date calculations to construct local dates reliably for years 0–99 and across month and day boundaries.
- Fixed `CollapsableSidebar` so empty or fragment-only icons no longer render an empty icon slot.
- Changed `CollapsableSidebar` to throw clear errors for an empty `ariaLabel`, empty or duplicate item IDs, whitespace in group IDs, and empty labels.
- Changed `PageLayout` to accept regions wrapped in fragments and throw a clear error for unsupported children.
- Fixed `Transition` so a user `style` is preserved and the duration is exposed through the `--puzzle-transition-duration` CSS variable.
- Fixed `LinearProgress` and `CircularProgress` to respect `prefers-reduced-motion`, and moved the linear progress transition into CSS.
- Improved `Avatar` image rendering with `object-fit: cover`.
- Added resource descriptor validation for rendering utilities, plus new unit and browser test coverage across forms, layout, navigation, and overlays.

### `@puzzle-ui/pieces`

- Changed `ConfirmAction` to use an `alertdialog`, support async `onConfirm` with a pending state and retry error message, and restore focus to the trigger on close.
- Added keyboard and focus support to horizontal `ActivitySection` lists, ticker `Announcement` lists, and horizontal `GallerySection` lists.
- Fixed `Announcement` to move focus to the next dismiss button after dismissing a message.
- Fixed `GallerySection` to return focus to the triggering item when its lightbox closes.
- Fixed `NotificationItem` accessibility with unread status text and a dismiss button labelled by the notification title.
- Fixed `DashboardMobileNavigation` to close after an item is navigated.
- Fixed `CartSummary` mobile layout, showing product images and aligning item columns.
- Fixed `ContentSection`, `Features`, and `GallerySection` layouts when media or a sidebar is absent, and improved responsive stacking, container-based breakpoints, and long-text wrapping.
- Fixed `VideoSection` vertical video aspect ratio and sizing.
- Improved responsive styling of booking, checkout, payment method, dashboard, and data-display pieces, and added extensive browser test coverage.

## 0.17.0 - 2026-11-22

### `@puzzle-ui/media-cloudflare`

- Added Cloudflare R2 object-storage adapters with single and multipart uploads, size/SHA-256 verification, idempotent completion, abort and delete cleanup, cursor listing, tenant-prefixed keys, and short-lived read/part targets backed by a metadata store.
- Added Worker-compatible S3 presigning for R2 through `CloudflareR2S3UrlSigner`, per-tenant bucket and signer resolvers, an in-memory metadata store for tests and local development, and a bucket provisioner (`CloudflareR2BucketProvisioner`) built on a narrow `getBucket`/`createBucket` interface.
- Added `CloudflareImagesProcessor`, which implements the Puzzle `MediaProcessor` contract on top of the Cloudflare Images binding.

### `@puzzle-ui/ui`

- Added `DateRangePicker`, an accessible popover date-range control with controlled and uncontrolled values, min/max and disabled-date rules, range validation, one or two visible months, locale and week-start options, custom day content, clearing, and form field names.
- Added `SortableTree`, an accessible hierarchical list with drag-and-drop and keyboard reordering, depth and move constraints, single or multiple selection, expand/collapse state, custom item rendering, and screen-reader move announcements.

### `@puzzle-ui/pieces`

- Added `SiteHeader` with default, transparent, overlay, minimal, and centered variants, nested navigation, primary and secondary actions, sticky/scrolled states, and a mobile menu.
- Added `LocaleSwitcher` for caller-supplied language destinations, with dropdown, inline, and compact presentations.
- Added `ContactForm` with configurable text, email, phone, textarea, select, and checkbox fields, consent and privacy-link support, honeypot spam protection, and loading, error, and success states, leaving submission and validation to the application.
- Added `AvailabilityCalendar` for caller-supplied day-level accommodation availability, with stay-range selection, minimum/maximum nights, one or two months, status legends, and per-day prices.
- Added `AvailabilityManager`, a resource-by-day availability grid with single, range, and multiple selection, bulk status and minor-unit price edits, and customizable slots for application-owned editors.
- Updated the Boutique B&B reference page and hospitality booking flow to use the new site header, availability calendar, and contact form.
- The number of stable canonical Pieces component APIs is now 132.

### `@puzzle-ui/fullstack`

- Added `@puzzle-ui/fullstack/payments/shared` and `@puzzle-ui/fullstack/payments/server` for serializable payment contracts and server-only order resolution, provider operations, idempotency, refunds, and webhook handling built on `@puzzle-ui/commerce`.
- Documented the Auth, Media, CMS, and Payments subpaths as published; there is still no package-root export.

## 0.16.0 - 2026-11-21

## 0.15.0 - 2026-11-21

### `@puzzle-ui/commerce`

- Added safe minor-unit money and currency utilities.
- Added provider-independent order, payment, refund, booking, capability, idempotency, and webhook contracts.

### `@puzzle-ui/storage`

- Documented that CMS content and media metadata can use the storage record contract, while file bytes belong in the separate `@puzzle-ui/media` object-storage adapter.

### `@puzzle-ui/media`

- Added workspace-only provider-neutral media metadata, object storage, processing, browser image/video preparation, and test adapter APIs.
- Added policy-protected, tenant-scoped Media audit storage; audit writes are not atomic with media mutations.
- Fixed guarded permanent deletion of soft-deleted media assets.

### `@puzzle-ui/cms`

- Added workspace-only CMS schemas, content lifecycle, revisions, policies, scheduling, media references, and audit APIs.
- Added an opt-in transactional change-event outbox with webhook subscriptions, signed delivery, retry/history, and replay-verification primitives; hosts provide secret storage, a safe transport, and worker scheduling.
- Fixed non-finite JSON draft handling.

### `@puzzle-ui/ui`

- Added `ImageUpload`, `VideoUpload`, `ImageCropper`, and `ImageHotspotEditor` controls for image and video upload and editing, plus CMS-oriented `FieldArray` and `JsonEditor` components.
- Expanded `TextEditor` with a serializable `TextDocument` model, nested lists, checklists, icon lists, block formatting, an accessible command toolbar, and parser/renderer improvements.
- `ImageBox` can request unoptimized rendering from configured framework image components, used by Media previews for temporary URLs.
- Improved `Popout` and `Popover` with nested popout handling, stable trigger refs, and fewer open-state callback re-registrations, and refined `ColorPicker`, `DatePicker`, and `NumberInput` behavior and stepper icon sizing.
- Fixed JSON formatting so non-finite parsed values are rejected instead of silently converted to `null`.
- Fixed point-hotspot persistence and media preview sizing with framework image overrides, including Next.js.
- Prevented retrying a single upload with an expired target.

### `@puzzle-ui/pieces`

- Added caller-data-driven Media compositions: `MediaLibrary`, `AssetPickerDialog`, `AssetDetailsPanel`, and `MediaField`, with sanitized Media audit presentation.
- Added CMS authoring compositions: `CmsShell`, `ContentList`, `ContentEditor`, `BlockEditor`, `ContentTypeBuilder`, `LocalizationEditor`, `RelationshipField`, `RevisionHistory`, `PublishScheduler`, `EditorialCalendar`, `AuditLogViewer`, and `WebhookManagement`.
- Added remote content-list controls, draft protection, revision comparisons, and relationship search with removable previews.
- Added commerce `CheckoutSection` and `PaymentMethodSelector` pieces.
- Refactored carousel-based and grid sections (categories, product grid/gallery, product showcase, gallery, testimonials, logo cloud, integrations, how-it-works, and others) onto a shared carousel primitive and trimmed styles.
- Marked all canonical component APIs and aliases as Stable, with updated registry and docs.
- Fixed point-hotspot persistence and media preview sizing with framework image overrides, including Next.js.

### `@puzzle-ui/storage-d1`

- Fixed registration of hyphenated index names without relaxing validation of table and other SQL identifiers.

### `@puzzle-ui/fullstack`

- Added workspace-only CMS and Media client/server, Next.js, and TanStack integrations with tenant authorization and sanitized contracts.
- Added optional CMS webhook administration and Media audit callbacks; hosts must provide policies, audit storage, and a safe webhook transport.
- Added payment server and shared entry points.
- Added an opt-in completed-upload content verification callback so a host content inspector can run before an asset is created.
- Fixed guarded permanent deletion for soft-deleted media assets and prevented single-upload retries from using expired targets.

### `@puzzle-ui/payment-providers`

- Added server-only fetch adapters for Stripe, Mollie, PayPal, and Adyen with capability declarations, idempotency headers, lifecycle operations, and webhook verification.

### `@puzzle-ui/i18n`

- Documented that the package is published to npm and remains pre-1.0, with npm install instructions.

## 0.14.0 - 2026-11-20

### `@puzzle-ui/theme`

- Added the `GOOGLE_FONT_FAMILIES` catalog and `GoogleFontFamily` type as public exports for font pickers and tooling.
- Exported `COLOR_THEMES` (built-in color theme presets) and `DEFAULT_COLOR_SCHEME` (default light and dark colors) so tools can preview themes without duplicating palettes.
- Added `THEME_TOKEN_REGISTRY` with read-only metadata (group, input kind, default, generated CSS variable) for every non-color token and typography-role value, plus `ThemeTokenGroup`, `ThemeTokenInputKind` and `ThemeTokenRegistryEntry` types.

### `@puzzle-ui/i18n`

- Added the pre-release `@puzzle-ui/i18n` package with an SSR-safe multilingual runtime, typed translations and formatting, and React bindings.
- Added localized routing and SEO helpers, including sitemap generation.
- Added compiler transforms, TypeScript type generation and a Vite plugin, plus the `puzzle-i18n` CLI for scanning and managing catalogs.
- Added catalog and Sanity content sources, request adapters for Next.js, React Router and TanStack, and developer diagnostics.
- Added human-reviewed AI translation assistance workflows.

## 0.13.0 - 2026-11-20

### `@puzzle-ui/core`

- Added `formatCurrency`, `formatDate`, `formatDateRange`, `formatNumber` and `formatTime`, plus the `DateRange` type. They use `Intl` with an explicit locale and caller-supplied options such as `timeZone`.
- Added the framework-neutral `@puzzle-ui/core/rendering` subpath, also re-exported from the root. It covers fold strategies, render modes, optimization profiles (conservative, balanced, aggressive, custom), configuration and policy resolution, component classification, fold-position prediction, deferred-load lifecycle, and typed rendering diagnostic events.
- Added the framework-neutral `@puzzle-ui/core/resources` subpath with `createResourceScheduler`. It provides prioritized, abortable, deduplicated loading of chunks, data and images, with retries, concurrency and prefetch budgets.
- Added packaged AI guidance (`ai/` instructions and manifest) for consumer instruction generation.

### `@puzzle-ui/theme`

- Exported the `ColorThemes` type.
- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/hooks`

- Added `useColorScheme` to read an element's computed light or dark scheme. It updates when the element's class, style or `data-theme` changes.
- Added visibility-driven rendering hooks: `FoldProvider`, `useFold`, `useFoldOptimization`, `useVisibility`, `useFoldState`, `useIsVisible` and `useIsNearby`. They share one `IntersectionObserver` engine for viewport and proximity tracking.
- Added `useResourcePrefetch` for abortable, deduplicated prefetching by visibility, proximity, idle time or explicit request, without mounting components.
- Added opt-in local rendering diagnostics through `FoldProvider`'s `onDiagnosticEvent`. Diagnostics are off by default and nothing is transmitted.
- Added packaged AI guidance (`ai/` instructions and manifest). Reorganized source into interaction, state, preferences and rendering folders; the public exports are unchanged.

### `@puzzle-ui/icons`

- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/ui`

- Added rendering boundaries: `FoldBoundary`, `FoldProvider`, `DeferredBoundary`, `SsrBoundary` and `StaticBoundary`. They add Next.js and TanStack Start client/server adapters and support fold-aware, deferred and static rendering with streaming SSR.
- Added subpath exports `./rendering/deferred`, `./rendering/ssr`, `./rendering/static`, `./rendering/fold`, `./next/client`, `./next/server`, `./tanstack/client`, `./tanstack/server` and `./tanstack/shared`.
- `AppBar` now lazy-loads its mobile navigation drawer on demand. It prefetches the drawer when idle and shows loading and retry states.
- `Image` now infers an aspect ratio from width and height when none is given. A `preload` image now defaults to eager loading and high fetch priority.
- `DatePicker` has a new `requiredDescription` prop. It gives required fields an accessible description, "Required" by default.
- `TextInput` now supports `type="search"`.
- `Section` now constrains its content width by default unless `fullWidth` is set, including for the default theme.
- Fixed `Badge` so it no longer stretches in flex layouts, increased `Card` header row spacing, and let `TokenInput` tokens shrink.
- Added packaged AI guidance (`ai/` instructions and manifest). Updated the README and API stability notes.

### `@puzzle-ui/pieces`

- Added hospitality sections for accommodation discovery: `AccommodationOverviewSection`, `AccommodationDetailsSection`, `AmenityListSection`, `AvailabilitySearchSection`, `RatePlansSection`, `StaySummarySection`, `HouseRulesSection`, `HostProfileSection`, `ServiceOptionsSection`, `GuestReviewsSection`, `LocalGuideSection` and `GiftVoucherSection`.
- Added restaurant sections: `RestaurantMenuSection`, `DishCard`, `DietaryInformation`, `OpeningHoursSection` and `TableReservationSection`.
- Extended testimonial items with optional `metadata`. Resource items now have optional `href` and `metadata`, for reusable hospitality compositions.
- Marketing, content, business, commerce, dashboard, footer and other sections now use `Heading`, `Text`, `Select`, `Slider` and `RadioGroup` from `@puzzle-ui/ui`, replacing raw HTML elements. The Pricing billing interval is now a `RadioGroup` and its calculator uses `Slider`.
- `HowItWorks` now lazy-loads its carousel and falls back to a static ordered list. The footer has a background change and better wrapping of long group headings.
- Added packaged AI guidance (`ai/` instructions and manifest) and updated the README.

### `@puzzle-ui/create`

- Added non-interactive configuration mode: `create-puzzle --config <file>` with `--validate` and `--dry-run`. It is backed by a published `config.schema.json` and documented in `CONFIGURATION.md`.
- Added `--credentials-stdin` for MongoDB and D1 Auth projects. Initial-user credentials are read from validated stdin JSON, and the password is never accepted in the config file or arguments.
- Added `create-puzzle ai init`, `ai update` and `ai check`. They generate offline, package-aware AI instructions for Copilot, Claude, Cursor and AGENTS.md from installed Puzzle packages, and track managed output in `.puzzle/ai/manifest.json`.
- The generator and prompts now share one validated project configuration. Package files now include the `ai` folder, `CONFIGURATION.md` and `config.schema.json`.
- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/storage`

- Enabled `isolatedDeclarations` and oxc declaration generation for the build, and kept `bun:test` external. Conformance suites were adjusted to match.
- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/session`

- Added packaged AI guidance (`ai/` instructions and manifest), now included in the published files.

### `@puzzle-ui/storage-d1`

- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/storage-mongodb`

- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/auth`

- `SimpleWebAuthnProvider` now accepts `supportedAlgorithmIDs`, a list of COSE algorithm IDs. It is validated as a non-empty list of unique IDs and applied to registration and verification. The default is EdDSA, ES256 and RS256. The `SimpleWebAuthnProviderOptions` type is exported.
- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/fullstack`

- Added packaged AI guidance (`ai/` instructions and manifest).

### `@puzzle-ui/seo`

- Preserved the React provider's `"use client"` directive in ESM and CJS build output.
- Added packaged AI guidance (`ai/` instructions and manifest).

## 0.12.0 - 2026-11-18

### `@puzzle-ui/theme`

- Changed default elevation shadow tokens to use `light-dark()` so shadows stay visible in dark mode with subtle light-toned highlights instead of heavy black shadows.

### `@puzzle-ui/hooks`

- Added `useAsyncAction` for tracking idle, loading, success and error state of an async action, with duplicate-run protection and `reset`.
- Added `useListFilter` for text search and category filtering of lists, with derived categories and an `enabled` switch.
- Added `useReducedMotion`, an SSR-safe hook that follows the `prefers-reduced-motion` media query and defaults to reduced motion on the server.

### `@puzzle-ui/ui`

- Added `SectionHeader` layout component for consistent eyebrow, title, description and actions headers with alignment options.
- Added `MediaFrame` data-display component for framing images, video and other media.
- Added business building blocks: `ProfileCard`, `CompanyInfo`, `ContactDetails`, `LogoCollection`, `MetricList`, `ServiceCard`, `CaseStudyCard`, `SocialLinks` and `BusinessImageView`.
- Improved `Preview`: the device frame is now sized by CSS rather than scaled, the default device follows the viewport, and previews show a loading indicator and an error state.
- Added `Preview` `loading="lazy"` mode that mounts frames near the viewport after page load, plus a `PreviewProvider` to set the loading mode for a whole tree.
- Improved `Preview` performance and stability by reusing cloned stylesheets, batching style syncs, waiting for stylesheets and fonts before revealing the frame, and giving the frame a meaningful document title.
- Improved `AppBar` sticky offset so it is set during server render through an inline script and stylesheet (new `nonce` prop for CSP), avoiding layout shift before hydration.
- Changed `Section` to be polymorphic, forwarding additional props and typings of the element given in `as`.
- Fixed `Dialog` to omit the native `title` attribute from its accepted props.
- Fixed `Rating` to no longer set `aria-readonly` on its `role` element, where the attribute is not valid.

### `@puzzle-ui/pieces`

- Added marketing sections: `Announcement`, `Benefits`, `CodeShowcase`, `Comparison`, `CTA`, `FAQ`, `Features`, `HowItWorks`, `Integrations`, `LogoCloud`, `Pricing`, `ProductShowcase`, `Roadmap`, `Security`, `Stats`, `Testimonials`, `UseCases` and `WaitlistSection`.
- Added business sections: `AboutSection`, `AwardsSection`, `CareersSection`, `CaseStudiesSection`, `ContactSection`, `LocationSection`, `PartnersSection`, `ServicesSection` and `TeamSection`.
- Added commerce sections: `ProductGrid`, `ProductGallery`, `ProductDetails`, `CartSummary`, `Categories`, `CommerceBenefits` and `BookingSection`.
- Added content sections: `BlogSection`, `ChangelogSection`, `ContentSection`, `EventSection`, `GallerySection`, `ResourceSection`, `TimelineSection` and `VideoSection`.
- Added application pieces: dashboard shell, header, stat cards, progress card and activity feed with `DashboardOverviewSection`, dashboard navigation (sidebar, topbar, mobile navigation, breadcrumbs, user menu), `ActivitySection`, `OnboardingSection`, `ProjectSection`, settings, feedback and confirm-action pieces, and data-display pieces such as the empty-state panel and metric comparison.
- Added `FooterSection` and a shared section types module.
- Added `AsymmetricHero` preset.
- Improved hero layouts: media now fills its frame, tablet and mobile spacing and aspect ratios are refined, stacked layout rules apply only when a media position is set, and `SplitHero` now defaults to large height.
- Fixed hero and section rendering during server-side rendering.
- Updated the package description to cover page sections and dashboard components, and added a README and architecture guide.

### `@puzzle-ui/auth`

- Added an optional `demoTotpBypass` MFA manager option that accepts a fixed TOTP code for a single demo account; invalid configuration throws an `AuthConfigurationError`.

### `@puzzle-ui/fullstack`

- Added auth lifecycle routes and handlers for requesting and verifying an email change, updating the profile name and image, listing sessions and revoking other sessions.
- Added an `allowPasswordChange` lifecycle option to disable password changes with a `PASSWORD_CHANGE_DISABLED` response, and an `emailChangeUrl` option for email-change links.
- Added client auth components `PasswordResetRequestForm`, `PasswordResetForm`, `EmailVerificationNotice`, `EmailVerificationForm`, `ChangePasswordForm` and `RequiredMfaEnrollment`, with their prop types.
- Added a `demoTotpCode` option on `AuthProvider` that shows the demo authentication code on the sign-in MFA challenge.

### `@puzzle-ui/seo`

- Changed generated Schema.org definitions to be split into smaller chunk modules, and the generator now checks for and removes stale chunks.

## 0.11.0 - 2026-11-16

### `@puzzle-ui/ui`

- Added a `barWidth` prop to `LinearProgress` and `CircularProgress` to customize bar thickness; circular progress rescales its radius and dash length to match.

### `@puzzle-ui/create`

- Added a MongoDB volume check before scaffolding. If volumes from an earlier project exist, it asks before deleting them, and refuses to delete volumes used by other projects or services.
- Generated MongoDB and D1 sign-in pages now enable `offerPasskeyAfterSignIn`, so users can add a passkey after signing in.
- Fixed React Router + D1 projects: they now install `reflect-metadata` and load it in the Worker entry before the server build, which WebAuthn needs in production.
- Fixed the Create E2E workflow on CI by installing Chromium and its system dependencies.

### `@puzzle-ui/fullstack`

- Added an `offerPasskeyAfterSignIn` option to `AuthExperience`. After sign-in, users without a passkey can add one (the current password is required) and see their recovery codes, or skip the step.
- Added optional `passkeyOfferDescription`, `passkeyAdded` and `skip` auth messages, with English defaults, for the passkey enrollment step.

## 0.10.1 - 2026-11-16

### `@puzzle-ui/create`

- Fixed MFA in scaffolded Auth projects: generated servers now configure WebAuthn passkeys (relying party and origin derived from `APP_ORIGIN`) and expose the passkey, TOTP enrollment, factor management and recovery-code endpoints.
- Added an `MfaSettings` panel to the generated dashboard so users can enroll passkeys and TOTP, manage factors and regenerate recovery codes.
- Fixed TanStack Start with Nitro and Auth builds by inlining dynamic imports so WebAuthn's metadata polyfill loads before its certificate dependencies.
- Documented passkey setup and `APP_ORIGIN` requirements, and extended the end-to-end suite with passkey registration and sign-in checks, including a Chromium virtual authenticator for TanStack Start with MongoDB (requires Playwright Chromium).

### `@puzzle-ui/fullstack`

- Fixed the auth experience so sign-in pages show the MFA challenge form when a sign-in is awaiting a second factor, instead of the password form.

## 0.10.0 - 2026-11-16

### `@puzzle-ui/ui`

- Added a responsive `Pagination` layout: on viewports under 768px it shows a compact page list (no sibling pages, at most one boundary page), while larger viewports keep the configured `siblingCount` and `boundaryCount`.
- Added `style` prop support to `Section`, so inline styles are now applied to the rendered element.
- Improved the layout and navigation component docs and examples, and added a component carousel to the site home page.

### `@puzzle-ui/create`

- Added a prompt for the first application user (email, masked password of 12–1024 characters, and confirmation) when MongoDB or D1 is selected with Auth. The CLI creates that account after install through Puzzle Auth's password hashing, and sends credentials over stdin rather than as command-line arguments or project files.
- Added a `db:setup` script to generated MongoDB projects. It starts the replica set, checks both accounts and primary readiness, and initializes missing users on older local volumes without resetting existing passwords or deleting data. The next steps now say to run `db:setup` instead of `docker compose up -d --wait`.
- Added a `Page not found` route to generated TanStack Start projects.
- Command runner now supports passing input to a child process over stdin.
- Docker with Compose is now documented as a requirement when selecting MongoDB with Auth.
- Expanded the end-to-end suite to cover dev-server checks, legacy MongoDB volumes, initial-user sign-in, and passwords with special characters.

## 0.9.0 - 2026-11-16

### `@puzzle-ui/theme`

- Added `createFontRouteRules` in `@puzzle-ui/theme/nitro`, which creates Nitro route rules that cache versioned fonts for a year as immutable and the generated stylesheet and preload fonts for a day with background revalidation.
- `downloadGoogleFonts` now accepts WOFF2 fonts that Google Fonts serves from `fonts.gstatic.com/l/font?kit=…` URLs, which fixes intermittent `fonts:download` failures.

### `@puzzle-ui/create`

- MongoDB projects now run with access control: `.env` gets randomly generated administrator and application passwords, `docker compose` reads them from `.env`, the replica set uses a generated keyfile, the application user is limited to `readWrite` on the project database, and the port is bound to `127.0.0.1`.
- Every project now gets a default `puzzle-fonts.json`, passes it to `Theme` with `fontSource="local"`, adds a `fonts:download` script, and downloads the fonts during setup.
- TanStack Start projects that do not use D1 now include Nitro, a `start` script, and font cache headers from `@puzzle-ui/theme/nitro`.
- Added a deployment guide for every framework and database at https://puzzle-ui.com/docs/create/deployment.
- Added an end-to-end suite (`bun run test:e2e`) that creates, installs, builds, serves and tests every project shape against the local packages, including the MongoDB and D1 authentication flows.

### `@puzzle-ui/storage-mongodb`

- The package's MongoDB test script now starts its replica set on a free localhost port (override with `MONGODB_TEST_PORT`) so it no longer conflicts with a local MongoDB on port 27017.

## 0.8.0 - 2026-11-16

### `@puzzle-ui/ui`

- Improved the package README and overlay guidelines with clearer descriptions, section headings, and a link to the overlay documentation.

### `@puzzle-ui/create`

- Added React Router (framework mode) as a project template alongside Next.js, TanStack Start, and Basic React.
- Added a database prompt for full-stack Puzzle Auth projects, with MongoDB, Cloudflare D1, and Custom storage options.
- Generated Auth projects now include sign-in and sign-up pages, a protected `/dashboard` route, an API route, and server modules wired to the chosen database.
- MongoDB projects get a `docker-compose.yml` replica set, and the next steps now include `docker compose up -d --wait`.
- D1 projects get `wrangler.jsonc`, the Cloudflare runtime integration (OpenNext for Next.js, the Cloudflare Vite plugin for TanStack Start and React Router), and a `cf-typegen` run after install.
- Auth projects write a `.env` with preview database settings and generated secrets for local development.
- The generated theme now maps Puzzle `Link` (and `Image` on Next.js) to the framework's components, and the starter page links to the package docs.
- Tailwind setup now keeps the existing layout of the Vite `plugins` array and supports React Router projects.
- Dependency installation uses the detected package manager, including dev dependencies for Cloudflare tooling.

### `@puzzle-ui/storage-d1`

- Fixed storing and querying dates nested in documents, so `Date` values are encoded reliably and compared by their ISO string in filters and sorts, including for invalid dates, which now raise a validation error.

### `@puzzle-ui/auth`

- Added `Pbkdf2PasswordHasher`, a Web Crypto PBKDF2-HMAC-SHA256 password hasher with a secret pepper that runs on Node.js, Bun, Deno, and Cloudflare Workers, including the Workers Free plan.
- Added `PasswordHashAlgorithm` and `PASSWORD_HASH_ALGORITHMS`, and `PasswordHash.algorithm` now accepts `pbkdf2-sha256` as well as `argon2id`.
- Auth managers now accept hashes from any supported algorithm and report invalid hasher output with a generic password hash error.

### `@puzzle-ui/fullstack`

- Fixed hydration mismatches in the sign-in, MFA challenge, MFA enrollment, and MFA settings forms by detecting passkey support only after hydration.

## 0.7.0 - 2026-11-15

### `@puzzle-ui/ui`

- Added `ImageBox`, a photo gallery component that lays out one to five images in a main-plus-supporting grid with a "+N" overflow tile, with an `aspectRatio` prop (default 2), `gap` and `radius` props, and `onImageClick` and `onViewAll` callbacks.
- Added exported `ImageBoxProps` and `ImageBoxImage` types.
- Added accessibility to `ImageBox`: a labelled gallery group, interactive tiles rendered as buttons only when callbacks are provided, a "View all photos" button, and eager loading for the main image with lazy loading for the rest.
- Documented `ImageBox` and refreshed the form component docs (Autocomplete, Checkbox, ColorPicker, DatePicker, FileUpload, FormField, InputGroup, Label, NumberInput, RadioGroup, Select, Slider, Stepper, Switch, TextAreaInput, TextInput, TimePicker, TokenInput).

## 0.6.2 - 2026-11-15

### `@puzzle-ui/ui`

- Added link support to TextEditor: a toolbar Link popover to apply, edit and remove links, link rendering in the editor and TextRenderer, and a new exported `TextLink` type for inline `link` data.
- Added safe link handling to TextEditor: only http, https, mailto and tel URLs are accepted, and links are preserved when parsing pasted HTML and Markdown.
- Added a `searchPlaceholder` prop and a search icon to the DataTable search field.
- Improved TextEditor list behavior: pressing Enter on an empty list item exits the list, list items get proper indentation, and the bullet and ordered list toolbar icons are no longer swapped.
- Fixed TextEditor losing its selection when focusing the editor or interacting with toolbar controls.

## 0.6.1 - 2026-11-15

### `@puzzle-ui/seo`

- Updated package description, docs homepage and keywords to improve discoverability.

### `@puzzle-ui/storage`

- Fixed the build so the `src/testing` entry point is bundled and every declared export target is built, with a new test verifying this.
- Updated package metadata with a docs homepage and keywords.

### `@puzzle-ui/ui`

- Added `DataTable`, a paginated data table with column sizing, local sorting (controlled or default), local search, custom loading and empty content, error handling and a max height, plus exported `DataTable` types.
- Improved `TextEditor` selection handling: formatting, undo and redo now keep the selection, and structurally equal controlled `value` updates no longer reset it.
- Added `TextEditor` support for the `Ctrl/Cmd+Shift+S` strikethrough shortcut, keeping `Ctrl/Cmd+Shift+X` as an alias.
- Added `TextEditor` heading-level preservation, including `h5` and `h6` when parsing HTML.
- Added exported `TextTransaction` type; the text document transform helpers (`applyMark`, `setTextVariant`, `setTextAlign`, `setListType`) now return a document and selection pair.
- Fixed `TextEditor` selection offsets inside iframes and across line breaks, and made it `"use client"` compatible.
- Fixed `ToggleGroup.Item` so `loading` and `aria-disabled` items are treated as disabled and skipped in roving focus.
- Documented `Button`, `ButtonGroup` and `ToggleGroup` as Stable APIs, backed by new component and browser tests.
- Fixed the `Background` docs preview so it renders at a consistent size.

## 0.6.0 - 2026-11-14

### `@puzzle-ui/ui`

- Added the `Grid` and `GridItem` layout components. They support responsive (mobile, tablet and desktop) columns, rows, gaps, alignment, auto-flow, auto-fit `minChildWidth`, item spans and placement, polymorphic `as` roots, and native props and refs.
- Fixed `Badge` so a standalone badge, one with no children, renders as a `span` instead of a `div`. This keeps it valid inside paragraphs and avoids hydration errors. Badges wrapping children still render a `div`.

## 0.5.1 - 2026-11-14

### `@puzzle-ui/auth`

- Reworked package documentation with installation, minimal setup, feature overview, and security guidance.

### `@puzzle-ui/seo`

- Keep React schema component JSON-LD graphs synchronized with client-side registrations, including components rendered after Suspense and changes made without a `SeoProvider` rerender.
- `useSeo().registerNode` must now be called during render; nodes registered in a render replace those from the component's previous render and are removed on unmount.

### `@puzzle-ui/session`

- Expanded package documentation with direct-use scenarios, documentation links, and npm, pnpm, and yarn installation instructions.

### `@puzzle-ui/ui`

- `TreeView` now expands branch rows when clicked by default; linked branches continue to navigate. Set `expandOnItemClick={false}` to select groups on click and expand them only with the arrow.

## 0.5.0 - 2026-11-14

### `@puzzle-ui/auth`

#### Added

- Initial release of framework-independent registration, password sign-in, session validation and sign-out, email verification, password reset and change, profile and account lifecycle operations, rate limiting, and audit events.
- Added optional MFA with TOTP and WebAuthn passkeys, recovery codes, required enrollment and policy enforcement, plus step-up authentication for protected operations.

### `@puzzle-ui/create`

#### Added

- Added optional Puzzle Auth scaffolding for supported server frameworks, including client providers, sign-in/sign-up pages, API routes, and an application-owned server configuration boundary.

#### Changed

- Added pnpm and Yarn support and made the detected package manager drive framework setup and dependency installation.

### `@puzzle-ui/fullstack`

#### Added

- Initial release with a React authentication client, provider, hooks, customizable authentication forms and screens, localization, and passkey support.
- Added server-side authentication handlers for MFA, email verification, password reset and changes, sessions, and readiness, plus Next.js App Router and TanStack Start adapters.
- Added shared public authentication contracts for client/server integrations.

### `@puzzle-ui/icons`

#### Added

- Added the `showLoader` prop to display an animated loading indicator, with reduced-motion support.

#### Changed

- `Icon` now defaults unspecified dimensions to `1em` and supports custom SVG children when the loader is not shown.

#### Removed

- **Breaking:** Removed the `SSRIcon` export.

### `@puzzle-ui/pieces`

#### Added

- Initial release of reusable, configurable hero components, including `Hero` and layout, alignment, theme, media, and content-width options.
- Added ready-made hero variants for split, centered, full-screen, video, image, minimal, editorial, agency, product, SaaS, store, restaurant, accommodation, print-shop, dashboard, app, campaign, coming-soon, and search layouts.

### `@puzzle-ui/seo`

#### Added

- Initial release of a framework-independent SEO toolkit with deterministic Schema.org graph construction, merging, reference resolution, validation, and safe JSON-LD serialization.
- Added a generated Schema.org registry, React metadata and structured-data components, server rendering support, and Next.js, TanStack, and React Router adapters.
- Added metadata resolution, server handlers, sitemap and robots.txt generation, URL normalization, and validation utilities.
- Added framework-independent testing utilities: `inspectSeoGraph`, `formatSeoDiagnostics`, `createSeoTestFixture`, `runSeoTest`, and `assertSeoTest`, with related public types and documentation.

### `@puzzle-ui/session`

#### Added

- Initial release of secure, database-independent session management: opaque tokens with SHA-256 hashing, anonymous and authenticated sessions, idle and absolute expiration, rotation and revocation, device listing, maximum-session policies, namespaced TTL data, allowlisted anonymous migration, secure cookies, and origin validation with CSRF protection.

### `@puzzle-ui/storage`

#### Added

- Initial release of vendor-neutral storage contracts for typed records and collections, CRUD and conditional writes with revision-based concurrency, query filtering and cursor pagination, capabilities, atomic batches, schemas and indexes, and explicit migrations.
- Exported shared storage errors, query validators, and reusable adapter and migration conformance suites.

### `@puzzle-ui/storage-d1`

#### Added

- Initial release of `D1StorageAdapter`, implementing the shared storage contracts with D1 CRUD, query, conditional-write, pagination, unique-index, and atomic-batch support.
- Added `D1StorageMigrationAdapter` for explicit, versioned migrations and D1 binding and adapter option types.

### `@puzzle-ui/storage-mongodb`

#### Added

- Initial release of `MongoStorageAdapter`, implementing the shared storage contracts with MongoDB CRUD, query, conditional-write, pagination, unique-index, and TTL-index support; multi-document transactions and atomic batches are opt-in.
- Added `MongoStorageMigrationAdapter` for explicit, versioned migrations and MongoDB adapter option types.

### `@puzzle-ui/theme`

#### Added

- Added `puzzle-theme fonts download` to download configured Google Fonts and generate locally hosted font assets and stylesheets.
- Added local font loading to `Theme` and `GoogleFont`, with `fontSource`, `fontBasePath`, and `fontPreload` options; `FontConfig` now supports variable-font `weightRange`.

### `@puzzle-ui/ui`

#### Added

- Added `TokenInput` and `TimePicker` form controls.
- Added the `Rating` component for displaying and selecting ratings.
- Added `AspectRatio`, `Separator`, and `ScrollArea` layout components.
- Added `ContextMenu` and expanded its interaction support.

#### Changed

- Refined `ButtonGroup`, `Badge`, `Checkbox`, `Section`, `Stack`, and `Preview` interactions and styling.

## 0.4.0 - 2026-11-09

### `@puzzle-ui/core`

#### Added

- Added color parsing and conversion utilities including `parseColor`, RGB/HSL conversion, RGBA helpers, luminance calculation, and color-format detection.

### `@puzzle-ui/create`

#### Fixed

- Handled missing CSS import paths safely while configuring Tailwind for TanStack Start.

### `@puzzle-ui/ui`

#### Added

- Added the `EmptyState` data-display component.
- Added `ColorPicker` and `InputGroup` form components.
- Added the `Pagination` navigation component.

#### Changed

- Refined existing form controls, navigation, layout, overlays, and `Preview` behavior.

## 0.3.0 - 2026-11-08

### `@puzzle-ui/create`

#### Added

- Introduced the interactive `create-puzzle` CLI for scaffolding Next.js, TanStack Start, and Vite React/TypeScript projects.
- Added project-name normalization, Puzzle UI and Theme setup, and optional Tailwind CSS configuration.

## 0.2.0 - 2026-11-08

### `@puzzle-ui/core`

#### Added

- Added responsive value helpers and breakpoint configuration through `BREAKPOINTS`, `resolveResponsiveValue`, and `resolveResponsiveValueForBreakpoint`.
- Added `normalizeSearchString` and consolidated string utilities under the string entry point.

### `@puzzle-ui/hooks`

#### Added

- Added `useRovingFocus` for keyboard navigation and roving tab stops, with orientation, RTL, looping, disabled-item, initial-focus, and programmatic-focus support.

### `@puzzle-ui/icons`

#### Changed

- **Breaking:** Renamed the package from `@puzzle/icons` to `@puzzle-ui/icons`; added conditional ESM/CJS TypeScript export entries.

### `@puzzle-ui/theme`

#### Added

- Added locally scoped themes through `ThemeScope` and theme component integrations through `ThemeComponents`.
- Expanded theme tokens with light/dark color schemes and configurable typography, spacing, layout, motion, and other design values; added responsive breakpoints.

### `@puzzle-ui/ui`

#### Added

- Added `ToggleGroup`, `Alert`, `Image`, `Paper`, `Skeleton`, and `LinearProgress` components.
- Added form controls: `Autocomplete`, `Checkbox`, `DatePicker`, `FileUpload`, `FormField`, `Input`, `Label`, `RadioGroup`, `Select`, `Slider`, `Stepper`, and `Switch`.
- Added layout components: `AppBar`, `Background`, `BottomNavigation`, `Breadcrumbs`, `CollapsibleSidebar`, `PageLayout`, `ResizablePanels`, `Sidebar`, and `Stack`.
- Added navigation components: `Accordion`, `Carousel`, `Link`, `Tabs`, and `TreeView`.
- Added overlay components: `Command`, `Dialog`, `Drawer`, `DropdownMenu`, `Notification`, `Popout`, `Popover`, and `Tooltip`.
- Added `TextEditor` with toolbar and renderer components, plus `Preview` with syntax highlighting.
- Added shared floating positioning and overlay management, along with scroll-lock and transition utilities.

## 0.1.0 - 2026-10-26

### `@puzzle-ui/core`

#### Added

- Introduced core string, color, and timing utilities, including `cn`, `nameToInitials`, color conversion/detection helpers, and `debounce`.

### `@puzzle-ui/hooks`

#### Added

- Added `useKeyboardKeys` for handling selected global keydown/keyup events, with modifier state and optional default-prevention and propagation controls.

### `@puzzle-ui/icons`

#### Added

- Introduced `Icon` and `SSRIcon` React components, plus named icon exports from bundled Iconify collections.

### `@puzzle-ui/theme`

#### Added

- Introduced the `Theme` provider, `GoogleFont`, configurable font definitions, typography presets, and token-driven CSS variables.

### `@puzzle-ui/ui`

#### Added

- Added `Button`, `ButtonGroup`, `Avatar`, and `Badge` foundational components.
- Added `Container`, `Section`, and `SectionStack` layout components.
- Added `Heading`, `Text`, and `CircularProgress` components.
- Added `Backdrop`, `Portal`, `PortalTarget`, and `Transition` primitives.
