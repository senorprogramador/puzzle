# `@puzzle-ui/media-cloudflare` — Agent Instructions

This package contains server/Worker integrations for the provider-neutral
`@puzzle-ui/media` contracts. It must remain framework-neutral and must not
import React, UI, Pieces, Wrangler, or a particular S3 SDK.

## Boundaries

- Keep all R2 keys, multipart upload IDs, credentials, and signed target
  headers on the server. Targets are short-lived bearer capabilities.
- Require tenant scope for metadata and object operations. The adapter uses
  tenant-prefixed keys and a metadata store; host applications still own
  request authorization.
- `CloudflareMediaMetadataStore` is deliberately injectable. The in-memory
  implementation is for tests/local development only; production must use a
  durable, tenant-scoped store.
- Cloudflare Worker R2 bindings do not create presigned URLs. Inject
  `CloudflareMediaUrlSigner`, or a dynamic
  `CloudflareMediaS3CompatibleResolver`, and document the application's
  signing endpoint.
- Cloudflare's Admin API and Images binding are structural interfaces because
  their runtime/API versions vary. Do not add a Cloudflare SDK just to widen
  those abstractions.

## Validation

Run `bun run build`, `bun run typecheck`, and `bun run test` in this package.
Tests should cover the shared `MediaObjectStorageAdapter` behavior, tenant
isolation, validation, idempotent completion/cleanup, and Images binding
injection. Avoid changing `packages/ui`, `packages/pieces`, or the shared
component registry.
