import type { StorageAdapter, StorageInsert } from "@puzzle-ui/storage";
import {
  MediaAssetConflictError,
  MediaNotFoundError,
  MediaValidationError,
} from "../errors/media.errors";
import type { MediaFolder } from "../types/media.types";
import { MEDIA_ASSETS_COLLECTION, MEDIA_FOLDERS_COLLECTION, registerMediaCollections } from "./collections";
import {
  assertConditionalWrites,
  assertTenantId,
  createMediaId,
  getMediaNow,
  makeStorageCondition,
  normalizeDisplayName,
  assertStorageCapability,
  type MediaServiceRuntime,
} from "./service-utils";

export type MediaFolderCreateInput = {
  readonly tenantId: string;
  readonly parentId?: string | null;
  readonly name: string;
  readonly actorId?: string | null;
};

export type MediaFolderPageInput = {
  readonly tenantId: string;
  readonly parentId?: string | null;
  readonly first?: number;
  readonly after?: string;
};

export type MediaFolderPage = {
  readonly items: readonly MediaFolder[];
  readonly nextCursor: string | null;
};

export type MediaFolderMutationInput = {
  readonly tenantId: string;
  readonly folderId: string;
  readonly expectedRevision: number;
  readonly actorId?: string | null;
};

export type MediaFolderService = {
  readonly ready: Promise<void>;
  create(input: MediaFolderCreateInput): Promise<MediaFolder>;
  get(tenantId: string, folderId: string): Promise<MediaFolder>;
  list(input: MediaFolderPageInput): Promise<MediaFolderPage>;
  rename(
    input: MediaFolderMutationInput & { readonly name: string },
  ): Promise<MediaFolder>;
  move(
    input: MediaFolderMutationInput & { readonly parentId: string | null },
  ): Promise<MediaFolder>;
  delete(input: MediaFolderMutationInput): Promise<MediaFolder>;
  restore(input: MediaFolderMutationInput): Promise<MediaFolder>;
  permanentlyDelete(input: MediaFolderMutationInput): Promise<boolean>;
};

export type MediaFolderServiceOptions = {
  readonly storage: StorageAdapter;
} & MediaServiceRuntime;

const validatePageSize = (first: number | undefined): number => {
  const value = first ?? 50;
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new MediaValidationError("first must be an integer from 1 to 100.");
  }
  return value;
};

export const createMediaFolderService = (
  options: MediaFolderServiceOptions,
): MediaFolderService => {
  const { storage } = options;
  const ready = registerMediaCollections(storage);

  const getActiveFolder = async (
    tenantId: string,
    folderId: string,
  ): Promise<MediaFolder> => {
    assertTenantId(tenantId);
    const folder = await storage.findById<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folderId,
    );
    if (!folder || folder.tenantId !== tenantId || folder.deletedAt) {
      throw new MediaNotFoundError("Media folder");
    }
    return folder;
  };

  const ensureParent = async (
    tenantId: string,
    parentId: string | null,
  ): Promise<void> => {
    if (parentId !== null) {
      await getActiveFolder(tenantId, parentId);
    }
  };

  const ensureSiblingNameAvailable = async (
    tenantId: string,
    parentId: string | null,
    name: string,
    exceptId?: string,
  ): Promise<void> => {
    assertStorageCapability(storage, "uniqueConstraints");
    const existing = await storage.findOne<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      {
        where: {
          tenantId: { operator: "eq", value: tenantId },
          parentId: { operator: "eq", value: parentId },
          name: { operator: "eq", value: name },
          deletedAt: { operator: "eq", value: null },
        },
      },
    );
    if (existing && existing.id !== exceptId) {
      throw new MediaAssetConflictError(
        "A folder with this name already exists in the selected parent.",
      );
    }
  };

  const get = async (
    tenantId: string,
    folderId: string,
  ): Promise<MediaFolder> => {
    await ready;
    return getActiveFolder(tenantId, folderId);
  };

  const create = async (
    input: MediaFolderCreateInput,
  ): Promise<MediaFolder> => {
    await ready;
    assertTenantId(input.tenantId);
    const name = normalizeDisplayName(input.name);
    const parentId = input.parentId ?? null;
    await ensureParent(input.tenantId, parentId);
    await ensureSiblingNameAvailable(input.tenantId, parentId, name);
    const now = getMediaNow(options.now);
    const insert: StorageInsert<MediaFolder> = {
      id: createMediaId(options.idFactory, "folder"),
      tenantId: input.tenantId,
      parentId,
      name,
      createdAt: now,
      updatedAt: now,
      createdBy: input.actorId ?? null,
      updatedBy: input.actorId ?? null,
      deletedAt: null,
      revision: 1,
    };
    const folder = await storage.insert<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      insert,
    );
    if (parentId !== null) {
      try {
        await ensureParent(input.tenantId, parentId);
      } catch {
        await storage.delete<MediaFolder>(
          MEDIA_FOLDERS_COLLECTION,
          folder.id,
          makeStorageCondition(folder.revision),
        );
        throw new MediaAssetConflictError(
          "The parent folder changed while the folder was being created.",
        );
      }
    }
    return folder;
  };

  const list = async (
    input: MediaFolderPageInput,
  ): Promise<MediaFolderPage> => {
    await ready;
    assertTenantId(input.tenantId);
    assertStorageCapability(storage, "cursorPagination");
    const first = validatePageSize(input.first);
    const page = await storage.findPage<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          parentId: { operator: "eq", value: input.parentId ?? null },
          deletedAt: { operator: "eq", value: null },
        },
        orderBy: [{ field: "name", direction: "asc" }],
        first,
        ...(input.after ? { after: { value: input.after } } : {}),
      },
    );
    return {
      items: page.items,
      nextCursor: page.nextCursor?.value ?? null,
    };
  };

  const rename = async (
    input: MediaFolderMutationInput & { readonly name: string },
  ): Promise<MediaFolder> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const folder = await getActiveFolder(input.tenantId, input.folderId);
    const name = normalizeDisplayName(input.name);
    await ensureSiblingNameAvailable(
      input.tenantId,
      folder.parentId,
      name,
      folder.id,
    );
    const updated = await storage.update<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folder.id,
      {
        name,
        updatedAt: getMediaNow(options.now),
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The folder changed before it could be renamed.");
    }
    return updated;
  };

  const move = async (
    input: MediaFolderMutationInput & { readonly parentId: string | null },
  ): Promise<MediaFolder> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const folder = await getActiveFolder(input.tenantId, input.folderId);
    await ensureParent(input.tenantId, input.parentId);
    await ensureSiblingNameAvailable(
      input.tenantId,
      input.parentId,
      folder.name,
      folder.id,
    );

    let ancestorId = input.parentId;
    const visited = new Set<string>();
    while (ancestorId !== null) {
      if (ancestorId === folder.id) {
        throw new MediaAssetConflictError("A folder cannot be moved into itself or a descendant.");
      }
      if (visited.has(ancestorId)) {
        throw new MediaAssetConflictError("The folder hierarchy contains a cycle.");
      }
      visited.add(ancestorId);
      ancestorId = (await getActiveFolder(input.tenantId, ancestorId)).parentId;
    }

    const updated = await storage.update<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folder.id,
      {
        parentId: input.parentId,
        updatedAt: getMediaNow(options.now),
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The folder changed before it could be moved.");
    }
    if (input.parentId !== null) {
      try {
        await ensureParent(input.tenantId, input.parentId);
      } catch {
        await storage.update<MediaFolder>(
          MEDIA_FOLDERS_COLLECTION,
          folder.id,
          {
            parentId: folder.parentId,
            updatedAt: getMediaNow(options.now),
            updatedBy: input.actorId ?? null,
          },
          makeStorageCondition(updated.revision),
        );
        throw new MediaAssetConflictError(
          "The destination folder changed while the folder was being moved.",
        );
      }
    }
    return updated;
  };

  const deleteFolder = async (
    input: MediaFolderMutationInput,
  ): Promise<MediaFolder> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const folder = await getActiveFolder(input.tenantId, input.folderId);
    const [children, assets] = await Promise.all([
      storage.findOne<MediaFolder>(MEDIA_FOLDERS_COLLECTION, {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          parentId: { operator: "eq", value: folder.id },
        },
      }),
      storage.findOne<import("../types/media.types").MediaAsset>(MEDIA_ASSETS_COLLECTION, {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          folderId: { operator: "eq", value: folder.id },
        },
      }),
    ]);
    if (children || assets) {
      throw new MediaAssetConflictError(
        "A non-empty folder cannot be deleted. Move its children and assets first.",
      );
    }
    const now = getMediaNow(options.now);
    const updated = await storage.update<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folder.id,
      {
        deletedAt: now,
        updatedAt: now,
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The folder changed before it could be deleted.");
    }
    const [racedChild, racedAsset] = await Promise.all([
      storage.findOne<MediaFolder>(MEDIA_FOLDERS_COLLECTION, {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          parentId: { operator: "eq", value: folder.id },
        },
      }),
      storage.findOne<import("../types/media.types").MediaAsset>(
        MEDIA_ASSETS_COLLECTION,
        {
          where: {
            tenantId: { operator: "eq", value: input.tenantId },
            folderId: { operator: "eq", value: folder.id },
          },
        },
      ),
    ]);
    if (racedChild || racedAsset) {
      const restored = await storage.update<MediaFolder>(
        MEDIA_FOLDERS_COLLECTION,
        folder.id,
        {
          deletedAt: null,
          updatedAt: getMediaNow(options.now),
          updatedBy: input.actorId ?? null,
        },
        makeStorageCondition(updated.revision),
      );
      if (!restored) {
        throw new MediaAssetConflictError(
          "The folder changed while its contents were being moved.",
        );
      }
      throw new MediaAssetConflictError(
        "A folder containing child folders or assets cannot be deleted.",
      );
    }
    return updated;
  };

  const restore = async (
    input: MediaFolderMutationInput,
  ): Promise<MediaFolder> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const folder = await storage.findById<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      input.folderId,
    );
    if (!folder || folder.tenantId !== input.tenantId || !folder.deletedAt) {
      throw new MediaNotFoundError("Deleted media folder");
    }
    await ensureParent(input.tenantId, folder.parentId);
    await ensureSiblingNameAvailable(input.tenantId, folder.parentId, folder.name);
    const updated = await storage.update<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folder.id,
      {
        deletedAt: null,
        updatedAt: getMediaNow(options.now),
        updatedBy: input.actorId ?? null,
      },
      makeStorageCondition(input.expectedRevision),
    );
    if (!updated) {
      throw new MediaAssetConflictError("The folder changed before it could be restored.");
    }
    return updated;
  };

  const permanentlyDelete = async (
    input: MediaFolderMutationInput,
  ): Promise<boolean> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    const folder = await storage.findById<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      input.folderId,
    );
    if (!folder || folder.tenantId !== input.tenantId || !folder.deletedAt) {
      throw new MediaNotFoundError("Deleted media folder");
    }
    const [children, assets] = await Promise.all([
      storage.findOne<MediaFolder>(MEDIA_FOLDERS_COLLECTION, {
        where: {
          tenantId: { operator: "eq", value: input.tenantId },
          parentId: { operator: "eq", value: folder.id },
        },
      }),
      storage.findOne<import("../types/media.types").MediaAsset>(
        MEDIA_ASSETS_COLLECTION,
        {
          where: {
            tenantId: { operator: "eq", value: input.tenantId },
            folderId: { operator: "eq", value: folder.id },
          },
        },
      ),
    ]);
    if (children || assets) {
      throw new MediaAssetConflictError(
        "A folder with child folders or assets cannot be permanently deleted.",
      );
    }
    const deleted = await storage.delete<MediaFolder>(
      MEDIA_FOLDERS_COLLECTION,
      folder.id,
      makeStorageCondition(input.expectedRevision),
    );
    if (!deleted) {
      throw new MediaAssetConflictError(
        "The folder changed before it could be permanently deleted.",
      );
    }
    return true;
  };

  return {
    ready,
    create,
    get,
    list,
    rename,
    move,
    delete: deleteFolder,
    restore,
    permanentlyDelete,
  };
};
