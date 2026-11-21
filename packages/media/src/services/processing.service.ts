import type { StorageAdapter } from "@puzzle-ui/storage";
import {
  MediaAssetConflictError,
  MediaCapabilityError,
  MediaNotFoundError,
  MediaProcessingError,
  MediaValidationError,
} from "../errors/media.errors";
import type {
  MediaAsset,
  MediaKind,
  MediaVariant,
} from "../types/media.types";
import type { MediaObjectStorageAdapter } from "../types/object-storage.types";
import type {
  MediaImageProfile,
  MediaProcessingFailure,
  MediaProcessingJob,
  MediaProcessingJobInput,
  MediaProcessingOutput,
  MediaProcessingOutputVariant,
  MediaProcessingQueueAdapter,
  MediaProcessingServiceOptions,
  MediaVideoRenditionProfile,
  VideoTranscoder,
} from "../types/processing.types";
import {
  normalizeMediaObjectReference,
  validateMediaFileMetadata,
  validateMediaImageProfiles,
  validateMediaVideoProfiles,
} from "../utils/media-validation";
import { MEDIA_ASSETS_COLLECTION, registerMediaCollections } from "./collections";
import {
  assertConditionalWrites,
  assertTenantId,
  createMediaId,
  getMediaNow,
  makeStorageCondition,
} from "./service-utils";

export type EnqueueMediaProcessingInput = {
  readonly tenantId: string;
  readonly assetId: string;
  readonly kind: "image" | "video";
  readonly profiles: readonly (MediaImageProfile | MediaVideoRenditionProfile)[];
  readonly idempotencyKey: string;
  readonly maxAttempts?: number;
  readonly availableAt?: Date;
};

export type MediaProcessingService = {
  readonly ready: Promise<void>;
  enqueue(input: EnqueueMediaProcessingInput): Promise<MediaProcessingJob>;
  runNext(workerId: string): Promise<MediaProcessingJob | null>;
  cancel(jobId: string): Promise<MediaProcessingJob | null>;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === "AbortError";

const errorIsRetryable = (error: unknown): boolean => {
  if (error instanceof MediaProcessingError) return error.retryable;
  if (
    error instanceof MediaValidationError ||
    error instanceof MediaCapabilityError ||
    error instanceof MediaNotFoundError ||
    error instanceof MediaAssetConflictError ||
    isAbortError(error)
  ) {
    return false;
  }
  return true;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Media processing failed.";

const errorCode = (error: unknown): string | undefined =>
  error instanceof MediaProcessingError ||
  error instanceof MediaValidationError ||
  error instanceof MediaCapabilityError ||
  error instanceof MediaNotFoundError ||
  error instanceof MediaAssetConflictError
    ? error.code
    : undefined;

const validateWorkerId = (workerId: string): void => {
  if (typeof workerId !== "string" || workerId.trim() === "") {
    throw new MediaValidationError("workerId must be a non-empty string.");
  }
};

const mergeVariants = (
  existing: readonly MediaVariant[],
  generated: readonly MediaVariant[],
): readonly MediaVariant[] => {
  const result = new Map<string, MediaVariant>();
  for (const variant of existing) result.set(variant.name, variant);
  for (const variant of generated) result.set(variant.name, variant);
  return [...result.values()];
};

const outputKindToMediaKind = (kind: MediaVariant["kind"]): MediaKind => {
  if (kind === "video") return "video";
  if (kind === "manifest") return "other";
  return "image";
};

const makeVariants = async (
  job: MediaProcessingJob,
  asset: MediaAsset,
  output: MediaProcessingOutput,
  now: Date,
  objectStorage: MediaObjectStorageAdapter,
  idFactory?: () => string,
): Promise<{
  readonly variants: readonly MediaVariant[];
  readonly fatalFailures: readonly string[];
  readonly fatalFailuresRetryable: boolean;
  readonly warnings: readonly string[];
}> => {
  const profiles = new Map(job.profiles.map((profile) => [profile.name, profile]));
  const generated: MediaVariant[] = [];
  const seen = new Set<string>();

  for (const outputVariant of output.variants) {
    const profile = profiles.get(outputVariant.name);
    if (!profile) {
      throw new MediaValidationError(
        `Processor returned an unrequested profile "${outputVariant.name}".`,
      );
    }
    if (seen.has(outputVariant.name)) {
      throw new MediaValidationError(
        `Processor returned profile "${outputVariant.name}" more than once.`,
      );
    }
    if (
      outputVariant.bitrate !== undefined &&
      (!Number.isSafeInteger(outputVariant.bitrate) || outputVariant.bitrate < 1)
    ) {
      throw new MediaValidationError(
        `Processor output "${outputVariant.name}" bitrate must be a positive safe integer.`,
      );
    }
    seen.add(outputVariant.name);
    const metadata = validateMediaFileMetadata({
      kind: outputKindToMediaKind(outputVariant.kind),
      mimeType: outputVariant.mimeType,
      size: outputVariant.size,
      ...(outputVariant.checksum ? { checksum: outputVariant.checksum } : {}),
      ...(outputVariant.width !== undefined
        ? { width: outputVariant.width, height: outputVariant.height }
        : {}),
      ...(outputVariant.duration !== undefined
        ? { duration: outputVariant.duration }
        : {}),
    });
    const object = normalizeMediaObjectReference(outputVariant.object);
    const storedObject = await objectStorage.getObjectMetadata(object);
    if (!storedObject || storedObject.tenantId !== job.tenantId) {
      throw new MediaProcessingError(
        `Processor output "${outputVariant.name}" is not present in the tenant object store.`,
        { retryable: false },
      );
    }
    if (
      storedObject.size !== metadata.size ||
      storedObject.mimeType.toLowerCase() !== metadata.mimeType
    ) {
      throw new MediaProcessingError(
        `Processor output "${outputVariant.name}" metadata does not match the stored object.`,
        { retryable: false },
      );
    }
    if (
      metadata.checksum &&
      storedObject.checksum &&
      storedObject.checksum.value !== metadata.checksum.value
    ) {
      throw new MediaProcessingError(
        `Processor output "${outputVariant.name}" checksum does not match the stored object.`,
        { retryable: false },
      );
    }
    generated.push({
      id: createMediaId(idFactory, "variant"),
      assetId: asset.id,
      name: outputVariant.name,
      kind: outputVariant.kind,
      status: "ready",
      object,
      mimeType: metadata.mimeType,
      size: metadata.size,
      ...(storedObject.checksum
        ? { checksum: storedObject.checksum }
        : metadata.checksum
          ? { checksum: metadata.checksum }
          : {}),
      ...(metadata.width !== undefined
        ? { width: metadata.width, height: metadata.height }
        : {}),
      ...(metadata.duration !== undefined ? { duration: metadata.duration } : {}),
      ...(outputVariant.bitrate !== undefined
        ? { bitrate: outputVariant.bitrate }
        : {}),
      createdAt: now,
      updatedAt: now,
      error: null,
    });
  }

  const failures = new Map(
    (output.failures ?? []).map((failure) => [failure.profile, failure]),
  );
  if (failures.size !== (output.failures?.length ?? 0)) {
    throw new MediaValidationError("Processor returned duplicate profile failures.");
  }
  const fatalFailures: string[] = [];
  const warnings: string[] = [];
  let fatalFailuresRetryable = true;
  for (const profile of job.profiles) {
    if (seen.has(profile.name)) {
      if (failures.has(profile.name)) {
        throw new MediaValidationError(
          `Profile "${profile.name}" cannot be both successful and failed.`,
        );
      }
      continue;
    }
    const failure = failures.get(profile.name);
    const message = failure?.message ?? "The processor did not return this profile.";
    if (failure && typeof failure.message !== "string") {
      throw new MediaValidationError(
        `Failure for profile "${profile.name}" requires a message.`,
      );
    }
    generated.push({
      id: createMediaId(idFactory, "variant"),
      assetId: asset.id,
      name: profile.name,
      kind: job.kind === "image" ? "image" : "video",
      status: "failed",
      error: message,
      createdAt: now,
      updatedAt: now,
    });
    if (profile.required ?? true) {
      fatalFailures.push(`${profile.name}: ${message}`);
      if (failure?.retryable === false) fatalFailuresRetryable = false;
    } else {
      warnings.push(`${profile.name}: ${message}`);
    }
  }
  for (const failedProfile of failures.keys()) {
    if (!profiles.has(failedProfile)) {
      throw new MediaValidationError(
        `Processor failed an unrequested profile "${failedProfile}".`,
      );
    }
  }
  return {
    variants: generated,
    fatalFailures,
    fatalFailuresRetryable,
    warnings,
  };
};

const toProcessingFailure = (error: unknown): MediaProcessingFailure => ({
  message: errorMessage(error),
  ...(errorCode(error) ? { code: errorCode(error) } : {}),
  retryable: errorIsRetryable(error),
});

export const createMediaProcessingService = (
  options: MediaProcessingServiceOptions,
): MediaProcessingService => {
  const { storage, queue } = options;
  const ready = registerMediaCollections(storage);
  const controllers = new Map<string, AbortController>();
  const baseRetryDelayMs = options.baseRetryDelayMs ?? 1_000;
  const maxRetryDelayMs = options.maxRetryDelayMs ?? 60_000;
  const leaseDurationMs = options.leaseDurationMs ?? 30_000;
  if (
    !Number.isInteger(baseRetryDelayMs) ||
    baseRetryDelayMs < 1 ||
    !Number.isInteger(maxRetryDelayMs) ||
    maxRetryDelayMs < baseRetryDelayMs ||
    !Number.isInteger(leaseDurationMs) ||
    leaseDurationMs < 1
  ) {
    throw new MediaValidationError("Processing retry and lease durations are invalid.");
  }

  const getAsset = async (tenantId: string, assetId: string): Promise<MediaAsset> => {
    const asset = await storage.findById<MediaAsset>(MEDIA_ASSETS_COLLECTION, assetId);
    if (!asset || asset.tenantId !== tenantId) {
      throw new MediaNotFoundError("Media asset");
    }
    return asset;
  };

  const updateAsset = async (
    asset: MediaAsset,
    changes: Partial<Omit<MediaAsset, "id" | "createdAt" | "revision">>,
  ): Promise<MediaAsset> => {
    const updated = await storage.update<MediaAsset>(
      MEDIA_ASSETS_COLLECTION,
      asset.id,
      { ...changes, updatedAt: getMediaNow(options.now) },
      makeStorageCondition(asset.revision),
    );
    if (!updated) {
      throw new MediaAssetConflictError(
        "The asset changed while its processing state was being updated.",
      );
    }
    return updated;
  };

  const enqueue = async (
    input: EnqueueMediaProcessingInput,
  ): Promise<MediaProcessingJob> => {
    await ready;
    assertTenantId(input.tenantId);
    assertConditionalWrites(storage);
    if (input.kind === "image") {
      if (!options.processor) {
        throw new MediaCapabilityError("MediaProcessor");
      }
      validateMediaImageProfiles(input.profiles as readonly MediaImageProfile[]);
    } else {
      if (!options.transcoder) {
        throw new MediaCapabilityError("VideoTranscoder");
      }
      validateMediaVideoProfiles(
        input.profiles as readonly MediaVideoRenditionProfile[],
      );
    }
    if (
      typeof input.idempotencyKey !== "string" ||
      input.idempotencyKey.trim() === ""
    ) {
      throw new MediaValidationError("idempotencyKey must be a non-empty string.");
    }
    const maxAttempts = input.maxAttempts ?? 3;
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 20) {
      throw new MediaValidationError("maxAttempts must be an integer from 1 to 20.");
    }
    const asset = await getAsset(input.tenantId, input.assetId);
    if (asset.status === "deleted") {
      throw new MediaNotFoundError("Media asset");
    }
    if (
      asset.status !== "uploaded" &&
      asset.status !== "failed" &&
      asset.status !== "ready"
    ) {
      throw new MediaAssetConflictError(
        `An asset in "${asset.status}" state cannot be queued for processing.`,
      );
    }
    if (
      (input.kind === "image" && asset.kind !== "image") ||
      (input.kind === "video" && asset.kind !== "video")
    ) {
      throw new MediaValidationError(
        `A ${input.kind} job cannot process a ${asset.kind} asset.`,
      );
    }
    if (
      input.availableAt !== undefined &&
      !Number.isFinite(input.availableAt.getTime())
    ) {
      throw new MediaValidationError("availableAt must be a valid date.");
    }
    const createdAt = getMediaNow(options.now);
    const jobInput: MediaProcessingJobInput = {
      id: createMediaId(options.idFactory, "job"),
      tenantId: input.tenantId,
      assetId: input.assetId,
      kind: input.kind,
      profiles: input.profiles,
      idempotencyKey: input.idempotencyKey,
      maxAttempts,
      availableAt: input.availableAt ?? createdAt,
      createdAt,
    };
    return queue.enqueue(jobInput);
  };

  const runNext = async (workerId: string): Promise<MediaProcessingJob | null> => {
    await ready;
    validateWorkerId(workerId);
    const startedAt = getMediaNow(options.now);
    const job = await queue.claimNext({
      workerId,
      leaseDurationMs,
      now: startedAt,
    });
    if (!job) return null;

    const controller = new AbortController();
    controllers.set(job.id, controller);
    let currentAsset: MediaAsset | undefined;
    let heartbeatError: unknown;
    let heartbeatPending: Promise<void> | undefined;
    let heartbeatStopped = false;
    const renewLease = async (): Promise<void> => {
      await queue.renewLease(
        job.id,
        workerId,
        leaseDurationMs,
        getMediaNow(options.now),
      );
    };
    const heartbeatIntervalMs = Math.max(1, Math.floor(leaseDurationMs / 3));
    const heartbeatTimer = setInterval(() => {
      if (heartbeatStopped || heartbeatPending) return;
      heartbeatPending = renewLease()
        .catch((error: unknown) => {
          heartbeatError = error;
          controller.abort();
        })
        .finally(() => {
          heartbeatPending = undefined;
        });
    }, heartbeatIntervalMs);
    const stopHeartbeat = async (): Promise<void> => {
      if (heartbeatStopped) return;
      heartbeatStopped = true;
      clearInterval(heartbeatTimer);
      if (heartbeatPending) await heartbeatPending;
    };
    try {
      assertConditionalWrites(storage);
      currentAsset = await getAsset(job.tenantId, job.assetId);
      if (currentAsset.status === "deleted") {
        throw new MediaNotFoundError("Media asset");
      }
      if (
        currentAsset.status === "processing" &&
        currentAsset.processingJobId !== job.id
      ) {
        throw new MediaProcessingError(
          "Another processing job currently owns this asset.",
          { retryable: true },
        );
      }
      if (currentAsset.status !== "processing") {
        currentAsset = await updateAsset(currentAsset, {
          status: "processing",
          previousStatus: currentAsset.status,
          processingError: null,
          processingJobId: job.id,
        });
      }

      const onProgress = async (progress: number): Promise<void> => {
        if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
          throw new MediaValidationError("Processor progress must be from 0 to 100.");
        }
        await queue.updateProgress(
          job.id,
          workerId,
          progress,
          getMediaNow(options.now),
        );
        await renewLease();
      };

      let output: MediaProcessingOutput;
      if (job.kind === "image") {
        if (!options.processor) throw new MediaCapabilityError("MediaProcessor");
        output = await options.processor.processImage({
          jobId: job.id,
          idempotencyKey: job.idempotencyKey,
          asset: currentAsset,
          profiles: job.profiles as readonly MediaImageProfile[],
          signal: controller.signal,
          onProgress,
        });
      } else {
        const transcoder: VideoTranscoder | undefined = options.transcoder;
        if (!transcoder) throw new MediaCapabilityError("VideoTranscoder");
        output = await transcoder.transcode({
          jobId: job.id,
          idempotencyKey: job.idempotencyKey,
          asset: currentAsset,
          profiles: job.profiles as readonly MediaVideoRenditionProfile[],
          signal: controller.signal,
          onProgress,
        });
      }
      if (controller.signal.aborted) {
        if (heartbeatError) throw heartbeatError;
        const abortError = new Error("Media processing was cancelled.");
        abortError.name = "AbortError";
        throw abortError;
      }
      currentAsset = await getAsset(job.tenantId, job.assetId);
      if (
        currentAsset.status !== "processing" ||
        currentAsset.processingJobId !== job.id
      ) {
        throw new MediaAssetConflictError(
          "The processing job no longer owns the asset.",
        );
      }
      const built = await makeVariants(
        job,
        currentAsset,
        output,
        getMediaNow(options.now),
        options.objectStorage,
        options.idFactory,
      );
      const processingError =
        built.fatalFailures.length > 0
          ? built.fatalFailures.join("; ")
          : built.warnings.length > 0
            ? built.warnings.join("; ")
            : null;
      currentAsset = await updateAsset(currentAsset, {
        variants: mergeVariants(currentAsset.variants, built.variants),
        ...(built.fatalFailures.length === 0
          ? {
              status: "ready" as const,
              previousStatus: null,
              processingJobId: null,
            }
          : {}),
        processingError,
      });

      if (built.fatalFailures.length > 0) {
        throw new MediaProcessingError(
          `Required media profiles failed: ${built.fatalFailures.join("; ")}`,
          {
            retryable: built.fatalFailuresRetryable,
          },
        );
      }
      await stopHeartbeat();
      if (heartbeatError) throw heartbeatError;
      return await queue.complete(
        job.id,
        workerId,
        built.variants,
        getMediaNow(options.now),
      );
    } catch (error) {
      await stopHeartbeat();
      if (isAbortError(error)) {
        const cancelled = await queue.get(job.id);
        if (cancelled?.status === "cancelled") return cancelled;
      }
      const failure = toProcessingFailure(error);
      const now = getMediaNow(options.now);
      const retryAt =
        failure.retryable && job.attempt < job.maxAttempts
          ? new Date(
              now.getTime() +
                Math.min(
                  maxRetryDelayMs,
                  baseRetryDelayMs * 2 ** Math.min(job.attempt - 1, 30),
                ),
            )
          : null;
      const failedJob = await queue.fail(
        job.id,
        workerId,
        failure,
        retryAt,
        now,
      );
      if (
        failedJob.status === "failed" ||
        failedJob.status === "dead-letter"
      ) {
        const asset = await storage.findById<MediaAsset>(
          MEDIA_ASSETS_COLLECTION,
          job.assetId,
        );
        if (
          asset &&
          asset.tenantId === job.tenantId &&
          asset.status !== "deleted" &&
          asset.processingJobId === job.id
        ) {
          await updateAsset(asset, {
            status: "failed",
            previousStatus: null,
            processingJobId: null,
            processingError: failure.message,
          });
        }
      }
      return failedJob;
    } finally {
      await stopHeartbeat();
      controllers.delete(job.id);
    }
  };

  const cancel = async (jobId: string): Promise<MediaProcessingJob | null> => {
    await ready;
    const before = await queue.get(jobId);
    if (!before) return null;
    controllers.get(jobId)?.abort();
    const cancelled = await queue.cancel(jobId, getMediaNow(options.now));
    if (!cancelled) return null;
    if (before.status === "processing") {
      const asset = await getAsset(before.tenantId, before.assetId);
      if (
        asset.status === "processing" &&
        asset.processingJobId === before.id
      ) {
        await updateAsset(asset, {
          status: asset.previousStatus ?? "uploaded",
          previousStatus: null,
          processingJobId: null,
          processingError: null,
        });
      }
    }
    return cancelled;
  };

  return { ready, enqueue, runNext, cancel };
};
