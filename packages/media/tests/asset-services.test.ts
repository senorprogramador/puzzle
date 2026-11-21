import { describe, expect, it } from "bun:test";
import {
  MediaAssetConflictError,
  MediaCapabilityError,
  cleanupExpiredMediaUploads,
  cleanupOrphanedMediaObjects,
  createMediaAssetService,
  createMediaFolderService,
  type MediaObjectStorageAdapter,
} from "../src";
import { InMemoryMediaObjectStorageAdapter } from "../src/testing";
import { MemoryStorageAdapter } from "./helpers/memory-storage-adapter";

const makeAssetService = (supportsConditionalWrites = true) => {
  const storage = new MemoryStorageAdapter({
    conditionalWrites: supportsConditionalWrites,
  });
  const objectStorage = new InMemoryMediaObjectStorageAdapter();
  const service = createMediaAssetService({
    storage,
    objectStorage: objectStorage as MediaObjectStorageAdapter,
    idFactory: (() => {
      let id = 0;
      return () => `test-${++id}`;
    })(),
  });
  const folders = createMediaFolderService({
    storage,
    idFactory: (() => {
      let id = 0;
      return () => `folder-${++id}`;
    })(),
  });
  return { storage, objectStorage, service, folders };
};

const createAsset = async (
  service: ReturnType<typeof makeAssetService>["service"],
  objectStorage: InMemoryMediaObjectStorageAdapter,
  folderId?: string | null,
  tenantId = "tenant-a",
  focalPoint?: { readonly x: number; readonly y: number } | null,
) => {
  const bytes = new Uint8Array(32).fill(7);
  const session = await objectStorage.createUploadIntent({
    tenantId,
    fileName: "photo.png",
    contentType: "image/png",
    expectedSize: bytes.byteLength,
    expiresInMs: 60_000,
  });
  await objectStorage.writeForTesting(session.id, bytes, "image/png");
  const stored = await objectStorage.completeUpload(session.id);
  return service.create({
    tenantId,
    ...(folderId !== undefined ? { folderId } : {}),
    originalName: "folder/photo.png",
    metadata: {
      kind: "image",
      mimeType: "image/png",
      size: 32,
      width: 32,
      height: 24,
    },
    object: stored.object,
    ...(focalPoint !== undefined ? { focalPoint } : {}),
  });
};

describe("media asset and folder services", () => {
  it("scopes assets by tenant, updates with revisions, and tracks usages", async () => {
    const { service, folders, objectStorage } = makeAssetService();
    await Promise.all([service.ready, folders.ready]);
    const folder = await folders.create({ tenantId: "tenant-a", name: "Images" });
    const asset = await createAsset(service, objectStorage, folder.id);
    const initiallyFocused = await createAsset(
      service,
      objectStorage,
      folder.id,
      "tenant-a",
      { x: 0.3, y: 0.6 },
    );
    expect(asset.status).toBe("uploaded");
    expect(initiallyFocused.focalPoint).toEqual({ x: 0.3, y: 0.6 });
    await expect(service.get("tenant-b", asset.id)).rejects.toThrow();

    const updated = await service.update({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: asset.revision,
      altText: "A sample image",
      tags: ["hero", " hero "],
      crop: { x: 0, y: 0, width: 0.5, height: 0.5 },
      focalPoint: { x: 0.25, y: 0.7 },
      hotspots: [{ id: "point", x: 0.5, y: 0.5, width: 0, height: 0 }],
    });
    expect(updated.revision).toBe(asset.revision + 1);
    expect(updated.tags).toEqual(["hero"]);
    expect(asset.focalPoint).toBeNull();
    expect(updated.focalPoint).toEqual({ x: 0.25, y: 0.7 });
    expect((await service.get("tenant-a", asset.id)).hotspots).toEqual([
      { id: "point", x: 0.5, y: 0.5, width: 0, height: 0 },
    ]);
    const filtered = await service.list({
      tenantId: "tenant-a",
      tagsAll: ["hero"],
      checksum: updated.checksum,
    });
    expect(filtered.items.map((item) => item.id)).toEqual([asset.id]);
    const preserved = await service.update({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: updated.revision,
      title: "Keep focal point",
    });
    expect(preserved.focalPoint).toEqual({ x: 0.25, y: 0.7 });
    const undefinedPreserved = await service.update({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: preserved.revision,
      focalPoint: undefined,
    });
    expect(undefinedPreserved.focalPoint).toEqual({ x: 0.25, y: 0.7 });
    const cleared = await service.update({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: undefinedPreserved.revision,
      focalPoint: null,
    });
    expect(cleared.focalPoint).toBeNull();

    const usage = await service.registerUsage({
      tenantId: "tenant-a",
      assetId: asset.id,
      resourceType: "page",
      resourceId: "home",
      fieldKey: "cover",
    });
    expect((await service.registerUsage({
      tenantId: "tenant-a",
      assetId: asset.id,
      resourceType: "page",
      resourceId: "home",
      fieldKey: "cover",
    })).id).toBe(usage.id);
    await expect(
      service.softDelete({
        tenantId: "tenant-a",
        assetId: asset.id,
        expectedRevision: cleared.revision,
      }),
    ).rejects.toBeInstanceOf(MediaAssetConflictError);
    expect(
      await service.removeUsage({
        tenantId: "tenant-a",
        assetId: asset.id,
        resourceType: "page",
        resourceId: "home",
        fieldKey: "cover",
      }),
    ).toBe(1);
    const deleted = await service.softDelete({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: cleared.revision,
    });
    expect(deleted.status).toBe("deleted");
    await expect(service.get("tenant-a", asset.id)).rejects.toThrow();
    expect(await service.get("tenant-a", asset.id, { includeDeleted: true })).toEqual(deleted);
    await expect(service.get("tenant-b", asset.id, { includeDeleted: true })).rejects.toThrow();
    const restored = await service.restore({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: deleted.revision,
    });
    expect(restored.status).toBe("uploaded");
  });

  it("rejects stale updates and adapters without conditional writes", async () => {
    const first = makeAssetService();
    const asset = await createAsset(first.service, first.objectStorage);
    const updated = await first.service.update({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: asset.revision,
      title: "First update",
    });

    await expect(
      first.service.update({
        tenantId: "tenant-a",
        assetId: asset.id,
        expectedRevision: asset.revision,
        title: "Stale update",
      }),
    ).rejects.toBeInstanceOf(MediaAssetConflictError);
    expect(updated.title).toBe("First update");

    const unsupported = makeAssetService(false);
    const unsupportedAsset = await createAsset(
      unsupported.service,
      unsupported.objectStorage,
    );
    await expect(
      unsupported.service.update({
        tenantId: "tenant-a",
        assetId: unsupportedAsset.id,
        expectedRevision: unsupportedAsset.revision,
        title: "Cannot write",
      }),
    ).rejects.toBeInstanceOf(MediaCapabilityError);
  });

  it("allows same-checksum assets with distinct IDs while keeping listings tenant-scoped", async () => {
    const { service, objectStorage } = makeAssetService();
    const first = await createAsset(service, objectStorage);
    const second = await createAsset(service, objectStorage);
    const otherTenant = await createAsset(
      service,
      objectStorage,
      undefined,
      "tenant-b",
    );

    expect(first.checksum).toEqual(second.checksum);
    expect(first.checksum).toEqual(otherTenant.checksum);
    expect(first.id).not.toBe(second.id);
    expect(first.id).not.toBe(otherTenant.id);
    expect(
      (await service.list({ tenantId: "tenant-a" }))
        .items.map((asset) => asset.id)
        .sort(),
    ).toEqual([first.id, second.id].sort());
    expect(
      (await service.list({ tenantId: "tenant-b" }))
        .items.map((asset) => asset.id)
        .sort(),
    ).toEqual([otherTenant.id]);
  });

  it("prevents folder cycles, cross-tenant moves, and non-empty folder deletion", async () => {
    const { folders, service, objectStorage } = makeAssetService();
    const parent = await folders.create({ tenantId: "tenant-a", name: "Parent" });
    const child = await folders.create({
      tenantId: "tenant-a",
      name: "Child",
      parentId: parent.id,
    });
    await expect(
      folders.move({
        tenantId: "tenant-a",
        folderId: parent.id,
        expectedRevision: parent.revision,
        parentId: child.id,
      }),
    ).rejects.toBeInstanceOf(MediaAssetConflictError);
    await expect(
      folders.move({
        tenantId: "tenant-b",
        folderId: child.id,
        expectedRevision: child.revision,
        parentId: null,
      }),
    ).rejects.toThrow();

    const asset = await createAsset(service, objectStorage, child.id);
    await expect(
      folders.delete({
        tenantId: "tenant-a",
        folderId: child.id,
        expectedRevision: child.revision,
      }),
    ).rejects.toBeInstanceOf(MediaAssetConflictError);
    const deleted = await service.softDelete({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: asset.revision,
    });
    const deletion = await service.permanentlyDelete({
      tenantId: "tenant-a",
      assetId: asset.id,
      expectedRevision: deleted.revision,
    });
    expect(deletion.deleted).toBe(true);
    expect(deletion.objectDeletionFailures).toEqual([]);
    const deletedChild = await folders.delete({
      tenantId: "tenant-a",
      folderId: child.id,
      expectedRevision: child.revision,
    });
    await expect(
      folders.create({
        tenantId: "tenant-a",
        parentId: parent.id,
        name: "Child",
      }),
    ).rejects.toThrow();
    expect(
      await folders.permanentlyDelete({
        tenantId: "tenant-a",
        folderId: child.id,
        expectedRevision: deletedChild.revision,
      }),
    ).toBe(true);
    const replacement = await folders.create({
      tenantId: "tenant-a",
      parentId: parent.id,
      name: "Child",
    });
    expect(replacement.parentId).toBe(parent.id);
  });

  it("cleans only old unreferenced objects and aborts expired upload sessions", async () => {
    let currentTime = new Date("2026-03-01T00:00:00.000Z");
    const storage = new MemoryStorageAdapter();
    const objectStorage = new InMemoryMediaObjectStorageAdapter({
      now: () => currentTime,
    });
    const assets = createMediaAssetService({ storage, objectStorage });
    const referenced = await createAsset(assets, objectStorage);
    const orphan = await objectStorage.createUploadIntent({
      tenantId: "tenant-a",
      fileName: "orphan.bin",
      contentType: "application/octet-stream",
      expectedSize: 1,
      expiresInMs: 1_000,
    });
    await objectStorage.writeForTesting(
      orphan.id,
      new Uint8Array([5]),
      "application/octet-stream",
    );
    const orphanObject = await objectStorage.completeUpload(orphan.id);
    const cleanup = await cleanupOrphanedMediaObjects({
      storage,
      objectStorage,
      olderThan: new Date(currentTime.getTime() + 10_000),
    });
    expect(cleanup.deleted).toBe(1);
    expect(await objectStorage.getObjectMetadata(referenced.object)).not.toBeNull();
    expect(await objectStorage.getObjectMetadata(orphanObject.object)).toBeNull();

    const expiredSession = await objectStorage.createUploadIntent({
      tenantId: "tenant-a",
      fileName: "expired.bin",
      contentType: "application/octet-stream",
      expiresInMs: 1_000,
    });
    currentTime = new Date(currentTime.getTime() + 2_000);
    const expiredCleanup = await cleanupExpiredMediaUploads({
      objectStorage,
      before: currentTime,
    });
    expect(expiredCleanup.aborted).toBe(1);
    expect(
      (await objectStorage.getUploadSession(expiredSession.id))?.state,
    ).toBe("aborted");
  });
});
