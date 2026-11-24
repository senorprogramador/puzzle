# Changelog

All notable changes to `@puzzle-ui/core` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.19.0 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- No changes; version bumped in lockstep.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.14.0 - 2026-11-20

- No changes; version bumped in lockstep.

## 0.13.0 - 2026-11-20

- Added `formatCurrency`, `formatDate`, `formatDateRange`, `formatNumber` and `formatTime`, plus the `DateRange` type. They use `Intl` with an explicit locale and caller-supplied options such as `timeZone`.
- Added the framework-neutral `@puzzle-ui/core/rendering` subpath, also re-exported from the root. It covers fold strategies, render modes, optimization profiles (conservative, balanced, aggressive, custom), configuration and policy resolution, component classification, fold-position prediction, deferred-load lifecycle, and typed rendering diagnostic events.
- Added the framework-neutral `@puzzle-ui/core/resources` subpath with `createResourceScheduler`. It provides prioritized, abortable, deduplicated loading of chunks, data and images, with retries, concurrency and prefetch budgets.
- Added packaged AI guidance (`ai/` instructions and manifest) for consumer instruction generation.

## 0.12.0 - 2026-11-18

- No changes; version bumped in lockstep.

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

### Added

- Added color parsing and conversion utilities including `parseColor`, RGB/HSL conversion, RGBA helpers, luminance calculation, and color-format detection.

## 0.3.0 - 2026-11-08

- No changes; version bumped in lockstep.

## 0.2.0 - 2026-11-08

### Added

- Added responsive value helpers and breakpoint configuration through `BREAKPOINTS`, `resolveResponsiveValue`, and `resolveResponsiveValueForBreakpoint`.
- Added `normalizeSearchString` and consolidated string utilities under the string entry point.

## 0.1.0 - 2026-10-26

### Added

- Introduced core string, color, and timing utilities, including `cn`, `nameToInitials`, color conversion/detection helpers, and `debounce`.
