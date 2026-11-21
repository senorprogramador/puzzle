import { describe, expect, it } from "bun:test";
import {
  createMediaAuditService,
  MediaPermissionDeniedError,
  MediaValidationError,
  type MediaAuditEventInput,
} from "../src";
import { MemoryStorageAdapter } from "./helpers/memory-storage-adapter";

const event = (tenantId: string, resourceId: string): MediaAuditEventInput => ({
  tenantId,
  actorId: "editor",
  resource: "asset",
  resourceId,
  action: "asset:update",
  timestamp: new Date("2026-01-01T00:00:00.000Z"),
  result: "success",
});

describe("media audit service", () => {
  it("persists sanitized events with tenant-scoped filters and cursor pagination", async () => {
    const storage = new MemoryStorageAdapter();
    let id = 0;
    const options = {
      storage,
      idFactory: () => `audit-${++id}`,
      authorize: ({ actorId }: { actorId: string }) => actorId === "auditor",
    };
    const audit = createMediaAuditService(options);
    const withExtra = { ...event("tenant-a", "asset-1"), secret: "must-not-persist" };
    const stored = await audit.record({ event: withExtra, actorId: "auditor" });
    expect(JSON.stringify(stored)).not.toContain("must-not-persist");
    await audit.record({ event: event("tenant-a", "asset-2"), actorId: "auditor" });
    await audit.record({ event: event("tenant-b", "asset-1"), actorId: "auditor" });
    const restarted = createMediaAuditService(options);
    const first = await restarted.list({ tenantId: "tenant-a", actorId: "auditor", first: 1 });
    expect(first.items.map((item) => item.resourceId)).toEqual(["asset-1"]);
    expect(first.nextCursor).not.toBeNull();
    const second = await restarted.list({ tenantId: "tenant-a", actorId: "auditor", first: 1, after: first.nextCursor! });
    expect(second.items.map((item) => item.resourceId)).toEqual(["asset-2"]);
    const filtered = await restarted.list({ tenantId: "tenant-a", actorId: "auditor", resource: "asset", resourceId: "asset-1" });
    expect(filtered.items).toHaveLength(1);
    expect((await restarted.list({ tenantId: "tenant-b", actorId: "auditor" })).items).toHaveLength(1);
  });

  it("requires explicit authorization and rejects malformed events and queries", async () => {
    const audit = createMediaAuditService({
      storage: new MemoryStorageAdapter(),
      authorize: () => false,
    });
    await expect(audit.record({ event: event("tenant-a", "asset-1"), actorId: "editor" })).rejects.toBeInstanceOf(MediaPermissionDeniedError);
    await expect(audit.list({ tenantId: "tenant-a", actorId: "editor" })).rejects.toBeInstanceOf(MediaPermissionDeniedError);
    const allowed = createMediaAuditService({ storage: new MemoryStorageAdapter(), authorize: () => true });
    await expect(allowed.record({ event: { ...event("tenant-a", "asset-1"), timestamp: new Date(NaN) }, actorId: "worker" })).rejects.toBeInstanceOf(MediaValidationError);
    await expect(allowed.list({ tenantId: "tenant-a", actorId: "auditor", first: 101 })).rejects.toBeInstanceOf(MediaValidationError);
  });
});
