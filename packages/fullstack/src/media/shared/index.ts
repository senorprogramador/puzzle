import type {
  MediaAsset,
  MediaAssetStatus,
  MediaChecksum,
  MediaCrop,
  MediaFocalPoint,
  MediaFolder,
  MediaHotspot,
  MediaKind,
  MediaVariant,
  MediaVariantStatus,
  MediaErrorCode,
} from "@puzzle-ui/media";

type MediaApiVariant = Omit<
  MediaVariant,
  "object" | "error" | "createdAt" | "updatedAt"
> & {
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type MediaApiAsset = Omit<
  MediaAsset,
  | "tenantId"
  | "object"
  | "variants"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "createdBy"
  | "updatedBy"
  | "processingError"
  | "processingJobId"
> & {
  readonly variants: readonly MediaApiVariant[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string | null;
};

export type MediaApiFolder = Omit<
  MediaFolder,
  "tenantId" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "deletedAt"
> & {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string | null;
};

export type MediaUploadIntentInput = {
  readonly fileName: string;
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly size: number;
  readonly expectedChecksum?: MediaChecksum;
};

export type MediaUploadTarget = {
  readonly url: string;
  readonly method: "PUT";
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: string;
};

export type MediaUploadPartTarget = MediaUploadTarget & {
  readonly partNumber: number;
};

export type MediaUploadIntent = {
  /** Opaque server upload-session identifier, not a storage provider ID. */
  readonly id: string;
  readonly mode: "single" | "multipart";
  readonly target?: MediaUploadTarget;
  readonly partSizeBytes?: number;
  readonly expiresAt: string;
};

export type MediaUploadStatus = {
  readonly id: string;
  readonly mode: "single" | "multipart";
  readonly state: "pending" | "completed" | "aborted" | "expired";
  readonly expiresAt: string;
  readonly expectedSize?: number;
  readonly partSizeBytes?: number;
};

export type MediaFinalizeUploadInput = {
  readonly originalName: string;
  readonly kind: MediaKind;
  readonly folderId?: string | null;
  readonly displayName?: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly orientation?: number;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags?: readonly string[];
  readonly crop?: MediaCrop | null;
  readonly focalPoint?: MediaFocalPoint | null;
  readonly hotspots?: readonly MediaHotspot[];
};

export type MediaUploadPartCompletion = {
  readonly partNumber: number;
  readonly etag: string;
};

export type MediaCompleteUploadInput = MediaFinalizeUploadInput & {
  readonly parts?: readonly MediaUploadPartCompletion[];
};

export type MediaAssetListInput = {
  readonly first?: number;
  readonly after?: string;
  readonly folderId?: string | null;
  readonly kind?: MediaKind;
  readonly status?: MediaAssetStatus;
  readonly orderBy?: "createdAt" | "updatedAt" | "displayName" | "size";
  readonly direction?: "asc" | "desc";
  readonly tagsAny?: readonly string[];
  readonly tagsAll?: readonly string[];
  readonly checksum?: MediaChecksum;
};

export type MediaAssetPage = {
  readonly items: readonly MediaApiAsset[];
  readonly nextCursor: string | null;
};

export type MediaAssetUpdateInput = {
  readonly expectedRevision: number;
  readonly folderId?: string | null;
  readonly displayName?: string;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags?: readonly string[];
  readonly crop?: MediaCrop | null;
  readonly focalPoint?: MediaFocalPoint | null;
  readonly hotspots?: readonly MediaHotspot[];
};

export type MediaFolderListInput = {
  readonly first?: number;
  readonly after?: string;
  readonly parentId?: string | null;
};

export type MediaFolderPage = {
  readonly items: readonly MediaApiFolder[];
  readonly nextCursor: string | null;
};

export type MediaFolderCreateInput = {
  readonly name: string;
  readonly parentId?: string | null;
};

export type MediaFolderUpdateInput = {
  readonly expectedRevision: number;
} & (
  | { readonly name: string; readonly parentId?: never }
  | { readonly parentId: string | null; readonly name?: never }
);

export type MediaRevisionInput = {
  readonly expectedRevision: number;
};

export type MediaSignedReadTarget = {
  readonly url: string;
  readonly expiresAt: string;
};

export type MediaProcessingStatus = {
  readonly assetId: string;
  readonly kind: "image" | "video";
  readonly status:
    | "queued"
    | "processing"
    | "retrying"
    | "succeeded"
    | "failed"
    | "dead-letter"
    | "cancelled";
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly progress: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string | null;
};

export type MediaPermanentDeleteResult = {
  readonly deleted: true;
  readonly objectDeletionFailureCount: number;
};

export type MediaApiErrorCode =
  | MediaErrorCode
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "INVALID_REQUEST"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "IDEMPOTENCY_CONFLICT"
  | "INTERNAL";

export type MediaApiError = {
  readonly error: {
    readonly code: MediaApiErrorCode;
    readonly message: string;
  };
};

export type MediaUploadProgress = {
  readonly phase: "queued" | "intent" | "uploading" | "finalizing";
  readonly loaded: number;
  readonly total: number;
  readonly percent: number;
  readonly attempt: number;
  readonly maxAttempts: number;
};

export type MediaUploadFileInfo = {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly lastModified: number;
};

export type MediaUploadResumeData = {
  readonly version: 1;
  /** Opaque Fullstack upload-session identifier; it is not a provider upload ID. */
  readonly uploadSessionId: string;
  readonly mode: "single" | "multipart";
  readonly fileInfo: MediaUploadFileInfo;
  readonly kind: MediaKind;
  readonly metadata: Omit<MediaFinalizeUploadInput, "originalName" | "kind">;
  readonly partSizeBytes?: number;
  readonly completedParts: readonly MediaUploadPartCompletion[];
  readonly singleTransferComplete: boolean;
};

export type {
  MediaAssetStatus,
  MediaChecksum,
  MediaCrop,
  MediaFocalPoint,
  MediaHotspot,
  MediaKind,
  MediaVariantStatus,
};
