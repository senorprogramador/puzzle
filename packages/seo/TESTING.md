# Testing @puzzle-ui/seo

Puzzle SEO exposes framework-independent testing utilities.

They do not require React, Vitest, Jest or another test runner at runtime.

## Create a fixture

```ts
import { createSeoTestFixture } from "@puzzle-ui/seo/testing";

const fixture = createSeoTestFixture({
  config: {
    siteUrl: "https://example.com",
    defaultLocale: "en",
    supportedLocales: ["en", "nl"],
  },
  nodes: [
    {
      "@type": "Organization",
      name: "Example",
      url: "https://example.com",
    },
  ],
});
```

You can supply an existing graph instead of nodes.

## Validate a fixture

```ts
import { createSeoTestFixture, runSeoTest } from "@puzzle-ui/seo/testing";

const fixture = createSeoTestFixture({
  config: {
    siteUrl: "https://example.com",
  },
  nodes: [
    {
      "@type": "Organization",
      name: "Example",
    },
  ],
});

const result = runSeoTest(fixture);

if (!result.passed) {
  console.error(result.errors);
}
```

The result contains:

- `passed`: whether validation succeeded.
- `errors`: validation errors.
- `warnings`: non-blocking warnings.
- `report`: the complete structured validation report.

## Strict validation

Warnings are treated as errors in strict mode.

```ts
const result = runSeoTest(fixture, {
  strict: true,
});
```

## Selective validation

You can disable individual validation categories.

```ts
const result = runSeoTest(fixture, {
  validateSchema: false,
  validateMetadata: false,
  validateReferences: false,
});
```

## Assertions

Use `assertSeoTest` when a failed validation should fail the surrounding test.

```ts
import { assertSeoTest } from "@puzzle-ui/seo/testing";

assertSeoTest(fixture, {
  strict: true,
});
```

The function returns the successful test result or throws an error containing formatted diagnostics.

## Graph inspection

Inspect the nodes, types, properties and references in a graph.

```ts
import { inspectSeoGraph } from "@puzzle-ui/seo/testing";

const inspection = inspectSeoGraph(graph, {
  baseUrl: "https://example.com",
});

console.log(inspection.nodeCount);
console.log(inspection.typeCounts);
console.log(inspection.references);
console.log(inspection.unresolvedReferences);
```

The inspection result includes:

- Node count.
- Counts grouped by Schema.org type.
- Node IDs and properties.
- All collected references.
- Unresolved local references.
- Graph validity.

Inspection does not mutate the original graph.

## Format diagnostics

```ts
import { formatSeoDiagnostics } from "@puzzle-ui/seo/testing";

const output = formatSeoDiagnostics(result.report);

console.log(output);
```

Optional formatting controls:

```ts
const output = formatSeoDiagnostics(result.report, {
  includeSuggestions: false,
  includePaths: true,
  includeSummary: true,
});
```

## Testing React integrations

The testing utilities intentionally do not render React components.

For React integration tests, use React Testing Library or the test runner of your choice.

The package's own React integration tests use Vitest, React DOM and Playwright.

## Recommended test strategy

1. Test metadata resolution independently.
2. Test Schema.org nodes and graph construction.
3. Inspect graph references.
4. Run strict SEO validation.
5. Test rendered JSON-LD separately.
6. Test framework-specific routes and server rendering.
7. Verify the production package exports.

## Package commands

From `packages/seo`:

```bash
bun run typecheck
bun run typecheck:test
bun run test:unit
bun run test:integration
bun run test:boundaries
bun run test:package
bun run test:browser
bun run test:schema
bun run vitest
```

For a complete repository release validation:

```bash
bun run build
bun run typecheck
bun run test:all
bun run --filter '@puzzle-ui/site' build
bun run release:dry-run
```
