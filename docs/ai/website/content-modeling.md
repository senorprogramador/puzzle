# Content modeling

Model content before choosing storage. Content ownership and update lifecycle
matter more than whether an item is currently represented as a string, a
configuration value, or a database record. For cross-project data guidance,
see the [data architecture guide](../reference/data-architecture.md).

## Classification

| Class | Meaning | Default treatment |
| --- | --- | --- |
| Static content | Reviewed copy or assets that change with a release | Version with the app or use an established content system; no database by default |
| Configurable content | Values that vary by environment, deployment, or operator | Typed configuration or environment settings; keep secrets server-only |
| Dynamic content | Application state that changes through a user or system workflow | Model its lifecycle and persistence need; use a database only for durable/shared/queryable behavior |
| User-generated content | Content submitted or created by users | Define owner, validation, moderation, retention, access rules, and persistence before accepting it |
| External content | Data owned and served by another system | Record source, permission, attribution, freshness/cache policy, and outage behavior |
| Sensitive data | Information whose exposure or retention creates risk | Treat as an overlay on any class; minimize collection, restrict access, and define retention/deletion |

Do not put every content item in a database. Static editorial pages, fixed
navigation, and build-time catalogs can remain static when no editing,
querying, or user-specific behavior requires persistence. Do not make a static
site depend on a database merely because an adapter is available.

## Entity decisions

For each entity or content group, complete the
[content inventory](./templates/content-inventory.md). For each persisted
entity, also complete the [data model](./templates/data-model.md).

| Attribute | Questions to answer |
| --- | --- |
| Ownership | Who creates, approves, updates, and deletes it? |
| Source | User-provided content, a verified source, application logic, or an external service? |
| Persistence | Is it versioned with the app, configured per deployment, cached, or durably stored? Why? |
| Validation | Which fields, formats, ranges, relationships, and authorization checks apply at the boundary? |
| Relationships | What references or lifecycle dependencies exist? Are they required or optional? |
| Localization | Which languages/regions apply, who translates, and how are missing translations handled? |
| Update frequency | How often does it change, and what freshness or review process is needed? |

## Truth, suggestions, and unknowns

- Preserve the source and verification state for factual content.
- Treat AI-written phrasing as a suggestion until the owner approves it.
- Use explicit markers such as `[Unknown — confirm with owner]` for missing
  facts, prices, testimonials, product details, customer identities, legal
  statements, or contact information.
- Do not turn placeholder content into structured data, JSON-LD, seed records,
  or a production default.
- For external data, do not imply that cached or unavailable values are current;
  document freshness and fallback states.

## Presentation boundary

Keep content models and business rules in the application or domain layer.
Pieces and generic UI components render consumer-provided content and actions;
they do not load content, decide access, or own persistence. Keep content
validation at the authoring, import, or server boundary rather than relying on
presentation components.
