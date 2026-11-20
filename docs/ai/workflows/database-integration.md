# Database integration workflow

1. Classify the data and persistence need using the
   [data architecture guide](../reference/data-architecture.md). Define
   ownership, lifecycle, validation, authorization, and retention before
   selecting a database.
2. Read the local instructions for the domain package, storage contract, and
   selected adapter. Use the actual
   [`@puzzle-ui/storage` contract](../../../packages/storage/AGENTS.md) and
   adapter capabilities; never invent methods or guarantees.
3. Keep domain models and shared validation separate from framework handlers
   and presentation. Put database drivers, secrets, and service credentials in
   server-only modules; inject verified identity rather than trusting a
   caller-supplied user or tenant ID.
4. Add schema/index/migration behavior through the adapter's supported
   mechanisms. Check migration ordering, rollback or recovery behavior,
   constraints, atomicity, and serialization against the real adapter.
5. Use deterministic development/test seed data. Make reset scope narrow and
   explicitly reject production or remote targets. Never commit secrets or
   real personal data.
6. Test domain validation, adapter conformance, authorization and data
   isolation, then the affected framework integration. Document environment
   variables and setup without publishing secret values.

The [Workspace architecture](../../../docs/workspace/architecture.md) shows
domain/storage separation; [Workspace app guidance](../../../docs/workspace/apps.md)
documents the current demo database setup. Follow the package guides for
adapter-specific procedures.
