# Changelog

## 0.21.0 - 2026-11-25

- No changes; version bumped in lockstep.

## 0.20.0 - 2026-11-25

- No changes; version bumped in lockstep.

## 0.19.1 - 2026-11-24

- No changes; version bumped in lockstep.

## 0.19.0 - 2026-11-24

- Breaking: rewrote the package as a code-first CMS. Define schemas statically with `defineCMS`, `collection`, `collection.singleton` and the `fields` factories, replacing runtime content-type registration.
- Added a request-scoped `createCms` instance that binds trusted tenant and actor context, with typed collection services for `find`, `findById`, `findBySlug`, `create`, `update`, `delete` and `purge`.
- Added a typed field catalog covering text, number, boolean, date, slug, select, media, relationship, rich text, JSON, array, object, blocks, computed and custom fields, plus `toCmsFieldDefinition` for serializable field definitions.
- Added opt-in drafts, timestamps, localization with explicit locale fallbacks, publishing, scheduling, archiving and revision restore, plus per-collection access policies and server-side `beforeChange`/`afterChange` hooks.
- Added `toCmsPresentation` to derive a serializable, callback-free collection schema for authoring UIs.
- Added schema-checked query paths, schema migrations, named custom validators, media-reference validation, relationship purge guards, and opt-in change events exposed through `cms.events`.
- Hardened webhook handling: validated endpoint and event ID inputs, and made subscription, delivery and change-event lookups tenant-scoped at query time.
- Added ADR-001 and rewrote the README and AI instructions for the code-first API; the new API is not yet published to npm.

## 0.18.0 - 2026-11-23

- No changes; version bumped in lockstep.

## 0.17.0 - 2026-11-22

- No changes; version bumped in lockstep.

## 0.16.0 - 2026-11-21

- No changes; version bumped in lockstep.

## 0.15.0 - 2026-11-21

- Added workspace-only CMS schemas, content lifecycle, revisions, policies, scheduling, media references, and audit APIs.
- Added an opt-in transactional change-event outbox with webhook subscriptions, signed delivery, retry/history, and replay-verification primitives; hosts provide secret storage, a safe transport, and worker scheduling.
- Fixed non-finite JSON draft handling.
