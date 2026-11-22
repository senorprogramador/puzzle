import {
  MediaAssetConflictError,
  MediaChecksumMismatchError,
  MediaNotFoundError,
  MediaObjectStorageError,
  MediaUploadExpiredError,
  type MediaMultipartCompletedPart,
  type MediaMultipartPartTarget,
  type MediaObjectListInput,
  type MediaObjectPage,
  type MediaObjectReference,
  type MediaObjectStorageAdapter,
  type MediaReadTarget,
  type MediaStoredObject,
  type MediaUploadConstraints,
  type MediaUploadSession,
} from "@puzzle-ui/media";
import {
  CloudflareMediaConfigurationError,
  CloudflareMediaProviderError,
} from "./errors";
import type {
  CloudflareMediaBucketTarget,
  CloudflareMediaMetadataStore,
  CloudflareR2MediaObjectStorageOptions,
  CloudflareUploadRecord,
  R2BucketLike,
  R2MultipartPart,
  R2MultipartUploadLike,
} from "./types";
import {
  checksumEquals,
  createTenantObjectKey,
  cursorForObject,
  normalizeReference,
  sha256,
  validateExpiry,
  validatePositiveInteger,
  validateTenantId,
  validateUploadConstraints,
} from "./utils";

type UploadRecord = CloudflareUploadRecord;

const defaultMaxTtl = 15 * 60 * 1000;
const defaultPageSize = 1000;

const asTarget = (
  target: Awaited<ReturnType<CloudflareMediaBucketTarget["signer"]["signUpload"]>>,
  expiresAt: Date,
): {
  readonly url: string;
  readonly method: "PUT";
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: Date;
} => ({
  url: target.url,
  method: "PUT",
  headers: target.headers ?? {},
  expiresAt,
});

const providerError = (message: string, cause: unknown): CloudflareMediaProviderError =>
  new CloudflareMediaProviderError(message, cause);

export class CloudflareR2MediaObjectStorageAdapter
  implements MediaObjectStorageAdapter
{
  private readonly bucketSource: CloudflareR2MediaObjectStorageOptions["bucket"];
  private readonly metadataStore: CloudflareMediaMetadataStore;
  private readonly tenantId?: string;
  private readonly bucketName?: string;
  private readonly idFactory: () => string;
  private readonly now: () => Date;
  private readonly maxSignedUrlTtlMs: number;
  private readonly maxListPageSize: number;
  private nextId = 0;

  constructor(options: CloudflareR2MediaObjectStorageOptions) {
    this.bucketSource = options.bucket;
    this.metadataStore = options.metadataStore;
    this.tenantId = options.tenantId ? validateTenantId(options.tenantId) : undefined;
    this.bucketName = options.bucketName;
    this.now = options.now ?? (() => new Date());
    this.maxSignedUrlTtlMs = options.maxSignedUrlTtlMs ?? defaultMaxTtl;
    this.maxListPageSize = options.maxListPageSize ?? defaultPageSize;
    validatePositiveInteger(this.maxSignedUrlTtlMs, "maxSignedUrlTtlMs");
    validatePositiveInteger(this.maxListPageSize, "maxListPageSize");
    this.idFactory =
      options.idFactory ??
      (() => {
        this.nextId += 1;
        return `r2-${this.nextId}`;
      });
  }

  async createUploadIntent(input: MediaUploadConstraints): Promise<MediaUploadSession> {
    const constraints = this.prepareConstraints(input);
    const id = this.idFactory();
    const expiresAt = this.expiry(constraints.expiresInMs);
    const target = await this.getBucketTarget(constraints.tenantId);
    const key = createTenantObjectKey(
      constraints.tenantId,
      id,
      constraints.fileName,
      constraints.objectPrefix,
    );
    const signed = await target.signer.signUpload({
      tenantId: constraints.tenantId,
      key,
      contentType: constraints.contentType,
      expiresAt,
      ...(constraints.expectedSize !== undefined
        ? { expectedSize: constraints.expectedSize }
        : {}),
    });
    const uploadTarget = asTarget(signed, expiresAt);
    const session: MediaUploadSession = {
      id,
      tenantId: constraints.tenantId,
      mode: "single",
      state: "pending",
      ...(constraints.expectedSize !== undefined
        ? { expectedSize: constraints.expectedSize }
        : {}),
      ...(constraints.expectedChecksum
        ? { expectedChecksum: constraints.expectedChecksum }
        : {}),
      expiresAt,
      uploadTarget: {
        ...uploadTarget,
        headers: {
          ...uploadTarget.headers,
          "content-type": constraints.contentType,
        },
      },
    };
    await this.metadataStore.saveUpload({
      session,
      tenantId: constraints.tenantId,
      key,
      contentType: constraints.contentType,
      fileName: constraints.fileName,
    });
    return session;
  }

  async createMultipartUpload(
    input: MediaUploadConstraints & { readonly partSizeBytes: number },
  ): Promise<MediaUploadSession> {
    const constraints = this.prepareConstraints(input);
    validatePositiveInteger(input.partSizeBytes, "partSizeBytes");
    const id = this.idFactory();
    const expiresAt = this.expiry(constraints.expiresInMs);
    const target = await this.getBucketTarget(constraints.tenantId);
    if (!target.bucket.createMultipartUpload) {
      throw new CloudflareMediaConfigurationError(
        "The configured R2 bucket does not expose multipart upload support.",
      );
    }
    const key = createTenantObjectKey(
      constraints.tenantId,
      id,
      constraints.fileName,
      constraints.objectPrefix,
    );
    let multipart: R2MultipartUploadLike;
    try {
      multipart = await target.bucket.createMultipartUpload(key, {
        httpMetadata: { contentType: constraints.contentType },
      });
    } catch (error) {
      throw providerError("Unable to create the R2 multipart upload.", error);
    }
    if (!multipart.uploadId) {
      throw new CloudflareMediaConfigurationError(
        "The R2 multipart binding did not return an upload ID.",
      );
    }
    const session: MediaUploadSession = {
      id,
      tenantId: constraints.tenantId,
      mode: "multipart",
      state: "pending",
      ...(constraints.expectedSize !== undefined
        ? { expectedSize: constraints.expectedSize }
        : {}),
      ...(constraints.expectedChecksum
        ? { expectedChecksum: constraints.expectedChecksum }
        : {}),
      expiresAt,
      partSizeBytes: input.partSizeBytes,
    };
    await this.metadataStore.saveUpload({
      session,
      tenantId: constraints.tenantId,
      key,
      contentType: constraints.contentType,
      fileName: constraints.fileName,
      uploadId: multipart.uploadId,
      partSizeBytes: input.partSizeBytes,
    });
    return session;
  }

  async createMultipartPartTargets(
    sessionId: string,
    partNumbers: readonly number[],
    expiresInMs: number,
  ): Promise<readonly MediaMultipartPartTarget[]> {
    const upload = await this.requireUpload(sessionId);
    this.assertPending(upload);
    if (upload.session.mode !== "multipart" || !upload.uploadId || !upload.partSizeBytes) {
      throw new MediaAssetConflictError("The upload session is not multipart.");
    }
    validateExpiry(expiresInMs, "expiresInMs", this.maxSignedUrlTtlMs);
    if (partNumbers.length === 0) {
      throw new MediaObjectStorageError("At least one multipart part target is required.");
    }
    const unique = new Set<number>();
    const maxPart =
      upload.session.expectedSize === undefined
        ? Number.MAX_SAFE_INTEGER
        : Math.ceil(upload.session.expectedSize / upload.partSizeBytes);
    const target = await this.getBucketTarget(upload.tenantId);
    return Promise.all(
      partNumbers.map(async (partNumber) => {
        if (
          !Number.isSafeInteger(partNumber) ||
          partNumber < 1 ||
          partNumber > maxPart ||
          unique.has(partNumber)
        ) {
          throw new MediaObjectStorageError(
            "Multipart part numbers must be unique positive integers within the expected upload.",
          );
        }
        unique.add(partNumber);
        const expiresAt = new Date(
          Math.min(this.now().getTime() + expiresInMs, upload.session.expiresAt.getTime()),
        );
        const signed = await target.signer.signMultipartPart({
          tenantId: upload.tenantId,
          key: upload.key,
          uploadId: upload.uploadId!,
          partNumber,
          expiresAt,
        });
        return {
          partNumber,
          url: signed.url,
          method: "PUT" as const,
          headers: signed.headers ?? {},
          expiresAt,
        };
      }),
    );
  }

  async completeUpload(
    sessionId: string,
    parts?: readonly MediaMultipartCompletedPart[],
  ): Promise<MediaStoredObject> {
    const upload = await this.requireUpload(sessionId);
    if (upload.session.state === "completed") {
      const object = await this.metadataStore.getObject(upload.key, upload.tenantId);
      if (object) return object.object;
      throw new MediaNotFoundError("Completed media object");
    }
    this.assertPending(upload);
    const target = await this.getBucketTarget(upload.tenantId);
    if (upload.session.mode === "multipart") {
      await this.completeMultipart(target.bucket, upload, parts);
    }
    const object = await this.readStoredObject(target.bucket, upload);
    if (
      upload.session.expectedSize !== undefined &&
      object.size !== upload.session.expectedSize
    ) {
      throw new MediaObjectStorageError(
        "The uploaded byte count does not match the declared size.",
        {
          details: {
            expectedSize: upload.session.expectedSize,
            actualSize: object.size,
          },
        },
      );
    }
    if (
      upload.session.expectedChecksum &&
      !checksumEquals(object.checksum!, upload.session.expectedChecksum)
    ) {
      throw new MediaChecksumMismatchError();
    }
    await this.metadataStore.saveObject({ key: upload.key, object });
    await this.metadataStore.updateUpload(sessionId, {
      session: { ...upload.session, state: "completed" },
    });
    return object;
  }

  async abortUpload(sessionId: string): Promise<boolean> {
    const upload = await this.findUpload(sessionId);
    if (
      !upload ||
      upload.session.state === "completed" ||
      upload.session.state === "aborted"
    ) {
      return false;
    }
    const target = await this.getBucketTarget(upload.tenantId);
    if (upload.session.mode === "multipart" && upload.uploadId) {
      const multipart = this.resumeMultipart(target.bucket, upload);
      if (multipart) {
        try {
          await multipart.abort();
        } catch (error) {
          throw providerError("Unable to abort the R2 multipart upload.", error);
        }
      }
    } else {
      await target.bucket.delete(upload.key);
    }
    await this.metadataStore.updateUpload(sessionId, {
      session: { ...upload.session, state: "aborted" },
    });
    return true;
  }

  async getUploadSession(sessionId: string): Promise<MediaUploadSession | null> {
    const upload = await this.findUpload(sessionId);
    if (!upload) return null;
    if (
      upload.session.state === "pending" &&
      upload.session.expiresAt.getTime() <= this.now().getTime()
    ) {
      const updated = await this.metadataStore.updateUpload(sessionId, {
        session: { ...upload.session, state: "expired" },
      });
      return updated?.session ?? { ...upload.session, state: "expired" };
    }
    return upload.session;
  }

  async getObjectMetadata(
    object: MediaObjectReference,
  ): Promise<MediaStoredObject | null> {
    const reference = normalizeReference(object);
    const record = await this.metadataStore.getObject(reference.key, this.tenantId);
    if (!record || record.object.object.versionId !== reference.versionId) return null;
    const target = await this.getBucketTarget(record.object.tenantId);
    if (!(await target.bucket.head(record.key))) return null;
    return record.object;
  }

  async createReadTarget(
    object: MediaObjectReference,
    expiresInMs: number,
  ): Promise<MediaReadTarget> {
    const reference = normalizeReference(object);
    validateExpiry(expiresInMs, "expiresInMs", this.maxSignedUrlTtlMs);
    const record = await this.metadataStore.getObject(reference.key, this.tenantId);
    if (!record || record.object.object.versionId !== reference.versionId) {
      throw new MediaNotFoundError("Media object");
    }
    const target = await this.getBucketTarget(record.object.tenantId);
    if (!(await target.bucket.head(record.key))) {
      throw new MediaNotFoundError("Media object");
    }
    const expiresAt = this.expiry(expiresInMs);
    const signed = await target.signer.signRead({
      tenantId: record.object.tenantId,
      key: record.key,
      expiresAt,
    });
    return { url: signed.url, expiresAt };
  }

  async deleteObject(object: MediaObjectReference): Promise<boolean> {
    const reference = normalizeReference(object);
    const record = await this.metadataStore.getObject(reference.key, this.tenantId);
    if (!record || record.object.object.versionId !== reference.versionId) return false;
    const target = await this.getBucketTarget(record.object.tenantId);
    try {
      await target.bucket.delete(record.key);
    } catch (error) {
      throw providerError("Unable to delete the R2 object.", error);
    }
    return this.metadataStore.deleteObject(record.key, record.object.tenantId);
  }

  async listObjects(input: MediaObjectListInput): Promise<MediaObjectPage> {
    validatePositiveInteger(input.first, "first");
    if (input.first > this.maxListPageSize) {
      throw new MediaObjectStorageError("Object list page exceeds the configured limit.");
    }
    if (input.olderThan && !Number.isFinite(input.olderThan.getTime())) {
      throw new MediaObjectStorageError("olderThan must be a valid date.");
    }
    const records = await this.metadataStore.listObjects({
      first: input.first + 1,
      ...(input.cursor ? { cursor: decodeCursor(input.cursor) } : {}),
      ...(input.olderThan ? { olderThan: input.olderThan } : {}),
      ...(this.tenantId ? { tenantId: this.tenantId } : {}),
    });
    const pageRecords = records.slice(0, input.first);
    const items = pageRecords.map((record) => ({
      object: record.object.object,
      tenantId: record.object.tenantId,
      size: record.object.size,
      mimeType: record.object.mimeType,
      ...(record.object.checksum ? { checksum: record.object.checksum } : {}),
      createdAt: record.object.createdAt,
    }));
    return {
      items,
      nextCursor:
        records.length > input.first && pageRecords.at(-1)
          ? cursorForObject(pageRecords.at(-1)!.key)
          : null,
    };
  }

  async listExpiredUploadSessions(
    before: Date,
    first: number,
  ): Promise<readonly MediaUploadSession[]> {
    if (!Number.isFinite(before.getTime())) {
      throw new MediaObjectStorageError("before must be a valid date.");
    }
    validatePositiveInteger(first, "first");
    if (first > this.maxListPageSize) {
      throw new MediaObjectStorageError("Expired upload page exceeds the configured limit.");
    }
    const records = await this.metadataStore.listExpiredUploads(
      before,
      first,
      this.tenantId,
    );
    return records.map((record) => record.session);
  }

  /** Test/local-development helper that bypasses presigned HTTP delivery. */
  async putForTesting(
    sessionId: string,
    bytes: Uint8Array,
    contentType: string,
  ): Promise<void> {
    const upload = await this.requireUpload(sessionId);
    this.assertPending(upload);
    if (upload.session.mode !== "single") {
      throw new MediaAssetConflictError("The upload session is multipart.");
    }
    const target = await this.getBucketTarget(upload.tenantId);
    await target.bucket.put(upload.key, bytes, {
      httpMetadata: { contentType: contentType.toLowerCase() },
    });
  }

  /** Test/local-development helper that bypasses presigned HTTP delivery. */
  async putPartForTesting(
    sessionId: string,
    partNumber: number,
    bytes: Uint8Array,
  ): Promise<MediaMultipartCompletedPart> {
    const upload = await this.requireUpload(sessionId);
    this.assertPending(upload);
    if (upload.session.mode !== "multipart" || !upload.uploadId) {
      throw new MediaAssetConflictError("The upload session is not multipart.");
    }
    const target = await this.getBucketTarget(upload.tenantId);
    const multipart = this.resumeMultipart(target.bucket, upload);
    if (!multipart) {
      throw new CloudflareMediaConfigurationError(
        "The configured R2 bucket cannot resume multipart uploads.",
      );
    }
    if (!Number.isSafeInteger(partNumber) || partNumber < 1) {
      throw new MediaObjectStorageError("partNumber must be a positive safe integer.");
    }
    const result = await multipart.uploadPart(partNumber, bytes);
    return { partNumber, etag: result.etag };
  }

  private prepareConstraints(input: MediaUploadConstraints): MediaUploadConstraints {
    const constraints = validateUploadConstraints(input);
    if (this.tenantId && constraints.tenantId !== this.tenantId) {
      throw new MediaObjectStorageError("The upload tenant is outside this adapter scope.");
    }
    validateExpiry(constraints.expiresInMs, "expiresInMs", this.maxSignedUrlTtlMs);
    return constraints;
  }

  private expiry(ttl: number): Date {
    return new Date(this.now().getTime() + ttl);
  }

  private async getBucketTarget(tenantId: string): Promise<CloudflareMediaBucketTarget> {
    const source = this.bucketSource;
    if (typeof source === "function") {
      return source({ tenantId, ...(this.bucketName ? { bucketName: this.bucketName } : {}) });
    }
    if ("resolve" in source) {
      return source.resolve({
        tenantId,
        ...(this.bucketName ? { bucketName: this.bucketName } : {}),
      });
    }
    return source;
  }

  private async findUpload(sessionId: string): Promise<UploadRecord | null> {
    const record = await this.metadataStore.getUpload(sessionId);
    if (!record || (this.tenantId && record.tenantId !== this.tenantId)) return null;
    return record;
  }

  private async requireUpload(sessionId: string): Promise<UploadRecord> {
    const upload = await this.findUpload(sessionId);
    if (!upload) throw new MediaNotFoundError("Upload session");
    return upload;
  }

  private assertPending(upload: UploadRecord): void {
    if (upload.session.state === "completed") {
      throw new MediaAssetConflictError("The upload session is already completed.");
    }
    if (upload.session.state === "aborted") {
      throw new MediaAssetConflictError("The upload session has been aborted.");
    }
    if (
      upload.session.state === "expired" ||
      upload.session.expiresAt.getTime() <= this.now().getTime()
    ) {
      void this.metadataStore.updateUpload(upload.session.id, {
        session: { ...upload.session, state: "expired" },
      });
      throw new MediaUploadExpiredError();
    }
  }

  private resumeMultipart(
    bucket: R2BucketLike,
    upload: UploadRecord,
  ): R2MultipartUploadLike | null {
    if (!upload.uploadId || !bucket.resumeMultipartUpload) return null;
    return bucket.resumeMultipartUpload(upload.key, upload.uploadId);
  }

  private async completeMultipart(
    bucket: R2BucketLike,
    upload: UploadRecord,
    parts: readonly MediaMultipartCompletedPart[] | undefined,
  ): Promise<void> {
    const multipart = this.resumeMultipart(bucket, upload);
    if (!multipart) {
      throw new CloudflareMediaConfigurationError(
        "The configured R2 bucket cannot resume multipart uploads.",
      );
    }
    let completed = parts;
    if (!completed && multipart.listParts) {
      completed = await multipart.listParts();
    }
    if (!completed || completed.length === 0) {
      throw new MediaAssetConflictError("Multipart completion requires uploaded parts.");
    }
    const seen = new Set<number>();
    const normalized: R2MultipartPart[] = [...completed]
      .sort((left, right) => left.partNumber - right.partNumber)
      .map((part) => {
        if (
          !Number.isSafeInteger(part.partNumber) ||
          part.partNumber < 1 ||
          seen.has(part.partNumber) ||
          typeof part.etag !== "string" ||
          part.etag.trim() === ""
        ) {
          throw new MediaObjectStorageError("Multipart parts must have unique numbers and ETags.");
        }
        seen.add(part.partNumber);
        return { partNumber: part.partNumber, etag: part.etag };
      });
    try {
      await multipart.complete(normalized);
    } catch (error) {
      throw providerError("Unable to complete the R2 multipart upload.", error);
    }
  }

  private async readStoredObject(
    bucket: R2BucketLike,
    upload: UploadRecord,
  ): Promise<MediaStoredObject> {
    let head;
    try {
      head = await bucket.head(upload.key);
    } catch (error) {
      throw providerError("Unable to read R2 object metadata.", error);
    }
    if (!head) throw new MediaNotFoundError("Uploaded media object");
    let body;
    try {
      const object = await bucket.get(upload.key);
      if (!object) throw new MediaNotFoundError("Uploaded media object");
      body = new Uint8Array(await object.arrayBuffer());
    } catch (error) {
      if (error instanceof MediaNotFoundError) throw error;
      throw providerError("Unable to read the uploaded R2 object.", error);
    }
    if (head.size !== body.byteLength) {
      throw new MediaObjectStorageError(
        "The R2 metadata size does not match the downloaded object.",
        { details: { metadataSize: head.size, actualSize: body.byteLength } },
      );
    }
    const checksum = await sha256(body);
    return {
      object: { key: upload.key },
      tenantId: upload.tenantId,
      mimeType: (
        head.httpMetadata?.contentType ??
        upload.contentType
      ).toLowerCase(),
      size: body.byteLength,
      checksum,
      createdAt: head.uploaded ?? this.now(),
    };
  }
}

const decodeCursor = (cursor: string): string => {
  try {
    return decodeURIComponent(cursor);
  } catch {
    throw new MediaObjectStorageError("Object list cursor is invalid.");
  }
};
