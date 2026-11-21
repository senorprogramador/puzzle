# `@puzzle-ui/media`

Provider-neutral media contracts and services for Puzzle. The package separates
binary object storage from `@puzzle-ui/storage` record persistence and includes
opt-in browser helpers for image preparation and video preflight. It does not
include a production storage provider, queue, image codec, transcoder, HTTP API,
or UI component.

## Availability and local workspace use

`@puzzle-ui/media` is not published to npm yet. `npm install @puzzle-ui/media`
and `bun add @puzzle-ui/media` will not work until a release is published; no
version is available to install from the registry.

To try it in this repository, add it as a workspace dependency to the consuming
app or package:

```json
{
  "dependencies": {
    "@puzzle-ui/media": "workspace:*"
  }
}
```

The root Bun workspace includes `packages/*`. From the repository root, run
`bun install`, then build the package before importing its `dist` exports:

```sh
bun run --filter @puzzle-ui/media build
```

## Entry points

- `@puzzle-ui/media`: media records, validation, object/processing contracts,
  asset/folder services, and lifecycle/cleanup helpers.
- `@puzzle-ui/media/browser`: browser-only image crop/resize/variants and local
  video metadata/poster utilities. Import is SSR-safe; call only in a browser.
- `@puzzle-ui/media/testing`: in-memory adapters and reusable Bun conformance
  runners.
- `@puzzle-ui/media/testing/adapters`: in-memory adapters without the Bun test
  runner dependency, for Node.js and other test environments. The adapters are
  test tools, not production storage/queue providers.

## Metadata and binary storage

Use the declared `StorageAdapter` public API for records and a separate
`MediaObjectStorageAdapter` for file bytes. A storage provider must report
`conditionalWrites` for asset/folder mutations, `cursorPagination` for lists,
and `uniqueConstraints` for folder names and idempotent usage registration.
Services fail explicitly when a required capability is unavailable.

```ts
import {
  createMediaAssetService,
  createMediaFolderService,
} from "@puzzle-ui/media";

const folders = createMediaFolderService({ storage });
const assets = createMediaAssetService({ storage, objectStorage });
await Promise.all([folders.ready, assets.ready]);

const folder = await folders.create({
  tenantId: "tenant-123",
  name: "Campaign",
  actorId: "user-456",
});

// Create assets only after the server has completed and validated the upload.
const asset = await assets.create({
  tenantId: "tenant-123",
  folderId: folder.id,
  originalName: "hero.png",
  metadata: {
    kind: "image",
    mimeType: "image/png",
    size: verifiedObject.size,
    width: 1600,
    height: 900,
    checksum: verifiedObject.checksum,
  },
  object: verifiedObject.object,
  altText: "A mountain landscape",
});
```

The asset service checks that the completed object exists in the same tenant
and that its stored MIME type and byte count match the supplied metadata. The
host server must still verify file signatures, policy, quota, tenant access,
and permissions; a client-supplied MIME type or checksum is not proof of file
contents. Object keys are internal references, not asset IDs or public URLs.
The Fullstack Media server exposes an optional `verifyUploadedContent` hook for
host byte inspection before asset creation; it does not inspect signatures when
that hook is absent. Hosts using the domain service directly must arrange their
own inspection.

Asset lists support tenant, folder, kind, status, sort, tags-any/tags-all, and
SHA-256 checksum filters. Tag/checksum filtering scans cursor pages in bounded
batches; continue with the returned cursor when a batch is exhausted.

Equal checksums do not trigger deduplication. Distinct asset IDs may refer to
identical bytes in the same or different tenants; checksum is a content
fingerprint, not a unique identifier or a cross-tenant lookup key.

`MediaAsset` stores `crop`, `focalPoint`, and `hotspots` separately. Focal points
use a normalized `{ x, y }` pair compatible with the UI's
`NormalizedImagePoint`; omit `focalPoint` in an update to preserve it and pass
`null` to clear it.
Point hotspots omit both dimensions or use `width: 0, height: 0`; area hotspots
use positive dimensions within the image bounds. When projecting a point with
omitted dimensions to Pieces, supply zeros for its width and height.

Asset updates, folder moves/renames/deletes, and restores require an
`expectedRevision`. Folder deletion is restricted to empty folders. Asset
deletion is soft by default and blocked while Media-owned usages are registered.
`assets.get(tenantId, assetId)` hides soft-deleted assets; trusted server-side
administrative workflows can pass `{ includeDeleted: true }` to retrieve them
within the same tenant for restore or permanent-deletion checks.
`MediaAssetService.permanentlyDelete` only checks its own `MediaAssetUsage`
records; it cannot see CMS-owned `CmsMediaUsage` records. Apps combining Media
and CMS must also guard permanent deletion against CMS and any other
host-owned references. When using Fullstack, provide `assertCanDeleteAsset` to
`createMediaServer`; that guard runs before object deletion and should query
CMS usage data for the asset's tenant. Direct service integrations must perform
an equivalent host-side guard.

Permanent deletion requires an already soft-deleted asset with no Media-owned
usages. It conditionally removes metadata first, then attempts to delete
original and variant objects. Its result reports any object-deletion failures
so cleanup can retry those orphans. Serialize or transactionally coordinate
reference registration/removal and deletion across domains and server
processes; separate Media and CMS usage collections do not close that race.

## Object-storage adapter contract

Implement `MediaObjectStorageAdapter` on the server. It covers single and
multipart upload intents, per-part targets, completion, abort, object metadata,
short-lived read targets, deletion, object listing, and expired-upload listing.
Completion should be idempotent and verify the actual uploaded size and any
requested checksum. Provider keys and multipart IDs must remain server-side.

Upload/read targets and their headers are short-lived bearer credentials:
return them only to the intended caller, never persist or log them, and enforce
expiration, allowed size/type, tenant ownership, and authorization in the host
server. The contract does not itself issue HTTP requests or validate file
signatures.

```ts
import type { MediaObjectStorageAdapter } from "@puzzle-ui/media";

const objectStorage: MediaObjectStorageAdapter = createConfiguredObjectStore();
```

## Asset and folder services

`createMediaAssetService` provides tenant-scoped create/get/list/update,
revision-checked soft-delete/restore/permanent-delete, usage registration, and
cleanup helpers. `createMediaFolderService` provides tenant-scoped create/list,
rename/move, cycle checks, and restricted soft-delete/restore. Both register
their collections through `StorageAdapter.registerCollection`.

Soft-deleted folder names remain reserved by the portable sibling-name unique
constraint until `folders.permanentlyDelete(...)` removes the empty folder.

`cleanupExpiredMediaUploads` aborts expired upload sessions. The
`cleanupOrphanedMediaObjects` helper deletes only objects older than the
provided cutoff that are not referenced by any stored asset or variant; use a
conservative cutoff to avoid racing active uploads or processing jobs. Run
cleanup with server-only credentials and suitable operational monitoring.

## Audit storage

`createMediaAuditService` stores sanitized audit events using the metadata
adapter and requires an explicit policy for `audit:write` and `audit:read`.
Use a trusted service actor for writes and resolve the tenant and reader on the
server for queries. Records contain actor, tenant, resource, action, result,
and timestamp—not request bodies, signed targets, headers, or object keys.
The host controls retention and authorization, including whether a reader may
access a tenant. The list supports resource/result filters and cursor paging,
ordered by ID rather than time; scan all pages and restart scans to find
later inserts that sort before an earlier cursor.

The Fullstack Media server's optional `onAudit` callback can write to this
service. It is not atomic with the media mutation; failed writes are reported
but the mutation may already have committed. Direct domain/worker operations
also require explicit audit calls. Use a host-owned transactional integration
when atomic mutation and audit persistence are required.

## Processing contracts and service

`MediaProcessor` and `VideoTranscoder` are injected provider/worker interfaces.
`MediaProcessingQueueAdapter` defines idempotent enqueue, leased claims,
worker-owned lease renewal, progress, retryable failure, dead-letter,
completion, and cancellation semantics. `createMediaProcessingService` updates the asset lifecycle and
checks each processor-produced object against object storage before marking a
variant ready. It rejects missing processors and missing/mismatched output
objects; it does not pretend a no-op succeeded.

Profiles are caller-configured. Processors receive the job ID and idempotency
key so their writes can be made idempotent. The host should use a durable queue
with atomic claims and leases in production; the in-memory queue is for tests
only. Retriable failures use capped exponential backoff; permanent/exhausted
failures stay visible on the job and asset.

## Browser utilities

```ts
import {
  cropImage,
  createImageVariants,
  readVideoMetadata,
  createVideoPoster,
  resizeImage,
} from "@puzzle-ui/media/browser";

const cropped = await cropImage(file, {
  crop: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
  maxWidth: 1200,
  format: "image/webp",
  signal: abortController.signal,
});

const resized = await resizeImage(file, {
  maxWidth: 1600,
  maxHeight: 1200,
  format: "image/webp",
  fallbackFormat: "image/png",
  quality: 0.84,
  signal: abortController.signal,
});

const variants = await createImageVariants(file, {
  retainOriginal: true,
  profiles: [
    { name: "mobile", maxWidth: 480 },
    { name: "desktop", maxWidth: 1600, format: "image/webp" },
  ],
});

const video = await readVideoMetadata(videoFile, {
  maxSizeBytes: 500_000_000,
  maxDurationSeconds: 900,
});
const poster = await createVideoPoster(videoFile, {
  maxWidth: 640,
  maxHeight: 360,
  signal: abortController.signal,
});
```

Image dimensions are reduced without upscaling and aspect ratio is preserved.
`cropImage` accepts normalized coordinates relative to the original, oriented
image, including values returned by `ImageCropper`. Its optional `maxWidth` and
`maxHeight` constrain the cropped output; without them it uses the cropped
source dimensions. Fractional dimensions are rounded down and crops covering
less than one source pixel in either dimension are rejected. Like `resizeImage`,
it returns an encoded Blob, original and output dimensions, actual format,
fallback status, and a suggested filename. It does not modify the source.
Re-encoding uses browser canvas decoding (including browser EXIF orientation
handling where supported), removes original metadata, and preserves alpha when
the selected/fallback format does. Browser codecs differ; the actual output
format and `usedFallbackFormat` are returned. The original is returned only
when `retainOriginal` is explicitly true and may contain EXIF/GPS data.

When using the ESM build and module workers, `OffscreenCanvas`, and
`createImageBitmap` are available, image preparation runs in a dedicated
worker. The CommonJS build processes images on the current thread. Aborting
terminates an active worker.
If the worker cannot start or the image cannot be decoded in it, processing
falls back to the current thread using `OffscreenCanvas` or an HTML canvas.
Worker startup failures are reported through the console; failures after
startup are surfaced as errors. Configure the application's `worker-src`
Content Security Policy and bundler to allow the emitted same-origin worker
asset and its imports. Verify this in the deployed application; a blocked or
unavailable worker means image preparation may run on the UI thread.
Video helpers read metadata and extract a local poster frame only; they do not transcode.
Browser decoding, codec support, and poster frame extraction depend on the
user's browser and the input file.

All browser APIs are accessed when a helper is called, not at module import, so
the subpath can be imported in SSR code without touching `window` or `document`.

## Testing adapters

The testing export contains:

- `InMemoryMediaObjectStorageAdapter`
- `InMemoryMediaProcessingQueueAdapter`
- `runMediaObjectStorageConformance`
- `runMediaProcessingQueueConformance`

Conformance fixtures supply isolated adapters and the upload operation needed
to exercise direct-upload targets. `bun run test:browser` builds the package and
uses the repository's existing Playwright tooling to exercise the browser
subpath in Chromium. It verifies image output bounds, original retention, video
metadata/poster extraction from a finite-duration WebM fixture, and object-URL
cleanup on unsupported input, corrupt media, and abort. Browser tests require
Playwright Chromium to be installed.
Run the package checks:

```sh
bun run build
bun run typecheck
bun run test
bun run test:browser
```
