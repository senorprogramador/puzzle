# Copilot instructions

These instructions supplement, and do not replace, the repository-wide and nearest
app/package `AGENTS.md` files. Those instructions, package manifests, public exports,
and the repository documentation are authoritative. If guidance conflicts, follow
the closest applicable repository instruction and verify behavior against source.

## Find the right context

- Read the root `AGENTS.md` and the applicable nested instructions before editing.
- Use [`docs/ai/README.md`](../docs/ai/README.md) to find relevant architecture,
  workflow, framework, and quality guidance; do not load unrelated guides.
- Identify each affected workspace from its manifest. Check its public exports,
  direct consumers, implementation, and focused tests before changing contracts.
- Follow package boundaries and client/server entry points. Do not rely on deep
  imports or infer support from directory names.

## Plan substantial changes

For cross-package or otherwise substantial work, first identify affected apps and
packages, dependencies and boundaries, implementation and test changes, related
documentation, and verifiable completion criteria. Keep small, local fixes direct.

## Implement and synchronize

- Follow nearby patterns; prefer focused, composable changes over new abstractions
  or dependencies.
- Preserve existing behavior and public APIs unless a breaking change is explicit.
  Do not add incomplete placeholders or task-introduced TODOs.
- When public behavior changes, update the relevant user docs, examples, previews,
  tests, and AI/architecture references. Verify documented imports against public
  exports.
- For UI changes, preserve semantic HTML, keyboard support, visible focus,
  responsive behavior, theme support, and reduced-motion preferences. Inspect
  rendered output at relevant viewport sizes when the change affects presentation.
- For public site changes, validate route metadata, canonicals, structured data,
  crawlability, and AI-readable resources where applicable.

## Validate and report

- Read the affected manifest and use its existing scripts. Run focused tests,
  typechecks, and builds appropriate to the change; use browser tests for rendered
  behavior.
- Do not treat compilation as sufficient for visual, accessibility, SEO, or
  interaction changes. Inspect browser output when those behaviors are affected.
- Report the exact commands run and their outcomes. Clearly identify checks not run,
  environmental limitations, and anything that remains unverified; never infer a
  passing result.
