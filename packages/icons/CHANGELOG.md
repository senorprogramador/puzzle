# Changelog

All notable changes to `@puzzle-ui/icons` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## 0.5.0 - 2026-11-14

### Added

- Added the `showLoader` prop to display an animated loading indicator, with reduced-motion support.

### Changed

- `Icon` now defaults unspecified dimensions to `1em` and supports custom SVG children when the loader is not shown.

### Removed

- **Breaking:** Removed the `SSRIcon` export.

## 0.4.0 - 2026-11-09

- No changes; version bumped in lockstep.

## 0.3.0 - 2026-11-08

- No changes; version bumped in lockstep.

## 0.2.0 - 2026-11-08

### Changed

- **Breaking:** Renamed the package from `@puzzle/icons` to `@puzzle-ui/icons`; added conditional ESM/CJS TypeScript export entries.

## 0.1.0 - 2026-10-26

### Added

- Introduced `Icon` and `SSRIcon` React components, plus named icon exports from bundled Iconify collections.
