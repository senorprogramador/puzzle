import type { StorageAdapter, StorageInsert, StorageUpdate } from "@puzzle-ui/storage";
import {
  MediaAssetConflictError,
  MediaChecksumMismatchError,
  InvalidMediaFileError,
  MediaNotFoundError,
  MediaValidationError,
} from "../errors/media.errors";
import type {
  MediaAsset,
  MediaAssetUsage,
  MediaAssetStatus,
  MediaChecksum,
  MediaCrop,
  MediaFileMetadata,
  MediaFocalPoint,
  MediaHotspot,
  MediaKind,
  MediaObjectReference,
} from "../types/media.types";
import type { MediaObjectStorageAdapter } from "../types/object-storage.types";
import {
  normalizeMediaChecksum,
  normalizeMediaCrop,
  normalizeMediaFocalPoint,
  normalizeMediaHotspots,
  normalizeMediaObjectReference,
  normalizeMediaTags,
  validateMediaFileMetadata,
} from "../utils/media-validation";
import {
  MEDIA_ASSETS_COLLECTION,
  MEDIA_ASSET_USAGES_COLLECTION,
  MEDIA_FOLDERS_COLLECTION,
  registerMediaCollections,
} from "./collections";
import {
  assertConditionalWrites,
  assertTenantId,
  createMediaId,
  getMediaNow,
  makeStorageCondition,
  normalizeDisplayName,
  normalizeOriginalName,
  assertStorageCapability,
  type MediaServiceRuntime,
} from "./service-utils";

export type MediaAssetCreateInput = {
  readonly tenantId: string;
  readonly folderId?: string | null;
  readonly originalName: string;
  readonly displayName?: string;
  readonly metadata: MediaFileMetadata;
  readonly object: MediaObjectReference;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags?: readonly string[];
  readonly crop?: MediaCrop | null;
  readonly focalPoint?: MediaFocalPoint | null;
  readonly hotspots?: readonly MediaHotspot[];
  readonly actorId?: string | null;
};

export type MediaAssetMetadataUpdate = {
  readonly tenantId: string;
  readonly assetId: string;
  readonly expectedRevision: number;
  readonly actorId?: string | null;
  readonly folderId?: string | null;
  readonly displayName?: string;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags?: readonly string[];
  readonly crop?: MediaCrop | null;
  readonly focalPoint?: MediaFocalPoint | null;
  readonly hotspots?: readonly MediaHotspot[];
};

export type MediaAssetListInput = {
  readonly tenantId: string;
  readonly folderId?: string | null;
  readonly kind?: MediaKind;
  readonly status?: MediaAssetStatus;
  readonly first?: number;
  readonly after?: string;
  readonly orderBy?: "createdAt" | "updatedAt" | "displayName" | "size";
  readonly direction?: "asc" | "desc";
  readonly tagsAny?: readonly string[];
  readonly tagsAll?: readonly string[];
  readonly checksum?: MediaChecksum;
};

export type MediaAssetPage = {
  readonly items: readonly MediaAsset[];
  readonly nextCursor: string | null;
};

export type MediaUsageInput = {
  readonly tenantId: string;
  readonly assetId: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly fieldKey?: string;
  readonly actorId?: string | null;
};

export type MediaAssetService = {
  readonly ready: Promise<void>;
  create(input: MediaAssetCreateInput): Promise<MediaAsset>;
  get(
    tenantId: string,
    assetId: string,
    options?: { readonly includeDeleted?: boolean },
  ): Promise<MediaAsset>;
  list(input: MediaAssetListInput): Promise<MediaAssetPage>;
  update(input: MediaAssetMetadataUpdate): Promise<MediaAsset>;
  softDelete(input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
    readonly actorId?: string | null;
  }): Promise<MediaAsset>;
  restore(input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
    readonly actorId?: string | null;
  }): Promise<MediaAsset>;
  permanentlyDelete(input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
  }): Promise<MediaPermanentDeleteResult>;
  registerUsage(input: MediaUsageInput): Promise<MediaAssetUsage>;
  removeUsage(input: Omit<MediaUsageInput, "actorId">): Promise<number>;
  listUsage(tenantId: string, assetId: string): Promise<readonly MediaAssetUsage[]>;
};

export type MediaPermanentDeleteResult = {
  readonly deleted: true;
  readonly objectDeletionFailures: readonly {
    readonly key: string;
    readonly error: string;
  }[];
};

export type MediaAssetServiceOptions = {
  readonly storage: StorageAdapter;
  readonly objectStorage: MediaObjectStorageAdapter;
} & MediaServiceRuntime;

const isPresent = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const validatePageSize = (first: number | undefined): number => {
  const value = first ?? 50;
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new MediaValidationError("first must be an integer from 1 to 100.");
  }
  return value;
};

const normalizeOptionalText = (value: string | null, field: string): string | null => {
  if (value === null) return null;
  if (typeof value !== "string") {
    throw new MediaValidationError(`${field} must be a string or null.`);
  }
  return value;
};

const objectKey = (object: MediaObjectReference): string =>
  `${object.key}\u0000${object.versionId ?? ""}`;

export const createMediaAssetService = (
  options: MediaAssetServiceOptions,
): MediaAssetService => {
  const { storage, objectStorage } = options;
  const ready = registerMediaCollections(storage);

  const getAnyAsset = async (
    tenantId: string,
    assetId: string,
  ): Promise<MediaAsset> => {
    assertTenantId(tenantId);
    const asset = await storage.findById<MediaAsset>(MEDIA_ASSETS_COLLECTION, assetId);
    if (!asset || asset.tenantId !== tenantId) {
      throw new MediaNotFoundError("Media asset");
    }
    return asset;
  };

  const getActiveAsset = async (
    tenantId: string,
    assetId: string,
  ): Promise<MediaAsset> => {
    const asset = await getAnyAsset(tenantId, assetId);
    if (asset.status === "deleted") {
      throw new MediaNotFoundError("Media asset");
    }
    return asset;
  };

  const ensureFolder = async (
    tenantId: string,
    folderId: string | null,
  ): Promise<void> => {
    if (folderId === null) return;
    const folder = await storage.findById<import("../types/media.types").MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folderId,
    );
    if (!folder || folder.tenantId !== tenantId || folder.deletedAt) {
      throw new MediaNotFoundError("Media folder");
    }
  };

  const listUsage = async (
    tenantId: string,
    assetId: string,
  ): Promise<readonly MediaAssetUsage[]> => {
    await ready;
    assertTenantId(tenantId);
    return storage.findMany<MediaAssetUsage>(MEDIA_ASSET_USAGES_COLLECTION, {
      where: {
        tenantId: { operator: "eq", value: tenantId },
        assetId: { operator: "eq", value: assetId },
      },
    });
  };

  const create = async (
    input: MediaAssetCreateInput,
  ): Promise<MediaAsset> => {
    await ready;
    assertTenantId(input.tenantId);
    const metadata = validateMediaFileMetadata(input.metadata);
    const originalName = normalizeOriginalName(input.originalName);
    const displayName = normalizeDisplayName(input.displayName ?? originalName);
    const object = normalizeMediaObjectReference(input.object);
    const storedObject = await objectStorage.getObjectMetadata(object);
    if (!storedObject || storedObject.tenantId !== input.tenantId) {
      throw new MediaNotFoundError("Uploaded media object");
    }
    if (
      storedObject.size !== metadata.size ||
      storedObject.mimeType.toLowerCase() !== metadata.mimeType
    ) {
      throw new InvalidMediaFileError(
        "Asset metadata does not match the completed object upload.",
      );
    }
    if (
      metadata.checksum &&
      storedObject.checksum &&
      storedObject.checksum.value !== metadata.checksum.value
    ) {
      throw new MediaChecksumMismatchError();
    }
    const verifiedMetadata: MediaFileMetadata = {
      ...metadata,
      ...(storedObject.checksum ? { checksum: storedObject.checksum } : {}),
    };
    const folderId = input.folderId ?? null;
    await ensureFolder(input.tenantId, folderId);
    const now = getMediaNow(options.now);
    const insert: StorageInsert<MediaAsset> = {
      id: createMediaId(options.idFactory, "asset"),
      tenantId: input.tenantId,
      folderId,
      originalName,
      displayName,
      ...verifiedMetadata,
      object,
      status: "uploaded",
      altText: normalizeOptionalText(input.altText ?? null, "altText"),
      caption: normalizeOptionalText(input.caption ?? null, "caption"),
      title: normalizeOptionalText(input.title ?? null, "title"),
      description: normalizeOptionalText(input.description ?? null, "description"),
      tags: normalizeMediaTags(input.tags ?? []),
      crop: input.crop == null ? null : normalizeMediaCrop(input.crop),
      focalPoint:
        input.focalPoint == null
          ? null
          : normalizeMediaFocalPoint(input.focalPoint),
      hotspots: normalizeMediaHotspots(input.hotspots ?? []),
      variants: [],
      processingError: null,
      processingJobId: null,
      previousStatus: null,
      createdAt: now,
      updatedAt: now,
      createdBy: input.actorId ?? null,
      updatedBy: input.actorId ?? null,
      deletedAt: null,
      revision: 1,
    };
    const asset = await storage.insert<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      insert,
    );
    if (folderId !== null) {
      try {
        await ensureFolder(input.tenantId, folderId);
      } catch {
        await storage.delete<MediaAsset>(
          MEDIA_ASSETS_COLLECTION,
          asset.id,
          makeStorageCondition(asset.revision),
        );
        throw new MediaAssetConflictError(
          "The destination folder changed while the asset was being created.",
        );
      }
    }
    return asset;
  };

  const get = async (
    tenantId: string,
    assetId: string,
    options?: { readonly includeDeleted?: boolean },
  ): Promise<MediaAsset> => {
    await ready;
    return options?.includeDeleted === true
      ? getAnyAsset(tenantId, assetId)
      : getActiveAsset(tenantId, assetId);
  };

  const list = async (
    input: MediaAssetListInput,
  ): Promise<MediaAssetPage> => {
    await ready;
    assertTenantId(input.tenantId);
    assertStorageCapability(storage, "cursorPagination");
    const first = validatePageSize(input.first);
    const where: NonNullable<import("@puzzle-ui/storage").StorageQuery<MediaAsset>["where"]> = {
      tenantId: { operator: "eq", value: input.tenantId },
    };
    if (input.folderId !== undefined) {
      Object.assign(where, {
        folderId: { operator: "eq", value: input.folderId },
      });
    }
    if (input.kind !== undefined) {
      Object.assign(where, { kind: { operator: "eq", value: input.kind } });
    }
    if (input.status !== undefined) {
      Object.assign(where, { status: { operator: "eq", value: input.status } });
    } else {
      Object.assign(where, { status: { operator: "ne", value: "deleted" } });
    }
    const orderBy = [
      {
        field: input.orderBy ?? "createdAt",
        direction: input.direction ?? "desc",
      },
    ] as const;
    const tagsAny =
      input.tagsAny === undefined
        ? undefined
        : normalizeMediaTags(input.tagsAny);
    const tagsAll =
      input.tagsAll === undefined
        ? undefined
        : normalizeMediaTags(input.tagsAll);
    const checksum =
      input.checksum === undefined
        ? undefined
        : normalizeMediaChecksum(input.checksum);
    const needsPostFilter =
      (tagsAny?.length ?? 0) > 0 ||
      (tagsAll?.length ?? 0) > 0 ||
      checksum !== undefined;
    if (!needsPostFilter) {
      const page = await storage.findPage<MediaAsset>(MEDIA_ASSETS_COLLECTION, {
        where,
        orderBy,
        first,
        ...(input.after ? { after: { value: input.after } } : {}),
      });
      return { items: page.items, nextCursor: page.nextCursor?.value ?? null };
    }

    const items: MediaAsset[] = [];
    let cursor = input.after;
    let nextCursor: string | null = null;
    let scanned = 0;
    const maxScan = 5_000;
    while (scanned < maxScan) {
      const cursorBefore = cursor;
      const page = await storage.findPage<MediaAsset>(MEDIA_ASSETS_COLLECTION, {
        where,
        orderBy,
        first: 1,
        ...(cursor ? { after: { value: cursor } } : {}),
      });
      const asset = page.items[0];
      if (!asset) {
        nextCursor = null;
        break;
      }
      scanned += 1;
      cursor = page.nextCursor?.value ?? undefined;
      const tagsMatch =
        (tagsAny === undefined ||
          tagsAny.length === 0 ||
          tagsAny.some((tag) => asset.tags.includes(tag))) &&
        (tagsAll === undefined ||
          tagsAll.every((tag) => asset.tags.includes(tag)));
      const checksumMatch =
        checksum === undefined ||
        (asset.checksum?.algorithm === checksum.algorithm &&
          asset.checksum?.value === checksum.value);
      if (tagsMatch && checksumMatch) {
        if (items.length === first) {
          nextCursor = cursorBefore ?? null;
          break;
        }
        items.push(asset);
      }
      if (!cursor) {
        nextCursor = null;
        break;
      }
      nextCursor = cursor;
    }
    return { items, nextCursor };
  };

  const update = async (
    input: MediaAssetMetadataUpdate,
  ): Promise<MediaAsset> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const asset = await getActiveAsset(input.tenantId, input.assetId);
    if (asset.status === "processing") {
      throw new MediaAssetConflictError(
        "Asset metadata cannot be changed while processing is active.",
      );
    }
    const changes: StorageUpdate<MediaAsset> = {
      updatedAt: getMediaNow(options.now),
      updatedBy: input.actorId ?? null,
    };
    if (isPresent(input, "folderId")) {
      const folderId = input.folderId ?? null;
      await ensureFolder(input.tenantId, folderId);
      Object.assign(changes, { folderId });
    }
    if (input.displayName !== undefined) {
      Object.assign(changes, {
        displayName: normalizeDisplayName(input.displayName),
      });
    }
    for (const key of ["altText", "caption", "title", "description"] as const) {
      if (isPresent(input, key)) {
        Object.assign(changes, {
          [key]: normalizeOptionalText(input[key] ?? null, key),
        });
      }
    }
    if (input.tags !== undefined) {
      Object.assign(changes, { tags: normalizeMediaTags(input.tags) });
    }
    if (isPresent(input, "crop")) {
      Object.assign(changes, {
        crop: input.crop == null ? null : normalizeMediaCrop(input.crop),
      });
    }
    if (input.focalPoint !== undefined) {
      Object.assign(changes, {
        focalPoint:
          input.focalPoint === null
            ? null
            : normalizeMediaFocalPoint(input.focalPoint),
      });
    }
    if (input.hotspots !== undefined) {
      Object.assign(changes, {
        hotspots: normalizeMediaHotspots(input.hotspots),
      });
    }
    const updated = await storage.update<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
      changes,
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The asset changed before its metadata could be updated.");
    }
    return updated;
  };

  const softDelete = async (input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
    readonly actorId?: string | null;
  }): Promise<MediaAsset> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const asset = await getActiveAsset(input.tenantId, input.assetId);
    if (asset.status === "processing") {
      throw new MediaAssetConflictError(
        "An asset cannot be deleted while processing is active.",
      );
    }
    const usage = await storage.findOne<MediaAssetUsage>(
      MEDIA_ASSET_USAGES_COLLECTION,
      {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          assetId: { operator: "eq", value: asset.id },
        },
      },
    );
    if (usage) {
      throw new MediaAssetConflictError(
        "An asset referenced by content cannot be deleted until its usages are removed.",
      );
    }
    const now = getMediaNow(options.now);
    const updated = await storage.update<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
      {
        status: "deleted",
        previousStatus: asset.status === "deleted" ? null : asset.status,
        deletedAt: now,
        updatedAt: now,
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The asset changed before it could be deleted.");
    }
    const racedUsage = await storage.findOne<MediaAssetUsage>(
      MEDIA_ASSET_USAGES_COLLECTION,
      {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          assetId: { operator: "eq", value: asset.id },
        },
      },
    );
    if (racedUsage) {
      const restored = await storage.update<MediaAsset>(
        MEDIA_ASSETS_COLLECTION,
        asset.id,
        {
          status: asset.status,
          previousStatus: null,
          processingJobId: null,
          deletedAt: null,
          updatedAt: getMediaNow(options.now),
          updatedBy: input.actorId ?? null,
        },
        makeStorageCondition(updated.revision),
      );
      if (!restored) {
        throw new MediaAssetConflictError(
          "A media usage was added while the asset was being deleted.",
        );
      }
      throw new MediaAssetConflictError(
        "An asset referenced by content cannot be deleted until its usages are removed.",
      );
    }
    return updated;
  };

  const restore = async (input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
    readonly actorId?: string | null;
  }): Promise<MediaAsset> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const asset = await getAnyAsset(input.tenantId, input.assetId);
    if (asset.status !== "deleted") {
      throw new MediaAssetConflictError("Only a deleted asset can be restored.");
    }
    await ensureFolder(input.tenantId, asset.folderId);
    const now = getMediaNow(options.now);
    const updated = await storage.update<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
      {
        status: asset.previousStatus ?? "uploaded",
        previousStatus: null,
        deletedAt: null,
        updatedAt: now,
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The asset changed before it could be restored.");
    }
    return updated;
  };

  const permanentlyDelete = async (input: {
    readonly tenantId: string;
    readonly assetId: string;
    readonly expectedRevision: number;
  }): Promise<MediaPermanentDeleteResult> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const asset = await getAnyAsset(input.tenantId, input.assetId);
    if (asset.status !== "deleted") {
      throw new MediaAssetConflictError(
        "An asset must be soft-deleted before permanent deletion.",
      );
    }
    const usages = await listUsage(input.tenantId, asset.id);
    if (usages.length > 0) {
      throw new MediaAssetConflictError("A referenced asset cannot be permanently deleted.");
    }
    const objects = new Map<string, MediaObjectReference>();
    objects.set(objectKey(asset.object), asset.object);
    for (const variant of asset.variants) {
      if (variant.object) {
        objects.set(objectKey(variant.object), variant.object);
      }
    }
    const deleted = await storage.delete<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
      makeStorageCondition(input.expectedRevision),
    );
    if (!deleted) {
      throw new MediaAssetConflictError(
        "The asset changed before it could be permanently deleted.",
      );
    }
    const objectDeletionFailures: {
      key: string;
      error: string;
    }[] = [];
    for (const object of objects.values()) {
      try {
        await objectStorage.deleteObject(object);
      } catch (error) {
        objectDeletionFailures.push({
          key: object.key,
          error:
            error instanceof Error ? error.message : "Object deletion failed.",
        });
      }
    }
    return { deleted: true, objectDeletionFailures };
  };

  const registerUsage = async (
    input: MediaUsageInput,
  ): Promise<MediaAssetUsage> => {
    await ready;
    assertTenantId(input.tenantId);
    assertStorageCapability(storage, "uniqueConstraints");
    const asset = await getActiveAsset(input.tenantId, input.assetId);
    for (const [field, value] of [
      ["resourceType", input.resourceType],
      ["resourceId", input.resourceId],
    ] as const) {
      if (typeof value !== "string" || value.trim() === "") {
        throw new MediaValidationError(`${field} must be a non-empty string.`);
      }
    }
    const fieldKey = input.fieldKey ?? "";
    if (typeof fieldKey !== "string") {
      throw new MediaValidationError("fieldKey must be a string.");
    }
    const existing = await storage.findOne<MediaAssetUsage>(
      MEDIA_ASSET_USAGES_COLLECTION,
      {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          assetId: { operator: "eq", value: asset.id },
          resourceType: { operator: "eq", value: input.resourceType },
          resourceId: { operator: "eq", value: input.resourceId },
          fieldKey: { operator: "eq", value: fieldKey },
        },
      },
    );
    if (existing) return existing;
    const now = getMediaNow(options.now);
    const insert: StorageInsert<MediaAssetUsage> = {
      id: createMediaId(options.idFactory, "usage"),
      tenantId: input.tenantId,
      assetId: asset.id,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      fieldKey,
      createdAt: now,
      updatedAt: now,
      createdBy: input.actorId ?? null,
      revision: 1,
    };
    const inserted = await storage.insert<MediaAssetUsage>(
      MEDIA_ASSET_USAGES_COLLECTION,
      insert,
    );
    const latestAsset = await storage.findById<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
    );
    if (
      !latestAsset ||
      latestAsset.tenantId !== input.tenantId ||
      latestAsset.status === "deleted"
    ) {
      await storage.delete<MediaAssetUsage>(
        MEDIA_ASSET_USAGES_COLLECTION,
        inserted.id,
        makeStorageCondition(inserted.revision),
      );
      throw new MediaAssetConflictError(
        "The asset changed before its usage could be registered.",
      );
    }
    return inserted;
  };

  const removeUsage = async (
    input: Omit<MediaUsageInput, "actorId">,
  ): Promise<number> => {
    await ready;
    assertTenantId(input.tenantId);
    if (typeof input.resourceType !== "string" || typeof input.resourceId !== "string") {
      throw new MediaValidationError("A usage requires resourceType and resourceId.");
    }
    return storage.deleteMany<MediaAssetUsage>(MEDIA_ASSET_USAGES_COLLECTION, {
      where: {
        tenantId: { operator: "eq", value: input.tenantId },
        assetId: { operator: "eq", value: input.assetId },
        resourceType: { operator: "eq", value: input.resourceType },
        resourceId: { operator: "eq", value: input.resourceId },
        fieldKey: { operator: "eq", value: input.fieldKey ?? "" },
      },
    });
  };

  return {
    ready,
    create,
    get,
    list,
    update,
    softDelete,
    restore,
    permanentlyDelete,
    registerUsage,
    removeUsage,
    listUsage,
  };
};

export type MediaObjectCleanupResult = {
  readonly examined: number;
  readonly deleted: number;
  readonly failures: readonly { readonly key: string; readonly error: string }[];
  readonly complete: boolean;
};

export const cleanupOrphanedMediaObjects = async (options: {
  readonly storage: StorageAdapter;
  readonly objectStorage: MediaObjectStorageAdapter;
  readonly olderThan: Date;
  readonly maxObjects?: number;
}): Promise<MediaObjectCleanupResult> => {
  if (!Number.isFinite(options.olderThan.getTime())) {
    throw new MediaValidationError("olderThan must be a valid date.");
  }
  const maxObjects = options.maxObjects ?? 500;
  if (!Number.isInteger(maxObjects) || maxObjects < 1 || maxObjects > 10_000) {
    throw new MediaValidationError("maxObjects must be an integer from 1 to 10000.");
  }
  await registerMediaCollections(options.storage);
  const assets = await options.storage.findMany<MediaAsset>(MEDIA_ASSETS_COLLECTION);
  const referenced = new Set<string>();
  for (const asset of assets) {
    referenced.add(objectKey(asset.object));
    for (const variant of asset.variants) {
      if (variant.object) referenced.add(objectKey(variant.object));
    }
  }

  let cursor: string | undefined;
  let examined = 0;
  let deleted = 0;
  let complete = true;
  const failures: { key: string; error: string }[] = [];
  while (examined < maxObjects) {
    const first = Math.min(100, maxObjects - examined);
    const page = await options.objectStorage.listObjects({
      first,
      olderThan: options.olderThan,
      ...(cursor ? { cursor } : {}),
    });
    if (page.items.length === 0) break;
    for (const item of page.items) {
      examined += 1;
      if (referenced.has(objectKey(item.object))) continue;
      try {
        if (await options.objectStorage.deleteObject(item.object)) deleted += 1;
      } catch (error) {
        failures.push({
          key: item.object.key,
          error: error instanceof Error ? error.message : "Object deletion failed.",
        });
      }
    }
    cursor = page.nextCursor ?? undefined;
    if (!cursor) break;
  }
  if (cursor) complete = false;
  return { examined, deleted, failures, complete };
};

export type ExpiredUploadCleanupResult = {
  readonly examined: number;
  readonly aborted: number;
  readonly failures: readonly { readonly sessionId: string; readonly error: string }[];
};

export const cleanupExpiredMediaUploads = async (options: {
  readonly objectStorage: MediaObjectStorageAdapter;
  readonly before: Date;
  readonly first?: number;
}): Promise<ExpiredUploadCleanupResult> => {
  const first = options.first ?? 100;
  if (!Number.isFinite(options.before.getTime())) {
    throw new MediaValidationError("before must be a valid date.");
  }
  if (!Number.isInteger(first) || first < 1 || first > 1000) {
    throw new MediaValidationError("first must be an integer from 1 to 1000.");
  }
  const sessions = await options.objectStorage.listExpiredUploadSessions(
    options.before,
    first,
  );
  let aborted = 0;
  const failures: { sessionId: string; error: string }[] = [];
  for (const session of sessions) {
    try {
      if (await options.objectStorage.abortUpload(session.id)) aborted += 1;
    } catch (error) {
      failures.push({
        sessionId: session.id,
        error: error instanceof Error ? error.message : "Upload cleanup failed.",
      });
    }
  }
  return { examined: sessions.length, aborted, failures };
};
