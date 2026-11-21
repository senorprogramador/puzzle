import type {
  MediaAsset,
  MediaChecksum,
  MediaObjectReference,
  MediaVariant,
} from "./media.types";

export type MediaImageProfile = {
  readonly name: string;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format?: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  readonly quality?: number;
  readonly required?: boolean;
};

export type MediaVideoRenditionProfile = {
  readonly name: string;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly videoBitrate?: number;
  readonly audioBitrate?: number;
  readonly container?: string;
  readonly mimeType?: string;
  readonly required?: boolean;
};

export type MediaProcessingProfile =
  | MediaImageProfile
  | MediaVideoRenditionProfile;

export type MediaProcessingFailure = {
  readonly message: string;
  readonly code?: string;
  readonly retryable: boolean;
};

export type MediaProcessingJobStatus =
  | "queued"
  | "processing"
  | "retrying"
  | "succeeded"
  | "failed"
  | "dead-letter"
  | "cancelled";

export type MediaProcessingJobKind = "image" | "video";

export type MediaProcessingJob = {
  readonly id: string;
  readonly tenantId: string;
  readonly assetId: string;
  readonly kind: MediaProcessingJobKind;
  readonly profiles: readonly MediaProcessingProfile[];
  readonly idempotencyKey: string;
  readonly status: MediaProcessingJobStatus;
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly progress: number;
  readonly availableAt: Date;
  readonly workerId?: string | null;
  readonly leaseExpiresAt?: Date | null;
  readonly result?: readonly MediaVariant[];
  readonly failure?: MediaProcessingFailure | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly completedAt?: Date | null;
  readonly revision: number;
};

export type MediaProcessingJobInput = {
  readonly id: string;
  readonly tenantId: string;
  readonly assetId: string;
  readonly kind: MediaProcessingJobKind;
  readonly profiles: readonly MediaProcessingProfile[];
  readonly idempotencyKey: string;
  readonly maxAttempts: number;
  readonly availableAt?: Date;
  readonly createdAt: Date;
};

export type MediaProcessingQueueClaim = {
  readonly workerId: string;
  readonly leaseDurationMs: number;
  readonly now: Date;
};

export interface MediaProcessingQueueAdapter {
  /**
   * Idempotency is scoped by tenant/key. Reuse with a different payload must
   * fail instead of silently enqueueing another operation.
   */
  enqueue(input: MediaProcessingJobInput): Promise<MediaProcessingJob>;
  get(id: string): Promise<MediaProcessingJob | null>;
  /** Atomically lease one available job and increment its attempt count. */
  claimNext(input: MediaProcessingQueueClaim): Promise<MediaProcessingJob | null>;
  updateProgress(
    id: string,
    workerId: string,
    progress: number,
    now: Date,
  ): Promise<MediaProcessingJob>;
  /** Only the current lease owner may extend a live lease. */
  renewLease(
    id: string,
    workerId: string,
    leaseDurationMs: number,
    now: Date,
  ): Promise<MediaProcessingJob>;
  /** Completion must be conditional on the current lease owner. */
  complete(
    id: string,
    workerId: string,
    result: readonly MediaVariant[],
    now: Date,
  ): Promise<MediaProcessingJob>;
  /** Failure must be conditional on the current lease owner. `retryAt` schedules a retry. */
  fail(
    id: string,
    workerId: string,
    failure: MediaProcessingFailure,
    retryAt: Date | null,
    now: Date,
  ): Promise<MediaProcessingJob>;
  cancel(id: string, now: Date): Promise<MediaProcessingJob | null>;
}

export type MediaProcessingOutputVariant = {
  readonly name: string;
  readonly kind: MediaVariant["kind"];
  readonly object: MediaObjectReference;
  readonly mimeType: string;
  readonly size: number;
  readonly checksum?: MediaChecksum;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly bitrate?: number;
};

export type MediaProcessingOutput = {
  readonly variants: readonly MediaProcessingOutputVariant[];
  readonly failures?: readonly {
    readonly profile: string;
    readonly message: string;
    readonly retryable?: boolean;
  }[];
};

export type MediaProcessorProgress = (progress: number) => void | Promise<void>;

export type MediaProcessorInput = {
  readonly jobId: string;
  readonly idempotencyKey: string;
  readonly asset: MediaAsset;
  readonly profiles: readonly MediaImageProfile[];
  readonly signal?: AbortSignal;
  readonly onProgress: MediaProcessorProgress;
};

export interface MediaProcessor {
  processImage(input: MediaProcessorInput): Promise<MediaProcessingOutput>;
}

export type VideoTranscoderInput = {
  readonly jobId: string;
  readonly idempotencyKey: string;
  readonly asset: MediaAsset;
  readonly profiles: readonly MediaVideoRenditionProfile[];
  readonly signal?: AbortSignal;
  readonly onProgress: MediaProcessorProgress;
};

export interface VideoTranscoder {
  transcode(input: VideoTranscoderInput): Promise<MediaProcessingOutput>;
}

export type MediaProcessingServiceOptions = {
  readonly storage: import("@puzzle-ui/storage").StorageAdapter;
  readonly objectStorage: import("./object-storage.types").MediaObjectStorageAdapter;
  readonly queue: MediaProcessingQueueAdapter;
  readonly processor?: MediaProcessor;
  readonly transcoder?: VideoTranscoder;
  readonly idFactory?: () => string;
  readonly now?: () => Date;
  readonly baseRetryDelayMs?: number;
  readonly maxRetryDelayMs?: number;
  readonly leaseDurationMs?: number;
};
