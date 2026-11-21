import {
  InvalidMediaFileError,
  MediaAssetConflictError,
  MediaCapabilityError,
  MediaChecksumMismatchError,
  MediaNotFoundError,
  MediaObjectStorageError,
  MediaPermissionDeniedError,
  MediaQuotaExceededError,
  MediaUploadExpiredError,
  MediaValidationError,
  UnsupportedMediaError,
  cleanupExpiredMediaUploads,
  normalizeMediaChecksum,
  normalizeMediaCrop,
  normalizeMediaFocalPoint,
  normalizeMediaHotspots,
  normalizeMediaTags,
  validateMediaFileMetadata,
  validateMediaImageProfiles,
  validateMediaVideoProfiles,
} from "@puzzle-ui/media";
import type {
  MediaAsset,
  MediaAuditEventInput,
  MediaAssetService,
  MediaChecksum,
  MediaFolder,
  MediaFolderService,
  MediaImageProfile,
  MediaKind,
  MediaObjectReference,
  MediaObjectStorageAdapter,
  MediaProcessingJob,
  MediaProcessingProfile,
  MediaProcessingService,
  MediaStoredObject,
  MediaUploadTarget as MediaStorageUploadTarget,
  MediaUploadSession,
  MediaVideoRenditionProfile,
} from "@puzzle-ui/media";
import type {
  MediaApiAsset,
  MediaApiError,
  MediaApiErrorCode,
  MediaApiFolder,
  MediaAssetListInput,
  MediaAssetPage,
  MediaAssetUpdateInput,
  MediaCompleteUploadInput,
  MediaFinalizeUploadInput,
  MediaFolderCreateInput,
  MediaFolderListInput,
  MediaFolderPage,
  MediaFolderUpdateInput,
  MediaPermanentDeleteResult,
  MediaProcessingStatus,
  MediaRevisionInput,
  MediaSignedReadTarget,
  MediaUploadIntent,
  MediaUploadIntentInput,
  MediaUploadPartCompletion,
  MediaUploadPartTarget,
  MediaUploadStatus,
  MediaUploadTarget as MediaApiUploadTarget,
} from "../shared";

export type MediaPermission =
  | "upload:create"
  | "upload:read"
  | "upload:part-targets"
  | "upload:complete"
  | "upload:abort"
  | "asset:list"
  | "asset:read"
  | "asset:update"
  | "asset:delete"
  | "asset:restore"
  | "asset:purge"
  | "asset:read-url"
  | "asset:process"
  | "folder:list"
  | "folder:read"
  | "folder:create"
  | "folder:update"
  | "folder:delete"
  | "folder:restore"
  | "folder:purge"
  | "service:readiness";

export type MediaRequestContext = {
  readonly actorId: string;
  readonly tenantId: string;
};

export type MediaAuthorizationInput = {
  readonly context: MediaRequestContext;
  readonly action: MediaPermission;
  readonly request: Request;
  readonly resourceId?: string;
};

export type MediaAuditEvent = MediaAuditEventInput;

export type MediaRateLimitDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly retryAfterSeconds?: number };

export type MediaRateLimit = (
  input: MediaAuthorizationInput,
) => Promise<MediaRateLimitDecision>;

export type MediaTenantQuotaInput = {
  readonly context: MediaRequestContext;
  readonly action: "upload:create";
  readonly request: Request;
  readonly requestedBytes: number;
  readonly mimeType: string;
};

export type MediaReadinessCheck = () => Promise<void>;

export type MediaReadinessState =
  | "ready"
  | "unavailable"
  | "unverified"
  | "not-configured";

export type MediaReadinessResult = {
  readonly ready: boolean;
  readonly dependencies: {
    readonly metadataStorage: MediaReadinessState;
    readonly objectStorage: MediaReadinessState;
    readonly queue: MediaReadinessState;
    readonly processor: MediaReadinessState;
  };
};

export type MediaCleanupHookInput = {
  readonly now: Date;
  readonly batchSize: number;
};

export type MediaCleanupHookResult = {
  readonly examined: number;
  readonly cleaned: number;
  readonly failed: number;
};

export type MediaCleanupHook = (
  input: MediaCleanupHookInput,
) => Promise<MediaCleanupHookResult>;

export type MediaCleanupResult = {
  readonly expiredUploads: {
    readonly examined: number;
    readonly aborted: number;
    readonly failed: number;
  };
  readonly storage?: MediaCleanupHookResult;
  readonly objectStorage?: MediaCleanupHookResult;
  readonly queue?: MediaCleanupHookResult;
  readonly processor?: MediaCleanupHookResult;
};

export type MediaCleanupOptions = {
  readonly now?: Date;
  readonly batchSize?: number;
};

export type MediaAssetDeletionGuardInput = {
  readonly asset: MediaAsset;
  readonly context: MediaRequestContext;
  readonly request: Request;
};

export type MediaUploadContentValidationInput = {
  readonly context: MediaRequestContext;
  readonly request: Request;
  readonly object: MediaStoredObject;
  readonly kind: MediaKind;
};

export type MediaIdempotencyInput = {
  /** Unique operation key. The server scopes this to the resolved tenant. */
  readonly key: string;
  /** Stable representation of the normalized, validated operation input. */
  readonly fingerprint: string;
};

export type MediaIdempotencyResult<T> = {
  readonly value: T;
  readonly replayed: boolean;
};

/**
 * Supply a durable, atomic implementation. It must serialize concurrent calls
 * for a key, reject a different fingerprint, and retain only the operation
 * result—not upload targets, provider credentials, or object references.
 * Failed operations must release their reservation so they can be retried.
 */
export interface MediaIdempotencyStore {
  execute<T>(
    input: MediaIdempotencyInput,
    operation: () => Promise<T>,
  ): Promise<MediaIdempotencyResult<T>>;
}

export class MediaIdempotencyConflictError extends Error {
  constructor() {
    super("The idempotency key was already used with different input.");
    this.name = "MediaIdempotencyConflictError";
  }
}

export type MediaServerOptions = {
  readonly basePath?: string;
  readonly assets: MediaAssetService;
  readonly folders: MediaFolderService;
  readonly objectStorage: MediaObjectStorageAdapter;
  readonly idempotency: MediaIdempotencyStore;
  readonly resolveContext: (
    request: Request,
  ) => Promise<MediaRequestContext | null>;
  readonly authorize: (
    input: MediaAuthorizationInput,
  ) => Promise<boolean>;
  /** Receives sanitized mutation and signed-target outcomes after trusted context resolution. */
  readonly onAudit?: (event: MediaAuditEvent) => Promise<void>;
  /** Runs after authorization; a denied decision returns 429 with Retry-After. */
  readonly rateLimit?: MediaRateLimit;
  /** Runs for upload intent; `false` or MediaQuotaExceededError returns 413. */
  readonly assertTenantQuota?: (
    input: MediaTenantQuotaInput,
  ) => Promise<void | boolean>;
  /**
   * Inspect the completed object's actual bytes before asset creation. Return
   * true only when its content is acceptable for the reported MIME type. The
   * host must ensure the inspected object reference remains immutable. Without
   * this callback, Fullstack does not verify file signatures.
   */
  readonly verifyUploadedContent?: (
    input: MediaUploadContentValidationInput,
  ) => Promise<boolean>;
  /** Missing probes for configured dependencies make readiness unverified. */
  readonly readiness?: {
    readonly metadataStorage?: MediaReadinessCheck;
    readonly objectStorage?: MediaReadinessCheck;
    readonly queue?: MediaReadinessCheck;
    readonly processor?: MediaReadinessCheck;
  };
  /** Host cleanup callbacks run alongside expired upload-session cleanup. */
  readonly cleanup?: {
    readonly storage?: MediaCleanupHook;
    readonly objectStorage?: MediaCleanupHook;
    readonly queue?: MediaCleanupHook;
    readonly processor?: MediaCleanupHook;
  };
  /**
   * Must reject permanent deletion while any host-owned reference (including
   * CMS usages) still points at the asset. This runs before object deletion.
   */
  readonly assertCanDeleteAsset: (
    input: MediaAssetDeletionGuardInput,
  ) => Promise<void | boolean>;
  readonly maxUploadBytes?: number;
  readonly allowedMimeTypes?: readonly string[];
  readonly uploadExpiresInMs?: number;
  readonly readExpiresInMs?: number;
  readonly maxImagePixels?: number;
  readonly multipart?: {
    readonly thresholdBytes: number;
    readonly partSizeBytes: number;
    readonly maxParts?: number;
    readonly maxPartTargetsPerRequest?: number;
  };
  readonly processing?: MediaProcessingService;
  readonly resolveProcessingProfiles?: (
    asset: MediaAsset,
  ) => Promise<readonly MediaProcessingProfile[]>;
};

export type MediaHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type MediaRouteHandler = (
  request: Request,
  params: Readonly<Record<string, string>>,
) => Promise<Response>;

export type MediaRouteHandlerMap = Readonly<
  Record<
    string,
    Readonly<Partial<Record<MediaHttpMethod, MediaRouteHandler>>>
  >
>;

export type MediaServer = {
  readonly routes: MediaRouteHandlerMap;
  initialize(): Promise<void>;
  readiness(): Promise<MediaReadinessResult>;
  cleanup(options?: MediaCleanupOptions): Promise<MediaCleanupResult>;
  dispatch(request: Request): Promise<Response>;
};

type OperationResult = {
  readonly body: unknown;
  readonly status?: number;
};

type Operation = (
  request: Request,
  params: Readonly<Record<string, string>>,
  context: MediaRequestContext,
) => Promise<OperationResult>;

type OperationOptions = {
  readonly action: MediaPermission;
  readonly resourceParam?: string;
};

const auditedMediaActions = new Set<MediaPermission>([
  "upload:create", "upload:part-targets", "upload:complete", "upload:abort",
  "asset:update", "asset:delete", "asset:restore", "asset:purge",
  "asset:read-url", "asset:process",
  "folder:create", "folder:update", "folder:delete", "folder:restore", "folder:purge",
]);

class MediaHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: MediaApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "MediaHttpError";
  }
}

class MediaRateLimitError extends Error {
  constructor(readonly retryAfterSeconds?: number) {
    super("The media request rate limit was exceeded.");
    this.name = "MediaRateLimitError";
  }
}

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
} as const;

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...noStoreHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const isSafeCapabilityUrl = (value: unknown): value is string => {
    if (typeof value !== "string" || value.length > 8192) return false;
    try {
      const url = new URL(value);
      return (
        (url.protocol === "https:" ||
          url.protocol === "http:" ||
          url.protocol === "memory:") &&
        url.username === "" &&
        url.password === ""
      );
    } catch {
      return false;
    }
  };

  const serializeUploadTarget = (
    target: MediaStorageUploadTarget,
    sessionExpiresAt: Date,
  ): MediaApiUploadTarget => {
    const now = Date.now();
    if (
      !isSafeCapabilityUrl(target.url) ||
      target.method !== "PUT" ||
      !(target.expiresAt instanceof Date) ||
      target.expiresAt.getTime() <= now ||
      target.expiresAt.getTime() > sessionExpiresAt.getTime() ||
      !isRecord(target.headers) ||
      Object.keys(target.headers).length > 50
    ) {
      throw new MediaCapabilityError("safe-upload-target");
    }
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(target.headers)) {
      if (
        !/^[!#$%&'*+.^_`|~0-9a-z-]+$/i.test(name) ||
        typeof value !== "string" ||
        value.length > 8192 ||
        /[\r\n]/.test(value) ||
        ["cookie", "set-cookie"].includes(name.toLowerCase())
      ) {
        continue;
      }
      headers[name] = value;
    }
    return {
      url: target.url,
      method: "PUT",
      headers,
      expiresAt: toIso(target.expiresAt),
    };
  };

const emptyResponse = (status: number, headers: HeadersInit = {}): Response =>
  new Response(null, {
    status,
    headers: { ...noStoreHeaders, ...Object.fromEntries(new Headers(headers)) },
  });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOwn = (value: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(value, key);

const isValidId = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim() !== "" &&
  value.length <= 256 &&
  !/[\u0000-\u001f\u007f/\\]/.test(value);

const validId = (value: unknown, field: string): string => {
  if (!isValidId(value)) {
    throw new MediaHttpError(400, "INVALID_REQUEST", `${field} is invalid.`);
  }
  return value;
};

const validText = (
  value: unknown,
  field: string,
  maxLength: number,
  options: { readonly nullable?: boolean; readonly allowEmpty?: boolean } = {},
): string | null => {
  if (value === null && options.nullable) return null;
  if (
    typeof value !== "string" ||
    value.length > maxLength ||
    (!options.allowEmpty && value.trim() === "") ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  ) {
    throw new MediaHttpError(400, "INVALID_REQUEST", `${field} is invalid.`);
  }
  return value;
};

const optionalText = (
  input: Record<string, unknown>,
  field: string,
  maxLength = 500,
): string | undefined | null => {
  if (!hasOwn(input, field)) return undefined;
  return validText(input[field], field, maxLength, {
    nullable: true,
    allowEmpty: true,
  });
};

const positiveInteger = (
  value: unknown,
  field: string,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  if (!Number.isSafeInteger(value) || (value as number) < 1 || (value as number) > max) {
    throw new MediaHttpError(400, "INVALID_REQUEST", `${field} is invalid.`);
  }
  return value as number;
};

const expectedRevision = (value: unknown): number =>
  positiveInteger(value, "expectedRevision");

const parseJson = async (
  request: Request,
  maxBytes = 64 * 1024,
): Promise<Record<string, unknown>> => {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    throw new MediaHttpError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "This endpoint requires a JSON request body.",
    );
  }

  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > maxBytes) {
    throw new MediaHttpError(413, "PAYLOAD_TOO_LARGE", "The request body is too large.");
  }

  if (!request.body) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "A JSON request body is required.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new MediaHttpError(
          413,
          "PAYLOAD_TOO_LARGE",
          "The request body is too large.",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new MediaHttpError(400, "INVALID_REQUEST", "The JSON request body is invalid.");
  }

  if (!isRecord(parsed)) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "The JSON request body must be an object.");
  }
  return parsed;
};

const decodeName = (name: string): string => {
  try {
    return decodeURIComponent(name);
  } catch {
    return "";
  }
};

const matchRoute = (
  routes: MediaRouteHandlerMap,
  pathname: string,
): { readonly route: string; readonly params: Readonly<Record<string, string>> } | null => {
  const pathParts = pathname.split("/").filter(Boolean);
  const candidates = Object.keys(routes).sort((left, right) => {
    const leftStatic = left.split("/").filter((part) => !part.startsWith(":")).length;
    const rightStatic = right.split("/").filter((part) => !part.startsWith(":")).length;
    return rightStatic - leftStatic;
  });

  for (const candidate of candidates) {
    const candidateParts = candidate.split("/").filter(Boolean);
    if (candidateParts.length !== pathParts.length) continue;
    const params: Record<string, string> = {};
    let matched = true;
    for (let index = 0; index < candidateParts.length; index += 1) {
      const expected = candidateParts[index]!;
      const actual = decodeName(pathParts[index]!);
      if (actual === "" || actual.includes("/") || actual.includes("\\")) {
        matched = false;
        break;
      }
      if (expected.startsWith(":")) {
        params[expected.slice(1)] = actual;
      } else if (expected !== actual) {
        matched = false;
        break;
      }
    }
    if (matched) return { route: candidate, params };
  }
  return null;
};

const errorResponse = (error: unknown): Response => {
  if (error instanceof MediaHttpError) {
    return jsonResponse(
      { error: { code: error.code, message: error.message } } satisfies MediaApiError,
      error.status,
    );
  }
  if (error instanceof MediaIdempotencyConflictError) {
    return jsonResponse(
      {
        error: {
          code: "IDEMPOTENCY_CONFLICT",
          message: "The operation was already completed with different input.",
        },
      } satisfies MediaApiError,
      409,
    );
  }
  if (error instanceof MediaRateLimitError) {
    const retryAfterSeconds =
      Number.isSafeInteger(error.retryAfterSeconds) &&
      error.retryAfterSeconds! > 0 &&
      error.retryAfterSeconds! <= 86_400
        ? error.retryAfterSeconds
        : undefined;
    return new Response(
      JSON.stringify({
        error: {
          code: "RATE_LIMITED",
          message: "The media request rate limit was exceeded.",
        } satisfies MediaApiError["error"],
      }),
      {
        status: 429,
        headers: {
          ...noStoreHeaders,
          "Content-Type": "application/json; charset=utf-8",
          ...(retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {}),
        },
      },
    );
  }
  if (error instanceof MediaUploadExpiredError) {
    return jsonResponse(
      {
        error: {
          code: "UPLOAD_EXPIRED",
          message: "The upload session has expired.",
        },
      } satisfies MediaApiError,
      410,
    );
  }
  if (error instanceof MediaNotFoundError) {
    return jsonResponse(
      { error: { code: "NOT_FOUND", message: "The requested media was not found." } } satisfies MediaApiError,
      404,
    );
  }
  if (error instanceof MediaPermissionDeniedError) {
    return jsonResponse(
      { error: { code: "PERMISSION_DENIED", message: "The operation is not permitted." } } satisfies MediaApiError,
      403,
    );
  }
  if (error instanceof MediaAssetConflictError) {
    return jsonResponse(
      { error: { code: "ASSET_CONFLICT", message: "The media resource changed or conflicts with this operation." } } satisfies MediaApiError,
      409,
    );
  }
  if (error instanceof UnsupportedMediaError) {
    return jsonResponse(
      { error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "The media type is not supported." } } satisfies MediaApiError,
      415,
    );
  }
  if (
    error instanceof InvalidMediaFileError ||
    error instanceof MediaValidationError
  ) {
    return jsonResponse(
      { error: { code: "VALIDATION", message: "The media request failed validation." } } satisfies MediaApiError,
      400,
    );
  }
  if (error instanceof MediaQuotaExceededError) {
    return jsonResponse(
      { error: { code: "QUOTA_EXCEEDED", message: "The media quota has been exceeded." } } satisfies MediaApiError,
      413,
    );
  }
  if (error instanceof MediaChecksumMismatchError) {
    return jsonResponse(
      { error: { code: "CHECKSUM_MISMATCH", message: "The uploaded file failed checksum validation." } } satisfies MediaApiError,
      422,
    );
  }
  if (error instanceof MediaCapabilityError || error instanceof MediaObjectStorageError) {
    return jsonResponse(
      { error: { code: "CAPABILITY", message: "The media service is temporarily unavailable." } } satisfies MediaApiError,
      503,
    );
  }
  return jsonResponse(
    { error: { code: "INTERNAL", message: "The media request could not be completed." } } satisfies MediaApiError,
    500,
  );
};

const toIso = (value: Date): string => {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new Error("Invalid media timestamp.");
  }
  return value.toISOString();
};

const serializeAsset = (asset: MediaAsset): MediaApiAsset => ({
  id: asset.id,
  folderId: asset.folderId,
  originalName: asset.originalName,
  displayName: asset.displayName,
  kind: asset.kind,
  mimeType: asset.mimeType,
  size: asset.size,
  ...(asset.checksum ? { checksum: asset.checksum } : {}),
  ...(asset.width !== undefined ? { width: asset.width } : {}),
  ...(asset.height !== undefined ? { height: asset.height } : {}),
  ...(asset.duration !== undefined ? { duration: asset.duration } : {}),
  ...(asset.orientation !== undefined ? { orientation: asset.orientation } : {}),
  status: asset.status,
  ...(asset.altText !== undefined ? { altText: asset.altText } : {}),
  ...(asset.caption !== undefined ? { caption: asset.caption } : {}),
  ...(asset.title !== undefined ? { title: asset.title } : {}),
  ...(asset.description !== undefined ? { description: asset.description } : {}),
  tags: asset.tags,
  ...(asset.crop !== undefined ? { crop: asset.crop } : {}),
  hotspots: asset.hotspots,
  focalPoint: asset.focalPoint,
  variants: asset.variants.map((variant) => ({
    id: variant.id,
    assetId: variant.assetId,
    name: variant.name,
    kind: variant.kind,
    status: variant.status,
    ...(variant.mimeType !== undefined ? { mimeType: variant.mimeType } : {}),
    ...(variant.size !== undefined ? { size: variant.size } : {}),
    ...(variant.checksum ? { checksum: variant.checksum } : {}),
    ...(variant.width !== undefined ? { width: variant.width } : {}),
    ...(variant.height !== undefined ? { height: variant.height } : {}),
    ...(variant.duration !== undefined ? { duration: variant.duration } : {}),
    ...(variant.bitrate !== undefined ? { bitrate: variant.bitrate } : {}),
    createdAt: toIso(variant.createdAt),
    updatedAt: toIso(variant.updatedAt),
  })),
  ...(asset.previousStatus !== undefined ? { previousStatus: asset.previousStatus } : {}),
  createdAt: toIso(asset.createdAt),
  updatedAt: toIso(asset.updatedAt),
  ...(asset.deletedAt !== undefined
    ? { deletedAt: asset.deletedAt === null ? null : toIso(asset.deletedAt) }
    : {}),
  revision: asset.revision,
});

const serializeFolder = (folder: MediaFolder): MediaApiFolder => ({
  id: folder.id,
  parentId: folder.parentId,
  name: folder.name,
  createdAt: toIso(folder.createdAt),
  updatedAt: toIso(folder.updatedAt),
  ...(folder.deletedAt !== undefined
    ? { deletedAt: folder.deletedAt === null ? null : toIso(folder.deletedAt) }
    : {}),
  revision: folder.revision,
});

const serializeProcessing = (job: MediaProcessingJob): MediaProcessingStatus => ({
  assetId: job.assetId,
  kind: job.kind,
  status: job.status,
  attempt: job.attempt,
  maxAttempts: job.maxAttempts,
  progress: job.progress,
  createdAt: toIso(job.createdAt),
  updatedAt: toIso(job.updatedAt),
  ...(job.completedAt !== undefined
    ? { completedAt: job.completedAt === null ? null : toIso(job.completedAt) }
    : {}),
});

const parseChecksum = (value: unknown): MediaChecksum | undefined => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "expectedChecksum is invalid.");
  }
  try {
    return normalizeMediaChecksum(value);
  } catch {
    throw new MediaHttpError(400, "INVALID_REQUEST", "expectedChecksum is invalid.");
  }
};

const parseUploadParts = (
  value: unknown,
): readonly MediaUploadPartCompletion[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length < 1 || value.length > 10_000) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "parts is invalid.");
  }
  const seen = new Set<number>();
  const parts = value.map((part) => {
    if (!isRecord(part)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "parts is invalid.");
    }
    const partNumber = positiveInteger(part.partNumber, "partNumber", 10_000);
    if (seen.has(partNumber)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "parts must be unique.");
    }
    seen.add(partNumber);
    const etag = validText(part.etag, "etag", 128)!;
    if (!/^[\x21-\x7e]+$/.test(etag)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "etag is invalid.");
    }
    return {
      partNumber,
      etag,
    };
  });
  return parts.sort((left, right) => left.partNumber - right.partNumber);
};

const parseUploadIntent = (input: Record<string, unknown>): MediaUploadIntentInput => {
  const fileName = validText(input.fileName, "fileName", 1024)!;
  const kind = input.kind;
  if (!["image", "video", "audio", "document", "other"].includes(String(kind))) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "kind is invalid.");
  }
  const mimeType = validText(input.mimeType, "mimeType", 255)!.toLowerCase();
  if (!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mimeType)) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "mimeType is invalid.");
  }
  const size = positiveInteger(input.size, "size");
  const expectedChecksum = parseChecksum(input.expectedChecksum);
  return {
    fileName,
    kind: kind as MediaKind,
    mimeType,
    size,
    ...(expectedChecksum ? { expectedChecksum } : {}),
  };
};

const filenameOnly = (fileName: string): string => {
  const normalized = fileName.replace(/\\/g, "/").split("/").at(-1)?.trim() ?? "";
  const safe = normalized.replace(/[\u0000-\u001f\u007f]/g, "");
  if (safe === "" || safe === "." || safe === ".." || safe.length > 255) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "fileName is invalid.");
  }
  return safe;
};

const parseFinalizeInput = (
  input: Record<string, unknown>,
  maxImagePixels: number,
): MediaFinalizeUploadInput => {
  const kind = input.kind;
  if (!["image", "video", "audio", "document", "other"].includes(String(kind))) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "kind is invalid.");
  }
  const result: Record<string, unknown> = {
    originalName: filenameOnly(validText(input.originalName, "originalName", 1024)!),
    kind,
  };
  if (hasOwn(input, "folderId")) {
    result.folderId =
      input.folderId === null ? null : validId(input.folderId, "folderId");
  }
  for (const field of ["displayName"] as const) {
    if (hasOwn(input, field)) {
      result[field] = validText(input[field], field, 255);
    }
  }
  for (const field of ["width", "height"] as const) {
    if (hasOwn(input, field)) {
      result[field] = positiveInteger(input[field], field, 100_000);
    }
  }
  if (
    typeof result.width === "number" &&
    typeof result.height === "number" &&
    result.width * result.height > maxImagePixels
  ) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "Image dimensions exceed the configured limit.");
  }
  if (hasOwn(input, "duration")) {
    if (
      typeof input.duration !== "number" ||
      !Number.isFinite(input.duration) ||
      input.duration < 0 ||
      input.duration > 86_400
    ) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "duration is invalid.");
    }
    result.duration = input.duration;
  }
  if (hasOwn(input, "orientation")) {
    const orientation = positiveInteger(input.orientation, "orientation", 8);
    result.orientation = orientation;
  }
  for (const field of ["altText", "caption", "title", "description"] as const) {
    const value = optionalText(input, field, field === "description" ? 5_000 : 1_000);
    if (value !== undefined) result[field] = value;
  }
  if (hasOwn(input, "tags")) {
    if (
      !Array.isArray(input.tags) ||
      input.tags.length > 100 ||
      input.tags.some((tag) => typeof tag !== "string" || tag.length > 64)
    ) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "tags is invalid.");
    }
    result.tags = normalizeMediaTags(input.tags);
  }
  if (hasOwn(input, "crop")) {
    result.crop = input.crop === null ? null : normalizeMediaCrop(input.crop);
  }
  if (hasOwn(input, "focalPoint")) {
    result.focalPoint =
      input.focalPoint === null
        ? null
        : normalizeMediaFocalPoint(input.focalPoint);
  }
  if (hasOwn(input, "hotspots")) {
    if (!Array.isArray(input.hotspots) || input.hotspots.length > 100) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "hotspots is invalid.");
    }
    result.hotspots = normalizeMediaHotspots(input.hotspots);
  }
  return result as MediaFinalizeUploadInput;
};

const parseAssetList = (url: URL): MediaAssetListInput => {
  const query = url.searchParams;
  const result: Record<string, unknown> = {};
  const first = query.get("first");
  if (first !== null) result.first = positiveInteger(Number(first), "first", 100);
  const after = query.get("after");
  if (after !== null) result.after = validText(after, "after", 1024);
  const folderId = query.get("folderId");
  if (folderId !== null) {
    result.folderId = folderId === "" ? null : validId(folderId, "folderId");
  }
  const kind = query.get("kind");
  if (kind !== null) {
    if (!["image", "video", "audio", "document", "other"].includes(kind)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "kind is invalid.");
    }
    result.kind = kind;
  }
  const status = query.get("status");
  if (status !== null) {
    if (!["pending-upload", "uploaded", "processing", "ready", "failed", "deleted"].includes(status)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "status is invalid.");
    }
    result.status = status;
  }
  const orderBy = query.get("orderBy");
  if (orderBy !== null) {
    if (!["createdAt", "updatedAt", "displayName", "size"].includes(orderBy)) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "orderBy is invalid.");
    }
    result.orderBy = orderBy;
  }
  const direction = query.get("direction");
  if (direction !== null) {
    if (direction !== "asc" && direction !== "desc") {
      throw new MediaHttpError(400, "INVALID_REQUEST", "direction is invalid.");
    }
    result.direction = direction;
  }
  for (const field of ["tagsAny", "tagsAll"] as const) {
    const values = query.getAll(field);
    if (values.length > 0) {
      const tags = values.flatMap((value) => value.split(",")).filter(Boolean);
      if (tags.length > 100 || tags.some((tag) => tag.length > 64)) {
        throw new MediaHttpError(400, "INVALID_REQUEST", `${field} is invalid.`);
      }
      result[field] = tags;
    }
  }
  const checksum = query.get("checksum");
  if (checksum !== null) {
    try {
      result.checksum = parseChecksum(JSON.parse(checksum));
    } catch {
      throw new MediaHttpError(400, "INVALID_REQUEST", "checksum is invalid.");
    }
  }
  return result as MediaAssetListInput;
};

const parseFolderList = (url: URL): MediaFolderListInput => {
  const query = url.searchParams;
  const result: Record<string, unknown> = {};
  const first = query.get("first");
  if (first !== null) result.first = positiveInteger(Number(first), "first", 100);
  const after = query.get("after");
  if (after !== null) result.after = validText(after, "after", 1024);
  const parentId = query.get("parentId");
  if (parentId !== null) {
    result.parentId = parentId === "" ? null : validId(parentId, "parentId");
  }
  return result as MediaFolderListInput;
};

const parseAssetUpdate = (
  input: Record<string, unknown>,
): MediaAssetUpdateInput => {
  const result: Record<string, unknown> = {
    expectedRevision: expectedRevision(input.expectedRevision),
  };
  if (hasOwn(input, "folderId")) {
    result.folderId =
      input.folderId === null ? null : validId(input.folderId, "folderId");
  }
  if (hasOwn(input, "displayName")) {
    result.displayName = validText(input.displayName, "displayName", 255);
  }
  for (const field of ["altText", "caption", "title", "description"] as const) {
    const value = optionalText(input, field, field === "description" ? 5_000 : 1_000);
    if (value !== undefined) result[field] = value;
  }
  if (hasOwn(input, "tags")) {
    if (
      !Array.isArray(input.tags) ||
      input.tags.length > 100 ||
      input.tags.some((tag) => typeof tag !== "string" || tag.length > 64)
    ) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "tags is invalid.");
    }
    result.tags = normalizeMediaTags(input.tags);
  }
  if (hasOwn(input, "crop")) {
    result.crop = input.crop === null ? null : normalizeMediaCrop(input.crop);
  }
  if (hasOwn(input, "focalPoint")) {
    result.focalPoint =
      input.focalPoint === null
        ? null
        : normalizeMediaFocalPoint(input.focalPoint);
  }
  if (hasOwn(input, "hotspots")) {
    if (!Array.isArray(input.hotspots) || input.hotspots.length > 100) {
      throw new MediaHttpError(400, "INVALID_REQUEST", "hotspots is invalid.");
    }
    result.hotspots = normalizeMediaHotspots(input.hotspots);
  }
  if (Object.keys(result).length === 1) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "At least one asset field is required.");
  }
  return result as MediaAssetUpdateInput;
};

const parseFolderUpdate = (
  input: Record<string, unknown>,
): MediaFolderUpdateInput => {
  const revision = expectedRevision(input.expectedRevision);
  const hasName = hasOwn(input, "name");
  const hasParent = hasOwn(input, "parentId");
  if (hasName === hasParent) {
    throw new MediaHttpError(400, "INVALID_REQUEST", "Provide exactly one folder update.");
  }
  if (hasName) {
    return {
      expectedRevision: revision,
      name: validText(input.name, "name", 255)!,
    };
  }
  return {
    expectedRevision: revision,
    parentId: input.parentId === null ? null : validId(input.parentId, "parentId"),
  };
};

const parseRevision = (input: Record<string, unknown>): MediaRevisionInput => ({
  expectedRevision: expectedRevision(input.expectedRevision),
});

const sameObject = (
  left: MediaObjectReference,
  right: MediaObjectReference,
): boolean => left.key === right.key && left.versionId === right.versionId;

const assertResolvedContext = (
  context: MediaRequestContext | null,
): MediaRequestContext => {
  if (
    !context ||
    typeof context.actorId !== "string" ||
    context.actorId.trim() === "" ||
    typeof context.tenantId !== "string" ||
    context.tenantId.trim() === "" ||
    context.actorId.length > 256 ||
    context.tenantId.length > 256 ||
    /[\u0000-\u001f\u007f/\\]/.test(context.actorId) ||
    /[\u0000-\u001f\u007f/\\]/.test(context.tenantId)
  ) {
    throw new MediaHttpError(
      401,
      "UNAUTHENTICATED",
      "Authentication is required.",
    );
  }
  return context;
};

const uploadStatus = (session: MediaUploadSession): MediaUploadStatus => ({
  id: session.id,
  mode: session.mode,
  state:
    session.state === "pending" && session.expiresAt.getTime() <= Date.now()
      ? "expired"
      : session.state,
  expiresAt: toIso(session.expiresAt),
  ...(session.expectedSize !== undefined
    ? { expectedSize: session.expectedSize }
    : {}),
  ...(session.partSizeBytes !== undefined
    ? { partSizeBytes: session.partSizeBytes }
    : {}),
});

const checkUploadSession = async (
  objectStorage: MediaObjectStorageAdapter,
  sessionId: string,
  tenantId: string,
  allowCompleted: boolean,
): Promise<MediaUploadSession> => {
  const session = await objectStorage.getUploadSession(sessionId);
  if (!session || session.id !== sessionId || session.tenantId !== tenantId) {
    throw new MediaNotFoundError("Upload session");
  }
  if (session.state === "aborted") {
    throw new MediaAssetConflictError("The upload session was aborted.");
  }
  if (
    session.state === "expired" ||
    (session.state === "pending" && session.expiresAt.getTime() <= Date.now())
  ) {
    throw new MediaUploadExpiredError();
  }
  if (session.state === "completed" && !allowCompleted) {
    throw new MediaAssetConflictError("The upload session is already complete.");
  }
  return session;
};

const validateStoredObject = async (
  objectStorage: MediaObjectStorageAdapter,
  completed: MediaStoredObject,
  session: MediaUploadSession,
  context: MediaRequestContext,
): Promise<MediaStoredObject> => {
  const actual = await objectStorage.getObjectMetadata(completed.object);
  const checksumMatches =
    actual?.checksum === undefined && completed.checksum === undefined
      ? true
      : actual?.checksum !== undefined &&
        completed.checksum !== undefined &&
        normalizeMediaChecksum(actual.checksum).value ===
          normalizeMediaChecksum(completed.checksum).value;
  if (
    !actual ||
    actual.tenantId !== context.tenantId ||
    completed.tenantId !== context.tenantId ||
    !sameObject(actual.object, completed.object) ||
    actual.size !== completed.size ||
    actual.mimeType.toLowerCase() !== completed.mimeType.toLowerCase() ||
    actual.size !== session.expectedSize ||
    !checksumMatches
  ) {
    throw new MediaObjectStorageError("Uploaded object metadata did not match the authorized intent.");
  }
  if (
    session.expectedChecksum &&
    (!actual.checksum ||
      normalizeMediaChecksum(session.expectedChecksum).value !==
        normalizeMediaChecksum(actual.checksum).value)
  ) {
    throw new MediaChecksumMismatchError();
  }
  return actual;
};

const processingProfiles = async (
  asset: MediaAsset,
  resolveProfiles: NonNullable<MediaServerOptions["resolveProcessingProfiles"]>,
): Promise<readonly MediaProcessingProfile[]> => {
  const profiles = await resolveProfiles(asset);
  if (!Array.isArray(profiles)) {
    throw new MediaValidationError("Processing profiles are invalid.");
  }
  if (asset.kind === "image") {
    return validateMediaImageProfiles(profiles as readonly MediaImageProfile[]);
  }
  if (asset.kind === "video") {
    return validateMediaVideoProfiles(
      profiles as readonly MediaVideoRenditionProfile[],
    );
  }
  throw new UnsupportedMediaError("Only image and video assets can be processed.");
};

export const createMediaServer = (options: MediaServerOptions): MediaServer => {
  const basePath = options.basePath ?? "/api/media";
  if (
    !basePath.startsWith("/") ||
    basePath.includes("?") ||
    basePath.includes("#") ||
    basePath.includes("..") ||
    basePath.includes("//")
  ) {
    throw new TypeError("basePath must be an absolute URL path.");
  }
  const normalizedBasePath = basePath.replace(/\/+$/, "");
  const maxUploadBytes = options.maxUploadBytes ?? 100 * 1024 * 1024;
  const maxImagePixels = options.maxImagePixels ?? 100_000_000;
  const uploadExpiresInMs = options.uploadExpiresInMs ?? 5 * 60 * 1000;
  const readExpiresInMs = options.readExpiresInMs ?? 60 * 1000;
  const multipart = options.multipart;
  const maxMultipartParts = multipart?.maxParts ?? 10_000;
  const maxPartTargetsPerRequest = multipart?.maxPartTargetsPerRequest ?? 100;
  const allowedMimeTypes = new Set(
    (options.allowedMimeTypes ?? [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "video/mp4",
      "audio/mpeg",
      "application/pdf",
    ]).map((value) => value.toLowerCase()),
  );

  if (
    !/^\/[A-Za-z0-9._~/-]*$/.test(basePath) ||
    allowedMimeTypes.size === 0 ||
    [...allowedMimeTypes].some(
      (mimeType) => !/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(mimeType),
    ) ||
    !Number.isSafeInteger(maxUploadBytes) ||
    maxUploadBytes < 1 ||
    !Number.isSafeInteger(maxImagePixels) ||
    maxImagePixels < 1 ||
    !Number.isSafeInteger(uploadExpiresInMs) ||
    uploadExpiresInMs < 1 ||
    !Number.isSafeInteger(readExpiresInMs) ||
    readExpiresInMs < 1 ||
    (multipart !== undefined &&
      (!Number.isSafeInteger(multipart.thresholdBytes) ||
        multipart.thresholdBytes < 1 ||
        !Number.isSafeInteger(multipart.partSizeBytes) ||
        multipart.partSizeBytes < 1 ||
        !Number.isSafeInteger(maxMultipartParts) ||
        maxMultipartParts < 1 ||
        maxMultipartParts > 10_000 ||
        !Number.isSafeInteger(maxPartTargetsPerRequest) ||
        maxPartTargetsPerRequest < 1 ||
        maxPartTargetsPerRequest > 100)) ||
    (options.processing && !options.resolveProcessingProfiles) ||
    (!options.processing && options.resolveProcessingProfiles) ||
    (options.verifyUploadedContent !== undefined &&
      typeof options.verifyUploadedContent !== "function")
  ) {
    throw new TypeError("Invalid media server configuration.");
  }

  let initializationPromise: Promise<void> | null = null;
  const initialize = (): Promise<void> => {
    if (!initializationPromise) {
      const dependencies = [
        options.assets.ready,
        options.folders.ready,
        ...(options.processing ? [options.processing.ready] : []),
      ];
      initializationPromise = Promise.all(dependencies)
        .then(() => undefined)
        .catch((error: unknown) => {
          initializationPromise = null;
          throw error;
        });
    }
    return initializationPromise;
  };

  const checkReadiness = async (
    check: MediaReadinessCheck,
  ): Promise<MediaReadinessState> => {
    try {
      await check();
      return "ready";
    } catch {
      return "unavailable";
    }
  };

  const readiness = async (): Promise<MediaReadinessResult> => {
    const metadataStorage = await checkReadiness(async () => {
      await Promise.all([options.assets.ready, options.folders.ready]);
      await options.readiness?.metadataStorage?.();
    });
    const objectStorage = options.readiness?.objectStorage
      ? await checkReadiness(options.readiness.objectStorage)
      : "unverified";
    const queue = options.processing
      ? await checkReadiness(async () => {
          await options.processing!.ready;
          await options.readiness?.queue?.();
        })
      : "not-configured";
    const processor = options.processing
      ? options.readiness?.processor
        ? await checkReadiness(options.readiness.processor)
        : "unverified"
      : "not-configured";
    const ready =
      metadataStorage === "ready" &&
      objectStorage === "ready" &&
      (!options.processing || (queue === "ready" && processor === "ready"));
    return {
      ready,
      dependencies: {
        metadataStorage,
        objectStorage,
        queue,
        processor,
      },
    };
  };

  const cleanup = async (
    cleanupOptions: MediaCleanupOptions = {},
  ): Promise<MediaCleanupResult> => {
    const now = cleanupOptions.now ?? new Date();
    const batchSize = cleanupOptions.batchSize ?? 100;
    if (
      !(now instanceof Date) ||
      !Number.isFinite(now.getTime()) ||
      !Number.isSafeInteger(batchSize) ||
      batchSize < 1 ||
      batchSize > 1_000
    ) {
      throw new TypeError("Invalid media cleanup options.");
    }
    const expired = await cleanupExpiredMediaUploads({
      objectStorage: options.objectStorage,
      before: now,
      first: batchSize,
    });
    const input = { now: new Date(now), batchSize };
    const result: {
      expiredUploads: MediaCleanupResult["expiredUploads"];
      storage?: MediaCleanupHookResult;
      objectStorage?: MediaCleanupHookResult;
      queue?: MediaCleanupHookResult;
      processor?: MediaCleanupHookResult;
    } = {
      expiredUploads: {
        examined: expired.examined,
        aborted: expired.aborted,
        failed: expired.failures.length,
      },
    };
    const hooks = [
      ["storage", options.cleanup?.storage],
      ["objectStorage", options.cleanup?.objectStorage],
      ["queue", options.cleanup?.queue],
      ["processor", options.cleanup?.processor],
    ] as const;
    for (const [name, hook] of hooks) {
      if (!hook) continue;
      const hookResult = await hook(input);
      if (
        !isRecord(hookResult) ||
        !Number.isSafeInteger(hookResult.examined) ||
        (hookResult.examined as number) < 0 ||
        !Number.isSafeInteger(hookResult.cleaned) ||
        (hookResult.cleaned as number) < 0 ||
        !Number.isSafeInteger(hookResult.failed) ||
        (hookResult.failed as number) < 0
      ) {
        throw new MediaCapabilityError(`cleanup-result:${name}`);
      }
      result[name] = {
        examined: hookResult.examined as number,
        cleaned: hookResult.cleaned as number,
        failed: hookResult.failed as number,
      };
    }
    return result;
  };

  const secure = (
    operationOptions: OperationOptions,
    operation: Operation,
  ): MediaRouteHandler =>
    async (request, params) => {
      try {
        await initialize();
      } catch {
        return errorResponse(
          new MediaHttpError(
            503,
            "CAPABILITY",
            "The media service is temporarily unavailable.",
          ),
        );
      }

      let context: MediaRequestContext;
      try {
        context = assertResolvedContext(await options.resolveContext(request));
      } catch (error) {
        return errorResponse(
          error instanceof MediaHttpError && error.status === 401
            ? error
            : new MediaHttpError(401, "UNAUTHENTICATED", "Authentication is required."),
        );
      }

      let resourceId: string | undefined;
      const respond = async (
        response: Response,
        result: MediaAuditEvent["result"],
        body?: unknown,
      ): Promise<Response> => {
        if (!options.onAudit || !auditedMediaActions.has(operationOptions.action)) return response;
        const resource = operationOptions.action.startsWith("upload:")
          ? "upload"
          : operationOptions.action.startsWith("folder:") ? "folder" : "asset";
        const item = isRecord(body)
          ? operationOptions.action === "upload:create" ? body.intent
            : operationOptions.action === "folder:create" ? body.folder : undefined
          : undefined;
        const createdId = isRecord(item) && typeof item.id === "string" ? item.id : undefined;
        const asset = isRecord(body) ? body.asset : undefined;
        const relatedAssetId = operationOptions.action === "upload:complete" &&
          isRecord(asset) && typeof asset.id === "string" ? asset.id : undefined;
        try {
          await options.onAudit({
            tenantId: context.tenantId,
            actorId: context.actorId,
            resource,
            ...(resourceId || createdId ? { resourceId: resourceId ?? createdId } : {}),
            ...(relatedAssetId ? { relatedAssetId } : {}),
            action: operationOptions.action,
            timestamp: new Date(),
            result,
          });
        } catch {
          return errorResponse(new MediaHttpError(
            503,
            "CAPABILITY",
            "The media audit could not be recorded; the operation may have completed. Refresh before retrying.",
          ));
        }
        return response;
      };
      try {
        resourceId = operationOptions.resourceParam
          ? validId(
              params[operationOptions.resourceParam],
              operationOptions.resourceParam,
            )
          : undefined;
      } catch (error) {
        return respond(errorResponse(error), "failure");
      }
      try {
        const allowed = await options.authorize({
          context,
          action: operationOptions.action,
          request,
          ...(resourceId ? { resourceId } : {}),
        });
        if (allowed !== true) {
          throw new MediaPermissionDeniedError();
        }
      } catch {
        return respond(errorResponse(new MediaPermissionDeniedError()), "denied");
      }

      if (options.rateLimit) {
        let decision: MediaRateLimitDecision;
        try {
          decision = await options.rateLimit({
            context,
            action: operationOptions.action,
            request,
            ...(resourceId ? { resourceId } : {}),
          });
        } catch {
          return respond(errorResponse(
            new MediaHttpError(
              503,
              "CAPABILITY",
              "The media rate-limit service is temporarily unavailable.",
            ),
          ), "failure");
        }
        if (!decision || decision.allowed !== true) {
          return respond(errorResponse(
            new MediaRateLimitError(
              decision && decision.allowed === false
                ? decision.retryAfterSeconds
                : undefined,
            ),
          ), "failure");
        }
      }

      try {
        const result = await operation(request, params, context);
        return respond(jsonResponse(result.body, result.status ?? 200), "success", result.body);
      } catch (error) {
        return respond(errorResponse(error), error instanceof MediaPermissionDeniedError ? "denied" : "failure");
      }
    };

  const routes: Record<string, Partial<Record<MediaHttpMethod, MediaRouteHandler>>> = {
    "/health": {
      GET: secure(
        { action: "service:readiness" },
        async () => {
          const result = await readiness();
          return { body: result, status: result.ready ? 200 : 503 };
        },
      ),
    },
    "/uploads/intent": {
      POST: secure({ action: "upload:create" }, async (request, _params, context) => {
        const input = parseUploadIntent(await parseJson(request));
        if (input.size > maxUploadBytes) {
          throw new MediaHttpError(413, "PAYLOAD_TOO_LARGE", "The upload exceeds the configured size limit.");
        }
        if (!allowedMimeTypes.has(input.mimeType)) {
          throw new UnsupportedMediaError("The requested media type is not allowed.");
        }
        validateMediaFileMetadata({
          kind: input.kind,
          mimeType: input.mimeType,
          size: input.size,
        });
        const fileName = filenameOnly(input.fileName);
        if (options.assertTenantQuota) {
          let quotaAllowed: void | boolean;
          try {
            quotaAllowed = await options.assertTenantQuota({
              context,
              action: "upload:create",
              request,
              requestedBytes: input.size,
              mimeType: input.mimeType,
            });
          } catch (error) {
            if (error instanceof MediaQuotaExceededError) throw error;
            throw new MediaHttpError(
              503,
              "CAPABILITY",
              "The tenant media quota could not be verified.",
            );
          }
          if (quotaAllowed !== undefined && quotaAllowed !== true) {
            throw new MediaQuotaExceededError();
          }
        }
        const constraints = {
          tenantId: context.tenantId,
          fileName,
          contentType: input.mimeType,
          expectedSize: input.size,
          ...(input.expectedChecksum ? { expectedChecksum: input.expectedChecksum } : {}),
          expiresInMs: uploadExpiresInMs,
        };
        const wantsMultipart =
          multipart !== undefined && input.size >= multipart.thresholdBytes;
        const session = wantsMultipart
          ? await options.objectStorage.createMultipartUpload({
              ...constraints,
              partSizeBytes: multipart.partSizeBytes,
            })
          : await options.objectStorage.createUploadIntent(constraints);
        const validSessionShape =
          session.mode === "single"
            ? !wantsMultipart &&
              session.uploadTarget !== undefined &&
              session.partSizeBytes === undefined
            : wantsMultipart &&
              session.uploadTarget === undefined &&
              session.partSizeBytes === multipart?.partSizeBytes;
        if (
          !isValidId(session.id) ||
          session.tenantId !== context.tenantId ||
          !validSessionShape ||
          session.expectedSize !== input.size ||
          (input.expectedChecksum !== undefined &&
            (!session.expectedChecksum ||
              normalizeMediaChecksum(session.expectedChecksum).value !==
                normalizeMediaChecksum(input.expectedChecksum).value)) ||
          session.expiresAt.getTime() <= Date.now() ||
                session.expiresAt.getTime() > Date.now() + uploadExpiresInMs
        ) {
          if (isValidId(session.id)) {
            await options.objectStorage.abortUpload(session.id).catch(() => false);
          }
          throw new MediaCapabilityError("safe-upload-session");
        }
        const intent: MediaUploadIntent = {
          id: session.id,
          mode: session.mode,
          ...(session.uploadTarget
            ? {
                target: serializeUploadTarget(
                  session.uploadTarget,
                  session.expiresAt,
                ),
              }
            : {}),
          ...(session.partSizeBytes !== undefined
            ? { partSizeBytes: session.partSizeBytes }
            : {}),
          expiresAt: toIso(session.expiresAt),
        };
        if (session.mode === "multipart") {
          const partCount = Math.ceil(input.size / session.partSizeBytes!);
          if (partCount > maxMultipartParts) {
            await options.objectStorage.abortUpload(session.id).catch(() => false);
            throw new MediaHttpError(
              413,
              "PAYLOAD_TOO_LARGE",
              "The upload requires too many parts.",
            );
          }
        }
        return { body: { intent }, status: 201 };
      }),
    },
    "/uploads/:uploadId": {
      GET: secure(
        { action: "upload:read", resourceParam: "uploadId" },
        async (_request, params, context) => {
          const uploadId = validId(params.uploadId, "uploadId");
          const session = await options.objectStorage.getUploadSession(uploadId);
          if (
            !session ||
            session.id !== uploadId ||
            session.tenantId !== context.tenantId
          ) {
            throw new MediaNotFoundError("Upload session");
          }
          return { body: { upload: uploadStatus(session) } };
        },
      ),
    },
    "/uploads/:uploadId/parts": {
      POST: secure(
        { action: "upload:part-targets", resourceParam: "uploadId" },
        async (request, params, context) => {
          const uploadId = validId(params.uploadId, "uploadId");
          const body = await parseJson(request);
          if (
            !Array.isArray(body.partNumbers) ||
            body.partNumbers.length < 1 ||
            body.partNumbers.length > maxPartTargetsPerRequest
          ) {
            throw new MediaHttpError(400, "INVALID_REQUEST", "partNumbers is invalid.");
          }
          const session = await checkUploadSession(
            options.objectStorage,
            uploadId,
            context.tenantId,
            false,
          );
          if (
            session.mode !== "multipart" ||
            !session.partSizeBytes ||
            !session.expectedSize
          ) {
            throw new MediaAssetConflictError("The upload session is not multipart.");
          }
          const partCount = Math.ceil(session.expectedSize / session.partSizeBytes);
          if (partCount > maxMultipartParts) {
            throw new MediaCapabilityError("multipart-part-limit");
          }
          const partNumbers = body.partNumbers.map((value) =>
            positiveInteger(value, "partNumber", partCount),
          );
          if (new Set(partNumbers).size !== partNumbers.length) {
            throw new MediaHttpError(400, "INVALID_REQUEST", "partNumbers must be unique.");
          }
          const targets = await options.objectStorage.createMultipartPartTargets(
            session.id,
            partNumbers,
            uploadExpiresInMs,
          );
          if (
            targets.length !== partNumbers.length ||
            new Set(targets.map((target) => target.partNumber)).size !== targets.length
          ) {
            throw new MediaCapabilityError("multipart-part-targets");
          }
          const byPart = new Map(targets.map((target) => [target.partNumber, target]));
          const safeTargets: readonly MediaUploadPartTarget[] = partNumbers.map(
            (partNumber) => {
              const target = byPart.get(partNumber);
              if (!target || target.partNumber !== partNumber) {
                throw new MediaCapabilityError("multipart-part-targets");
              }
              return {
                ...serializeUploadTarget(target, session.expiresAt),
                partNumber,
              };
            },
          );
          return { body: { targets: safeTargets } };
        },
      ),
    },
    "/uploads/:uploadId/complete": {
      POST: secure(
        { action: "upload:complete", resourceParam: "uploadId" },
        async (request, params, context) => {
          const uploadId = validId(params.uploadId, "uploadId");
          const body = await parseJson(
            request,
            Math.min(4 * 1024 * 1024, 64 * 1024 + maxMultipartParts * 320),
          );
          const input = parseFinalizeInput(body, maxImagePixels);
          const parts = parseUploadParts(body.parts);
          const completeInput: MediaCompleteUploadInput = {
            ...input,
            ...(parts ? { parts } : {}),
          };
          const fingerprint = JSON.stringify(completeInput);
          const result = await options.idempotency.execute(
            {
              key: `media-upload-finalize:${context.tenantId}:${uploadId}`,
              fingerprint,
            },
            async () => {
              const session = await checkUploadSession(
                options.objectStorage,
                uploadId,
                context.tenantId,
                true,
              );
              if (!session.expectedSize) {
                throw new MediaAssetConflictError("The upload intent has no declared size.");
              }
              if (session.mode === "multipart") {
                if (!session.partSizeBytes || !parts) {
                  throw new MediaHttpError(
                    400,
                    "INVALID_REQUEST",
                    "Multipart completion requires every uploaded part.",
                  );
                }
                const expectedPartCount = Math.ceil(
                  session.expectedSize / session.partSizeBytes,
                );
                if (
                  expectedPartCount > maxMultipartParts ||
                  parts.length !== expectedPartCount ||
                  parts.some((part, index) => part.partNumber !== index + 1)
                ) {
                  throw new MediaHttpError(
                    400,
                    "INVALID_REQUEST",
                    "Multipart completion parts do not match the upload intent.",
                  );
                }
              } else if (parts !== undefined) {
                throw new MediaHttpError(
                  400,
                  "INVALID_REQUEST",
                  "Single uploads cannot include multipart parts.",
                );
              }
              const stored = await options.objectStorage.completeUpload(
                session.id,
                parts,
              );
              const verified = await validateStoredObject(
                options.objectStorage,
                stored,
                session,
                context,
              );
              if (!allowedMimeTypes.has(verified.mimeType.toLowerCase())) {
                throw new UnsupportedMediaError("The uploaded object type is not allowed.");
              }
              const metadata = validateMediaFileMetadata({
                kind: input.kind,
                mimeType: verified.mimeType,
                size: verified.size,
                ...(verified.checksum ? { checksum: verified.checksum } : {}),
                ...(input.width !== undefined ? { width: input.width } : {}),
                ...(input.height !== undefined ? { height: input.height } : {}),
                ...(input.duration !== undefined ? { duration: input.duration } : {}),
                ...(input.orientation !== undefined
                  ? { orientation: input.orientation }
                  : {}),
              });
              if (options.verifyUploadedContent) {
                let accepted: boolean;
                try {
                  accepted = await options.verifyUploadedContent({
                    context,
                    request,
                    object: verified,
                    kind: input.kind,
                  });
                } catch {
                  throw new MediaHttpError(
                    503,
                    "CAPABILITY",
                    "The uploaded content could not be verified.",
                  );
                }
                if (accepted === false) {
                  throw new UnsupportedMediaError("The uploaded content was rejected.");
                }
                if (accepted !== true) {
                  throw new MediaHttpError(
                    503,
                    "CAPABILITY",
                    "The uploaded content could not be verified.",
                  );
                }
              }
              const asset = await options.assets.create({
                tenantId: context.tenantId,
                ...(input.folderId !== undefined ? { folderId: input.folderId } : {}),
                originalName: input.originalName,
                ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
                metadata,
                object: verified.object,
                ...(input.altText !== undefined ? { altText: input.altText } : {}),
                ...(input.caption !== undefined ? { caption: input.caption } : {}),
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.description !== undefined ? { description: input.description } : {}),
                ...(input.tags !== undefined ? { tags: input.tags } : {}),
                ...(input.crop !== undefined ? { crop: input.crop } : {}),
                ...(input.focalPoint !== undefined
                  ? { focalPoint: input.focalPoint }
                  : {}),
                ...(input.hotspots !== undefined ? { hotspots: input.hotspots } : {}),
                actorId: context.actorId,
              });
              if (asset.status !== "uploaded") {
                throw new MediaAssetConflictError(
                  "New media assets must remain unprocessed until a server worker validates them.",
                );
              }
              return serializeAsset(asset);
            },
          );
          return {
            body: {
              asset: result.value,
              replayed: result.replayed,
            },
          };
        },
      ),
    },
    "/uploads/:uploadId/abort": {
      POST: secure(
        { action: "upload:abort", resourceParam: "uploadId" },
        async (_request, params, context) => {
          const uploadId = validId(params.uploadId, "uploadId");
          const session = await options.objectStorage.getUploadSession(uploadId);
          if (
            !session ||
            session.id !== uploadId ||
            session.tenantId !== context.tenantId
          ) {
            throw new MediaNotFoundError("Upload session");
          }
          const aborted = await options.objectStorage.abortUpload(uploadId);
          return { body: { aborted } };
        },
      ),
    },
    "/assets": {
      GET: secure({ action: "asset:list" }, async (request, _params, context) => {
        const input = parseAssetList(new URL(request.url));
        const page = await options.assets.list({
          ...input,
          tenantId: context.tenantId,
        });
        const result: MediaAssetPage = {
          items: page.items.map(serializeAsset),
          nextCursor: page.nextCursor,
        };
        return { body: result };
      }),
    },
    "/assets/:assetId": {
      GET: secure(
        { action: "asset:read", resourceParam: "assetId" },
        async (_request, params, context) => {
          const asset = await options.assets.get(
            context.tenantId,
            validId(params.assetId, "assetId"),
          );
          return { body: { asset: serializeAsset(asset) } };
        },
      ),
      PATCH: secure(
        { action: "asset:update", resourceParam: "assetId" },
        async (request, params, context) => {
          const input = parseAssetUpdate(await parseJson(request));
          const asset = await options.assets.update({
            ...input,
            tenantId: context.tenantId,
            assetId: validId(params.assetId, "assetId"),
            actorId: context.actorId,
          });
          return { body: { asset: serializeAsset(asset) } };
        },
      ),
      DELETE: secure(
        { action: "asset:delete", resourceParam: "assetId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const asset = await options.assets.softDelete({
            ...input,
            tenantId: context.tenantId,
            assetId: validId(params.assetId, "assetId"),
            actorId: context.actorId,
          });
          return { body: { asset: serializeAsset(asset) } };
        },
      ),
    },
    "/assets/:assetId/restore": {
      POST: secure(
        { action: "asset:restore", resourceParam: "assetId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const asset = await options.assets.restore({
            ...input,
            tenantId: context.tenantId,
            assetId: validId(params.assetId, "assetId"),
            actorId: context.actorId,
          });
          return { body: { asset: serializeAsset(asset) } };
        },
      ),
    },
    "/assets/:assetId/permanent": {
      DELETE: secure(
        { action: "asset:purge", resourceParam: "assetId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const asset = await options.assets.get(
            context.tenantId,
            validId(params.assetId, "assetId"),
            { includeDeleted: true },
          );
          try {
            const allowed = await options.assertCanDeleteAsset({
              asset,
              context,
              request,
            });
            if (allowed !== undefined && allowed !== true) {
              throw new MediaPermissionDeniedError();
            }
          } catch {
            throw new MediaPermissionDeniedError(
              "The asset is still referenced by host content.",
            );
          }
          const result = await options.assets.permanentlyDelete({
            ...input,
            tenantId: context.tenantId,
            assetId: asset.id,
          });
          const response: MediaPermanentDeleteResult = {
            deleted: true,
            objectDeletionFailureCount: result.objectDeletionFailures.length,
          };
          return { body: response };
        },
      ),
    },
    "/assets/:assetId/read": {
      POST: secure(
        { action: "asset:read-url", resourceParam: "assetId" },
        async (_request, params, context) => {
          const asset = await options.assets.get(
            context.tenantId,
            validId(params.assetId, "assetId"),
          );
          if (asset.status !== "ready") {
            throw new MediaHttpError(
              409,
              "ASSET_CONFLICT",
              "Only processed media can be read.",
            );
          }
          const target = await options.objectStorage.createReadTarget(
            asset.object,
            readExpiresInMs,
          );
          if (
            !isSafeCapabilityUrl(target.url) ||
            target.expiresAt.getTime() <= Date.now() ||
            target.expiresAt.getTime() > Date.now() + readExpiresInMs
          ) {
            throw new MediaCapabilityError("short-lived-read-target");
          }
          const readTarget: MediaSignedReadTarget = {
            url: target.url,
            expiresAt: toIso(target.expiresAt),
          };
          return { body: { target: readTarget } };
        },
      ),
    },
    "/folders": {
      GET: secure({ action: "folder:list" }, async (request, _params, context) => {
        const page = await options.folders.list({
          ...parseFolderList(new URL(request.url)),
          tenantId: context.tenantId,
        });
        const result: MediaFolderPage = {
          items: page.items.map(serializeFolder),
          nextCursor: page.nextCursor,
        };
        return { body: result };
      }),
      POST: secure({ action: "folder:create" }, async (request, _params, context) => {
        const body = await parseJson(request);
        const input: MediaFolderCreateInput = {
          name: validText(body.name, "name", 255)!,
          ...(hasOwn(body, "parentId")
            ? {
                parentId:
                  body.parentId === null
                    ? null
                    : validId(body.parentId, "parentId"),
              }
            : {}),
        };
        const folder = await options.folders.create({
          ...input,
          tenantId: context.tenantId,
          actorId: context.actorId,
        });
        return { body: { folder: serializeFolder(folder) }, status: 201 };
      }),
    },
    "/folders/:folderId": {
      GET: secure(
        { action: "folder:read", resourceParam: "folderId" },
        async (_request, params, context) => {
          const folder = await options.folders.get(
            context.tenantId,
            validId(params.folderId, "folderId"),
          );
          return { body: { folder: serializeFolder(folder) } };
        },
      ),
      PATCH: secure(
        { action: "folder:update", resourceParam: "folderId" },
        async (request, params, context) => {
          const folderId = validId(params.folderId, "folderId");
          const input = parseFolderUpdate(await parseJson(request));
          const mutation = {
            tenantId: context.tenantId,
            folderId,
            expectedRevision: input.expectedRevision,
            actorId: context.actorId,
          };
          const folder = "name" in input
            ? await options.folders.rename({ ...mutation, name: input.name! })
            : await options.folders.move({
                ...mutation,
                parentId: input.parentId ?? null,
              });
          return { body: { folder: serializeFolder(folder) } };
        },
      ),
      DELETE: secure(
        { action: "folder:delete", resourceParam: "folderId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const folder = await options.folders.delete({
            ...input,
            tenantId: context.tenantId,
            folderId: validId(params.folderId, "folderId"),
            actorId: context.actorId,
          });
          return { body: { folder: serializeFolder(folder) } };
        },
      ),
    },
    "/folders/:folderId/restore": {
      POST: secure(
        { action: "folder:restore", resourceParam: "folderId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const folder = await options.folders.restore({
            ...input,
            tenantId: context.tenantId,
            folderId: validId(params.folderId, "folderId"),
            actorId: context.actorId,
          });
          return { body: { folder: serializeFolder(folder) } };
        },
      ),
    },
    "/folders/:folderId/permanent": {
      DELETE: secure(
        { action: "folder:purge", resourceParam: "folderId" },
        async (request, params, context) => {
          const input = parseRevision(await parseJson(request));
          const deleted = await options.folders.permanentlyDelete({
            ...input,
            tenantId: context.tenantId,
            folderId: validId(params.folderId, "folderId"),
            actorId: context.actorId,
          });
          return { body: { deleted } };
        },
      ),
    },
  };

  if (options.processing && options.resolveProcessingProfiles) {
    routes["/assets/:assetId/processing"] = {
      POST: secure(
        { action: "asset:process", resourceParam: "assetId" },
        async (_request, params, context) => {
          const asset = await options.assets.get(
            context.tenantId,
            validId(params.assetId, "assetId"),
          );
          const profiles = await processingProfiles(
            asset,
            options.resolveProcessingProfiles!,
          );
          const job = await options.processing!.enqueue({
            tenantId: context.tenantId,
            assetId: asset.id,
            kind: asset.kind as "image" | "video",
            profiles,
            idempotencyKey: `fullstack-media:${asset.id}:${asset.revision}`,
          });
          return { body: { processing: serializeProcessing(job) }, status: 202 };
        },
      ),
    };
  }

  const routeMap = Object.fromEntries(
    Object.entries(routes).map(([route, handlers]) => [
      `${normalizedBasePath}${route}`,
      handlers,
    ]),
  ) as MediaRouteHandlerMap;
  const dispatch = async (request: Request): Promise<Response> => {
    const match = matchRoute(routeMap, new URL(request.url).pathname);
    if (!match) return emptyResponse(404);
    const allowed = routeMap[match.route]!;
    const method = request.method.toUpperCase();
    if (!["GET", "POST", "PATCH", "DELETE"].includes(method)) {
      return emptyResponse(405, { Allow: Object.keys(allowed).join(", ") });
    }
    const handler = allowed[method as MediaHttpMethod];
    if (!handler) {
      return emptyResponse(405, { Allow: Object.keys(allowed).join(", ") });
    }
    return handler(request, match.params);
  };

  return {
    routes: routeMap,
    initialize,
    readiness,
    cleanup,
    dispatch,
  };
};

export type {
  MediaApiAsset,
  MediaApiFolder,
  MediaAssetListInput,
  MediaAssetPage,
  MediaAssetUpdateInput,
  MediaCompleteUploadInput,
  MediaFinalizeUploadInput,
  MediaFolderCreateInput,
  MediaFolderListInput,
  MediaFolderPage,
  MediaFolderUpdateInput,
  MediaPermanentDeleteResult,
  MediaProcessingStatus,
  MediaRevisionInput,
  MediaSignedReadTarget,
  MediaUploadIntent,
  MediaUploadIntentInput,
  MediaUploadPartCompletion,
  MediaUploadPartTarget,
  MediaUploadStatus,
} from "../shared";
