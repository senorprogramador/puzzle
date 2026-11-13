# Changelog

All notable changes to `@puzzle-ui/seo` are documented here.

## Unreleased

### Added

- `inspectSeoGraph` for graph inspection.
- `formatSeoDiagnostics` for formatted validation reports.
- `createSeoTestFixture` for framework-independent test fixtures.
- `runSeoTest` for structured SEO validation results.
- `assertSeoTest` for assertion-based validation.
- `SeoGraphInspection` and related public types.
- Dedicated testing API documentation.

### Improved

- Testing utilities remain independent of React and test runners.
- Graph inspection exposes node types, properties and references.
- Diagnostics can include suggestions, paths and validation summaries.

### Compatibility

- React 19 remains an optional peer dependency.
- Existing package exports remain compatible.
- ESM, CommonJS and TypeScript declaration entrypoints are retained.
- No new runtime dependencies are introduced.

### Release

- Uses the existing Puzzle lockstep release process.
- No independent package versioning or publishing workflow is introduced.
