# Page specification

> Duplicate one specification per page. Reference real registry entries and
> verify component APIs before implementation. This document plans composition;
> it does not authorize invented content or unverified integrations.

## Page

- **Title / route:** [Title] — `[route]`
- **Objective:** [User need and intended outcome]
- **Audience:** [Audience or unknown]
- **Primary action:** [Action or none]
- **Sitemap record:** [Link]
- **Shared layout:** [Layout name or page-specific]
- **Authentication:** [Public / requirement / unresolved]

## Section plan

| Order | Section / purpose | Content requirements and source | Selected Piece + variant | UI components | Custom React / semantic HTML | Data dependencies |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [Purpose] | [Known content IDs / unknowns] | [Package, export, variant, or none] | [Public exports or none] | [Elements or none] | [Entity/source or none] |

For each Puzzle component selection, record:

- **Registry identity:** [Package + export; link to package/category JSON]
- **Documentation:** [Verified doc path]
- **Public entry point and source:** [Verified source path]
- **API checked:** [Props/variant confirmed against types and docs]
- **Rationale / fallback:** [Why it fits; or why semantic React/custom app code is simpler]

## Data and behavior

- **Data dependencies:** [Source, owner, loading, stale, empty, and error states]
- **Interactions:** [Trigger, result, validation, authorization, error state]
- **Client/server ownership:** [What runs where and why]
- **Forms/actions:** [Fields, validation boundary, submit behavior, success/failure]

## Responsive behavior

| Viewport/state | Layout and order | Navigation/actions | Media and wrapping | Verification |
| --- | --- | --- | --- | --- |
| Narrow | [Behavior] | [Behavior] | [Behavior] | [Check] |
| Medium | [Behavior] | [Behavior] | [Behavior] | [Check] |
| Wide | [Behavior] | [Behavior] | [Behavior] | [Check] |

## SEO and accessibility

- **SEO metadata:** [Title/description source, canonical/indexing, verified structured data or none]
- **Semantic structure:** [Landmarks, heading order, lists, forms]
- **Accessible names and relationships:** [Labels, descriptions, status announcements]
- **Keyboard/focus behavior:** [Expected sequence and visible focus]
- **Contrast, motion, and media:** [Requirements, alt text owner, reduced-motion behavior]

## Open items

| Unknown or dependency | Impact | Owner | Resolution |
| --- | --- | --- | --- |
| [Unknown — confirm with owner] | [Impact] | [Owner] | [Pending / resolved / not applicable] |
