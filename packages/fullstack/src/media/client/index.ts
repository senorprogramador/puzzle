import type {
  MediaAssetListInput,
  MediaAssetPage,
  MediaAssetUpdateInput,
  MediaApiAsset,
  MediaApiError,
  MediaApiErrorCode,
  MediaApiFolder,
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
  MediaUploadFileInfo,
  MediaUploadProgress,
  MediaUploadResumeData,
  MediaUploadStatus,
  MediaUploadTarget,
} from "../shared";
import type { MediaKind } from "@puzzle-ui/media";

export type MediaClientErrorOptions = {
  readonly status: number;
  readonly code: MediaApiErrorCode;
  readonly retryable?: boolean;
};

export class MediaClientError extends Error {
  readonly status: number;
  readonly code: MediaApiErrorCode;
  readonly retryable: boolean;

  constructor(message: string, options: MediaClientErrorOptions) {
    super(message);
    this.name = "MediaClientError";
    this.status = options.status;
    this.code = options.code;
    this.retryable =
      options.retryable ??
      (options.status === 408 ||
        options.status === 425 ||
        options.status === 429 ||
        options.status >= 500);
  }
}

export type MediaClientRequestOptions = {
  readonly signal?: AbortSignal;
};

export type MediaUploadTransportInput = {
  readonly target: MediaUploadTarget;
  readonly file: Blob;
  readonly signal?: AbortSignal;
  readonly onProgress: (loaded: number, total: number) => void;
};

export type MediaUploadTransport = (
  input: MediaUploadTransportInput,
) => Promise<string | void>;

export type MediaClientOptions = {
  readonly basePath?: string;
  readonly fetch?: typeof fetch;
  readonly uploadTransport?: MediaUploadTransport;
};

export type MediaClient = {
  createUploadIntent(
    input: MediaUploadIntentInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaUploadIntent>;
  getUploadStatus(
    uploadId: string,
    options?: MediaClientRequestOptions,
  ): Promise<MediaUploadStatus>;
  completeUpload(
    uploadId: string,
    input: MediaCompleteUploadInput,
    options?: MediaClientRequestOptions,
  ): Promise<{ readonly asset: MediaApiAsset; readonly replayed: boolean }>;
  createMultipartPartTargets(
    uploadId: string,
    partNumbers: readonly number[],
    options?: MediaClientRequestOptions,
  ): Promise<readonly MediaUploadPartTarget[]>;
  abortUpload(
    uploadId: string,
    options?: MediaClientRequestOptions,
  ): Promise<{ readonly aborted: boolean }>;
  listAssets(
    input?: MediaAssetListInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaAssetPage>;
  getAsset(
    assetId: string,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiAsset>;
  updateAsset(
    assetId: string,
    input: MediaAssetUpdateInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiAsset>;
  deleteAsset(
    assetId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiAsset>;
  restoreAsset(
    assetId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiAsset>;
  permanentlyDeleteAsset(
    assetId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaPermanentDeleteResult>;
  createReadTarget(
    assetId: string,
    options?: MediaClientRequestOptions,
  ): Promise<MediaSignedReadTarget>;
  requestProcessing(
    assetId: string,
    options?: MediaClientRequestOptions,
  ): Promise<MediaProcessingStatus>;
  listFolders(
    input?: MediaFolderListInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaFolderPage>;
  getFolder(
    folderId: string,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiFolder>;
  createFolder(
    input: MediaFolderCreateInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiFolder>;
  updateFolder(
    folderId: string,
    input: MediaFolderUpdateInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiFolder>;
  deleteFolder(
    folderId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiFolder>;
  restoreFolder(
    folderId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<MediaApiFolder>;
  permanentlyDeleteFolder(
    folderId: string,
    input: MediaRevisionInput,
    options?: MediaClientRequestOptions,
  ): Promise<{ readonly deleted: boolean }>;
  uploadTransport: MediaUploadTransport;
};

export type MediaUploadFileInput = {
  readonly file: File;
  readonly kind: MediaKind;
  readonly metadata: Omit<MediaFinalizeUploadInput, "originalName" | "kind">;
  readonly expectedChecksum?: MediaUploadIntentInput["expectedChecksum"];
};

export type MediaUploadOptions = {
  readonly signal?: AbortSignal;
  readonly onProgress?: (progress: MediaUploadProgress) => void;
};

export type MediaUploadQueueOptions = {
  readonly maxConcurrentUploads?: number;
  readonly maxRetries?: number;
  readonly retryDelayMs?: number;
};

export type MediaUploadQueue = {
  createTask(
    input: MediaUploadFileInput,
    options?: MediaUploadOptions,
  ): MediaUploadTask;
  upload(
    input: MediaUploadFileInput,
    options?: MediaUploadOptions,
  ): Promise<MediaApiAsset>;
  /** Resumes serialized state only after the caller reselects the original File. */
  resume(
    data: MediaUploadResumeData | string,
    file: File,
    options?: MediaUploadOptions,
  ): MediaUploadTask;
  close(): void;
};

export type MediaUploadTaskStatus =
  | "queued"
  | "creating-intent"
  | "uploading"
  | "paused"
  | "finalizing"
  | "completed"
  | "failed"
  | "cancelled";

export type MediaUploadTask = {
  readonly id: string;
  readonly promise: Promise<MediaApiAsset>;
  readonly status: MediaUploadTaskStatus;
  /**
   * Pauses at the next safe boundary without aborting the server session.
   * A single PUT finishes first; multipart pauses after the current part.
   */
  pause(): Promise<void>;
  /** Resumes with the original file selected again. */
  resume(file: File): void;
  /** Cancels the transfer and aborts its server upload session. */
  cancel(): Promise<void>;
  getResumeData(): MediaUploadResumeData | null;
};

class MediaTransferError extends Error {
  readonly retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.name = "MediaTransferError";
    this.retryable = retryable;
  }
}

const PAUSED = Symbol("media-upload-paused");

const abortError = (): Error => {
  const error = new Error("The media upload was aborted.");
  error.name = "AbortError";
  return error;
};

const retryableError = (error: unknown): boolean => {
  if (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "MediaIdempotencyConflictError")
  ) {
    return false;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "retryable" in error &&
    typeof error.retryable === "boolean"
  ) {
    return error.retryable;
  }
  return true;
};

const delay = (milliseconds: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });

const uploadWithXhr: MediaUploadTransport = ({
  target,
  file,
  signal,
  onProgress,
}) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    if (typeof XMLHttpRequest === "undefined") {
      reject(
        new MediaClientError("XMLHttpRequest is unavailable in this environment.", {
          status: 501,
          code: "CAPABILITY",
          retryable: false,
        }),
      );
      return;
    }

    const request = new XMLHttpRequest();
    let settled = false;
    const settle = (operation: () => void) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      operation();
    };
    const onAbort = () => request.abort();

    request.open(target.method, target.url, true);
    request.withCredentials = false;
    for (const [name, value] of Object.entries(target.headers)) {
      request.setRequestHeader(name, value);
    }
    request.upload.onprogress = (event) => {
      onProgress(event.loaded, event.lengthComputable ? event.total : file.size);
    };
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        const etag = request.getResponseHeader("ETag") ?? undefined;
        settle(() => resolve(etag));
      } else {
        settle(() =>
          reject(
            new MediaTransferError(
              "The file transfer was rejected by the upload target.",
              request.status === 408 ||
                request.status === 425 ||
                request.status === 429 ||
                request.status >= 500,
            ),
          ),
        );
      }
    };
    request.onerror = () =>
      settle(() =>
        reject(new MediaTransferError("The file transfer failed.", true)),
      );
    request.onabort = () => settle(() => reject(abortError()));
    signal?.addEventListener("abort", onAbort, { once: true });
    request.send(file);
  });

const apiPath = (basePath: string, path: string): string =>
  `${basePath}${path.startsWith("/") ? path : `/${path}`}`;

const encode = (value: string): string => encodeURIComponent(value);

const serializeQuery = (
  values: Record<string, unknown> | undefined,
): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values ?? {})) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const entry of value) query.append(key, String(entry));
    } else if (value !== null && typeof value === "object") {
      query.set(key, JSON.stringify(value));
    } else {
      query.set(key, value === null ? "" : String(value));
    }
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

export const createMediaClient = (options: MediaClientOptions = {}): MediaClient => {
  const basePath = (options.basePath ?? "/api/media").replace(/\/+$/, "");
  if (!basePath.startsWith("/") || basePath.includes("?") || basePath.includes("#")) {
    throw new TypeError("basePath must be an absolute URL path.");
  }
  const fetcher = options.fetch ?? ((input, init) => fetch(input, init));
  const uploadTransport = options.uploadTransport ?? uploadWithXhr;

  const request = async <T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> => {
    let response: Response;
    try {
      response = await fetcher(apiPath(basePath, path), {
        ...init,
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          ...init.headers,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      throw new MediaClientError("The media service could not be reached.", {
        status: 503,
        code: "CAPABILITY",
        retryable: true,
      });
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (!response.ok) {
      const error = body as MediaApiError | null;
      const detail = error && typeof error === "object" && "error" in error
        ? error.error
        : undefined;
      throw new MediaClientError(
        typeof detail?.message === "string"
          ? detail.message
          : "The media request failed.",
        {
          status: response.status,
          code:
            typeof detail?.code === "string"
              ? detail.code as MediaApiErrorCode
              : "INTERNAL",
        },
      );
    }
    return body as T;
  };

  return {
    async createUploadIntent(input, requestOptions) {
      const result = await request<{ readonly intent: MediaUploadIntent }>(
        "/uploads/intent",
        {
          method: "POST",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.intent;
    },
    async getUploadStatus(uploadId, requestOptions) {
      const result = await request<{ readonly upload: MediaUploadStatus }>(
        `/uploads/${encode(uploadId)}`,
        { signal: requestOptions?.signal },
      );
      return result.upload;
    },
    completeUpload(uploadId, input, requestOptions) {
      return request(`/uploads/${encode(uploadId)}/complete`, {
        method: "POST",
        body: JSON.stringify(input),
        signal: requestOptions?.signal,
      });
    },
    async createMultipartPartTargets(uploadId, partNumbers, requestOptions) {
      const result = await request<{
        readonly targets: readonly MediaUploadPartTarget[];
      }>(`/uploads/${encode(uploadId)}/parts`, {
        method: "POST",
        body: JSON.stringify({ partNumbers }),
        signal: requestOptions?.signal,
      });
      return result.targets;
    },
    abortUpload(uploadId, requestOptions) {
      return request(`/uploads/${encode(uploadId)}/abort`, {
        method: "POST",
        signal: requestOptions?.signal,
      });
    },
    async listAssets(input, requestOptions) {
      return request(`/assets${serializeQuery(input as Record<string, unknown> | undefined)}`, {
        signal: requestOptions?.signal,
      });
    },
    async getAsset(assetId, requestOptions) {
      const result = await request<{ readonly asset: MediaApiAsset }>(
        `/assets/${encode(assetId)}`,
        { signal: requestOptions?.signal },
      );
      return result.asset;
    },
    async updateAsset(assetId, input, requestOptions) {
      const result = await request<{ readonly asset: MediaApiAsset }>(
        `/assets/${encode(assetId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.asset;
    },
    async deleteAsset(assetId, input, requestOptions) {
      const result = await request<{ readonly asset: MediaApiAsset }>(
        `/assets/${encode(assetId)}`,
        {
          method: "DELETE",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.asset;
    },
    async restoreAsset(assetId, input, requestOptions) {
      const result = await request<{ readonly asset: MediaApiAsset }>(
        `/assets/${encode(assetId)}/restore`,
        {
          method: "POST",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.asset;
    },
    permanentlyDeleteAsset(assetId, input, requestOptions) {
      return request(`/assets/${encode(assetId)}/permanent`, {
        method: "DELETE",
        body: JSON.stringify(input),
        signal: requestOptions?.signal,
      });
    },
    async createReadTarget(assetId, requestOptions) {
      const result = await request<{ readonly target: MediaSignedReadTarget }>(
        `/assets/${encode(assetId)}/read`,
        {
          method: "POST",
          signal: requestOptions?.signal,
        },
      );
      return result.target;
    },
    async requestProcessing(assetId, requestOptions) {
      const result = await request<{ readonly processing: MediaProcessingStatus }>(
        `/assets/${encode(assetId)}/processing`,
        {
          method: "POST",
          signal: requestOptions?.signal,
        },
      );
      return result.processing;
    },
    async listFolders(input, requestOptions) {
      return request(`/folders${serializeQuery(input as Record<string, unknown> | undefined)}`, {
        signal: requestOptions?.signal,
      });
    },
    async getFolder(folderId, requestOptions) {
      const result = await request<{ readonly folder: MediaApiFolder }>(
        `/folders/${encode(folderId)}`,
        { signal: requestOptions?.signal },
      );
      return result.folder;
    },
    async createFolder(input, requestOptions) {
      const result = await request<{ readonly folder: MediaApiFolder }>(
        "/folders",
        {
          method: "POST",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.folder;
    },
    async updateFolder(folderId, input, requestOptions) {
      const result = await request<{ readonly folder: MediaApiFolder }>(
        `/folders/${encode(folderId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.folder;
    },
    async deleteFolder(folderId, input, requestOptions) {
      const result = await request<{ readonly folder: MediaApiFolder }>(
        `/folders/${encode(folderId)}`,
        {
          method: "DELETE",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.folder;
    },
    async restoreFolder(folderId, input, requestOptions) {
      const result = await request<{ readonly folder: MediaApiFolder }>(
        `/folders/${encode(folderId)}/restore`,
        {
          method: "POST",
          body: JSON.stringify(input),
          signal: requestOptions?.signal,
        },
      );
      return result.folder;
    },
    permanentlyDeleteFolder(folderId, input, requestOptions) {
      return request(`/folders/${encode(folderId)}/permanent`, {
        method: "DELETE",
        body: JSON.stringify(input),
        signal: requestOptions?.signal,
      });
    },
    uploadTransport,
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSerializableText = (
  value: unknown,
  maxLength: number,
  allowEmpty = false,
): value is string =>
  typeof value === "string" &&
  value.length <= maxLength &&
  (allowEmpty || value.trim() !== "") &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);

const safeMetadata = (
  value: unknown,
): MediaUploadResumeData["metadata"] => {
  if (!isRecord(value)) {
    throw new TypeError("Resume metadata must be an object.");
  }
  const result: Record<string, unknown> = {};
  const stringLimits: Record<string, number> = {
    displayName: 255,
    altText: 1_000,
    caption: 1_000,
    title: 1_000,
    description: 5_000,
  };
  for (const [field, maxLength] of Object.entries(stringLimits)) {
    if (!Object.prototype.hasOwnProperty.call(value, field)) continue;
    const fieldValue = value[field];
    if (
      (field === "displayName" && !isSerializableText(fieldValue, maxLength)) ||
      (field !== "displayName" &&
        fieldValue !== null &&
        !isSerializableText(fieldValue, maxLength, true))
    ) {
      throw new TypeError(`Resume metadata field ${field} is invalid.`);
    }
    result[field] = fieldValue;
  }
  if (Object.prototype.hasOwnProperty.call(value, "folderId")) {
    const folderId = value.folderId;
    if (
      folderId !== null &&
      (!isSerializableText(folderId, 256) || /[\\/]/.test(folderId))
    ) {
      throw new TypeError("Resume metadata folderId is invalid.");
    }
    result.folderId = folderId;
  }
  for (const field of ["width", "height", "orientation"] as const) {
    if (!Object.prototype.hasOwnProperty.call(value, field)) continue;
    const fieldValue = value[field];
    const max = field === "orientation" ? 8 : 100_000;
    if (!Number.isSafeInteger(fieldValue) || (fieldValue as number) < 1 || (fieldValue as number) > max) {
      throw new TypeError(`Resume metadata field ${field} is invalid.`);
    }
    result[field] = fieldValue;
  }
  if (Object.prototype.hasOwnProperty.call(value, "duration")) {
    const duration = value.duration;
    if (
      typeof duration !== "number" ||
      !Number.isFinite(duration) ||
      duration < 0 ||
      duration > 86_400
    ) {
      throw new TypeError("Resume metadata duration is invalid.");
    }
    result.duration = duration;
  }
  if (Object.prototype.hasOwnProperty.call(value, "tags")) {
    if (
      !Array.isArray(value.tags) ||
      value.tags.length > 100 ||
      value.tags.some((tag) => !isSerializableText(tag, 64, true))
    ) {
      throw new TypeError("Resume metadata tags are invalid.");
    }
    result.tags = [...value.tags];
  }
  if (Object.prototype.hasOwnProperty.call(value, "crop")) {
    const crop = value.crop;
    if (crop === null) {
      result.crop = null;
    } else if (
      isRecord(crop) &&
      ["x", "y", "width", "height"].every(
        (field) =>
          typeof crop[field] === "number" &&
          Number.isFinite(crop[field]),
      )
    ) {
      result.crop = {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
      };
    } else {
      throw new TypeError("Resume metadata crop is invalid.");
    }
  }
  if (Object.prototype.hasOwnProperty.call(value, "focalPoint")) {
    const focalPoint = value.focalPoint;
    if (focalPoint === null) {
      result.focalPoint = null;
    } else if (
      isRecord(focalPoint) &&
      typeof focalPoint.x === "number" &&
      Number.isFinite(focalPoint.x) &&
      typeof focalPoint.y === "number" &&
      Number.isFinite(focalPoint.y)
    ) {
      result.focalPoint = { x: focalPoint.x, y: focalPoint.y };
    } else {
      throw new TypeError("Resume metadata focalPoint is invalid.");
    }
  }
  if (Object.prototype.hasOwnProperty.call(value, "hotspots")) {
    if (!Array.isArray(value.hotspots) || value.hotspots.length > 100) {
      throw new TypeError("Resume metadata hotspots are invalid.");
    }
    result.hotspots = value.hotspots.map((hotspot) => {
      if (
        !isRecord(hotspot) ||
        !isSerializableText(hotspot.id, 128) ||
        typeof hotspot.x !== "number" ||
        !Number.isFinite(hotspot.x) ||
        typeof hotspot.y !== "number" ||
        !Number.isFinite(hotspot.y)
      ) {
        throw new TypeError("Resume metadata hotspot is invalid.");
      }
      const safeHotspot: Record<string, unknown> = {
        id: hotspot.id,
        x: hotspot.x,
        y: hotspot.y,
      };
      for (const field of ["width", "height"] as const) {
        if (hotspot[field] !== undefined) {
          if (typeof hotspot[field] !== "number" || !Number.isFinite(hotspot[field])) {
            throw new TypeError(`Resume metadata hotspot ${field} is invalid.`);
          }
          safeHotspot[field] = hotspot[field];
        }
      }
      if (hotspot.label !== undefined) {
        if (!isSerializableText(hotspot.label, 1_000, true)) {
          throw new TypeError("Resume metadata hotspot label is invalid.");
        }
        safeHotspot.label = hotspot.label;
      }
      if (hotspot.data !== undefined) {
        if (!isRecord(hotspot.data)) {
          throw new TypeError("Resume metadata hotspot data is invalid.");
        }
        const data: Record<string, string | number | boolean | null> = {};
        for (const [key, item] of Object.entries(hotspot.data)) {
          if (
            !isSerializableText(key, 128) ||
            !(
              item === null ||
              typeof item === "string" ||
              typeof item === "boolean" ||
              (typeof item === "number" && Number.isFinite(item))
            )
          ) {
            throw new TypeError("Resume metadata hotspot data is invalid.");
          }
          data[key] = item;
        }
        safeHotspot.data = data;
      }
      return safeHotspot;
    });
  }
  return result as MediaUploadResumeData["metadata"];
};

const sanitizeResumeData = (value: unknown): MediaUploadResumeData => {
  if (!isRecord(value) || value.version !== 1) {
    throw new TypeError("Unsupported media upload resume data.");
  }
  if (
    !isSerializableText(value.uploadSessionId, 256) ||
    /[\\/]/.test(value.uploadSessionId)
  ) {
    throw new TypeError("Resume upload session ID is invalid.");
  }
  if (value.mode !== "single" && value.mode !== "multipart") {
    throw new TypeError("Resume upload mode is invalid.");
  }
  if (
    !isRecord(value.fileInfo) ||
    !isSerializableText(value.fileInfo.name, 255, true) ||
    !isSerializableText(value.fileInfo.type, 255, true) ||
    !Number.isSafeInteger(value.fileInfo.size) ||
    (value.fileInfo.size as number) < 1 ||
    !Number.isSafeInteger(value.fileInfo.lastModified) ||
    (value.fileInfo.lastModified as number) < 0
  ) {
    throw new TypeError("Resume file metadata is invalid.");
  }
  if (!["image", "video", "audio", "document", "other"].includes(String(value.kind))) {
    throw new TypeError("Resume media kind is invalid.");
  }
  if (typeof value.singleTransferComplete !== "boolean") {
    throw new TypeError("Resume transfer state is invalid.");
  }
  const completedParts: MediaUploadPartCompletion[] = [];
  if (
    !Array.isArray(value.completedParts) ||
    value.completedParts.length > 10_000
  ) {
    throw new TypeError("Resume multipart state is invalid.");
  }
  const seenParts = new Set<number>();
  for (const part of value.completedParts) {
    if (
      !isRecord(part) ||
      !Number.isSafeInteger(part.partNumber) ||
      (part.partNumber as number) < 1 ||
      (part.partNumber as number) > 10_000 ||
      !isSerializableText(part.etag, 128) ||
      !/^[\x21-\x7e]+$/.test(part.etag) ||
      seenParts.has(part.partNumber as number)
    ) {
      throw new TypeError("Resume multipart state is invalid.");
    }
    seenParts.add(part.partNumber as number);
    completedParts.push({
      partNumber: part.partNumber as number,
      etag: part.etag,
    });
  }
  completedParts.sort((left, right) => left.partNumber - right.partNumber);

  const partSizeBytes = value.partSizeBytes;
  if (value.mode === "multipart") {
    if (
      !Number.isSafeInteger(partSizeBytes) ||
      (partSizeBytes as number) < 1
    ) {
      throw new TypeError("Resume multipart part size is invalid.");
    }
  } else if (
    partSizeBytes !== undefined ||
    completedParts.length > 0 ||
    !value.singleTransferComplete
  ) {
    throw new TypeError("Single-upload resume data cannot contain multipart state.");
  }

  const result: MediaUploadResumeData = {
    version: 1,
    uploadSessionId: value.uploadSessionId,
    mode: value.mode,
    fileInfo: {
      name: value.fileInfo.name,
      size: value.fileInfo.size as number,
      type: value.fileInfo.type,
      lastModified: value.fileInfo.lastModified as number,
    },
    kind: value.kind as MediaKind,
    metadata: safeMetadata(value.metadata ?? {}),
    completedParts,
    singleTransferComplete: value.singleTransferComplete,
    ...(value.mode === "multipart"
      ? { partSizeBytes: partSizeBytes as number }
      : {}),
  };
  return result;
};

/** Serializes allowlisted session/file metadata and ETags, never upload targets or the File. */
export const serializeMediaUploadResumeData = (
  data: MediaUploadResumeData,
): string => JSON.stringify(sanitizeResumeData(data));

/** Revalidates serialized resume data before it is used with a reselected File. */
export const parseMediaUploadResumeData = (
  serialized: string,
): MediaUploadResumeData => {
  if (typeof serialized !== "string") {
    throw new TypeError("Serialized media upload resume data must be a string.");
  }
  try {
    return sanitizeResumeData(JSON.parse(serialized));
  } catch (error) {
    if (error instanceof TypeError) throw error;
    throw new TypeError("Serialized media upload resume data is invalid.");
  }
};

export const createMediaUploadQueue = (
  client: MediaClient,
  options: MediaUploadQueueOptions = {},
): MediaUploadQueue => {
  const concurrency = options.maxConcurrentUploads ?? 3;
  const maxRetries = options.maxRetries ?? 2;
  const maxAttempts = maxRetries + 1;
  const retryDelayMs = options.retryDelayMs ?? 250;
  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > 16 ||
    !Number.isInteger(maxRetries) ||
    maxRetries < 0 ||
    maxRetries > 5 ||
    !Number.isInteger(retryDelayMs) ||
    retryDelayMs < 0 ||
    retryDelayMs > 30_000
  ) {
    throw new RangeError("Invalid media upload queue limits.");
  }

  type SessionState = {
    uploadId?: string;
    mode?: "single" | "multipart";
    intent?: MediaUploadIntent;
    partSizeBytes?: number;
    completedParts: MediaUploadPartCompletion[];
    singleTransferComplete: boolean;
    verified: boolean;
    abortPromise?: Promise<void>;
  };
  type TaskRecord = {
    readonly id: string;
    input: MediaUploadFileInput;
    readonly options: MediaUploadOptions;
    readonly controller: AbortController;
    readonly promise: Promise<MediaApiAsset>;
    readonly resolve: (asset: MediaApiAsset) => void;
    readonly reject: (error: unknown) => void;
    readonly session: SessionState;
    status: MediaUploadTaskStatus;
    pauseRequested: boolean;
    pausePromise?: Promise<void>;
    resolvePause?: () => void;
    rejectPause?: (error: unknown) => void;
    externalAbortListener?: () => void;
    cancelled: boolean;
    settled: boolean;
    inRun: boolean;
    cancelPromise?: Promise<void>;
  };

  const waiting: TaskRecord[] = [];
  const tasks = new Set<TaskRecord>();
  let active = 0;
  let closed = false;
  let nextTaskId = 0;

  const notify = (
    task: TaskRecord,
    progress: MediaUploadProgress,
  ): void => {
    try {
      task.options.onProgress?.(progress);
    } catch {
      // Progress observers do not own the upload lifecycle.
    }
  };

  const fileInfo = (file: File) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });

  const sameFile = (file: File, expected: MediaUploadResumeData["fileInfo"]) =>
    file.name === expected.name &&
    file.size === expected.size &&
    file.type === expected.type &&
    file.lastModified === expected.lastModified;

  const resumeData = (task: TaskRecord): MediaUploadResumeData | null => {
    const { uploadId, mode, partSizeBytes, completedParts, singleTransferComplete } =
      task.session;
    if (
      task.status !== "paused" ||
      !uploadId ||
      !mode ||
      (mode === "single" && !singleTransferComplete)
    ) {
      return null;
    }
    return sanitizeResumeData({
      version: 1,
      uploadSessionId: uploadId,
      mode,
      fileInfo: fileInfo(task.input.file),
      kind: task.input.kind,
      metadata: task.input.metadata,
      ...(partSizeBytes !== undefined ? { partSizeBytes } : {}),
      completedParts,
      singleTransferComplete,
    });
  };

  const removeFromQueue = (task: TaskRecord) => {
    const index = waiting.indexOf(task);
    if (index >= 0) waiting.splice(index, 1);
  };

  const settle = (
    task: TaskRecord,
    status: "completed" | "failed" | "cancelled",
    result?: MediaApiAsset,
    error?: unknown,
  ): void => {
    if (task.settled) return;
    task.settled = true;
    task.status = status;
    task.options.signal?.removeEventListener(
      "abort",
      task.externalAbortListener!,
    );
    tasks.delete(task);
    if (task.resolvePause) {
      if (error !== undefined && status !== "cancelled") {
        task.rejectPause?.(error);
      } else {
        task.resolvePause();
      }
      task.resolvePause = undefined;
      task.rejectPause = undefined;
    }
    if (status === "completed" && result) task.resolve(result);
    else task.reject(error ?? abortError());
  };

  const abortServerSession = (task: TaskRecord): Promise<void> => {
    const uploadId = task.session.uploadId;
    if (!uploadId) return Promise.resolve();
    if (!task.session.abortPromise) {
      task.session.abortPromise = client
        .abortUpload(uploadId)
        .then(() => undefined);
    }
    return task.session.abortPromise;
  };

  const cancelTask = (task: TaskRecord): Promise<void> => {
    if (task.settled) return Promise.resolve();
    if (task.cancelPromise) return task.cancelPromise;
    task.cancelled = true;
    task.pauseRequested = false;
    task.controller.abort();
    removeFromQueue(task);
    task.status = "cancelled";
    task.cancelPromise = (async () => {
      let abortFailure: unknown;
      try {
        await abortServerSession(task);
      } catch (error) {
        abortFailure = error;
      }
      if (task.inRun) {
        await task.promise.catch(() => undefined);
      } else {
        settle(task, "cancelled", undefined, abortError());
      }
      if (abortFailure !== undefined) throw abortFailure;
    })();
    return task.cancelPromise;
  };

  const createRecord = (
    input: MediaUploadFileInput,
    uploadOptions: MediaUploadOptions,
    session?: Partial<SessionState>,
  ): TaskRecord => {
    let resolve!: (asset: MediaApiAsset) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<MediaApiAsset>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    const task: TaskRecord = {
      id: `media-task-${++nextTaskId}`,
      input,
      options: uploadOptions,
      controller: new AbortController(),
      promise,
      resolve,
      reject,
      session: {
        completedParts: [],
        singleTransferComplete: false,
        verified: false,
        ...session,
      },
      status: "queued",
      pauseRequested: false,
      cancelled: false,
      settled: false,
      inRun: false,
    };
    task.externalAbortListener = () => {
      void cancelTask(task).catch(() => undefined);
    };
    tasks.add(task);
    if (uploadOptions.signal?.aborted) {
      void cancelTask(task);
    } else {
      uploadOptions.signal?.addEventListener(
        "abort",
        task.externalAbortListener,
        { once: true },
      );
    }
    return task;
  };

  const taskHandle = (task: TaskRecord): MediaUploadTask => ({
    id: task.id,
    promise: task.promise,
    get status() {
      return task.status;
    },
    pause: () => {
      if (closed) {
        return Promise.reject(new Error("The media upload queue is closed."));
      }
      if (task.settled || task.status === "paused") return Promise.resolve();
      if (task.status === "finalizing") {
        return Promise.reject(
          new MediaClientError("An upload cannot be paused during finalization.", {
            status: 409,
            code: "ASSET_CONFLICT",
            retryable: false,
          }),
        );
      }
      task.pauseRequested = true;
      if (!task.inRun) {
        removeFromQueue(task);
        task.pauseRequested = false;
        task.status = "paused";
        return Promise.resolve();
      }
      if (!task.pausePromise) {
        task.pausePromise = new Promise<void>((resolve, reject) => {
          task.resolvePause = resolve;
          task.rejectPause = reject;
        });
      }
      return task.pausePromise;
    },
    resume: (file) => {
      if (closed) throw new Error("The media upload queue is closed.");
      if (task.settled || task.status !== "paused") {
        throw new Error("Only a paused media upload can be resumed.");
      }
      const expected = fileInfo(task.input.file);
      if (!sameFile(file, expected)) {
        throw new TypeError("The reselected file does not match the paused upload.");
      }
      if (
        task.session.mode === "single" &&
        !task.session.singleTransferComplete &&
        !task.session.intent?.target
      ) {
        throw new TypeError("This single upload cannot be resumed without its target.");
      }
      task.input = { ...task.input, file };
      task.pauseRequested = false;
      task.pausePromise = undefined;
      task.resolvePause = undefined;
      task.rejectPause = undefined;
      task.status = "queued";
      waiting.push(task);
      pump();
    },
    cancel: () => cancelTask(task),
    getResumeData: () => resumeData(task),
  });

  const checkpoint = (task: TaskRecord): boolean => {
    if (task.cancelled) throw abortError();
    if (!task.pauseRequested) return false;
    task.pauseRequested = false;
    task.status = "paused";
    task.resolvePause?.();
    task.resolvePause = undefined;
    task.rejectPause = undefined;
    return true;
  };

  const verifyResumedSession = async (task: TaskRecord): Promise<void> => {
    if (task.session.verified || !task.session.uploadId) return;
    const status = await client.getUploadStatus(task.session.uploadId, {
      signal: task.controller.signal,
    });
    if (status.state === "expired") {
      throw new MediaClientError("The upload session has expired.", {
        status: 410,
        code: "UPLOAD_EXPIRED",
        retryable: false,
      });
    }
    if (status.state === "aborted") {
      throw new MediaClientError("The upload session was cancelled.", {
        status: 409,
        code: "ASSET_CONFLICT",
        retryable: false,
      });
    }
    if (
      status.mode !== task.session.mode ||
      status.expectedSize !== task.input.file.size ||
      (status.mode === "multipart" &&
        status.partSizeBytes !== task.session.partSizeBytes)
    ) {
      throw new MediaClientError("The saved upload session does not match its resume data.", {
        status: 409,
        code: "ASSET_CONFLICT",
        retryable: false,
      });
    }
    if (status.state === "completed") {
      if (status.mode === "single") {
        task.session.singleTransferComplete = true;
      } else {
        const partCount = Math.ceil(
          task.input.file.size / task.session.partSizeBytes!,
        );
        if (task.session.completedParts.length !== partCount) {
          throw new MediaClientError("The completed upload is missing resume ETags.", {
            status: 409,
            code: "ASSET_CONFLICT",
            retryable: false,
          });
        }
      }
    }
    task.session.verified = true;
  };

  const execute = async (
    task: TaskRecord,
  ): Promise<MediaApiAsset | typeof PAUSED> => {
    const { file, kind, metadata, expectedChecksum } = task.input;
    const signal = task.controller.signal;
    const ensureActive = () => {
      if (task.cancelled || signal.aborted) throw abortError();
    };
    const ensureUnexpired = (expiresAt: string) => {
      if (!Number.isFinite(Date.parse(expiresAt)) || Date.parse(expiresAt) <= Date.now()) {
        throw new MediaClientError("The upload target has expired.", {
          status: 410,
          code: "UPLOAD_EXPIRED",
          retryable: false,
        });
      }
    };
    const reportProgress = (
      loaded: number,
      attempt: number,
    ) => {
      const boundedLoaded = Math.max(0, Math.min(file.size, loaded));
      notify(task, {
        phase: "uploading",
        loaded: boundedLoaded,
        total: file.size,
        percent: file.size
          ? Math.min(100, Math.round((boundedLoaded / file.size) * 100))
          : 0,
        attempt,
        maxAttempts,
      });
    };

    ensureActive();
    if (task.session.uploadId) {
      task.status = "creating-intent";
      await verifyResumedSession(task);
    } else {
      if (checkpoint(task)) return PAUSED;
      task.status = "creating-intent";
      notify(task, {
        phase: "intent",
        loaded: 0,
        total: file.size,
        percent: 0,
        attempt: 0,
        maxAttempts,
      });
      const intent = await client.createUploadIntent(
        {
          fileName: file.name,
          kind,
          mimeType: file.type,
          size: file.size,
          ...(expectedChecksum ? { expectedChecksum } : {}),
        },
        { signal },
      );
      ensureActive();
      ensureUnexpired(intent.expiresAt);
      task.session.uploadId = intent.id;
      task.session.mode = intent.mode;
      task.session.intent = intent;
      task.session.partSizeBytes = intent.partSizeBytes;
      task.session.verified = true;
    }

    const uploadId = task.session.uploadId!;
    const mode = task.session.mode!;
    let transferAttempt = 0;
    let transferred = 0;

    if (mode === "single" && !task.session.singleTransferComplete) {
      const target = task.session.intent?.target;
      if (!target) {
        throw new MediaClientError("A fresh upload target is required to resume.", {
          status: 409,
          code: "ASSET_CONFLICT",
          retryable: false,
        });
      }
      ensureUnexpired(target.expiresAt);
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        transferAttempt = attempt;
        ensureActive();
        ensureUnexpired(target.expiresAt);
        task.status = "uploading";
        notify(task, {
          phase: "uploading",
          loaded: 0,
          total: file.size,
          percent: 0,
          attempt,
          maxAttempts,
        });
        try {
          await client.uploadTransport({
            target,
            file,
            signal,
            onProgress: (loaded) => reportProgress(loaded, attempt),
          });
          task.session.singleTransferComplete = true;
          transferred = file.size;
          break;
        } catch (error) {
          if (attempt === maxAttempts || !retryableError(error)) throw error;
          await delay(retryDelayMs * attempt, signal);
        }
      }
      if (checkpoint(task)) return PAUSED;
    } else if (mode === "multipart") {
      const partSizeBytes = task.session.partSizeBytes;
      if (!Number.isSafeInteger(partSizeBytes) || !partSizeBytes) {
        throw new MediaClientError("The multipart upload configuration is invalid.", {
          status: 503,
          code: "CAPABILITY",
          retryable: false,
        });
      }
      const partCount = Math.ceil(file.size / partSizeBytes);
      if (partCount < 1 || partCount > 10_000) {
        throw new MediaClientError("The upload requires too many parts.", {
          status: 413,
          code: "PAYLOAD_TOO_LARGE",
          retryable: false,
        });
      }
      const completed = new Map(
        task.session.completedParts.map((part) => [part.partNumber, part]),
      );
      for (const partNumber of completed.keys()) {
        if (partNumber > partCount) {
          throw new MediaClientError("Resume data contains an invalid part number.", {
            status: 409,
            code: "ASSET_CONFLICT",
            retryable: false,
          });
        }
      }
      transferred = [...completed.keys()].reduce((total, partNumber) => {
        const start = (partNumber - 1) * partSizeBytes;
        return total + Math.min(partSizeBytes, file.size - start);
      }, 0);
      for (let partNumber = 1; partNumber <= partCount; partNumber += 1) {
        ensureActive();
        if (completed.has(partNumber)) continue;
        if (checkpoint(task)) return PAUSED;
        const start = (partNumber - 1) * partSizeBytes;
        const end = Math.min(file.size, start + partSizeBytes);
        const part = file.slice(start, end);
        let uploaded = false;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          transferAttempt = attempt;
          ensureActive();
          task.status = "uploading";
          try {
            const [target] = await client.createMultipartPartTargets(
              uploadId,
              [partNumber],
              { signal },
            );
            ensureActive();
            if (
              !target ||
              target.partNumber !== partNumber
            ) {
              throw new MediaClientError("The multipart part target is invalid.", {
                status: 503,
                code: "CAPABILITY",
                retryable: false,
              });
            }
            ensureUnexpired(target.expiresAt);
            if (checkpoint(task)) return PAUSED;
            const etag = await client.uploadTransport({
              target,
              file: part,
              signal,
              onProgress: (loaded) =>
                reportProgress(transferred + Math.min(part.size, loaded), attempt),
            });
            if (typeof etag !== "string" || etag.trim() === "") {
              throw new MediaClientError(
                "The upload target did not return the multipart part ETag.",
                {
                  status: 502,
                  code: "OBJECT_STORAGE",
                  retryable: false,
                },
              );
            }
            task.session.completedParts.push({ partNumber, etag });
            task.session.completedParts.sort((left, right) => left.partNumber - right.partNumber);
            completed.set(partNumber, { partNumber, etag });
            transferred += part.size;
            reportProgress(transferred, attempt);
            uploaded = true;
            break;
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") throw error;
            if (attempt === maxAttempts || !retryableError(error)) throw error;
            await delay(retryDelayMs * attempt, signal);
          }
        }
        if (!uploaded) throw new Error("A multipart transfer did not complete.");
        if (checkpoint(task)) return PAUSED;
      }
    } else if (mode !== "single") {
      throw new MediaClientError("The server returned an unsupported upload mode.", {
        status: 503,
        code: "CAPABILITY",
        retryable: false,
      });
    }

    if (checkpoint(task)) return PAUSED;
    ensureActive();
    task.status = "finalizing";
    notify(task, {
      phase: "finalizing",
      loaded: file.size,
      total: file.size,
      percent: 100,
      attempt: transferAttempt,
      maxAttempts,
    });
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      ensureActive();
      try {
        const result = await client.completeUpload(
          uploadId,
          {
            ...metadata,
            originalName: file.name,
            kind,
            ...(task.session.completedParts.length > 0
              ? { parts: task.session.completedParts }
              : {}),
          },
          { signal },
        );
        return result.asset;
      } catch (error) {
        if (attempt === maxAttempts || !retryableError(error)) throw error;
        await delay(retryDelayMs * attempt, signal);
      }
    }
    throw new Error("Media finalization did not complete.");
  };

  const settleTask = (
    task: TaskRecord,
    status: "completed" | "failed" | "cancelled",
    result?: MediaApiAsset,
    error?: unknown,
  ) => settle(task, status, result, error);

  const pump = (): void => {
    while (!closed && active < concurrency && waiting.length > 0) {
      const task = waiting.shift()!;
      if (task.settled || task.status !== "queued") continue;
      task.inRun = true;
      active += 1;
      notify(task, {
        phase: "queued",
        loaded: 0,
        total: task.input.file.size,
        percent: 0,
        attempt: 0,
        maxAttempts,
      });
      void execute(task)
        .then(async (result) => {
          if (result === PAUSED) return;
          settleTask(task, "completed", result);
        })
        .catch(async (error) => {
          if (task.session.uploadId) {
            await abortServerSession(task).catch(() => undefined);
          }
          settleTask(
            task,
            task.cancelled ? "cancelled" : "failed",
            undefined,
            task.cancelled ? abortError() : error,
          );
        })
        .finally(() => {
          task.inRun = false;
          active -= 1;
          pump();
        });
    }
  };

  const create = (
    input: MediaUploadFileInput,
    uploadOptions: MediaUploadOptions = {},
    session?: Partial<SessionState>,
  ): MediaUploadTask => {
    if (closed) throw new Error("The media upload queue is closed.");
    const task = createRecord(input, uploadOptions, session);
    if (!task.cancelled) {
      waiting.push(task);
      pump();
    }
    return taskHandle(task);
  };

  return {
    createTask(input, uploadOptions) {
      return create(input, uploadOptions);
    },
    upload(input, uploadOptions) {
      if (closed) {
        return Promise.reject(new Error("The media upload queue is closed."));
      }
      return create(input, uploadOptions).promise;
    },
    resume(data, file, uploadOptions) {
      const resume = typeof data === "string"
        ? parseMediaUploadResumeData(data)
        : sanitizeResumeData(data);
      if (!sameFile(file, resume.fileInfo)) {
        throw new TypeError("The reselected file does not match the saved upload.");
      }
      if (resume.mode === "single" && !resume.singleTransferComplete) {
        throw new TypeError("This single upload is not resumable from persisted metadata.");
      }
      if (resume.mode === "multipart") {
        const partCount = Math.ceil(file.size / resume.partSizeBytes!);
        if (resume.completedParts.some((part) => part.partNumber > partCount)) {
          throw new TypeError("Resume data contains invalid multipart ETags.");
        }
      }
      return create(
        {
          file,
          kind: resume.kind,
          metadata: resume.metadata,
        },
        uploadOptions,
        {
          uploadId: resume.uploadSessionId,
          mode: resume.mode,
          partSizeBytes: resume.partSizeBytes,
          completedParts: [...resume.completedParts],
          singleTransferComplete: resume.singleTransferComplete,
          verified: false,
        },
      );
    },
    close() {
      if (closed) return;
      closed = true;
      for (const task of [...tasks]) {
        if (!task.inRun) void cancelTask(task).catch(() => undefined);
      }
    },
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
  MediaUploadProgress,
  MediaUploadStatus,
  MediaUploadTarget,
} from "../shared";
