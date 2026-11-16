# Changelog

All notable changes to `@puzzle-ui/theme` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.10.0 - 2026-11-16

- No changes; version bumped in lockstep.

## 0.9.0 - 2026-11-16

- Added `createFontRouteRules` in `@puzzle-ui/theme/nitro`, which creates Nitro route rules that cache versioned fonts for a year as immutable and the generated stylesheet and preload fonts for a day with background revalidation.
- `downloadGoogleFonts` now accepts WOFF2 fonts that Google Fonts serves from `fonts.gstatic.com/l/font?kit=…` URLs, which fixes intermittent `fonts:download` failures.

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

### Added

- Added `puzzle-theme fonts download` to download configured Google Fonts and generate locally hosted font assets and stylesheets.
- Added local font loading to `Theme` and `GoogleFont`, with `fontSource`, `fontBasePath`, and `fontPreload` options; `FontConfig` now supports variable-font `weightRange`.

## 0.4.0 - 2026-11-09

- No changes; version bumped in lockstep.

## 0.3.0 - 2026-11-08

- No changes; version bumped in lockstep.

## 0.2.0 - 2026-11-08

### Added

- Added locally scoped themes through `ThemeScope` and theme component integrations through `ThemeComponents`.
- Expanded theme tokens with light/dark color schemes and configurable typography, spacing, layout, motion, and other design values; added responsive breakpoints.

## 0.1.0 - 2026-10-26

### Added

- Introduced the `Theme` provider, `GoogleFont`, configurable font definitions, typography presets, and token-driven CSS variables.
