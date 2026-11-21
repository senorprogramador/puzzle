# `@puzzle-ui/media`

Use Media for provider-neutral asset/folder/variant metadata, object-storage
ports, image/video processing contracts, metadata services, and optional
browser utilities. It is not a React component library, HTTP API, database
adapter, or storage provider.

`@puzzle-ui/media` is not published to npm yet. Do not instruct users to install
it from npm or Bun's registry before a release. For local use in this monorepo,
add `"@puzzle-ui/media": "workspace:*"` to the consuming package's dependencies,
run `bun install` from the repository root, and build it with
`bun run --filter @puzzle-ui/media build` before consuming its `dist` exports.

```ts
import {
  createMediaAssetService,
  createMediaFolderService,
} from "@puzzle-ui/media";
import { cropImage, resizeImage, createVideoPoster } from "@puzzle-ui/media/browser";
```

The root entry uses the public `@puzzle-ui/storage` `StorageAdapter` only for
metadata. Binary files belong to a separate `MediaObjectStorageAdapter`.
Services require tenant scope, conditional writes for mutations, cursor
pagination for lists, and unique constraints for folder/usage guarantees. Applications
must authorize every operation on their server; IDs and browser state do not
grant access.

`createMediaAuditService` persists sanitized events and requires a host policy
for tenant-scoped `audit:read` and `audit:write`. Use a trusted service actor
for writes; never record signed targets, credentials, or request bodies. Its
ID-ordered cursor scans are not chronological and audit writes are not atomic
with media mutations. Fullstack's optional `onAudit` can feed it; direct
domain and worker operations require separate host auditing.

Checksums are fingerprints, not unique IDs: duplicate content remains distinct
assets, including within a tenant. `MediaAsset.focalPoint` is a separate
nullable normalized `{ x, y }` point; omit it in updates to preserve the value
and pass `null` to clear it.
Point hotspots omit both dimensions or use two zero dimensions; area hotspots
use positive dimensions. Supply zero dimensions when projecting a point
without dimensions into a Pieces media component.

`MediaAssetService` sees only its own `MediaAssetUsage` rows, not CMS
`CmsMediaUsage`. For apps combining Media and CMS, use Fullstack's host-provided
`assertCanDeleteAsset` guard (or an equivalent server-side guard) to check CMS
and other host references before permanent deletion. Coordinate reference
changes and deletion across domains/processes; the separate collections do not
provide a shared transaction. `assets.get` hides soft-deleted assets by default;
only trusted, authorized server-side workflows should use
`{ includeDeleted: true }` to retrieve them within the tenant.

Browser helpers defer browser API access until invoked, so importing the
subpath during SSR is safe. Call them only in a browser and pass an
`AbortSignal` for cancellable work. Use `cropImage` to export normalized
`ImageCropper` values relative to the original, oriented image; it optionally
limits output dimensions without upscaling. Image variants are re-encoded to strip
metadata; retaining an original is explicit and may retain EXIF/GPS data.
The ESM build uses a module worker for image preparation when supported,
falling back to the current thread when worker startup or decoding is
unavailable; CommonJS always uses the current thread. Configure CSP and
bundler handling for the emitted worker; abort terminates it.
Video helpers read local metadata and create a poster only. They do not
transcode video.

For in-memory test adapters in Node.js, import
`@puzzle-ui/media/testing/adapters`. The `@puzzle-ui/media/testing` entry also
exports conformance runners and requires Bun's test runtime.

See the package [README](../README.md) for adapter lifecycles and API details.
