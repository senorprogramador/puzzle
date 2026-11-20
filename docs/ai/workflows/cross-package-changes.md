# Cross-package changes

Use this workflow when a shared type, export, runtime behavior, or documented
contract affects more than one workspace.

1. Identify the owner and consumers using the
   [package map](../architecture/package-map.md) and
   [dependency map](../architecture/dependency-map.md). Confirm relationships
   against current manifests; do not infer them from directory names.
2. Read the `AGENTS.md` for every package or app whose implementation or
   public contract will change. Read additional instructions only when an
   actual dependency or boundary requires them.
3. Trace the contract from provider to consumer: public export, types,
   runtime behavior, tests, and docs. Decide the compatibility behavior before
   editing.
4. Implement in dependency order: update the owning contract first, then its
   adapters/consumers. Avoid circular dependencies and keep framework-specific
   code in its adapter.
5. Validate the provider, affected consumers, and integration boundary. Add
   tests at the lowest layer that proves the contract and at an app/browser
   layer when framework behavior changes.
6. Update architecture indexes when workspace membership, public exports,
   ownership, or dependency edges change. Report exact checks and any
   unverified consumers.

For example, storage contract work requires checking adapter conformance;
framework integration work requires checking the framework-specific package
and app. See [package development](./package-development.md) and the
[testing workflow](./testing.md).
