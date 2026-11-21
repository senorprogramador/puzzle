import { describe, expect, it } from "bun:test";
import {
  MediaCapabilityError,
  createMediaAssetService,
  createMediaProcessingService,
} from "../src";
import {
  InMemoryMediaObjectStorageAdapter,
  InMemoryMediaProcessingQueueAdapter,
} from "../src/testing";
import { MemoryStorageAdapter } from "./helpers/memory-storage-adapter";

const uploadObject = async (
  objectStorage: InMemoryMediaObjectStorageAdapter,
  tenantId: string,
  fileName: string,
  contentType: string,
  bytes: Uint8Array,
) => {
  const session = await objectStorage.createUploadIntent({
    tenantId,
    fileName,
    contentType,
    expectedSize: bytes.byteLength,
    expiresInMs: 60_000,
  });
  await objectStorage.writeForTesting(session.id, bytes, contentType);
  return objectStorage.completeUpload(session.id);
};

const createFixture = async () => {
  const storage = new MemoryStorageAdapter();
  const objectStorage = new InMemoryMediaObjectStorageAdapter();
  const queue = new InMemoryMediaProcessingQueueAdapter();
  const assets = createMediaAssetService({ storage, objectStorage });
  const source = await uploadObject(
    objectStorage,
    "tenant-a",
    "source.png",
    "image/png",
    new Uint8Array([1, 2, 3]),
  );
  const asset = await assets.create({
    tenantId: "tenant-a",
    originalName: "source.png",
    metadata: {
      kind: "image",
      mimeType: "image/png",
      size: source.size,
      width: 10,
      height: 10,
    },
    object: source.object,
  });
  return { storage, objectStorage, queue, assets, asset };
};

describe("media processing service", () => {
  it("runs configured processing and marks assets ready only after stored outputs verify", async () => {
    const fixture = await createFixture();
    const processing = createMediaProcessingService({
      storage: fixture.storage,
      objectStorage: fixture.objectStorage,
      queue: fixture.queue,
      processor: {
        processImage: async ({ onProgress }) => {
          await onProgress(50);
          const bytes = new Uint8Array([8, 9]);
          const stored = await uploadObject(
            fixture.objectStorage,
            "tenant-a",
            "thumbnail.png",
            "image/png",
            bytes,
          );
          return {
            variants: [
              {
                name: "thumbnail",
                kind: "image",
                object: stored.object,
                mimeType: stored.mimeType,
                size: stored.size,
                width: 2,
                height: 2,
              },
            ],
          };
        },
      },
    });
    const job = await processing.enqueue({
      tenantId: "tenant-a",
      assetId: fixture.asset.id,
      kind: "image",
      profiles: [{ name: "thumbnail", maxWidth: 200 }],
      idempotencyKey: "asset-thumbnail",
    });
    expect(job.status).toBe("queued");
    const completed = await processing.runNext("worker-1");
    expect(completed?.status).toBe("succeeded");
    const asset = await fixture.assets.get("tenant-a", fixture.asset.id);
    expect(asset.status).toBe("ready");
    expect(asset.variants[0]?.status).toBe("ready");
    expect(asset.variants[0]?.size).toBe(2);
  });

  it("records partial required-profile failures and never reports fake success", async () => {
    const fixture = await createFixture();
    const processing = createMediaProcessingService({
      storage: fixture.storage,
      objectStorage: fixture.objectStorage,
      queue: fixture.queue,
      processor: {
        processImage: async () => ({
          variants: [
            {
              name: "small",
              kind: "image",
              object: (await uploadObject(
                fixture.objectStorage,
                "tenant-a",
                "small.png",
                "image/png",
                new Uint8Array([4, 5]),
              )).object,
              mimeType: "image/png",
              size: 2,
              width: 2,
              height: 2,
            },
          ],
          failures: [
            {
              profile: "thumbnail",
              message: "The image encoder failed.",
              retryable: false,
            },
          ],
        }),
      },
    });
    const job = await processing.enqueue({
      tenantId: "tenant-a",
      assetId: fixture.asset.id,
      kind: "image",
      profiles: [
        { name: "thumbnail", maxWidth: 100 },
        { name: "small", maxWidth: 50 },
      ],
      idempotencyKey: "failed-image",
      maxAttempts: 1,
    });
    const failed = await processing.runNext("worker-1");
    expect(failed?.id).toBe(job.id);
    expect(failed?.status).toBe("failed");
    const storedAsset = await fixture.assets.get("tenant-a", fixture.asset.id);
    expect(storedAsset.status).toBe("failed");
    expect(storedAsset.variants.find((variant) => variant.name === "thumbnail")?.status).toBe("failed");
    expect(storedAsset.variants.find((variant) => variant.name === "small")?.status).toBe("ready");
  });

  it("keeps optional variant failures visible without failing required processing", async () => {
    const fixture = await createFixture();
    const processing = createMediaProcessingService({
      storage: fixture.storage,
      objectStorage: fixture.objectStorage,
      queue: fixture.queue,
      processor: {
        processImage: async () => ({
          variants: [],
          failures: [
            {
              profile: "preview",
              message: "Optional preview was skipped.",
              retryable: false,
            },
          ],
        }),
      },
    });
    await processing.enqueue({
      tenantId: "tenant-a",
      assetId: fixture.asset.id,
      kind: "image",
      profiles: [{ name: "preview", maxWidth: 100, required: false }],
      idempotencyKey: "optional-preview",
    });
    const completed = await processing.runNext("worker-1");
    const asset = await fixture.assets.get("tenant-a", fixture.asset.id);
    expect(completed?.status).toBe("succeeded");
    expect(asset.status).toBe("ready");
    expect(asset.variants[0]?.status).toBe("failed");
    expect(asset.processingError).toContain("Optional preview");
  });

  it("rejects processing requests without a configured processor", async () => {
    const fixture = await createFixture();
    const processing = createMediaProcessingService({
      storage: fixture.storage,
      objectStorage: fixture.objectStorage,
      queue: fixture.queue,
    });
    await expect(
      processing.enqueue({
        tenantId: "tenant-a",
        assetId: fixture.asset.id,
        kind: "image",
        profiles: [{ name: "thumbnail", maxWidth: 100 }],
        idempotencyKey: "missing-processor",
      }),
    ).rejects.toBeInstanceOf(MediaCapabilityError);
  });

  it("cancels the active processor and restores the asset's prior state", async () => {
    const fixture = await createFixture();
    let markStarted: (() => void) | undefined;
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });
    const processing = createMediaProcessingService({
      storage: fixture.storage,
      objectStorage: fixture.objectStorage,
      queue: fixture.queue,
      processor: {
        processImage: async ({ signal }) => {
          markStarted?.();
          return new Promise((_, reject) => {
            signal?.addEventListener(
              "abort",
              () => {
                const error = new Error("cancelled");
                error.name = "AbortError";
                reject(error);
              },
              { once: true },
            );
          });
        },
      },
    });
    const job = await processing.enqueue({
      tenantId: "tenant-a",
      assetId: fixture.asset.id,
      kind: "image",
      profiles: [{ name: "thumbnail", maxWidth: 100 }],
      idempotencyKey: "cancel-active",
    });
    const processingPromise = processing.runNext("worker-cancel");
    await started;
    const cancelled = await processing.cancel(job.id);
    const runResult = await processingPromise;
    const asset = await fixture.assets.get("tenant-a", fixture.asset.id);
    expect(cancelled?.status).toBe("cancelled");
    expect(runResult?.status).toBe("cancelled");
    expect(asset.status).toBe("uploaded");
    expect(asset.processingJobId).toBeNull();
  });
});
