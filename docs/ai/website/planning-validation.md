# Planning validation

Complete this checklist before implementation. An item can be marked
**Not applicable** only with a short reason; do not treat an unknown as a
confirmed decision.

## Requirements and truth

- [ ] Project purpose, audiences, and conversion goals come from the user or a
      verified source.
- [ ] User facts, sourced facts, AI suggestions, and unknowns are labeled
      separately.
- [ ] Required functionality and constraints have observable acceptance
      criteria.
- [ ] Missing information that affects business requirements, truth, security,
      ownership, or architecture is listed for clarification.
- [ ] No fabricated company facts, prices, testimonials, customer identities,
      legal claims, product specifications, or contact details appear as
      approved content.

## Structure and content

- [ ] Every known page is in the sitemap, with a distinct purpose and route.
- [ ] Duplicate or overlapping pages are resolved or explicitly justified.
- [ ] Navigation labels, hierarchy, and destinations are consistent.
- [ ] Each page has an audience, primary action, required content,
      functionality, auth, SEO, and data requirements.
- [ ] Required copy, media, and integrations have a source, owner, or explicit
      unknown marker.
- [ ] Localization and content update responsibilities are recorded where
      relevant.

## Components and visual system

- [ ] Piece/UI choices link to a registry entry and documentation; public APIs
      and props are verified before implementation.
- [ ] A simpler semantic React composition is used where a Piece or UI
      composition would be oversized.
- [ ] The design direction covers typography, fonts, color, spacing, layout,
      media, responsive behavior, motion, and required color schemes.
- [ ] Puzzle Theme is the token source; no independent application token
      system is planned.
- [ ] Adjacent sections have intentional variation while sharing the same
      design system.
- [ ] Accessibility expectations and interaction states are assigned.

## Data, architecture, and sequence

- [ ] Every database requirement has a functional justification; static or
      configurable content is not persisted by default.
- [ ] Persistent data has an owner, source, validation, relationship,
      authorization, lifecycle, localization, and update frequency.
- [ ] Framework, SSR, auth, SEO, storage, and deployment decisions are verified
      against the selected framework guide and current generated/API behavior.
- [ ] Server-only modules, secrets, and database access stay outside client
      bundles and presentation components.
- [ ] Every functional requirement is assigned to a page, integration, or
      implementation task.
- [ ] Shared foundations precede tasks that depend on them; dependencies and
      task completion criteria are explicit.
- [ ] Testing and visual QA have representative routes, states, viewports, and
      validation commands.

## Clarification rule

Do not ask for approval on every technical detail. Choose the simplest
repository-consistent option for reversible implementation choices and record
it. Ask the user only when the answer materially changes business requirements,
factual content, security, data ownership, or the resulting application.
