import { createMediaServer, MediaIdempotencyConflictError } from "../dist/media/server/index.js";

const clone = (value) => structuredClone(value);

export const createMediaFixture = (overrides = {}) => {
  const calls = {
    createUploadIntent: 0,
    completeUpload: 0,
    completedParts: null,
    abortUpload: 0,
    expiredSessionLists: 0,
    assetCreate: 0,
    assetList: [],
    assetPermanentDelete: 0,
    folderCreate: 0,
    objectDelete: 0,
    authorization: [],
    partTargetRequests: [],
    deletionGuard: 0,
  };
  const sessions = new Map();
  const storedObjects = new Map();
  const assetsById = new Map();
  let nextUpload = 0;
  let nextAsset = 0;
  let context = { actorId: "actor-a", tenantId: "tenant-a" };
  let allowed = true;
  let deletionGuard = async () => {};

  const objectStorage = {
    async createUploadIntent(input) {
      calls.createUploadIntent += 1;
      return createUploadSession(input, "single");
    },
    async createMultipartUpload(input) {
      calls.createUploadIntent += 1;
      return createUploadSession(input, "multipart", input.partSizeBytes);
    },
    async createMultipartPartTargets(id, partNumbers) {
      calls.partTargetRequests.push({ id, partNumbers: clone(partNumbers) });
      const record = sessions.get(id);
      if (!record) throw new Error("Missing test upload session.");
      return partNumbers.map((partNumber) => ({
        partNumber,
        url: `https://upload.example.test/${id}/part/${partNumber}?token=temporary`,
        method: "PUT",
        headers: { "content-type": record.input.contentType },
        expiresAt: record.session.expiresAt,
      }));
    },
    async getUploadSession(id) {
      const record = sessions.get(id);
      if (!record) return null;
      if (
        record.session.state === "pending" &&
        record.session.expiresAt.getTime() <= Date.now()
      ) {
        record.session = { ...record.session, state: "expired" };
      }
      return clone(record.session);
    },
    async listExpiredUploadSessions(before, first) {
      calls.expiredSessionLists += 1;
      return [...sessions.values()]
        .map((record) => record.session)
        .filter(
          (session) =>
            (session.state === "pending" || session.state === "expired") &&
            session.expiresAt.getTime() <= before.getTime(),
        )
        .slice(0, first)
        .map(clone);
    },
    async completeUpload(id, parts) {
      calls.completeUpload += 1;
      calls.completedParts = parts ? clone(parts) : undefined;
      const record = sessions.get(id);
      if (!record) throw new Error("Missing test upload session.");
      if (!record.stored) {
        const object = { key: `private-object-key-${id}`, versionId: `v-${id}` };
        record.stored = {
          object,
          tenantId: record.session.tenantId,
          mimeType: record.input.contentType,
          size: record.input.expectedSize,
          createdAt: new Date(),
        };
        record.session = { ...record.session, state: "completed" };
        storedObjects.set(object.key, record.stored);
      }
      return clone(record.stored);
    },
    async getObjectMetadata(object) {
      return clone(storedObjects.get(object.key) ?? null);
    },
    async abortUpload(id) {
      calls.abortUpload += 1;
      const record = sessions.get(id);
      if (!record || record.session.state === "completed" || record.session.state === "aborted") {
        return false;
      }
      record.session = { ...record.session, state: "aborted" };
      return true;
    },
    async createReadTarget(object) {
      return {
        url: `https://read.example.test/${encodeURIComponent(object.key)}?token=short-lived`,
        expiresAt: new Date(Date.now() + 60_000),
      };
    },
    async deleteObject(object) {
      calls.objectDelete += 1;
      return storedObjects.delete(object.key);
    },
  };

  function createUploadSession(input, mode, partSizeBytes) {
    const id = `upload-${++nextUpload}`;
    const expiresAt = new Date(Date.now() + 60_000);
    const session = {
      id,
      tenantId: input.tenantId,
      mode,
      state: "pending",
      expectedSize: input.expectedSize,
      ...(input.expectedChecksum ? { expectedChecksum: input.expectedChecksum } : {}),
      expiresAt,
      ...(mode === "single"
        ? {
            uploadTarget: {
              url: `https://upload.example.test/${id}?token=short-lived`,
              method: "PUT",
              headers: {
                "content-type": input.contentType,
                "x-upload-token": "short-lived",
              },
              expiresAt,
            },
          }
        : { partSizeBytes }),
    };
    sessions.set(id, { session, input });
    return clone(session);
  }

  const makeAsset = (input, id = input.id ?? `asset-${++nextAsset}`) => ({
    id,
    tenantId: input.tenantId ?? "tenant-a",
    folderId: input.folderId ?? null,
    originalName: input.originalName ?? "image.png",
    displayName: input.displayName ?? input.originalName ?? "image.png",
    kind: input.metadata?.kind ?? "image",
    mimeType: input.metadata?.mimeType ?? "image/png",
    size: input.metadata?.size ?? 4,
    ...(input.metadata?.checksum ? { checksum: input.metadata.checksum } : {}),
    object: input.object ?? { key: `private-object-key-${id}`, versionId: `v-${id}` },
    ...(input.metadata?.width !== undefined ? { width: input.metadata.width } : {}),
    ...(input.metadata?.height !== undefined ? { height: input.metadata.height } : {}),
    status: input.status ?? "uploaded",
    altText: input.altText ?? null,
    caption: input.caption ?? null,
    title: input.title ?? null,
    description: input.description ?? null,
    tags: input.tags ?? [],
    crop: input.crop ?? null,
    hotspots: input.hotspots ?? [],
    focalPoint: input.focalPoint ?? null,
    variants: input.variants ?? [],
    processingError: null,
    processingJobId: null,
    previousStatus: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: null,
    updatedBy: null,
    deletedAt: null,
    revision: input.revision ?? 1,
  });

  const assets = {
    ready: Promise.resolve(),
    async create(input) {
      calls.assetCreate += 1;
      const asset = makeAsset(input);
      assetsById.set(asset.id, asset);
      return clone(asset);
    },
    async get(tenantId, id) {
      const asset = assetsById.get(id);
      if (!asset || asset.tenantId !== tenantId) {
        const error = new Error("Not found");
        error.name = "MediaNotFoundError";
        throw error;
      }
      return clone(asset);
    },
    async list(input) {
      calls.assetList.push(clone(input));
      return { items: [], nextCursor: null };
    },
    async update(input) {
      const current = assetsById.get(input.assetId);
      const next = { ...current, ...input, revision: current.revision + 1 };
      assetsById.set(next.id, next);
      return clone(next);
    },
    async softDelete(input) {
      const current = assetsById.get(input.assetId);
      const next = { ...current, status: "deleted", revision: current.revision + 1 };
      assetsById.set(next.id, next);
      return clone(next);
    },
    async restore(input) {
      const current = assetsById.get(input.assetId);
      const next = { ...current, status: "uploaded", revision: current.revision + 1 };
      assetsById.set(next.id, next);
      return clone(next);
    },
    async permanentlyDelete(input) {
      calls.assetPermanentDelete += 1;
      const asset = assetsById.get(input.assetId);
      if (asset) await objectStorage.deleteObject(asset.object);
      return { deleted: true, objectDeletionFailures: [] };
    },
  };

  const folders = {
    ready: Promise.resolve(),
    async create(input) {
      calls.folderCreate += 1;
      return {
        id: "folder-test",
        tenantId: input.tenantId,
        parentId: input.parentId ?? null,
        name: input.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        revision: 1,
      };
    },
    async get(tenantId, id) {
      return {
        id,
        tenantId,
        parentId: null,
        name: "Images",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        revision: 1,
      };
    },
    async list() {
      return { items: [], nextCursor: null };
    },
    async rename(input) {
      return {
        id: input.folderId,
        tenantId: input.tenantId,
        parentId: null,
        name: input.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        revision: input.expectedRevision + 1,
      };
    },
    async move(input) {
      return {
        id: input.folderId,
        tenantId: input.tenantId,
        parentId: input.parentId,
        name: "Images",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        revision: input.expectedRevision + 1,
      };
    },
    async delete(input) {
      return {
        id: input.folderId,
        tenantId: input.tenantId,
        parentId: null,
        name: "Images",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        revision: input.expectedRevision + 1,
      };
    },
    async restore(input) {
      return {
        id: input.folderId,
        tenantId: input.tenantId,
        parentId: null,
        name: "Images",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        revision: input.expectedRevision + 1,
      };
    },
    async permanentlyDelete() {
      return true;
    },
  };

  const records = new Map();
  const idempotency = {
    async execute(input, operation) {
      const existing = records.get(input.key);
      if (existing) {
        if (existing.fingerprint !== input.fingerprint) {
          throw new MediaIdempotencyConflictError();
        }
        return { value: await existing.promise, replayed: true };
      }
      const entry = {
        fingerprint: input.fingerprint,
        promise: Promise.resolve().then(operation),
      };
      records.set(input.key, entry);
      try {
        const value = await entry.promise;
        return { value, replayed: false };
      } catch (error) {
        records.delete(input.key);
        throw error;
      }
    },
  };

  const server = createMediaServer({
    assets,
    folders,
    objectStorage,
    idempotency,
    resolveContext: async () => context,
    authorize: async (input) => {
      calls.authorization.push({
        action: input.action,
        tenantId: input.context.tenantId,
        resourceId: input.resourceId,
      });
      return allowed;
    },
    assertCanDeleteAsset: async (input) => {
      calls.deletionGuard += 1;
      return deletionGuard(input);
    },
    maxUploadBytes: 1024,
    allowedMimeTypes: ["image/png"],
    ...overrides,
  });

  return {
    server,
    assets,
    folders,
    objectStorage,
    calls,
    assetsById,
    sessions,
    setContext(value) {
      context = value;
    },
    setAllowed(value) {
      allowed = value;
    },
    setDeletionGuard(value) {
      deletionGuard = value;
    },
    addAsset(input) {
      const asset = makeAsset(input);
      assetsById.set(asset.id, asset);
      return clone(asset);
    },
  };
};

export const mediaRequest = (method, path, body, options = {}) => {
  const headers = new Headers(options.headers);
  if (body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Request(`https://app.example.test/api/media${path}`, {
    method,
    headers,
    ...(body !== undefined
      ? { body: typeof body === "string" ? body : JSON.stringify(body) }
      : {}),
  });
};
