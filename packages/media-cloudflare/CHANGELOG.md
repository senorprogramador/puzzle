# Changelog

## 0.17.0 - 2026-11-22

- Added Cloudflare R2 object-storage adapters with single and multipart uploads, size/SHA-256 verification, idempotent completion, abort and delete cleanup, cursor listing, tenant-prefixed keys, and short-lived read/part targets backed by a metadata store.
- Added Worker-compatible S3 presigning for R2 through `CloudflareR2S3UrlSigner`, per-tenant bucket and signer resolvers, an in-memory metadata store for tests and local development, and a bucket provisioner (`CloudflareR2BucketProvisioner`) built on a narrow `getBucket`/`createBucket` interface.
- Added `CloudflareImagesProcessor`, which implements the Puzzle `MediaProcessor` contract on top of the Cloudflare Images binding.
