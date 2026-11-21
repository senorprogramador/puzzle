# Changelog

All notable changes to `@puzzle-ui/hooks` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Added `useColorScheme` to read an element's computed light or dark scheme. It updates when the element's class, style or `data-theme` changes.
- Added visibility-driven rendering hooks: `FoldProvider`, `useFold`, `useFoldOptimization`, `useVisibility`, `useFoldState`, `useIsVisible` and `useIsNearby`. They share one `IntersectionObserver` engine for viewport and proximity tracking.
- Added `useResourcePrefetch` for abortable, deduplicated prefetching by visibility, proximity, idle time or explicit request, without mounting components.
- Added opt-in local rendering diagnostics through `FoldProvider`'s `onDiagnosticEvent`. Diagnostics are off by default and nothing is transmitted.
- Added packaged AI guidance (`ai/` instructions and manifest). Reorganized source into interaction, state, preferences and rendering folders; the public exports are unchanged.

## 0.12.0 - 2026-11-18

- Added `useAsyncAction` for tracking idle, loading, success and error state of an async action, with duplicate-run protection and `reset`.
- Added `useListFilter` for text search and category filtering of lists, with derived categories and an `enabled` switch.
- Added `useReducedMotion`, an SSR-safe hook that follows the `prefers-reduced-motion` media query and defaults to reduced motion on the server.

## 0.11.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.1 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.8.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.7.0 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.2 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.1 - 2026-11-15

- No changes; version bumped in lockstep.

## 0.6.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.1 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.5.0 - 2026-11-14

- No changes; version bumped in lockstep.

## 0.4.0 - 2026-11-09

- No changes; version bumped in lockstep.

## 0.3.0 - 2026-11-08

- No changes; version bumped in lockstep.

## 0.2.0 - 2026-11-08

### Added

- Added `useRovingFocus` for keyboard navigation and roving tab stops, with orientation, RTL, looping, disabled-item, initial-focus, and programmatic-focus support.

## 0.1.0 - 2026-10-26

### Added

- Added `useKeyboardKeys` for handling selected global keydown/keyup events, with modifier state and optional default-prevention and propagation controls.
