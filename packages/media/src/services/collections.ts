import type { StorageAdapter } from "@puzzle-ui/storage";
import type {
  MediaAsset,
  MediaAssetUsage,
  MediaFolder,
} from "../types/media.types";

export const MEDIA_ASSETS_COLLECTION = "media_assets";
export const MEDIA_FOLDERS_COLLECTION = "media_folders";
export const MEDIA_ASSET_USAGES_COLLECTION = "media_asset_usages";
const registrations = new WeakMap<StorageAdapter, Promise<void>>();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isDate = (value: unknown): value is Date =>
  value instanceof Date && Number.isFinite(value.getTime());

const isStorageRecord = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.tenantId === "string" &&
  isDate(value.createdAt) &&
  isDate(value.updatedAt) &&
  Number.isInteger(value.revision);

const isMediaAssetRecord = (value: unknown): value is MediaAsset =>
  isStorageRecord(value) &&
  typeof value.originalName === "string" &&
  typeof value.displayName === "string" &&
  typeof value.mimeType === "string" &&
  Number.isSafeInteger(value.size) &&
  (value.focalPoint === null ||
    (isRecord(value.focalPoint) &&
      typeof value.focalPoint.x === "number" &&
      Number.isFinite(value.focalPoint.x) &&
      value.focalPoint.x >= 0 &&
      value.focalPoint.x <= 1 &&
      typeof value.focalPoint.y === "number" &&
      Number.isFinite(value.focalPoint.y) &&
      value.focalPoint.y >= 0 &&
      value.focalPoint.y <= 1)) &&
  typeof value.object === "object" &&
  value.object !== null &&
  typeof (value.object as { key?: unknown }).key === "string";

const isMediaFolderRecord = (value: unknown): value is MediaFolder =>
  isStorageRecord(value) &&
  typeof value.name === "string" &&
  (value.parentId === null || typeof value.parentId === "string");

const isMediaUsageRecord = (value: unknown): value is MediaAssetUsage =>
  isStorageRecord(value) &&
  typeof value.assetId === "string" &&
  typeof value.resourceType === "string" &&
  typeof value.resourceId === "string" &&
  typeof value.fieldKey === "string";

export const registerMediaCollections = async (
  storage: StorageAdapter,
): Promise<void> => {
  const existing = registrations.get(storage);
  if (existing) {
    await existing;
    return;
  }
  const registration = Promise.all([
    storage.registerCollection<MediaAsset>({
      name: MEDIA_ASSETS_COLLECTION,
      schema: { validate: isMediaAssetRecord },
      indexes: [
        { name: "by-tenant-folder", fields: ["tenantId", "folderId"] },
        { name: "by-tenant-status", fields: ["tenantId", "status"] },
        { name: "by-tenant-kind", fields: ["tenantId", "kind"] },
      ],
    }),
    storage.registerCollection<MediaFolder>({
      name: MEDIA_FOLDERS_COLLECTION,
      schema: { validate: isMediaFolderRecord },
      indexes: [
        {
          name: "unique-tenant-parent-name",
          fields: ["tenantId", "parentId", "name"],
          unique: true,
        },
      ],
    }),
    storage.registerCollection<MediaAssetUsage>({
      name: MEDIA_ASSET_USAGES_COLLECTION,
      schema: { validate: isMediaUsageRecord },
      indexes: [
        {
          name: "unique-asset-reference",
          fields: ["tenantId", "assetId", "resourceType", "resourceId", "fieldKey"],
          unique: true,
        },
        { name: "by-tenant-asset", fields: ["tenantId", "assetId"] },
      ],
    }),
  ]).then(() => undefined);
  registrations.set(storage, registration);
  try {
    await registration;
  } catch (error) {
    registrations.delete(storage);
    throw error;
  }
};
