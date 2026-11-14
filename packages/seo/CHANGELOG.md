# Changelog

All notable changes to `@puzzle-ui/seo` are documented in this file.
Puzzle packages are released in lockstep; versions without package changes are noted as such.

## Unreleased

### Fixed

- Keep React schema component JSON-LD graphs synchronized with client-side registrations, including components rendered after Suspense and changes made without a `SeoProvider` rerender.

## 0.5.0 - 2026-11-14

### Added

- Initial release of a framework-independent SEO toolkit with deterministic Schema.org graph construction, merging, reference resolution, validation, and safe JSON-LD serialization.
- Added a generated Schema.org registry, React metadata and structured-data components, server rendering support, and Next.js, TanStack, and React Router adapters.
- Added metadata resolution, server handlers, sitemap and robots.txt generation, URL normalization, and validation utilities.
- Added framework-independent testing utilities: `inspectSeoGraph`, `formatSeoDiagnostics`, `createSeoTestFixture`, `runSeoTest`, and `assertSeoTest`, with related public types and documentation.
