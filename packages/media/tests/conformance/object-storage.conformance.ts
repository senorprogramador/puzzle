import { describe, expect, it } from "bun:test";
import {
  MediaChecksumMismatchError,
  type MediaObjectStorageAdapter,
} from "../../src";
import type { MediaObjectStorageConformanceFixture } from "./object-storage.fixture";

const sha256 = async (bytes: Uint8Array): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const completeSingle = async (
  fixture: MediaObjectStorageConformanceFixture,
  adapter: MediaObjectStorageAdapter,
  bytes: Uint8Array,
  expectedChecksum?: string,
): Promise<{ readonly session: Awaited<ReturnType<MediaObjectStorageAdapter["createUploadIntent"]>>; readonly object: Awaited<ReturnType<MediaObjectStorageAdapter["completeUpload"]>> }> => {
  const session = await adapter.createUploadIntent({
    tenantId: "tenant-a",
    fileName: "photo.png",
    contentType: "image/png",
    expectedSize: bytes.byteLength,
    ...(expectedChecksum
      ? {
          expectedChecksum: {
            algorithm: "sha256" as const,
            value: expectedChecksum,
          },
        }
      : {}),
    expiresInMs: 60_000,
  });
  await fixture.uploadSingle(adapter, session, bytes, "image/png");
  return { session, object: await adapter.completeUpload(session.id) };
};

export const runMediaObjectStorageConformance = (
  fixture: MediaObjectStorageConformanceFixture,
): void => {
  describe("media object storage conformance", () => {
    it("completes and idempotently returns a validated single upload", async () => {
      const adapter = await fixture.createAdapter();
      const bytes = new TextEncoder().encode("a valid image payload");
      const { session, object } = await completeSingle(
        fixture,
        adapter,
        bytes,
        await sha256(bytes),
      );
      expect(session.mode).toBe("single");
      expect(session.state).toBe("pending");
      expect(session.uploadTarget?.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(object.size).toBe(bytes.byteLength);
      expect(object.tenantId).toBe("tenant-a");
      expect(object.checksum?.value).toBe(await sha256(bytes));
      expect((await adapter.completeUpload(session.id)).object).toEqual(object.object);
      expect(await adapter.getObjectMetadata(object.object)).toEqual(object);

      const readTarget = await adapter.createReadTarget(object.object, 30_000);
      expect(readTarget.url).toBeTruthy();
      expect(readTarget.expiresAt.getTime()).toBeGreaterThan(Date.now());
      expect(await adapter.deleteObject(object.object)).toBe(true);
      expect(await adapter.deleteObject(object.object)).toBe(false);
    });

    it("rejects a checksum mismatch and aborts unfinished uploads", async () => {
      const adapter = await fixture.createAdapter();
      const bytes = new TextEncoder().encode("payload");
      const session = await adapter.createUploadIntent({
        tenantId: "tenant-a",
        fileName: "file.bin",
        contentType: "application/octet-stream",
        expectedSize: bytes.byteLength,
        expectedChecksum: {
          algorithm: "sha256",
          value: "0".repeat(64),
        },
        expiresInMs: 60_000,
      });
      await fixture.uploadSingle(
        adapter,
        session,
        bytes,
        "application/octet-stream",
      );
      await expect(adapter.completeUpload(session.id)).rejects.toBeInstanceOf(
        MediaChecksumMismatchError,
      );
      expect(await adapter.abortUpload(session.id)).toBe(true);
      expect((await adapter.getUploadSession(session.id))?.state).toBe("aborted");
      expect(await adapter.abortUpload(session.id)).toBe(false);
    });

    it("assembles ordered multipart parts and validates their ETags", async () => {
      const adapter = await fixture.createAdapter();
      const bytes = new TextEncoder().encode("multipart media bytes");
      const session = await adapter.createMultipartUpload({
        tenantId: "tenant-b",
        fileName: "movie.mp4",
        contentType: "video/mp4",
        expectedSize: bytes.byteLength,
        expectedChecksum: {
          algorithm: "sha256",
          value: await sha256(bytes),
        },
        expiresInMs: 60_000,
        partSizeBytes: 8,
      });
      const partCount = Math.ceil(bytes.byteLength / 8);
      const targets = await adapter.createMultipartPartTargets(
        session.id,
        Array.from({ length: partCount }, (_, index) => index + 1),
        30_000,
      );
      expect(targets).toHaveLength(partCount);
      const parts = await fixture.uploadMultipart(
        adapter,
        session,
        targets,
        bytes,
        "video/mp4",
      );
      const object = await adapter.completeUpload(session.id, parts);
      expect(object.size).toBe(bytes.byteLength);
      expect(object.checksum?.value).toBe(await sha256(bytes));
    });

    it("lists objects by stable cursor and reports expired upload sessions", async () => {
      const adapter = await fixture.createAdapter();
      const bytes = new TextEncoder().encode("object");
      const first = await completeSingle(fixture, adapter, bytes);
      const second = await completeSingle(fixture, adapter, bytes);
      const page1 = await adapter.listObjects({ first: 1 });
      expect(page1.items).toHaveLength(1);
      expect(page1.nextCursor).not.toBeNull();
      const page2 = await adapter.listObjects({
        first: 1,
        cursor: page1.nextCursor ?? undefined,
      });
      expect(page2.items).toHaveLength(1);
      expect(page2.items[0]?.object.key).not.toBe(page1.items[0]?.object.key);

      const expiring = await adapter.createUploadIntent({
        tenantId: "tenant-a",
        fileName: "abandoned.bin",
        contentType: "application/octet-stream",
        expiresInMs: 10,
      });
      const expired = await adapter.listExpiredUploadSessions(
        new Date(Date.now() + 60_000),
        10,
      );
      expect(expired.some((session) => session.id === expiring.id)).toBe(true);
      expect(first.object.object.key).not.toBe(second.object.object.key);
    });
  });
};
