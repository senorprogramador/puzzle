# AI documentation

This directory is a navigation and decision layer for AI-assisted work in
Puzzle. It points to authoritative implementation and usage sources; it does
not replace package documentation or duplicate package instructions.

## Find the relevant guide

| Task | Start here |
| --- | --- |
| Understand the monorepo or locate a workspace | [Architecture overview](./architecture/overview.md), [package map](./architecture/package-map.md) |
| Trace package dependencies or change a shared contract | [Dependency map](./architecture/dependency-map.md), [cross-package workflow](./workflows/cross-package-changes.md) |
| Choose a Piece, UI component, or custom React | [Component selection](./reference/component-selection.md) |
| Model data or add persistence | [Data architecture](./reference/data-architecture.md), [database integration](./workflows/database-integration.md) |
| Choose a framework integration | [Framework overview](./frameworks/overview.md), [compatibility matrix](./frameworks/compatibility.md) |
| Develop or validate a component/package | [Component workflow](./workflows/component-development.md), [package workflow](./workflows/package-development.md), [testing strategy](./reference/testing-strategy.md) |
| Review component maturity or registry data | [API stability audit](../api-stability-audit.md), [component registry](./registry/README.md) |
| Run browser QA or assess a generated/reference website | [Quality overview](./quality/README.md), [Playwright strategy](./quality/playwright.md), [visual testing](./quality/visual-testing.md), [responsive testing](./quality/responsive-testing.md), [accessibility](./quality/accessibility.md) |
| Review evidence from the current quality initiative | [Initiative assessment](./quality/initiative-assessment.md) |
| Plan and generate a website | [Website planning engine](./website/README.md), [15-phase workflow](./website/generation-workflow.md) |
| Install Puzzle consumer instructions in an application | [AI integration guide](./integration/README.md), [generated package registry](./integration/registry.json) |
| Change documentation-site content or navigation | [Site instructions](../../apps/site/AGENTS.md) |
| Work on auth security | [Auth security guide](../../apps/site/content/docs/auth/security.mdx), [security policy](../../SECURITY.md) |
| Work on multilingual runtime, routing, React, catalogs/sources, CLI, or SEO APIs | [Multilingual package instructions](../../packages/i18n/AGENTS.md), [public docs](../../apps/site/content/docs/multilingual/index.mdx) |

Read the root [AGENTS.md](../../AGENTS.md) first for repository-wide task
routing. Then read only the nearest relevant package or app `AGENTS.md`; these
contain local implementation knowledge and do not replace this cross-cutting
index.

## Sources of truth

Resolve questions in this order:

1. Current source code, package manifests, and public exports establish
   implementation and API truth.
2. Architecture documents explain intended ownership and boundaries.
3. Package documentation explains supported usage.
4. `AGENTS.md` files provide development rules.
5. These AI documents provide cross-cutting navigation and workflows.

If sources disagree, verify against the higher-level source and correct the
stale document when safe. Do not silently repeat an unresolved conflict.

For component maturity, an unresolved inconsistency exists between the
aggregate [API stability audit](../../docs/api-stability-audit.md) and some
per-component labels in the UI README and site documentation. Check the target
component's current documentation and report the discrepancy rather than
assuming a global stability label.

The [roadmap](../../ROADMAP.md) describes planning status, not API guarantees.
The [Auth foundation document](../../docs/auth/architecture-and-foundation.md)
records architectural intent, not a substitute for current exports. Dated
SEO/GEO audits and reports under `docs/seo-geo/` are evidence snapshots, not
proof of current deployment state or API behavior.

## Authoritative references

- [Contribution guide](../../CONTRIBUTING.md) and [root README](../../README.md):
  repository setup and contributor workflows.
- [Architecture indexes](./architecture/overview.md): current workspace
  inventory, responsibilities, exports, and dependency relationships.
- Package READMEs and site docs: public usage; verify examples against exports.
- [Testing guide](../../apps/site/content/docs/developer/testing.mdx): test
  selection, infrastructure, and repository-specific requirements.
- [Security policy](../../SECURITY.md): vulnerability reporting; package
  security requirements belong in the relevant package and Auth docs.
