# Testing strategy

Choose tests by the risk and behavior changed. Start with the narrowest
relevant test, then expand when a contract, integration, or user-visible flow
is affected.

## Testing pyramid

| Layer | Use it for | Examples |
| --- | --- | --- |
| Unit | Pure logic, validation, transformations, and edge cases | Utility and schema tests |
| Component | Rendering, props, accessibility semantics, and local state | jsdom component tests |
| Integration | Boundaries between packages, adapters, and services | Storage conformance and framework-handler tests |
| End-to-end | Critical user journeys across the running application | Playwright browser tests; generated-project matrix |
| Visual review | Layout, responsive changes, typography, and regressions apparent in rendered UI | Existing browser runs plus manual screenshot inspection |

Keep lower-level tests fast and specific; use browser tests for real layout,
focus, keyboard, scrolling, pointer, or streaming behavior that a DOM
simulation cannot establish. Add E2E coverage when correctness depends on
multiple real layers. Do not use an E2E test as a substitute for focused
contract tests.

The repository has Playwright/browser coverage, including a production-preview
suite for the client-side reference website. No dedicated visual-regression
baseline or screenshot matcher is configured. Treat screenshot comparison as
manual; do not claim automated visual-regression coverage otherwise. See the
[AI quality guides](../quality/README.md) for the reference-site test command,
viewport matrix, and visual inspection workflow.

## Select validation

1. Read the affected package or app manifest and local `AGENTS.md`.
2. Run its focused test for the changed behavior.
3. Run typecheck/build when types, exports, bundling, or framework boundaries
   change.
4. Run consumer integration tests for public contract changes.
5. Use repository-wide suites for broad changes or before release, not as the
   default for every small edit.

Known root commands include `bun run build`, `bun run typecheck`,
`bun run test:all`, `bun run test:reference`, and `bun run test:e2e`.
`test:all` includes package, browser, MongoDB integration, and reference-site
tests; `test:reference` builds workspace packages and the playground, then
tests its production preview. `test:e2e` exercises generated project shapes
and requires Docker and network access. UI and Pieces provide focused
`test:unit`, `test:component`, and `test:browser` scripts. The documentation
site uses `bun run --filter "@puzzle-ui/site" build`. Check current manifests
before using any command or assuming its prerequisites.

For infrastructure and exact test-selection guidance, see the
[site testing guide](../../../apps/site/content/docs/developer/testing.mdx) and
[testing workflow](../workflows/testing.md).
