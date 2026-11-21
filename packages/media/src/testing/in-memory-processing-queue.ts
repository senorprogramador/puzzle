import {
  MediaAssetConflictError,
  MediaNotFoundError,
  MediaValidationError,
} from "../errors/media.errors";
import type {
  MediaProcessingFailure,
  MediaProcessingJob,
  MediaProcessingJobInput,
  MediaProcessingQueueAdapter,
  MediaProcessingQueueClaim,
} from "../types/processing.types";

export class InMemoryMediaProcessingQueueAdapter
  implements MediaProcessingQueueAdapter
{
  private readonly jobs = new Map<string, MediaProcessingJob>();
  private readonly idempotency = new Map<string, string>();

  async enqueue(input: MediaProcessingJobInput): Promise<MediaProcessingJob> {
    const key = `${input.tenantId}\u0000${input.idempotencyKey}`;
    const existingId = this.idempotency.get(key);
    if (existingId) {
      const existing = this.jobs.get(existingId);
      if (!existing) throw new MediaAssetConflictError("Idempotency index is inconsistent.");
      if (
        existing.assetId !== input.assetId ||
        existing.kind !== input.kind ||
        JSON.stringify(existing.profiles) !== JSON.stringify(input.profiles)
      ) {
        throw new MediaAssetConflictError(
          "An idempotency key cannot be reused for a different processing request.",
        );
      }
      return existing;
    }
    if (
      !Number.isInteger(input.maxAttempts) ||
      input.maxAttempts < 1 ||
      !Number.isFinite(input.createdAt.getTime())
    ) {
      throw new MediaValidationError("The processing job input is invalid.");
    }
    const availableAt = input.availableAt ?? input.createdAt;
    if (!Number.isFinite(availableAt.getTime())) {
      throw new MediaValidationError("availableAt must be a valid date.");
    }
    const job: MediaProcessingJob = {
      ...input,
      status: "queued",
      attempt: 0,
      progress: 0,
      availableAt,
      workerId: null,
      leaseExpiresAt: null,
      result: [],
      failure: null,
      updatedAt: input.createdAt,
      completedAt: null,
      revision: 1,
    };
    this.jobs.set(job.id, job);
    this.idempotency.set(key, job.id);
    return job;
  }

  async get(id: string): Promise<MediaProcessingJob | null> {
    return this.jobs.get(id) ?? null;
  }

  async claimNext(
    input: MediaProcessingQueueClaim,
  ): Promise<MediaProcessingJob | null> {
    this.validateClaim(input);
    for (const job of this.jobs.values()) {
      const leaseExpired =
        job.status === "processing" &&
        (job.leaseExpiresAt?.getTime() ?? Number.POSITIVE_INFINITY) <=
          input.now.getTime();
      const retryExhausted =
        (job.status === "queued" || job.status === "retrying") &&
        job.attempt >= job.maxAttempts;
      if ((leaseExpired || retryExhausted) && job.attempt >= job.maxAttempts) {
        this.save({
          ...job,
          status: "dead-letter",
          failure: {
            message: "The processing attempt limit was reached.",
            retryable: true,
          },
          workerId: null,
          leaseExpiresAt: null,
          completedAt: input.now,
          updatedAt: input.now,
          revision: job.revision + 1,
        });
      }
    }
    const eligible = [...this.jobs.values()]
      .filter(
        (job) =>
          ((job.status === "queued" || job.status === "retrying") &&
            job.attempt < job.maxAttempts &&
            job.availableAt.getTime() <= input.now.getTime()) ||
          (job.status === "processing" &&
            job.attempt < job.maxAttempts &&
            (job.leaseExpiresAt?.getTime() ?? Number.POSITIVE_INFINITY) <=
              input.now.getTime()),
      )
      .sort(
        (left, right) =>
          left.availableAt.getTime() - right.availableAt.getTime() ||
          left.createdAt.getTime() - right.createdAt.getTime(),
      );
    const job = eligible[0];
    if (!job) return null;
    const claimed: MediaProcessingJob = {
      ...job,
      status: "processing",
      attempt: job.attempt + 1,
      progress: 0,
      workerId: input.workerId,
      leaseExpiresAt: new Date(input.now.getTime() + input.leaseDurationMs),
      updatedAt: input.now,
      failure: null,
      revision: job.revision + 1,
    };
    this.jobs.set(job.id, claimed);
    return claimed;
  }

  async updateProgress(
    id: string,
    workerId: string,
    progress: number,
    now: Date,
  ): Promise<MediaProcessingJob> {
    const job = this.getProcessingJob(id);
    this.assertWorker(job, workerId);
    if (!Number.isFinite(progress) || progress < job.progress || progress > 100) {
      throw new MediaValidationError(
        "Processing progress must be monotonic and from 0 to 100.",
      );
    }
    return this.save({
      ...job,
      progress,
      updatedAt: now,
      revision: job.revision + 1,
    });
  }

  async renewLease(
    id: string,
    workerId: string,
    leaseDurationMs: number,
    now: Date,
  ): Promise<MediaProcessingJob> {
    const job = this.getProcessingJob(id);
    if (job.workerId !== workerId) {
      throw new MediaAssetConflictError(
        "Only the worker holding the processing lease can renew it.",
      );
    }
    if (
      !Number.isInteger(leaseDurationMs) ||
      leaseDurationMs < 1 ||
      !Number.isFinite(now.getTime()) ||
      (job.leaseExpiresAt?.getTime() ?? 0) <= now.getTime()
    ) {
      throw new MediaValidationError("The processing lease cannot be renewed.");
    }
    return this.save({
      ...job,
      leaseExpiresAt: new Date(now.getTime() + leaseDurationMs),
      updatedAt: now,
      revision: job.revision + 1,
    });
  }

  async complete(
    id: string,
    workerId: string,
    result: MediaProcessingJob["result"],
    now: Date,
  ): Promise<MediaProcessingJob> {
    const job = this.getProcessingJob(id);
    this.assertWorker(job, workerId);
    return this.save({
      ...job,
      status: "succeeded",
      progress: 100,
      result: result ?? [],
      failure: null,
      workerId: null,
      leaseExpiresAt: null,
      completedAt: now,
      updatedAt: now,
      revision: job.revision + 1,
    });
  }

  async fail(
    id: string,
    workerId: string,
    failure: MediaProcessingFailure,
    retryAt: Date | null,
    now: Date,
  ): Promise<MediaProcessingJob> {
    const job = this.getProcessingJob(id);
    this.assertWorker(job, workerId);
    if (retryAt && (!failure.retryable || retryAt.getTime() <= now.getTime())) {
      throw new MediaValidationError(
        "A retry time is only valid for a retryable failure in the future.",
      );
    }
    const retry = retryAt !== null && job.attempt < job.maxAttempts;
    return this.save({
      ...job,
      status: retry ? "retrying" : failure.retryable ? "dead-letter" : "failed",
      availableAt: retry ? retryAt : job.availableAt,
      progress: retry ? 0 : job.progress,
      failure,
      workerId: null,
      leaseExpiresAt: null,
      completedAt: retry ? null : now,
      updatedAt: now,
      revision: job.revision + 1,
    });
  }

  async cancel(id: string, now: Date): Promise<MediaProcessingJob | null> {
    const job = this.jobs.get(id);
    if (!job || this.isTerminal(job.status)) return null;
    return this.save({
      ...job,
      status: "cancelled",
      workerId: null,
      leaseExpiresAt: null,
      completedAt: now,
      updatedAt: now,
      revision: job.revision + 1,
    });
  }

  reset(): void {
    this.jobs.clear();
    this.idempotency.clear();
  }

  private getProcessingJob(id: string): MediaProcessingJob {
    const job = this.jobs.get(id);
    if (!job) throw new MediaNotFoundError("Processing job");
    if (job.status !== "processing") {
      throw new MediaAssetConflictError(
        `Processing job cannot be updated while its status is "${job.status}".`,
      );
    }
    return job;
  }

  private save(job: MediaProcessingJob): MediaProcessingJob {
    this.jobs.set(job.id, job);
    return job;
  }

  private assertWorker(job: MediaProcessingJob, workerId: string): void {
    if (job.workerId !== workerId) {
      throw new MediaAssetConflictError(
        "Only the worker holding the processing lease can update this job.",
      );
    }
  }

  private validateClaim(input: MediaProcessingQueueClaim): void {
    if (typeof input.workerId !== "string" || input.workerId.trim() === "") {
      throw new MediaValidationError("workerId must be a non-empty string.");
    }
    if (
      !Number.isInteger(input.leaseDurationMs) ||
      input.leaseDurationMs < 1 ||
      !Number.isFinite(input.now.getTime())
    ) {
      throw new MediaValidationError("Processing lease configuration is invalid.");
    }
  }

  private isTerminal(status: MediaProcessingJob["status"]): boolean {
    return (
      status === "succeeded" ||
      status === "failed" ||
      status === "dead-letter" ||
      status === "cancelled"
    );
  }
}
