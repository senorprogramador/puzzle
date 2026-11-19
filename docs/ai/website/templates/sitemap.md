# Sitemap and page inventory

> Duplicate this file per project. Use unknown markers instead of inventing
> page content. Resolve duplicate or overlapping routes before implementation.

## Site structure

- **Primary navigation:** [Labels and destinations]
- **Secondary/footer navigation:** [Labels and destinations]
- **Shared layouts:** [Shells and page groups]
- **Route conventions:** [Locale prefix, protected route groups, trailing slash, etc.]
- **Source brief:** [Link to project brief]

```text
/                         [Page]
├── /section              [Page]
└── /section/detail       [Page]
```

## Page records

Create one record for every route.

### [Page title] — `[route]`

- **Purpose:** [Distinct user need this page serves]
- **Target audience:** [Audience or unknown]
- **Primary action:** [One main action or none]
- **Secondary actions:** [Actions or none]
- **Required content:** [Content inventory IDs; mark missing facts/assets unknown]
- **Required functionality:** [Observable behaviors and acceptance IDs]
- **Authentication:** [Public / required role or permission / unknown]
- **SEO requirements:** [Indexing, title/description source, canonical, structured data if verified]
- **Shared layout:** [Layout name or page-specific]
- **Required data:** [Static/config/dynamic/external entity or none]

## Overlap and route review

| Routes/pages that may overlap | Shared intent/content | Distinct user need | Decision | Rationale |
| --- | --- | --- | --- | --- |
| [Page A and Page B] | [Overlap] | [Difference or none] | [Keep separate / merge / redirect / investigate] | [Reason] |

## Navigation consistency checks

- [ ] Every required page is represented exactly once or has an explicit alias/redirect.
- [ ] Every navigation label has a valid destination.
- [ ] Parent/child route relationships match the information architecture.
- [ ] Protected routes and public routes are visibly distinguished in the plan.
- [ ] Mobile navigation includes the same required destinations and accessible names.
- [ ] Active, unavailable, and not-found route behavior is planned.
