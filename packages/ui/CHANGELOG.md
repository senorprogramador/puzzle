# Changelog

All notable changes to `@puzzle-ui/ui` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Added rendering boundaries: `FoldBoundary`, `FoldProvider`, `DeferredBoundary`, `SsrBoundary` and `StaticBoundary`. They add Next.js and TanStack Start client/server adapters and support fold-aware, deferred and static rendering with streaming SSR.
- Added subpath exports `./rendering/deferred`, `./rendering/ssr`, `./rendering/static`, `./rendering/fold`, `./next/client`, `./next/server`, `./tanstack/client`, `./tanstack/server` and `./tanstack/shared`.
- `AppBar` now lazy-loads its mobile navigation drawer on demand. It prefetches the drawer when idle and shows loading and retry states.
- `Image` now infers an aspect ratio from width and height when none is given. A `preload` image now defaults to eager loading and high fetch priority.
- `DatePicker` has a new `requiredDescription` prop. It gives required fields an accessible description, "Required" by default.
- `TextInput` now supports `type="search"`.
- `Section` now constrains its content width by default unless `fullWidth` is set, including for the default theme.
- Fixed `Badge` so it no longer stretches in flex layouts, increased `Card` header row spacing, and let `TokenInput` tokens shrink.
- Added packaged AI guidance (`ai/` instructions and manifest). Updated the README and API stability notes.

## 0.12.0 - 2026-11-18

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

## 0.11.0 - 2026-11-16

- Added a `barWidth` prop to `LinearProgress` and `CircularProgress` to customize bar thickness; circular progress rescales its radius and dash length to match.

## 0.10.1 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.0 - 2026-11-16

- Added a responsive `Pagination` layout: on viewports under 768px it shows a compact page list (no sibling pages, at most one boundary page), while larger viewports keep the configured `siblingCount` and `boundaryCount`.
- Added `style` prop support to `Section`, so inline styles are now applied to the rendered element.
- Improved the layout and navigation component docs and examples, and added a component carousel to the site home page.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- Improved the package README and overlay guidelines with clearer descriptions, section headings, and a link to the overlay documentation.

## 0.7.0 - 2026-11-15

- Added `ImageBox`, a photo gallery component that lays out one to five images in a main-plus-supporting grid with a "+N" overflow tile, with an `aspectRatio` prop (default 2), `gap` and `radius` props, and `onImageClick` and `onViewAll` callbacks.
- Added exported `ImageBoxProps` and `ImageBoxImage` types.
- Added accessibility to `ImageBox`: a labelled gallery group, interactive tiles rendered as buttons only when callbacks are provided, a "View all photos" button, and eager loading for the main image with lazy loading for the rest.
- Documented `ImageBox` and refreshed the form component docs (Autocomplete, Checkbox, ColorPicker, DatePicker, FileUpload, FormField, InputGroup, Label, NumberInput, RadioGroup, Select, Slider, Stepper, Switch, TextAreaInput, TextInput, TimePicker, TokenInput).

## 0.6.2 - 2026-11-15

- Added link support to TextEditor: a toolbar Link popover to apply, edit and remove links, link rendering in the editor and TextRenderer, and a new exported `TextLink` type for inline `link` data.
- Added safe link handling to TextEditor: only http, https, mailto and tel URLs are accepted, and links are preserved when parsing pasted HTML and Markdown.
- Added a `searchPlaceholder` prop and a search icon to the DataTable search field.
- Improved TextEditor list behavior: pressing Enter on an empty list item exits the list, list items get proper indentation, and the bullet and ordered list toolbar icons are no longer swapped.
- Fixed TextEditor losing its selection when focusing the editor or interacting with toolbar controls.

## 0.6.1 - 2026-11-15

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

- Added the `Grid` and `GridItem` layout components. They support responsive (mobile, tablet and desktop) columns, rows, gaps, alignment, auto-flow, auto-fit `minChildWidth`, item spans and placement, polymorphic `as` roots, and native props and refs.
- Fixed `Badge` so a standalone badge, one with no children, renders as a `span` instead of a `div`. This keeps it valid inside paragraphs and avoids hydration errors. Badges wrapping children still render a `div`.

## 0.5.1 - 2026-11-14

- `TreeView` now expands branch rows when clicked by default; linked branches continue to navigate. Set `expandOnItemClick={false}` to select groups on click and expand them only with the arrow.

## 0.5.0 - 2026-11-14

### Added

- Added `TokenInput` and `TimePicker` form controls.
- Added the `Rating` component for displaying and selecting ratings.
- Added `AspectRatio`, `Separator`, and `ScrollArea` layout components.
- Added `ContextMenu` and expanded its interaction support.

### Changed

- Refined `ButtonGroup`, `Badge`, `Checkbox`, `Section`, `Stack`, and `Preview` interactions and styling.

## 0.4.0 - 2026-11-09

### Added

- Added the `EmptyState` data-display component.
- Added `ColorPicker` and `InputGroup` form components.
- Added the `Pagination` navigation component.

### Changed

- Refined existing form controls, navigation, layout, overlays, and `Preview` behavior.

## 0.3.0 - 2026-11-08

- No changes; version bumped in lockstep.

## 0.2.0 - 2026-11-08

### Added

- Added `ToggleGroup`, `Alert`, `Image`, `Paper`, `Skeleton`, and `LinearProgress` components.
- Added form controls: `Autocomplete`, `Checkbox`, `DatePicker`, `FileUpload`, `FormField`, `Input`, `Label`, `RadioGroup`, `Select`, `Slider`, `Stepper`, and `Switch`.
- Added layout components: `AppBar`, `Background`, `BottomNavigation`, `Breadcrumbs`, `CollapsibleSidebar`, `PageLayout`, `ResizablePanels`, `Sidebar`, and `Stack`.
- Added navigation components: `Accordion`, `Carousel`, `Link`, `Tabs`, and `TreeView`.
- Added overlay components: `Command`, `Dialog`, `Drawer`, `DropdownMenu`, `Notification`, `Popout`, `Popover`, and `Tooltip`.
- Added `TextEditor` with toolbar and renderer components, plus `Preview` with syntax highlighting.
- Added shared floating positioning and overlay management, along with scroll-lock and transition utilities.

## 0.1.0 - 2026-10-26

### Added

- Added `Button`, `ButtonGroup`, `Avatar`, and `Badge` foundational components.
- Added `Container`, `Section`, and `SectionStack` layout components.
- Added `Heading`, `Text`, and `CircularProgress` components.
- Added `Backdrop`, `Portal`, `PortalTarget`, and `Transition` primitives.
