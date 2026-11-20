# Website generation workflow

Complete planning phases 1–10 before starting page implementation. The plan
should be proportional to the site: skip inapplicable artifacts with a brief
reason, but do not skip a decision that affects truthfulness, architecture,
security, or acceptance criteria.

## Operational sequence

Follow these five stages in order. The detailed phase definitions below specify
the inputs, decisions, dependencies, outputs, and completion criteria.

### Phase A – Project setup

1. Read the completed project brief and mark user-provided facts separately
   from suggestions and unknowns.
2. Determine the framework, styling preference, Auth requirement, and database
   requirement.
3. Validate the choices against the actual Create configuration schema and
   supported combinations.
4. Generate the project with `@puzzle-ui/create`. Use interactive setup or a
   validated JSON configuration; never put passwords in that file.
5. Install and initialize dependencies. Supply MongoDB/D1 initial-user
   credentials through the documented stdin mechanism; do not approve a
   database reset implicitly.
6. Inspect the generated files, environment-variable structure, routes, Theme
   integration, Auth setup, and database setup where applicable.
7. Run the generated application's typecheck and build before planning changes
   on top of it.

### Phase B – Planning

1. Complete the sitemap and identify duplicate or overlapping routes.
2. Complete page specifications for every route.
3. Complete the content inventory, including sources and explicitly unknown
   facts.
4. Complete the data model only for information that needs persistence.
5. Complete the design-system plan using Puzzle Theme tokens.
6. Complete the dependency-aware implementation plan.

### Phase C – Architecture

1. Inspect the generated framework structure and its framework-specific guide.
2. Define the global layout and shared route shells.
3. Configure Puzzle Theme and the design tokens.
4. Configure fonts and local font delivery.
5. Configure routing and route-level rendering boundaries.
6. Configure navigation and shared page chrome.
7. Configure server-side data access and integrations.
8. Configure Auth and authorization where applicable.

### Phase D – Implementation

1. Implement shared layouts.
2. Implement reusable application components.
3. Implement public pages.
4. Implement authenticated pages.
5. Integrate the configured database or other data sources.
6. Integrate approved content and assets.
7. Implement interactions and loading, empty, error, and disabled states.
8. Implement SEO and framework-specific metadata.

Use the [component registry](../registry/README.md) to discover candidates.
Verify every selected public export and API before using it. Prefer suitable
Pieces, then UI, existing application components, and finally semantic React
nodes; do not force a component into an unsuitable section. Keep application
data outside presentation components and database access on the server.

### Phase E – Validation

1. Run the generated application's typecheck.
2. Run relevant unit tests.
3. Run integration tests for affected routes, data access, and Auth.
4. Run Playwright tests for critical user flows.
5. Inspect screenshots at representative viewport sizes.
6. Fix functional and visual issues, then repeat the relevant checks.
7. Record results, remaining risks, and setup instructions in the quality
   report.

Do not treat a successful CLI exit as evidence that the generated application
works. Verify its build and the user-visible flows that the plan requires.

## Planning

### 1. Project configuration

**Objective:** establish the project environment and non-negotiable constraints.<br>
**Inputs:** repository state, user brief, package manifests, deployment target.<br>
**Decisions:** existing app versus new scaffold; supported framework, runtime,
package manager, styling, hosting, and required Puzzle packages.<br>
**Outputs:** completed project-brief configuration and verified framework choice.<br>
**Dependencies:** none.<br>
**Complete when:** framework and deployment assumptions are checked against
current project files and the [compatibility matrix](../frameworks/compatibility.md).

### 2. Requirements discovery

**Objective:** convert the request into explicit user and business outcomes.<br>
**Inputs:** user-provided requirements, project context, known content sources.<br>
**Decisions:** target audiences, conversion goals, required functions,
accessibility expectations, success measures, and what remains unknown.<br>
**Outputs:** approved facts, requirements, constraints, assumptions, and
clarification items in the [project brief](./templates/project-brief.md).<br>
**Dependencies:** phase 1.<br>
**Complete when:** each requirement is testable or explicitly marked as an
open question; AI suggestions are not presented as user facts.

### 3. Website structure

**Objective:** define the information architecture and navigation model.<br>
**Inputs:** approved goals, audiences, content domains, required functions.<br>
**Decisions:** route groups, hierarchy, primary/secondary navigation, and
shared shells.<br>
**Outputs:** a navigable sitemap and an overlap review.<br>
**Dependencies:** phase 2.<br>
**Complete when:** every proposed route has a distinct purpose and navigation
labels, parents, and destinations are consistent.

### 4. Page inventory

**Objective:** enumerate pages and define their responsibilities.<br>
**Inputs:** sitemap, audiences, functional requirements.<br>
**Decisions:** page title, primary action, secondary actions, auth needs,
layout, SEO needs, required content, functionality, and data.<br>
**Outputs:** one [sitemap page record](./templates/sitemap.md) and one
[page specification](./templates/page-specification.md) per route; shared
patterns may be referenced, but every page's differences must be recorded.<br>
**Dependencies:** phase 3.<br>
**Complete when:** no route is an unexplained duplicate and each page has a
purpose, audience, action, and owner for its required inputs.

### 5. Content inventory

**Objective:** identify what content exists, who owns it, and how it can be
used truthfully.<br>
**Inputs:** page inventory, user-provided material, approved external sources.<br>
**Decisions:** content type, source, owner, verification status, localization,
update frequency, and whether it is public or sensitive.<br>
**Outputs:** completed [content inventory](./templates/content-inventory.md)
with missing facts and assets called out.<br>
**Dependencies:** phases 2–4.<br>
**Complete when:** every factual claim and required asset has a source or is
explicitly marked unknown; no invented copy is treated as approved content.

### 6. Component discovery

**Objective:** select suitable existing presentation components without
forcing library usage.<br>
**Inputs:** page specifications, section requirements, content and interaction
needs.<br>
**Decisions:** Piece, Piece variant, UI primitives, existing app component, or
semantic React; note API maturity only when explicitly verified.<br>
**Outputs:** component selections and rationale in the page specifications,
including registry, documentation, and public-export references.<br>
**Dependencies:** phases 4–5.<br>
**Complete when:** each selection is checked against the
[component registry](../registry/README.md), documentation, and actual public
API; unmatched sections have a simple fallback plan.

### 7. Data architecture

**Objective:** assign each information type to an appropriate source and
ownership boundary.<br>
**Inputs:** content inventory, functionality, auth and integration requirements.<br>
**Decisions:** static, configurable, dynamic, user-generated, external, or
sensitive classification; persistence and validation needs.<br>
**Outputs:** data ownership decisions and a [data model](./templates/data-model.md)
when entities or durable state are required.<br>
**Dependencies:** phases 2, 5, and 6.<br>
**Complete when:** every persistent entity has a functional reason, owner,
source, validation, access rule, and lifecycle; otherwise it stays out of a
database.

### 8. Design system

**Objective:** define a consistent visual language and responsive rules.<br>
**Inputs:** brand references, audiences, page inventory, available assets,
accessibility requirements.<br>
**Decisions:** color, type, fonts, spacing, containers, surfaces, imagery,
motion, responsive behavior, and light/dark needs.<br>
**Outputs:** a [design-system plan](./templates/design-system.md) grounded in
Puzzle Theme tokens.<br>
**Dependencies:** phases 2–5; may progress in parallel with phases 6–7.<br>
**Complete when:** tokens and layout rules cover all page types and allow
section variation without inconsistent one-off styling.

### 9. Application architecture

**Objective:** place routing, rendering, data access, auth, and integrations
inside verified framework boundaries.<br>
**Inputs:** project configuration, sitemap, data model, design system, package
selection.<br>
**Decisions:** route/layout structure, server/client boundary, service and
validation ownership, environment variables, SEO integration, and deployment.<br>
**Outputs:** architecture notes, route map, integration boundaries, and any
required setup tasks.<br>
**Dependencies:** phases 1, 3, 6–8.<br>
**Complete when:** every framework-specific API is verified in the selected
guide or source, and server-only behavior has no client import path.

### 10. Implementation planning

**Objective:** turn the approved design into a sequenced, testable work plan.<br>
**Inputs:** phases 1–9 and repository instructions for affected packages/apps.<br>
**Decisions:** task boundaries, prerequisites, acceptance criteria, risk,
validation commands, and implementation order.<br>
**Outputs:** completed [implementation plan](./templates/implementation-plan.md)
with dependencies and checks.<br>
**Dependencies:** phases 1–9.<br>
**Complete when:** shared foundations precede dependent pages, every requested
behavior is assigned, and each task has a verifiable outcome.

## Implementation

### 11. Page implementation

**Objective:** build the planned application foundations, layouts, and pages.<br>
**Inputs:** approved plan, existing app/package patterns, selected component
APIs and content.<br>
**Decisions:** resolve only implementation-level details that do not alter
approved business requirements; record necessary deviations.<br>
**Outputs:** implemented routes, shared layouts, page composition, states, and
accessible interactions.<br>
**Dependencies:** phase 10 and its task prerequisites.<br>
**Complete when:** each page matches its specification, uses verified props,
and has no fabricated facts or unresolved security-sensitive assumptions.

### 12. Data integration

**Objective:** connect approved sources and persistence to application-owned
services.<br>
**Inputs:** data model, configured framework/runtime, selected adapter or API,
environment and access rules.<br>
**Decisions:** server access path, validation, authorization, error/loading
behavior, caching, and seed/setup strategy.<br>
**Outputs:** real integrations, safe environment documentation, and
deterministic test data.<br>
**Dependencies:** phases 7, 9, and 10; page contracts from phase 11.<br>
**Complete when:** only verified data is used, access is authorized server-side,
and setup/test flows work without real user data or committed secrets.

## Quality assurance and delivery

### 13. Testing

**Objective:** prove planned behavior at the narrowest useful test levels.<br>
**Inputs:** acceptance criteria, implementation, route and data boundaries.<br>
**Decisions:** unit, component, integration, browser, and visual checks by risk.<br>
**Outputs:** test results and reproducible validation commands.<br>
**Dependencies:** phases 11–12.<br>
**Complete when:** critical routes, forms, permissions, errors, empty/loading
states, keyboard use, and data boundaries pass their relevant checks.

### 14. Visual quality assurance

**Objective:** verify real pages at representative viewport sizes.<br>
**Inputs:** running application, approved design-system and page plans,
representative content/assets.<br>
**Decisions:** which viewports and page states provide adequate coverage; fix
layout defects before cosmetic details.<br>
**Outputs:** screenshots or inspection notes, issue list, and fixes.<br>
**Dependencies:** phases 11 and 13.<br>
**Complete when:** hierarchy, spacing, text wrapping, media, contrast, focus,
and responsive transitions match the plan without overflow or repetitive
section treatment.

### 15. Delivery

**Objective:** hand off a verified application and disclose remaining risks.<br>
**Inputs:** test/visual results, deployment configuration, known limitations.<br>
**Decisions:** release readiness, required follow-up, and any unverified
framework or service behavior.<br>
**Outputs:** [quality report](./templates/quality-report.md), setup/build
instructions, known gaps, and delivery summary.<br>
**Dependencies:** phases 13–14.<br>
**Complete when:** the documented commands and environment requirements are
accurate, all material unknowns are resolved or disclosed, and no placeholder
or AI suggestion is mistaken for factual content.

## Related decision guides

- [Planning validation](./planning-validation.md)
- [Content modeling](./content-modeling.md)
- [Database planning](./database-planning.md)
- [Design-system planning](./design-system.md)
- [Page composition](./page-composition.md)
