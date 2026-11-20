# Testing workflow

1. Identify the changed behavior and its owning package/app. Read its
   `AGENTS.md` and manifest before selecting commands.
2. Choose the narrowest test that establishes the behavior:
   - pure logic: unit test;
   - rendered props/state: component test;
   - adapter/service/framework boundary: integration test;
   - real navigation or multi-layer journey: browser/E2E test.
3. Run typecheck/build if types, public exports, bundling, or framework
   boundaries changed. Expand to consumers when a shared API changed.
4. For visual changes, inspect the rendered page at relevant viewport sizes;
   use existing Playwright browser tests when available and manually inspect
   screenshots. Do not imply a baseline-based visual test exists unless the
   package has one.
5. Report exact commands and pass/fail results. State infrastructure-dependent
   checks not run and why.

Useful verified commands include:

- Root: `bun run build`, `bun run typecheck`, `bun run test:all`, and
  `bun run test:e2e`.
- UI/Pieces: `bun run test:unit`, `bun run test:component`, and
  `bun run test:browser` in the relevant package.
- Site docs: `bun run --filter "@puzzle-ui/site" build`.

The root `test:all` suite is broad and includes browser and MongoDB
integration tests. The generated-project E2E suite requires Docker and network
access. For test-layer guidance, see the
[testing strategy](../reference/testing-strategy.md) and
[site testing guide](../../../apps/site/content/docs/developer/testing.mdx).
