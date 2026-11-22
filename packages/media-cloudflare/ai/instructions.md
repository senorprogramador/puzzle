# Cloudflare Media Guidance

Use `@puzzle-ui/media-cloudflare` only in server or Cloudflare Worker code.
Construct `CloudflareR2MediaObjectStorageAdapter` with a tenant-scoped
`CloudflareMediaMetadataStore`, an R2 bucket target, and a
`CloudflareMediaUrlSigner`. R2 Worker bindings do not issue presigned URLs;
use `CloudflareR2S3UrlSigner` for Worker-compatible AWS Signature Version 4
presigning or inject an authenticated application upload gateway.

The adapter verifies the actual object size and SHA-256 checksum during
completion, keeps provider upload IDs in the metadata store, supports
multipart abort/complete, and issues read targets only for recorded objects.
Use a durable metadata store in production. `InMemoryCloudflareMediaMetadataStore`
and the adapter's `putForTesting`/`putPartForTesting` helpers are for tests and
local development.

`CloudflareR2BucketProvisioner` accepts a narrow injected Admin API because
Cloudflare account API transports and credentials are application-specific.
`CloudflareImagesProcessor` similarly accepts the Images binding, source
resolver, and variant writer without assuming a framework or storage driver.
