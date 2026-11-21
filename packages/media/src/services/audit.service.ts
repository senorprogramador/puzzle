import type { StorageAdapter, StorageInsert, StorageRecord, StorageWhere } from "@puzzle-ui/storage";
import { MediaPermissionDeniedError, MediaValidationError } from "../errors/media.errors";
import { assertStorageCapability, assertTenantId, createMediaId, getMediaNow, type MediaServiceRuntime } from "./service-utils";

export const MEDIA_AUDIT_EVENTS_COLLECTION = "media_audit_events";

export type MediaAuditEventInput = {
  readonly tenantId: string;
  readonly actorId: string | null;
  readonly resource: "upload" | "asset" | "folder";
  readonly resourceId?: string;
  readonly relatedAssetId?: string;
  readonly action: string;
  readonly timestamp: Date;
  readonly result: "success" | "denied" | "failure";
};

export type MediaAuditRecord = StorageRecord & MediaAuditEventInput;

export type MediaAuditServiceOptions = {
  readonly storage: StorageAdapter;
  readonly authorize: (input: {
    readonly tenantId: string;
    readonly actorId: string;
    readonly action: "audit:read" | "audit:write";
  }) => boolean | Promise<boolean>;
} & MediaServiceRuntime;

export type MediaAuditListInput = {
  readonly tenantId: string;
  readonly actorId: string;
  readonly resource?: MediaAuditEventInput["resource"];
  readonly resourceId?: string;
  readonly result?: MediaAuditEventInput["result"];
  readonly first?: number;
  readonly after?: string;
};

export type MediaAuditService = {
  readonly ready: Promise<void>;
  record(input: { readonly event: MediaAuditEventInput; readonly actorId: string }): Promise<MediaAuditRecord>;
  list(input: MediaAuditListInput): Promise<{ readonly items: readonly MediaAuditRecord[]; readonly nextCursor: string | null }>;
};

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= 255 && !/[\u0000-\u001f\u007f]/.test(value);

const validResource = (value: unknown): value is MediaAuditEventInput["resource"] =>
  value === "upload" || value === "asset" || value === "folder";

const validResult = (value: unknown): value is MediaAuditEventInput["result"] =>
  value === "success" || value === "denied" || value === "failure";

const validEvent = (value: unknown): value is MediaAuditEventInput => {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Record<string, unknown>;
  return isText(event.tenantId) &&
    (event.actorId === null || isText(event.actorId)) &&
    validResource(event.resource) &&
    (event.resourceId === undefined || isText(event.resourceId)) &&
    (event.relatedAssetId === undefined || isText(event.relatedAssetId)) &&
    typeof event.action === "string" && /^[a-z][a-z-]*:[a-z][a-z-]*$/.test(event.action) &&
    event.action.length <= 120 &&
    event.timestamp instanceof Date && Number.isFinite(event.timestamp.getTime()) &&
    validResult(event.result);
};

const isAuditRecord = (value: unknown): value is MediaAuditRecord =>
  validEvent(value) && "id" in value && isText(value.id) &&
  "createdAt" in value && value.createdAt instanceof Date && Number.isFinite(value.createdAt.getTime()) &&
  "updatedAt" in value && value.updatedAt instanceof Date && Number.isFinite(value.updatedAt.getTime()) &&
  "revision" in value && Number.isInteger(value.revision) && typeof value.revision === "number" && value.revision > 0;

export const createMediaAuditService = (options: MediaAuditServiceOptions): MediaAuditService => {
  if (typeof options.authorize !== "function") {
    throw new TypeError("Media audit requires an authorization policy.");
  }
  const { storage } = options;
  const ready = storage.registerCollection<MediaAuditRecord>({
    name: MEDIA_AUDIT_EVENTS_COLLECTION,
    schema: { validate: isAuditRecord },
    indexes: [
      { name: "by-tenant-resource", fields: ["tenantId", "resource"] },
      { name: "by-tenant-result", fields: ["tenantId", "result"] },
    ],
  });
  const authorize = async (tenantId: string, actorId: string, action: "audit:read" | "audit:write") => {
    assertTenantId(tenantId);
    if (!isText(actorId)) throw new MediaValidationError("Audit actorId must be a non-empty identifier.");
    if (await options.authorize({ tenantId, actorId, action }) !== true) throw new MediaPermissionDeniedError();
  };
  return {
    ready,
    async record({ event, actorId }) {
      await ready;
      if (!validEvent(event)) throw new MediaValidationError("The media audit event is invalid.");
      await authorize(event.tenantId, actorId, "audit:write");
      const now = getMediaNow(options.now);
      const record: StorageInsert<MediaAuditRecord> = {
        id: createMediaId(options.idFactory, "media_audit"),
        tenantId: event.tenantId,
        actorId: event.actorId,
        resource: event.resource,
        ...(event.resourceId === undefined ? {} : { resourceId: event.resourceId }),
        ...(event.relatedAssetId === undefined ? {} : { relatedAssetId: event.relatedAssetId }),
        action: event.action,
        timestamp: event.timestamp,
        result: event.result,
        createdAt: now,
        updatedAt: now,
        revision: 1,
      };
      return storage.insert<MediaAuditRecord>(MEDIA_AUDIT_EVENTS_COLLECTION, record);
    },
    async list(input) {
      await ready;
      await authorize(input.tenantId, input.actorId, "audit:read");
      assertStorageCapability(storage, "cursorPagination");
      const first = input.first ?? 50;
      if (!Number.isInteger(first) || first < 1 || first > 100 ||
          (input.resource !== undefined && !validResource(input.resource)) ||
          (input.result !== undefined && !validResult(input.result)) ||
          (input.resourceId !== undefined && !isText(input.resourceId)) ||
          (input.after !== undefined && (typeof input.after !== "string" || input.after.length === 0 || input.after.length > 8192))) {
        throw new MediaValidationError("Invalid media audit query.");
      }
      const where: StorageWhere<MediaAuditRecord> = {
        tenantId: { operator: "eq", value: input.tenantId },
        ...(input.resource === undefined ? {} : { resource: { operator: "eq", value: input.resource } }),
        ...(input.resourceId === undefined ? {} : { resourceId: { operator: "eq", value: input.resourceId } }),
        ...(input.result === undefined ? {} : { result: { operator: "eq", value: input.result } }),
      };
      const page = await storage.findPage<MediaAuditRecord>(MEDIA_AUDIT_EVENTS_COLLECTION, {
        where, first, orderBy: [{ field: "id", direction: "asc" }],
        ...(input.after === undefined ? {} : { after: { value: input.after } }),
      });
      return { items: page.items, nextCursor: page.nextCursor?.value ?? null };
    },
  };
};
