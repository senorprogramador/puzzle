export const MEDIA_ASSET_STATUSES = [
  "pending-upload",
  "uploaded",
  "processing",
  "ready",
  "failed",
  "deleted",
] as const;

export type MediaAssetStatus = (typeof MEDIA_ASSET_STATUSES)[number];

export const MEDIA_KINDS = [
  "image",
  "video",
  "audio",
  "document",
  "other",
] as const;

export type MediaKind = (typeof MEDIA_KINDS)[number];

export type MediaChecksum = {
  readonly algorithm: "sha256";
  readonly value: string;
};

export type MediaObjectReference = {
  readonly key: string;
  readonly versionId?: string;
};

export type MediaCrop = {
  /** Normalized x-coordinate relative to the original, oriented image. */
  readonly x: number;
  /** Normalized y-coordinate relative to the original, oriented image. */
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type MediaFocalPoint = {
  /** Normalized coordinates relative to the original, oriented image. */
  readonly x: number;
  readonly y: number;
};

export type MediaHotspot = {
  readonly id: string;
  /** Normalized coordinates relative to the original, oriented image. */
  readonly x: number;
  readonly y: number;
  /** Omit both dimensions or set both to zero for a point. Areas use positive dimensions. */
  readonly width?: number;
  readonly height?: number;
  readonly label?: string;
  readonly data?: Readonly<Record<string, string | number | boolean | null>>;
};

export type MediaVariantStatus = "pending" | "ready" | "failed";

export type MediaVariant = {
  readonly id: string;
  readonly assetId: string;
  readonly name: string;
  readonly kind: "image" | "video" | "poster" | "manifest" | "thumbnail";
  readonly status: MediaVariantStatus;
  readonly object?: MediaObjectReference;
  readonly mimeType?: string;
  readonly size?: number;
  /** Content fingerprint only; checksums are not unique asset identifiers. */
  readonly checksum?: MediaChecksum;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly bitrate?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly error?: string | null;
};

export type MediaAsset = {
  readonly id: string;
  readonly tenantId: string;
  readonly folderId: string | null;
  readonly originalName: string;
  readonly displayName: string;
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly size: number;
  /** Duplicate checksums are allowed; asset IDs remain distinct. */
  readonly checksum?: MediaChecksum;
  readonly object: MediaObjectReference;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly orientation?: number;
  readonly status: MediaAssetStatus;
  readonly altText?: string | null;
  readonly caption?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly tags: readonly string[];
  readonly crop?: MediaCrop | null;
  readonly hotspots: readonly MediaHotspot[];
  readonly focalPoint: MediaFocalPoint | null;
  readonly variants: readonly MediaVariant[];
  readonly processingError?: string | null;
  readonly processingJobId?: string | null;
  readonly previousStatus?: Exclude<MediaAssetStatus, "deleted"> | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly deletedAt?: Date | null;
  readonly revision: number;
};

export type MediaFolder = {
  readonly id: string;
  readonly tenantId: string;
  readonly parentId: string | null;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy?: string | null;
  readonly updatedBy?: string | null;
  readonly deletedAt?: Date | null;
  readonly revision: number;
};

export type MediaAssetUsage = {
  readonly id: string;
  readonly tenantId: string;
  readonly assetId: string;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly fieldKey: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy?: string | null;
  readonly revision: number;
};

export type MediaFileMetadata = {
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly size: number;
  readonly checksum?: MediaChecksum;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly orientation?: number;
};
