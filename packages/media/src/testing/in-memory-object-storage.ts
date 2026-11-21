import {
  MediaAssetConflictError,
  MediaChecksumMismatchError,
  MediaNotFoundError,
  MediaObjectStorageError,
  MediaUploadExpiredError,
  MediaValidationError,
} from "../errors/media.errors";
import type {
  MediaChecksum,
  MediaObjectReference,
} from "../types/media.types";
import type {
  MediaMultipartCompletedPart,
  MediaMultipartPartTarget,
  MediaObjectListInput,
  MediaObjectPage,
  MediaObjectSummary,
  MediaObjectStorageAdapter,
  MediaReadTarget,
  MediaStoredObject,
  MediaUploadConstraints,
  MediaUploadSession,
  MediaUploadTarget,
} from "../types/object-storage.types";
import { normalizeMediaChecksum } from "../utils/media-validation";

type StoredPart = {
  readonly bytes: Uint8Array;
  readonly etag: string;
};

type InMemoryUpload = {
  session: MediaUploadSession;
  readonly constraints: MediaUploadConstraints;
  readonly object: MediaObjectReference;
  readonly partSizeBytes?: number;
  readonly parts: Map<number, StoredPart>;
  readonly issuedParts: Set<number>;
  bytes?: Uint8Array;
  storedObject?: MediaStoredObject;
};

export type InMemoryMediaObjectStorageOptions = {
  readonly idFactory?: () => string;
  readonly now?: () => Date;
  readonly maxSignedUrlTtlMs?: number;
};

const cloneBytes = (bytes: Uint8Array): Uint8Array => new Uint8Array(bytes);

const toHex = (value: ArrayBuffer): string =>
  [...new Uint8Array(value)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const checksumBytes = async (bytes: Uint8Array): Promise<MediaChecksum> => {
  if (!globalThis.crypto?.subtle) {
    throw new MediaObjectStorageError("Web Crypto is required by the test adapter.");
  }
  const input = new Uint8Array(bytes);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", input);
  return { algorithm: "sha256", value: toHex(digest) };
};

const validateConstraints = (input: MediaUploadConstraints): void => {
  if (typeof input.tenantId !== "string" || input.tenantId.trim() === "") {
    throw new MediaValidationError("tenantId must be a non-empty string.");
  }
  if (typeof input.fileName !== "string" || input.fileName.trim() === "") {
    throw new MediaValidationError("fileName must be a non-empty string.");
  }
  if (
    typeof input.contentType !== "string" ||
    !/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(input.contentType)
  ) {
    throw new MediaValidationError("contentType must be a valid MIME type.");
  }
  if (
    input.expectedSize !== undefined &&
    (!Number.isSafeInteger(input.expectedSize) || input.expectedSize < 1)
  ) {
    throw new MediaValidationError("expectedSize must be a positive safe integer.");
  }
  if (!Number.isInteger(input.expiresInMs) || input.expiresInMs < 1) {
    throw new MediaValidationError("expiresInMs must be a positive integer.");
  }
  if (input.expectedChecksum) normalizeMediaChecksum(input.expectedChecksum);
};

export class InMemoryMediaObjectStorageAdapter
  implements MediaObjectStorageAdapter
{
  private readonly uploads = new Map<string, InMemoryUpload>();
  private readonly objects = new Map<string, MediaStoredObject>();
  private readonly objectBytes = new Map<string, Uint8Array>();
  private nextId = 0;
  private readonly idFactory: () => string;
  private readonly now: () => Date;
  private readonly maxSignedUrlTtlMs: number;

  constructor(options: InMemoryMediaObjectStorageOptions = {}) {
    this.idFactory =
      options.idFactory ??
      (() => {
        this.nextId += 1;
        return `memory-${this.nextId}`;
      });
    this.now = options.now ?? (() => new Date());
    this.maxSignedUrlTtlMs = options.maxSignedUrlTtlMs ?? 15 * 60 * 1000;
  }

  async createUploadIntent(
    input: MediaUploadConstraints,
  ): Promise<MediaUploadSession> {
    validateConstraints(input);
    const now = this.validNow();
    const id = this.idFactory();
    const object = this.makeObjectReference(input);
    const expiresAt = new Date(now.getTime() + input.expiresInMs);
    const session: MediaUploadSession = {
      id,
      tenantId: input.tenantId,
      mode: "single",
      state: "pending",
      ...(input.expectedSize !== undefined
        ? { expectedSize: input.expectedSize }
        : {}),
      ...(input.expectedChecksum
        ? { expectedChecksum: normalizeMediaChecksum(input.expectedChecksum) }
        : {}),
      expiresAt,
      uploadTarget: this.makeTarget(id, input.expiresInMs, expiresAt),
    };
    this.uploads.set(id, {
      session,
      constraints: input,
      object,
      parts: new Map(),
      issuedParts: new Set(),
    });
    return session;
  }

  async createMultipartUpload(
    input: MediaUploadConstraints & { readonly partSizeBytes: number },
  ): Promise<MediaUploadSession> {
    validateConstraints(input);
    if (!Number.isSafeInteger(input.partSizeBytes) || input.partSizeBytes < 1) {
      throw new MediaValidationError("partSizeBytes must be a positive safe integer.");
    }
    if (input.expiresInMs > this.maxSignedUrlTtlMs) {
      throw new MediaValidationError("Upload target expiry exceeds the configured limit.");
    }
    const now = this.validNow();
    const id = this.idFactory();
    const object = this.makeObjectReference(input);
    const expiresAt = new Date(now.getTime() + input.expiresInMs);
    const session: MediaUploadSession = {
      id,
      tenantId: input.tenantId,
      mode: "multipart",
      state: "pending",
      ...(input.expectedSize !== undefined
        ? { expectedSize: input.expectedSize }
        : {}),
      ...(input.expectedChecksum
        ? { expectedChecksum: normalizeMediaChecksum(input.expectedChecksum) }
        : {}),
      expiresAt,
      partSizeBytes: input.partSizeBytes,
    };
    this.uploads.set(id, {
      session,
      constraints: input,
      object,
      partSizeBytes: input.partSizeBytes,
      parts: new Map(),
      issuedParts: new Set(),
    });
    return session;
  }

  async createMultipartPartTargets(
    sessionId: string,
    partNumbers: readonly number[],
    expiresInMs: number,
  ): Promise<readonly MediaMultipartPartTarget[]> {
    const upload = this.getPendingUpload(sessionId);
    if (upload.session.mode !== "multipart") {
      throw new MediaAssetConflictError("The upload session is not multipart.");
    }
    if (
      !Number.isInteger(expiresInMs) ||
      expiresInMs < 1 ||
      expiresInMs > this.maxSignedUrlTtlMs
    ) {
      throw new MediaValidationError("Part target expiry is outside the configured limit.");
    }
    if (partNumbers.length === 0) {
      throw new MediaValidationError("At least one multipart part target is required.");
    }
    const unique = new Set<number>();
    return partNumbers.map((partNumber) => {
      if (!Number.isInteger(partNumber) || partNumber < 1 || unique.has(partNumber)) {
        throw new MediaValidationError(
          "Multipart part numbers must be unique positive integers.",
        );
      }
      const expectedSize = upload.session.expectedSize;
      const partSize = upload.partSizeBytes ?? 0;
      if (
        expectedSize !== undefined &&
        partNumber > Math.ceil(expectedSize / partSize)
      ) {
        throw new MediaValidationError("A multipart part number exceeds the expected upload size.");
      }
      unique.add(partNumber);
      upload.issuedParts.add(partNumber);
      const expiresAt = new Date(
        Math.min(
          this.validNow().getTime() + expiresInMs,
          upload.session.expiresAt.getTime(),
        ),
      );
      return {
        partNumber,
        url: `memory://multipart/${encodeURIComponent(sessionId)}/${partNumber}`,
        method: "PUT",
        headers: { "content-type": upload.constraints.contentType },
        expiresAt,
      };
    });
  }

  async completeUpload(
    sessionId: string,
    parts?: readonly MediaMultipartCompletedPart[],
  ): Promise<MediaStoredObject> {
    const upload = this.findUpload(sessionId);
    if (!upload) throw new MediaNotFoundError("Upload session");
    if (upload.session.state === "completed" && upload.storedObject) {
      return upload.storedObject;
    }
    this.assertPendingAndUnexpired(upload);
    let bytes: Uint8Array;
    if (upload.session.mode === "single") {
      if (!upload.bytes) {
        throw new MediaAssetConflictError("The single upload has no uploaded bytes.");
      }
      bytes = upload.bytes;
    } else {
      bytes = this.collectMultipartBytes(upload, parts);
    }
    if (
      upload.constraints.expectedSize !== undefined &&
      bytes.byteLength !== upload.constraints.expectedSize
    ) {
      throw new MediaObjectStorageError(
        "The uploaded byte count does not match the declared size.",
        { details: { expectedSize: upload.constraints.expectedSize, actualSize: bytes.byteLength } },
      );
    }
    const checksum = await checksumBytes(bytes);
    if (
      upload.constraints.expectedChecksum &&
      checksum.value !==
        normalizeMediaChecksum(upload.constraints.expectedChecksum).value
    ) {
      throw new MediaChecksumMismatchError();
    }
    const createdAt = this.validNow();
    const stored: MediaStoredObject = {
      object: upload.object,
      tenantId: upload.session.tenantId,
      mimeType: upload.constraints.contentType.toLowerCase(),
      size: bytes.byteLength,
      checksum,
      createdAt,
    };
    upload.storedObject = stored;
    upload.session = { ...upload.session, state: "completed" };
    this.objects.set(this.refKey(upload.object), stored);
    this.objectBytes.set(this.refKey(upload.object), cloneBytes(bytes));
    return stored;
  }

  async abortUpload(sessionId: string): Promise<boolean> {
    const upload = this.findUpload(sessionId);
    if (!upload || upload.session.state === "completed" || upload.session.state === "aborted") {
      return false;
    }
    upload.session = { ...upload.session, state: "aborted" };
    upload.bytes = undefined;
    upload.parts.clear();
    upload.issuedParts.clear();
    return true;
  }

  async getUploadSession(sessionId: string): Promise<MediaUploadSession | null> {
    const upload = this.findUpload(sessionId);
    if (!upload) return null;
    if (
      upload.session.state === "pending" &&
      upload.session.expiresAt.getTime() <= this.validNow().getTime()
    ) {
      upload.session = { ...upload.session, state: "expired" };
    }
    return upload.session;
  }

  async getObjectMetadata(
    object: MediaObjectReference,
  ): Promise<MediaStoredObject | null> {
    return this.objects.get(this.refKey(object)) ?? null;
  }

  async createReadTarget(
    object: MediaObjectReference,
    expiresInMs: number,
  ): Promise<MediaReadTarget> {
    if (!this.objects.has(this.refKey(object))) {
      throw new MediaNotFoundError("Media object");
    }
    if (
      !Number.isInteger(expiresInMs) ||
      expiresInMs < 1 ||
      expiresInMs > this.maxSignedUrlTtlMs
    ) {
      throw new MediaValidationError("Read target expiry is outside the configured limit.");
    }
    return {
      url: `memory://read/${encodeURIComponent(object.key)}`,
      expiresAt: new Date(this.validNow().getTime() + expiresInMs),
    };
  }

  async deleteObject(object: MediaObjectReference): Promise<boolean> {
    const key = this.refKey(object);
    const existed = this.objects.delete(key);
    this.objectBytes.delete(key);
    return existed;
  }

  async listObjects(input: MediaObjectListInput): Promise<MediaObjectPage> {
    if (!Number.isInteger(input.first) || input.first < 1 || input.first > 1000) {
      throw new MediaValidationError("Object list first must be from 1 to 1000.");
    }
    if (
      input.olderThan !== undefined &&
      !Number.isFinite(input.olderThan.getTime())
    ) {
      throw new MediaValidationError("olderThan must be a valid date.");
    }
    const items = [...this.objects.values()]
      .filter(
        (item) =>
          input.olderThan === undefined ||
          item.createdAt.getTime() < input.olderThan.getTime(),
      )
      .sort((left, right) =>
        this.objectCursor(left.object).localeCompare(this.objectCursor(right.object)),
      );
    const cursor = input.cursor;
    const startIndex = cursor
      ? items.findIndex((item) => this.objectCursor(item.object) > cursor)
      : 0;
    const start = startIndex < 0 ? items.length : startIndex;
    const page = items.slice(start, start + input.first);
    const nextCursor =
      start + page.length < items.length
        ? (page.at(-1) ? this.objectCursor(page.at(-1)!.object) : null)
        : null;
    const summaries: MediaObjectSummary[] = page.map((item) => ({
      object: item.object,
      tenantId: item.tenantId,
      size: item.size,
      mimeType: item.mimeType,
      checksum: item.checksum,
      createdAt: item.createdAt,
    }));
    return { items: summaries, nextCursor };
  }

  async listExpiredUploadSessions(
    before: Date,
    first: number,
  ): Promise<readonly MediaUploadSession[]> {
    if (!Number.isInteger(first) || first < 1 || first > 1000) {
      throw new MediaValidationError("first must be from 1 to 1000.");
    }
    return [...this.uploads.values()]
      .filter(
        (upload) =>
          (upload.session.state === "pending" ||
            upload.session.state === "expired") &&
          upload.session.expiresAt.getTime() <= before.getTime(),
      )
      .sort(
        (left, right) =>
          left.session.expiresAt.getTime() - right.session.expiresAt.getTime(),
      )
      .slice(0, first)
      .map((upload) => upload.session);
  }

  async writeForTesting(
    sessionId: string,
    bytes: Uint8Array,
    contentType: string,
  ): Promise<void> {
    const upload = this.getPendingUpload(sessionId);
    if (upload.session.mode !== "single") {
      throw new MediaAssetConflictError("The upload session is multipart.");
    }
    this.assertContentType(upload, contentType);
    upload.bytes = cloneBytes(bytes);
  }

  async writePartForTesting(
    sessionId: string,
    partNumber: number,
    bytes: Uint8Array,
  ): Promise<MediaMultipartCompletedPart> {
    const upload = this.getPendingUpload(sessionId);
    if (upload.session.mode !== "multipart") {
      throw new MediaAssetConflictError("The upload session is not multipart.");
    }
    if (!Number.isInteger(partNumber) || partNumber < 1) {
      throw new MediaValidationError("partNumber must be a positive integer.");
    }
    if (!upload.issuedParts.has(partNumber)) {
      throw new MediaAssetConflictError(
        "A multipart part cannot be uploaded without an issued part target.",
      );
    }
    const partSize = upload.partSizeBytes ?? 0;
    if (bytes.byteLength < 1 || bytes.byteLength > partSize) {
      throw new MediaValidationError("Multipart part size is outside the configured range.");
    }
    if (
      upload.session.expectedSize !== undefined &&
      partNumber < Math.ceil(upload.session.expectedSize / (upload.partSizeBytes ?? 1)) &&
      bytes.byteLength !== upload.partSizeBytes
    ) {
      throw new MediaValidationError("All non-final multipart parts must have partSizeBytes.");
    }
    const copy = cloneBytes(bytes);
    const etag = (await checksumBytes(copy)).value;
    upload.parts.set(partNumber, { bytes: copy, etag });
    return { partNumber, etag };
  }

  getBytesForTesting(object: MediaObjectReference): Uint8Array | null {
    const bytes = this.objectBytes.get(this.refKey(object));
    return bytes ? cloneBytes(bytes) : null;
  }

  reset(): void {
    this.uploads.clear();
    this.objects.clear();
    this.objectBytes.clear();
    this.nextId = 0;
  }

  private findUpload(sessionId: string): InMemoryUpload | undefined {
    return this.uploads.get(sessionId);
  }

  private getPendingUpload(sessionId: string): InMemoryUpload {
    const upload = this.findUpload(sessionId);
    if (!upload) throw new MediaNotFoundError("Upload session");
    this.assertPendingAndUnexpired(upload);
    return upload;
  }

  private assertPendingAndUnexpired(upload: InMemoryUpload): void {
    if (upload.session.state === "aborted") {
      throw new MediaAssetConflictError("The upload session was aborted.");
    }
    if (upload.session.state === "completed") {
      throw new MediaAssetConflictError("The upload session is already complete.");
    }
    if (upload.session.expiresAt.getTime() <= this.validNow().getTime()) {
      upload.session = { ...upload.session, state: "expired" };
      throw new MediaUploadExpiredError();
    }
    if (upload.session.state === "expired") {
      throw new MediaUploadExpiredError();
    }
  }

  private collectMultipartBytes(
    upload: InMemoryUpload,
    completedParts: readonly MediaMultipartCompletedPart[] | undefined,
  ): Uint8Array {
    if (!completedParts?.length) {
      throw new MediaAssetConflictError(
        "Multipart completion requires the uploaded part numbers and ETags.",
      );
    }
    const sorted = [...completedParts].sort(
      (left, right) => left.partNumber - right.partNumber,
    );
    if (
      sorted.some(
        (part, index) =>
          part.partNumber !== index + 1 ||
          upload.parts.get(part.partNumber)?.etag !== part.etag,
      )
    ) {
      throw new MediaAssetConflictError(
        "Multipart completion parts do not match the uploaded parts.",
      );
    }
    const partSize = upload.partSizeBytes ?? 0;
    if (
      sorted.some(
        (part, index) =>
          index < sorted.length - 1 &&
          upload.parts.get(part.partNumber)?.bytes.byteLength !== partSize,
      )
    ) {
      throw new MediaAssetConflictError(
        "Every multipart part except the final part must use the configured part size.",
      );
    }
    const length = sorted.reduce(
      (sum, part) => sum + (upload.parts.get(part.partNumber)?.bytes.length ?? 0),
      0,
    );
    const result = new Uint8Array(length);
    let offset = 0;
    for (const part of sorted) {
      const bytes = upload.parts.get(part.partNumber)?.bytes;
      if (!bytes) throw new MediaAssetConflictError("A multipart part is missing.");
      result.set(bytes, offset);
      offset += bytes.length;
    }
    return result;
  }

  private assertContentType(upload: InMemoryUpload, contentType: string): void {
    if (contentType.toLowerCase() !== upload.constraints.contentType.toLowerCase()) {
      throw new MediaValidationError("Uploaded MIME type differs from the upload intent.");
    }
  }

  private makeObjectReference(input: MediaUploadConstraints): MediaObjectReference {
    const objectPrefix = input.objectPrefix?.replace(/^\/+|\/+$/g, "");
    if (
      objectPrefix !== undefined &&
      (objectPrefix === "" ||
        objectPrefix.split("/").some((segment) => segment === "." || segment === "..") ||
        /[\u0000-\u001f\u007f]/.test(objectPrefix))
    ) {
      throw new MediaValidationError("objectPrefix must be a safe relative key prefix.");
    }
    const prefix = objectPrefix ? `${objectPrefix}/` : "";
    return {
      key: `${prefix}${encodeURIComponent(input.tenantId)}/${this.idFactory()}`,
    };
  }

  private makeTarget(
    sessionId: string,
    expiresInMs: number,
    expiresAt: Date,
  ): MediaUploadTarget {
    if (expiresInMs > this.maxSignedUrlTtlMs) {
      throw new MediaValidationError("Upload target expiry exceeds the configured limit.");
    }
    return {
      url: `memory://upload/${encodeURIComponent(sessionId)}`,
      method: "PUT",
      headers: {},
      expiresAt,
    };
  }

  private refKey(object: MediaObjectReference): string {
    return `${object.key}\u0000${object.versionId ?? ""}`;
  }

  private objectCursor(object: MediaObjectReference): string {
    return this.refKey(object);
  }

  private validNow(): Date {
    const now = this.now();
    if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
      throw new MediaValidationError("The configured clock returned an invalid date.");
    }
    return now;
  }
}
