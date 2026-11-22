import type {
  MediaAsset,
  MediaChecksum,
  MediaImageProfile,
  MediaObjectReference,
  MediaObjectSummary,
  MediaStoredObject,
  MediaUploadSession,
} from "@puzzle-ui/media";

export type R2PutValue =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | ReadableStream<Uint8Array>
  | string
  | Uint8Array;

export type R2HttpMetadata = {
  readonly contentType?: string;
  readonly contentLanguage?: string;
  readonly contentDisposition?: string;
  readonly contentEncoding?: string;
  readonly cacheControl?: string;
  readonly cacheExpiry?: Date;
};

export type R2ObjectLike = {
  readonly key: string;
  readonly size: number;
  readonly etag?: string;
  readonly uploaded?: Date;
  readonly httpMetadata?: R2HttpMetadata;
  readonly customMetadata?: Readonly<Record<string, string>>;
  readonly arrayBuffer: () => Promise<ArrayBuffer>;
};

export type R2ListResultLike = {
  readonly objects: readonly R2ObjectLike[];
  readonly truncated: boolean;
  readonly cursor?: string;
};

export type R2MultipartPart = {
  readonly partNumber: number;
  readonly etag: string;
};

export interface R2MultipartUploadLike {
  readonly uploadId?: string;
  uploadPart(partNumber: number, value: R2PutValue): Promise<{ readonly etag: string }>;
  complete(parts: readonly R2MultipartPart[]): Promise<R2ObjectLike | void>;
  abort(): Promise<void>;
  listParts?(): Promise<readonly R2MultipartPart[]>;
}

export interface R2BucketLike {
  put(
    key: string,
    value: R2PutValue,
    options?: {
      readonly httpMetadata?: R2HttpMetadata;
      readonly customMetadata?: Readonly<Record<string, string>>;
    },
  ): Promise<R2ObjectLike | void | null>;
  get(key: string): Promise<R2ObjectLike | null>;
  head(key: string): Promise<R2ObjectLike | null>;
  delete(key: string): Promise<void>;
  list?(options?: {
    readonly cursor?: string;
    readonly limit?: number;
    readonly prefix?: string;
  }): Promise<R2ListResultLike>;
  createMultipartUpload?(
    key: string,
    options?: {
      readonly httpMetadata?: R2HttpMetadata;
      readonly customMetadata?: Readonly<Record<string, string>>;
    },
  ): Promise<R2MultipartUploadLike>;
  resumeMultipartUpload?(key: string, uploadId: string): R2MultipartUploadLike;
}

export type CloudflareMediaUrlTarget = {
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
};

/**
 * R2 Worker bindings do not issue presigned URLs. Applications can inject a
 * signer backed by their S3-compatible endpoint, a gateway, or their own
 * authenticated upload route.
 */
export interface CloudflareMediaUrlSigner {
  signUpload(input: {
    readonly tenantId: string;
    readonly key: string;
    readonly contentType: string;
    readonly expiresAt: Date;
    readonly expectedSize?: number;
  }): Promise<CloudflareMediaUrlTarget>;
  signMultipartPart(input: {
    readonly tenantId: string;
    readonly key: string;
    readonly uploadId: string;
    readonly partNumber: number;
    readonly expiresAt: Date;
  }): Promise<CloudflareMediaUrlTarget>;
  signRead(input: {
    readonly tenantId: string;
    readonly key: string;
    readonly expiresAt: Date;
  }): Promise<CloudflareMediaUrlTarget>;
}

export type CloudflareMediaBucketContext = {
  readonly tenantId: string;
  readonly bucketName?: string;
};

export type CloudflareMediaBucketTarget = {
  readonly bucket: R2BucketLike;
  readonly signer: CloudflareMediaUrlSigner;
  readonly bucketName?: string;
};

export type CloudflareMediaBucketResolver = (
  context: CloudflareMediaBucketContext,
) => CloudflareMediaBucketTarget | Promise<CloudflareMediaBucketTarget>;

/**
 * A resolver is useful for tenant-specific R2 buckets or S3-compatible R2
 * clients. It deliberately exposes only the operations needed by this package,
 * avoiding a dependency on a particular S3 SDK.
 */
export interface CloudflareMediaS3CompatibleResolver {
  resolve(context: CloudflareMediaBucketContext): Promise<CloudflareMediaBucketTarget>;
}

export type CloudflareMediaBucketSource =
  | CloudflareMediaBucketTarget
  | CloudflareMediaBucketResolver
  | CloudflareMediaS3CompatibleResolver;

export type CloudflareMediaStaticBucket = CloudflareMediaBucketTarget;
export type CloudflareMediaDynamicBucketResolver =
  | CloudflareMediaBucketResolver
  | CloudflareMediaS3CompatibleResolver;

export type CloudflareUploadRecord = {
  readonly session: MediaUploadSession;
  readonly tenantId: string;
  readonly key: string;
  readonly contentType: string;
  readonly fileName: string;
  readonly uploadId?: string;
  readonly partSizeBytes?: number;
};

export type CloudflareObjectRecord = {
  readonly object: MediaStoredObject;
  readonly key: string;
};

export interface CloudflareMediaMetadataStore {
  saveUpload(record: CloudflareUploadRecord): Promise<void>;
  getUpload(id: string): Promise<CloudflareUploadRecord | null>;
  updateUpload(
    id: string,
    update: Partial<Pick<CloudflareUploadRecord, "session">>,
  ): Promise<CloudflareUploadRecord | null>;
  listExpiredUploads(
    before: Date,
    first: number,
    tenantId?: string,
  ): Promise<readonly CloudflareUploadRecord[]>;
  saveObject(record: CloudflareObjectRecord): Promise<void>;
  getObject(key: string, tenantId?: string): Promise<CloudflareObjectRecord | null>;
  deleteObject(key: string, tenantId?: string): Promise<boolean>;
  listObjects(
    input: {
      readonly first: number;
      readonly cursor?: string;
      readonly olderThan?: Date;
      readonly tenantId?: string;
    },
  ): Promise<readonly CloudflareObjectRecord[]>;
}

export type CloudflareR2MediaObjectStorageOptions = {
  readonly bucket: CloudflareMediaBucketSource;
  readonly metadataStore: CloudflareMediaMetadataStore;
  readonly tenantId?: string;
  readonly bucketName?: string;
  readonly idFactory?: () => string;
  readonly now?: () => Date;
  readonly maxSignedUrlTtlMs?: number;
  readonly maxListPageSize?: number;
};

export type CloudflareR2MediaObjectStorageAdapterOptions =
  CloudflareR2MediaObjectStorageOptions;

export type CloudflareR2BucketProvisionerApi = {
  getBucket(name: string): Promise<CloudflareR2BucketInfo | null>;
  createBucket(input: {
    readonly name: string;
    readonly locationHint?: string;
  }): Promise<CloudflareR2BucketInfo>;
};

export type CloudflareR2BucketInfo = {
  readonly name: string;
  readonly creationDate?: Date;
  readonly location?: string;
};

export type CloudflareR2BucketProvisionerOptions = {
  readonly api: CloudflareR2BucketProvisionerApi;
  readonly nameForTenant?: (tenantId: string) => string;
};

export type CloudflareR2S3UrlSignerOptions = {
  readonly endpoint: string;
  readonly bucketName: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region?: string;
  readonly now?: () => Date;
};

export type CloudflareImagesSource =
  | string
  | ArrayBuffer
  | Uint8Array
  | Blob
  | ReadableStream<Uint8Array>;

export type CloudflareImagesOutputLike = {
  response(): Promise<Response | { readonly arrayBuffer: () => Promise<ArrayBuffer>; readonly headers?: Headers }>;
};

export type CloudflareImagesTransformLike = {
  output(options?: {
    readonly format?: string;
    readonly quality?: number;
  }): CloudflareImagesOutputLike;
};

export type CloudflareImagesInputLike = {
  transform(options: {
    readonly width?: number;
    readonly height?: number;
    readonly fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  }): CloudflareImagesTransformLike;
};

export interface CloudflareImagesBinding {
  input(source: CloudflareImagesSource): CloudflareImagesInputLike;
}

export type CloudflareImagesVariantWriteInput = {
  readonly asset: MediaAsset;
  readonly profile: MediaImageProfile;
  readonly bytes: Uint8Array;
  readonly mimeType: string;
  readonly checksum: MediaChecksum;
};

export type CloudflareImagesProcessorOptions = {
  readonly images: CloudflareImagesBinding;
  readonly source: (
    asset: MediaAsset,
  ) => CloudflareImagesSource | Promise<CloudflareImagesSource>;
  readonly writeVariant: (
    input: CloudflareImagesVariantWriteInput,
  ) => Promise<{
    readonly object: MediaObjectReference;
    readonly size?: number;
    readonly mimeType?: string;
    readonly width?: number;
    readonly height?: number;
  }>;
  readonly idFactory?: () => string;
};

export type CloudflareMediaObjectSummary = MediaObjectSummary;
