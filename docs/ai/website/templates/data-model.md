# Data model

> Use this only for data that has a justified persistence or integration need.
> If no database is needed, record that decision and rationale instead of
> creating placeholder entities.

## Persistence decision

- **Database needed:** [Yes / No]
- **Functional reason:** [Durability, shared state, query, transaction, etc.; or why static/config is enough]
- **Source of truth:** [Application / user / external service / other]
- **Selected adapter and runtime:** [Verified adapter and target / not applicable]
- **Capability evidence:** [Adapter docs and reported capabilities]

## Entities

### [Entity name]

- **Purpose and owner:** [Business meaning, creating/updating authority]
- **Source and lifecycle:** [Created, changed, archived, deleted by whom and when]
- **Classification:** [Dynamic / user-generated / external / sensitive fields]
- **Validation boundary:** [Trusted server/service boundary and rules]
- **Localization:** [Fields/locales and fallback]

| Field | Type/constraints | Required | Sensitive? | Source/default | Validation |
| --- | --- | --- | --- | --- | --- |
| [Field] | [Type, range, uniqueness if supported] | [Yes/No] | [Yes/No] | [Source or none] | [Rule] |

## Relationships and query needs

| From | Relationship | To | Cardinality/optional | Integrity/authorization rule |
| --- | --- | --- | --- | --- |
| [Entity] | [Reference] | [Entity] | [One-to-many, etc.] | [Rule] |

| Use case/query | Filters/order/pagination | Access rule | Freshness/consistency need |
| --- | --- | --- | --- |
| [Use case] | [Required operations] | [Who may access] | [Requirement] |

## Access and security

| Role/owner | Read | Create | Update | Delete | Isolation rule |
| --- | --- | --- | --- | --- | --- |
| [Role] | [Scope] | [Scope] | [Scope] | [Scope] | [Tenant/user boundary] |

- **Server-only access path:** [Service/module and framework boundary]
- **Secrets/environment variables:** [Names only; no values]
- **Retention/deletion:** [Policy or unknown]

## Adapter, initialization, and tests

- **Adapter contract:** [Actual package/API and capability report]
- **Migrations/setup:** [Order, repeat behavior, failure/recovery, deployment ownership]
- **Seed data:** [Deterministic fictional fixture set; never real user data]
- **Test data and cleanup:** [Isolated database/namespace and safe reset rule]
- **Unsupported capabilities/limitations:** [Explicitly list or mark unknown]

## Open decisions

| Question | Impact | Evidence needed | Owner/status |
| --- | --- | --- | --- |
| [Unknown — confirm with owner] | [Security / ownership / business / technical] | [Evidence] | [Owner / pending] |
