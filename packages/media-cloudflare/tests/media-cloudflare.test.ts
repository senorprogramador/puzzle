import { describe, expect, it } from "bun:test";
import {
  CloudflareImagesProcessor,
  CloudflareR2BucketProvisioner,
  CloudflareR2MediaObjectStorageAdapter,
  CloudflareR2S3UrlSigner,
  InMemoryCloudflareMediaMetadataStore,
  type CloudflareMediaBucketTarget,
  type R2BucketLike,
  type R2MultipartUploadLike,
  type R2ObjectLike,
} from "../src";
import type { MediaAsset, MediaMultipartCompletedPart } from "@puzzle-ui/media";

type Stored = {
  readonly bytes: Uint8Array;
  readonly contentType: string;
  readonly uploaded: Date;
};

class MockBucket implements R2BucketLike {
  readonly objects = new Map<string, Stored>();
  readonly uploads = new Map<string, { readonly key: string; readonly parts: Map<number, Uint8Array> }>();
  private nextUpload = 0;

  async put(key: string, value: Uint8Array, options?: { readonly httpMetadata?: { readonly contentType?: string } }): Promise<R2ObjectLike> {
    const bytes = new Uint8Array(value);
    this.objects.set(key, {
      bytes,
      contentType: options?.httpMetadata?.contentType ?? "application/octet-stream",
      uploaded: new Date(),
    });
    return this.object(key)!;
  }

  async get(key: string): Promise<R2ObjectLike | null> {
    return this.object(key);
  }

  async head(key: string): Promise<R2ObjectLike | null> {
    return this.object(key);
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key);
  }

  async createMultipartUpload(key: string): Promise<R2MultipartUploadLike> {
    this.nextUpload += 1;
    const uploadId = `upload-${this.nextUpload}`;
    this.uploads.set(uploadId, { key, parts: new Map() });
    return this.multipart(uploadId);
  }

  resumeMultipartUpload(_key: string, uploadId: string): R2MultipartUploadLike {
    return this.multipart(uploadId);
  }

  private multipart(uploadId: string): R2MultipartUploadLike {
    const upload = this.uploads.get(uploadId);
    if (!upload) throw new Error("upload not found");
    return {
      uploadId,
      uploadPart: async (partNumber, value) => {
        const bytes = value instanceof Uint8Array ? new Uint8Array(value) : new Uint8Array(value as ArrayBuffer);
        upload.parts.set(partNumber, bytes);
        return { etag: `etag-${partNumber}` };
      },
      complete: async (parts) => {
        const bytes = new Uint8Array(
          parts.reduce((size, part) => size + (upload.parts.get(part.partNumber)?.byteLength ?? 0), 0),
        );
        let offset = 0;
        for (const part of parts) {
          const value = upload.parts.get(part.partNumber);
          if (!value) throw new Error("missing part");
          bytes.set(value, offset);
          offset += value.byteLength;
        }
        await this.put(upload.key, bytes, {
          httpMetadata: { contentType: "image/png" },
        });
        this.uploads.delete(uploadId);
        return this.object(upload.key)!;
      },
      abort: async () => {
        this.uploads.delete(uploadId);
      },
    };
  }

  private object(key: string): R2ObjectLike | null {
    const stored = this.objects.get(key);
    if (!stored) return null;
    return {
      key,
      size: stored.bytes.byteLength,
      uploaded: stored.uploaded,
      httpMetadata: { contentType: stored.contentType },
      arrayBuffer: async () => stored.bytes.slice().buffer,
    };
  }
}

const targetFor = (bucket: MockBucket): CloudflareMediaBucketTarget => ({
  bucket,
  signer: {
    signUpload: async ({ key }) => ({ url: `https://upload.test/${encodeURIComponent(key)}` }),
    signMultipartPart: async ({ key, partNumber }) => ({
      url: `https://upload.test/${encodeURIComponent(key)}/${partNumber}`,
    }),
    signRead: async ({ key }) => ({ url: `https://read.test/${encodeURIComponent(key)}` }),
  },
});

const adapterFor = (bucket: MockBucket, tenantId?: string) =>
  new CloudflareR2MediaObjectStorageAdapter({
    bucket: targetFor(bucket),
    metadataStore: new InMemoryCloudflareMediaMetadataStore(),
    ...(tenantId ? { tenantId } : {}),
  });

describe("@puzzle-ui/media-cloudflare", () => {
  it("completes single uploads, verifies checksums, and isolates tenant-scoped adapters", async () => {
    const bucket = new MockBucket();
    const adapter = adapterFor(bucket, "tenant-a");
    const bytes = new TextEncoder().encode("cloudflare media");
    const session = await adapter.createUploadIntent({
      tenantId: "tenant-a",
      fileName: "photo.png",
      contentType: "image/png",
      expectedSize: bytes.byteLength,
      expiresInMs: 30_000,
    });
    await adapter.putForTesting(session.id, bytes, "image/png");
    const stored = await adapter.completeUpload(session.id);
    expect(stored.tenantId).toBe("tenant-a");
    expect(stored.size).toBe(bytes.byteLength);
    expect((await adapter.completeUpload(session.id)).object).toEqual(stored.object);
    expect(await adapter.getObjectMetadata(stored.object)).toEqual(stored);
    expect(await adapterFor(bucket, "tenant-b").getObjectMetadata(stored.object)).toBeNull();
    expect(await adapter.deleteObject(stored.object)).toBe(true);
    expect(await adapter.deleteObject(stored.object)).toBe(false);
  });

  it("validates tenant, MIME, prefix, and target expiry constraints", async () => {
    const adapter = adapterFor(new MockBucket());
    await expect(
      adapter.createUploadIntent({
        tenantId: "tenant-a",
        fileName: "file.bin",
        contentType: "not-a-mime",
        expiresInMs: 1000,
      }),
    ).rejects.toThrow();
    await expect(
      adapter.createUploadIntent({
        tenantId: "tenant-a",
        fileName: "file.bin",
        contentType: "application/octet-stream",
        objectPrefix: "../escape",
        expiresInMs: 1000,
      }),
    ).rejects.toThrow();
    await expect(
      adapter.createUploadIntent({
        tenantId: "tenant-a",
        fileName: "file.bin",
        contentType: "application/octet-stream",
        expiresInMs: 60 * 60 * 1000,
      }),
    ).rejects.toThrow();
  });

  it("assembles multipart parts and rejects invalid part targets", async () => {
    const bucket = new MockBucket();
    const adapter = adapterFor(bucket);
    const bytes = new TextEncoder().encode("multipart payload");
    const session = await adapter.createMultipartUpload({
      tenantId: "tenant-a",
      fileName: "photo.png",
      contentType: "image/png",
      expectedSize: bytes.byteLength,
      expiresInMs: 30_000,
      partSizeBytes: 8,
    });
    await expect(adapter.createMultipartPartTargets(session.id, [1, 1], 1000)).rejects.toThrow();
    const targets = await adapter.createMultipartPartTargets(session.id, [1, 2, 3], 1000);
    expect(targets).toHaveLength(3);
    const parts: MediaMultipartCompletedPart[] = [];
    for (const target of targets) {
      const start = (target.partNumber - 1) * 8;
      parts.push(await adapter.putPartForTesting(session.id, target.partNumber, bytes.slice(start, start + 8)));
    }
    const stored = await adapter.completeUpload(session.id, parts.reverse());
    expect(stored.size).toBe(bytes.byteLength);
  });

  it("resolves dynamic tenant buckets and provisions idempotently", async () => {
    const buckets = new Map<string, MockBucket>();
    const adapter = new CloudflareR2MediaObjectStorageAdapter({
      bucket: {
        resolve: async ({ tenantId }) => {
          const bucket = buckets.get(tenantId) ?? new MockBucket();
          buckets.set(tenantId, bucket);
          return targetFor(bucket);
        },
      },
      metadataStore: new InMemoryCloudflareMediaMetadataStore(),
    });
    const first = await adapter.createUploadIntent({
      tenantId: "tenant-a",
      fileName: "a.txt",
      contentType: "text/plain",
      expiresInMs: 1000,
    });
    expect(first.uploadTarget?.url).toContain("tenants");

    let created = 0;
    const provisioner = new CloudflareR2BucketProvisioner({
      api: {
        getBucket: async () => null,
        createBucket: async ({ name }) => {
          created += 1;
          return { name };
        },
      },
    });
    expect((await provisioner.ensureBucket({ tenantId: "tenant-a", name: "tenant-a-media" })).name).toBe(
      "tenant-a-media",
    );
    expect(created).toBe(1);
  });

  it("creates constrained Worker-compatible R2 S3 presigned targets", async () => {
    const signer = new CloudflareR2S3UrlSigner({
      endpoint: "https://account.r2.cloudflarestorage.com",
      bucketName: "tenant-a-media",
      accessKeyId: "access-key",
      secretAccessKey: "secret-key",
      now: () => new Date("2026-01-01T00:00:00.000Z"),
    });
    const target = await signer.signUpload({
      tenantId: "tenant-a",
      key: "tenant-a/r2-1/photo.png",
      contentType: "image/png",
      expiresAt: new Date("2026-01-01T00:05:00.000Z"),
    });
    const url = new URL(target.url);
    expect(url.protocol).toBe("https:");
    expect(url.pathname).toBe("/tenant-a-media/tenant-a/r2-1/photo.png");
    expect(url.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    expect(url.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(url.searchParams.get("X-Amz-SignedHeaders")).toBe("host");
    expect(url.searchParams.get("contentType")).toBeNull();
    expect(url.searchParams.get("X-Amz-Signature")).toMatch(/^[a-f0-9]{64}$/);
    expect(target.headers).toEqual({ "content-type": "image/png" });
    expect(target.url).not.toContain("secret-key");
  });

  it("processes profiles through injectable Cloudflare Images bindings", async () => {
    const written: Uint8Array[] = [];
    const processor = new CloudflareImagesProcessor({
      images: {
        input: () => ({
          transform: () => ({
            output: () => ({
              response: async () => new Response(new Uint8Array([1, 2, 3]), {
                headers: { "content-type": "image/webp" },
              }),
            }),
          }),
        }),
      },
      source: async () => new Uint8Array([9]),
      writeVariant: async ({ bytes }) => {
        written.push(bytes);
        return { object: { key: "variants/one.webp" } };
      },
    });
    const output = await processor.processImage({
      jobId: "job",
      idempotencyKey: "key",
      asset: {
        id: "asset",
        tenantId: "tenant-a",
        folderId: null,
        originalName: "photo.png",
        displayName: "photo",
        kind: "image",
        mimeType: "image/png",
        size: 1,
        object: { key: "originals/photo.png" },
        status: "uploaded",
        tags: [],
        hotspots: [],
        focalPoint: null,
        variants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        revision: 1,
      },
      profiles: [
        { name: "small", maxWidth: 320, format: "image/webp" },
        { name: "card", maxWidth: 320, format: "image/webp" },
      ],
      onProgress: () => undefined,
    });
    expect(output.variants[0]?.mimeType).toBe("image/webp");
    expect(output.variants.map((variant) => variant.name)).toEqual(["small", "card"]);
    expect(written).toHaveLength(1);
    expect(written[0]).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("honors an already-aborted image processing signal", async () => {
    const controller = new AbortController();
    controller.abort();
    const asset: MediaAsset = {
      id: "asset",
      tenantId: "tenant-a",
      folderId: null,
      originalName: "photo.png",
      displayName: "photo",
      kind: "image",
      mimeType: "image/png",
      size: 1,
      object: { key: "originals/photo.png" },
      status: "uploaded",
      tags: [],
      hotspots: [],
      focalPoint: null,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      revision: 1,
    };
    const processor = new CloudflareImagesProcessor({
      images: {
        input: () => {
          throw new Error("Images binding should not be called");
        },
      },
      source: async () => new Uint8Array([1]),
      writeVariant: async () => ({ object: { key: "unused" } }),
    });
    await expect(
      processor.processImage({
        jobId: "job",
        idempotencyKey: "key",
        asset,
        profiles: [{ name: "small", maxWidth: 320 }],
        signal: controller.signal,
        onProgress: () => undefined,
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
