# Website planning engine

Use this planning system to turn verified requirements into an implementable
website plan before changing application code. It is a repeatable workflow and
set of working templates, not an application generator or a requirement to use
every Puzzle package.

## Lifecycle

| Stage | Phases | Result |
| --- | --- | --- |
| Planning | 1–10 in the [generation workflow](./generation-workflow.md) | Confirmed brief, sitemap, page and content inventories, component choices, data/design/application architecture, and an ordered implementation plan |
| Implementation | 11–12 | Shared foundations and pages implemented, then real data sources integrated at appropriate application boundaries |
| Quality assurance and delivery | 13–15 | Functional and visual evidence, known limitations, and a delivery report |

Start with the [project brief](./templates/project-brief.md), then complete the
[sitemap](./templates/sitemap.md), [content inventory](./templates/content-inventory.md),
[page specifications](./templates/page-specification.md), [data model](./templates/data-model.md),
[design system](./templates/design-system.md), and
[implementation plan](./templates/implementation-plan.md) as applicable.
Use the [planning validation checklist](./planning-validation.md) before
implementation and the [quality report](./templates/quality-report.md) at
delivery. Do not create empty artifacts for decisions that do not apply; record
why they are not applicable.

## Decision guides

- [Content modeling](./content-modeling.md) and its
  [content inventory template](./templates/content-inventory.md)
- [Database planning](./database-planning.md) and its
  [data model template](./templates/data-model.md)
- [Design-system planning](./design-system.md) and its
  [design-system template](./templates/design-system.md)
- [Page composition](./page-composition.md) and the
  [page specification template](./templates/page-specification.md)

## Framework and storage constraints

The current interactive Create CLI offers **Next.js App Router**, **TanStack
Start**, **React Router framework mode**, and **Basic React (Vite + TypeScript)**.
That list describes scaffold choices, not equal integration guarantees. Check
the [compatibility matrix](../frameworks/compatibility.md) and focused framework
guides before planning SSR, routing, auth, SEO, or deployment behavior.

Create asks for an Auth database only when Auth is enabled for a full-stack
framework. Its current options are **MongoDB**, **Cloudflare D1**, and **Custom**
(bring a Puzzle Storage adapter); Basic React has no generated database
integration. These are not a general database provisioning service. For any
other persistence requirement, validate the chosen server runtime, adapter,
and deployment configuration independently. See
[database planning](./database-planning.md), the
[Storage contract instructions](../../../packages/storage/AGENTS.md), and the
[Create README](../../../packages/create/README.md).

## Source of truth and truthfulness

- Use the [component registry](../registry/README.md) to discover candidate
  Pieces and UI components, then inspect their current docs and public APIs.
- Use [data architecture](../reference/data-architecture.md) and
  [content modeling](./content-modeling.md) before deciding that content needs
  persistence.
- Use Puzzle Theme as the design-token source; see the
  [Theme package instructions](../../../packages/theme/AGENTS.md).
- Keep user-provided facts, externally verified facts (with sources),
  AI-generated suggestions, and unknowns distinct in every planning artifact.
- Never invent company or organization facts, prices, testimonials, customer
  identities, legal claims, product specifications, or contact details. Mark
  missing information as unknown and use clearly labeled placeholders until
  it is verified.

Ask for clarification only when missing information materially changes business
requirements, factual content, security, data ownership, or the resulting
application. Make ordinary technical choices using repository guidance and
record assumptions that do not require a decision.
