# Changelog

All notable changes to `@puzzle-ui/theme` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

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
