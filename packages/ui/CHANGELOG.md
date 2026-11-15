# Changelog

All notable changes to `@puzzle-ui/ui` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

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
