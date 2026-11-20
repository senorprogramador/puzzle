# Database planning

Decide whether persistence is functionally necessary before selecting an
adapter. Start with the repository's [data architecture guide](../reference/data-architecture.md)
and the framework-neutral [`@puzzle-ui/storage` contract](../../../packages/storage/AGENTS.md).
Do not invent adapter methods, capabilities, or migrations.

## Persistence decision

A database may be justified by durable user-owned records, cross-device state,
shared concurrent updates, server-side queries, or atomic multi-record
behavior. Static pages, build-time data, environment configuration, and values
derivable from trusted inputs do not need a database by default. If persistence
is not required, record **No database** and the reason in the project plan.

## Verified Puzzle choices

The Create CLI offers these Auth storage choices only when Auth is enabled for
a full-stack framework. Basic React does not receive a generated database
integration. These options are not a general database provisioning feature.

| Choice | Verified Puzzle integration | Planning constraints |
| --- | --- | --- |
| MongoDB | `@puzzle-ui/storage-mongodb` implements the shared Storage contract | Multi-document transactions and atomic batches are opt-in, require a client and a replica-set or sharded deployment; TTL deletion is asynchronous, so enforce security-sensitive expiry in application logic |
| Cloudflare D1 | `@puzzle-ui/storage-d1` implements the shared contract with query, conditional-write, pagination, unique-index, atomic-batch, and versioned migration support | No native TTL indexes; migrations are adapter-managed and explicit, not Wrangler SQL migrations, and must not run on every request |
| Custom | Create installs `@puzzle-ui/storage` and leaves an adapter integration for the project to supply | This is not a built-in engine; verify the chosen adapter's contract, runtime compatibility, setup, capabilities, and tests before planning against it |

Only the selected framework and deployment determine whether an adapter can
run. Create currently scaffolds Next.js, TanStack Start, and React Router as
full-stack choices, plus Basic React (Vite); check the
[framework compatibility matrix](../frameworks/compatibility.md) and
[Create documentation](../../../packages/create/README.md). Do not assume
every framework/database pair has identical SSR, auth, or production behavior.

The storage contract and adapters may change. For implementation-level
capabilities, use their current package guides and capability reports:
[Storage](../../../packages/storage/README.md),
[D1](../../../packages/storage-d1/README.md), and
[MongoDB](../../../packages/storage-mongodb/README.md).

## Required planning steps

When a database is justified, complete the
[data-model template](./templates/data-model.md) and record:

1. **Entities:** fields, identifiers, relationships, lifecycle, and expected queries.
2. **Ownership:** who owns each record and can read, create, update, or delete it.
3. **Validation:** schema and business validation at trusted request/service boundaries.
4. **Access rules:** authentication, authorization, tenant isolation, and sensitive fields.
5. **Adapter:** select the adapter configured for the project and verify its actual capability report and deployment fit.
6. **Seed data:** deterministic, fictional fixtures only; document the exact collections/tables and values.
7. **Initialization:** setup/migration order, environment requirements, safe repeat behavior, and recovery.
8. **Test data:** isolated test records and cleanup/reset boundaries; never use real user data.
9. **Server access:** keep drivers, credentials, and database calls in server-only modules or services.
10. **Failure behavior:** define unavailable, stale, unauthorized, invalid, empty, and partial-result states.

## Boundaries and safeguards

- Reuse Puzzle's Storage contract when it covers the requirement; do not add a
  second abstraction over it without a demonstrated contract gap.
- Keep database logic out of Pieces, generic UI, and client components.
- Do not trust caller-supplied user or tenant IDs for authorization.
- Keep secrets out of client bundles, logs, fixtures, and generated public
  configuration. Document variable names and safe placeholders only.
- Do not assume transactions, uniqueness, TTL, batch atomicity, or migration
  guarantees from an adapter's name; verify the selected adapter.
- Make development/test resets narrow, explicit, and impossible to confuse
  with production or remote data.
