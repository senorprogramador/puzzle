# Changelog

All notable changes to Puzzle packages are documented in this file. Packages
are released in lockstep; packages without changes are omitted from each release.
Individual package changelogs contain their own history.

## [Unreleased]

### Added

### Changed

### Fixed

### Deprecated

### Removed

### Security

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
