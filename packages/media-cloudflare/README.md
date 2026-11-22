# @puzzle-ui/media-cloudflare

Cloudflare integrations for the provider-neutral [`@puzzle-ui/media`](../media)
contracts.

## Installation

```sh
npm install @puzzle-ui/media @puzzle-ui/media-cloudflare
```

## R2 object storage

`CloudflareR2MediaObjectStorageAdapter` supports single and multipart upload
intents, actual size/SHA-256 verification, idempotent completion, abort and
delete cleanup, metadata, cursor listing, tenant-prefixed object keys, and
short-lived read/part targets. It requires a metadata store:

```ts
import {
  CloudflareR2MediaObjectStorageAdapter,
  InMemoryCloudflareMediaMetadataStore,
  type CloudflareMediaUrlSigner,
  type R2BucketLike,
} from "@puzzle-ui/media-cloudflare";

const adapter = new CloudflareR2MediaObjectStorageAdapter({
  tenantId: "tenant-a",
  bucket: {
    bucket: env.MEDIA_BUCKET as R2BucketLike,
    signer: env.MEDIA_SIGNER as CloudflareMediaUrlSigner,
  },
  metadataStore: new InMemoryCloudflareMediaMetadataStore(),
});
```

R2 Worker bindings expose object operations but do not generate presigned
URLs. `CloudflareR2S3UrlSigner` implements Worker-compatible AWS Signature
Version 4 presigning for an R2 S3-compatible endpoint. `CloudflareMediaUrlSigner`
is intentionally structural so applications can instead use an authenticated
upload gateway. `CloudflareMediaS3CompatibleResolver` and
`CloudflareMediaBucketResolver` can select a bucket and signer dynamically per
tenant; construct a signer per resolved bucket when using separate buckets.

Use a durable, tenant-scoped implementation of `CloudflareMediaMetadataStore`
in production. The in-memory store and `putForTesting` helpers are only for
tests/local development. The metadata store is required because R2 does not
persist the media upload-session and application-level object records required
by the media contract.

## Bucket provisioning

`CloudflareR2BucketProvisioner` accepts a narrow `getBucket`/`createBucket`
interface. The package does not assume a Cloudflare account API SDK, account
credentials, or a particular REST client:

```ts
const provisioner = new CloudflareR2BucketProvisioner({ api });
await provisioner.ensureBucket({ tenantId: "tenant-a" });
```

## Cloudflare Images

`CloudflareImagesProcessor` accepts the Images binding, an image source
resolver, and a variant writer. This keeps the binding version and object
storage policy in the host application while implementing `MediaProcessor`.
The binding and Admin API types are narrow structural interfaces because
Cloudflare's runtime APIs vary between Workers releases.

All provider keys, multipart IDs, signed headers, and signed URLs are
server-only. Host applications must authorize tenant requests before invoking
the adapter and must never log upload/read targets.
