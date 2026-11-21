# `@puzzle-ui/media` — Agent Instructions

## Responsibility and boundaries

Media owns provider-neutral media metadata, object-storage and processing
contracts, metadata services, adapter conformance helpers, and opt-in browser
utilities. It does not own UI components, HTTP routes, database drivers,
object-storage providers, credentials, or mandatory image/video processors.

The root export is framework-neutral and must not access browser globals at
module scope. Browser APIs belong only under `@puzzle-ui/media/browser`.
`@puzzle-ui/storage` is used through its declared public exports for asset,
folder, and usage metadata; it is not binary object storage.

## Public exports

- `@puzzle-ui/media`: contracts, errors, validators, metadata and processing
  services.
- `@puzzle-ui/media/browser`: browser-only image preparation and video
  preflight/poster helpers. Importing the module is safe during SSR; call these
  helpers only in a browser environment.
- `@puzzle-ui/media/testing`: in-memory object/processing adapters and adapter
  conformance runners (the runners use Bun).
- `@puzzle-ui/media/testing/adapters`: in-memory adapters without the Bun-only
  conformance runners, suitable for Node-based integration tests.

Use only these package entry points. Do not expose server credentials,
permanent URLs, or provider-specific objects in browser utilities.

## Contract and service rules

- Require tenant scope for persisted assets, folders, usages, and processing
  jobs. Never treat an asset ID as authorization.
- Keep crop, focal point, and hotspots distinct. Focal points are nullable
  normalized `{ x, y }` values; omission preserves an updated value and `null`
  clears it. Checksums are fingerprints, not uniqueness constraints.
- Keep object keys internal to server-side media contracts. Upload and read
  targets are short-lived bearer credentials and must not be persisted or
  logged.
- Do not claim storage, checksum, authorization, retry, or processing
  guarantees unless an adapter actually implements them.
- Asset/folder mutations use storage conditional writes and revisions. Do not
  silently fall back to unconditional writes when an adapter lacks the needed
  capability. Paginated reads require cursor pagination; folder-name and
  idempotent usage guarantees require unique constraints.
- Keep the object-storage contract separate from `StorageAdapter`.
- A missing processor/transcoder is an explicit failure, never a successful
  no-op.
- Audit storage requires an explicit tenant/actor authorization policy and
  sanitized event metadata. Audit writes are not atomic with media mutations;
  document that boundary and never store signed targets or object keys.
- Processing workers must renew leases as the current owner. Treat duplicate
  deliveries as normal and use the job idempotency key for processor writes.

## Browser rules

- Do not touch `window`, `document`, `Image`, `URL`, canvas, or video APIs at
  module import time.
- Validate file size/type and dimensions, preserve aspect ratio, do not upscale,
  and strip metadata from re-encoded images. Retaining an original is an
  explicit caller choice because the original may contain EXIF/GPS metadata.
- Revoke object URLs and release decoded media resources on success, failure,
  and abort. Honor `AbortSignal` and report codec fallback explicitly.
- Do not implement full video transcoding in the browser as a required path.

## Tests and documentation

Run `bun run build`, `bun run typecheck`, and `bun run test` in this package.
Run `bun run test:browser` for real Chromium checks of browser APIs using the
repository's existing Playwright tooling and the checked-in finite-duration
video fixture. The command skips when Playwright Chromium is not installed.
Keep object-storage and processing adapter conformance suites reusable, and
add tests for tenant isolation, conditional writes, validation, serialization,
idempotency, retries, and cleanup when those behaviors change.

Update this package's README and `ai/instructions.md` whenever public entry
points or supported behavior changes. Do not modify other packages from work
in this directory.
