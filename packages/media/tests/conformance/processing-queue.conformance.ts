import { describe, expect, it } from "bun:test";
import { MediaAssetConflictError } from "../../src";
import type {
  MediaProcessingJobInput,
  MediaProcessingQueueAdapter,
} from "../../src";
import type { MediaProcessingQueueConformanceFixture } from "./processing-queue.fixture";

const makeInput = (
  overrides: Partial<MediaProcessingJobInput> = {},
): MediaProcessingJobInput => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");
  return {
    id: "job-a",
    tenantId: "tenant-a",
    assetId: "asset-a",
    kind: "image",
    profiles: [{ name: "thumbnail", maxWidth: 200 }],
    idempotencyKey: "request-a",
    maxAttempts: 2,
    availableAt: createdAt,
    createdAt,
    ...overrides,
  };
};

const enqueueAndClaim = async (
  queue: MediaProcessingQueueAdapter,
  overrides: Partial<MediaProcessingJobInput> = {},
) => {
  const input = makeInput(overrides);
  await queue.enqueue(input);
  const job = await queue.claimNext({
    workerId: "worker-a",
    leaseDurationMs: 10_000,
    now: input.createdAt,
  });
  expect(job).not.toBeNull();
  return job!;
};

export const runMediaProcessingQueueConformance = (
  fixture: MediaProcessingQueueConformanceFixture,
): void => {
  describe("media processing queue conformance", () => {
    it("deduplicates idempotency keys and rejects mismatched payload reuse", async () => {
      const queue = await fixture.createAdapter();
      const input = makeInput();
      const first = await queue.enqueue(input);
      const duplicate = await queue.enqueue({ ...input, id: "job-b" });
      expect(duplicate.id).toBe(first.id);
      await expect(
        queue.enqueue({ ...input, id: "job-c", assetId: "different-asset" }),
      ).rejects.toBeInstanceOf(MediaAssetConflictError);
    });

    it("claims due jobs once, updates progress, and reclaims an expired lease", async () => {
      const queue = await fixture.createAdapter();
      const input = makeInput({
        availableAt: new Date("2026-01-01T00:00:05.000Z"),
      });
      await queue.enqueue(input);
      expect(
        await queue.claimNext({
          workerId: "worker-a",
          leaseDurationMs: 1_000,
          now: input.createdAt,
        }),
      ).toBeNull();
      const claimed = await queue.claimNext({
        workerId: "worker-a",
        leaseDurationMs: 1_000,
        now: input.availableAt!,
      });
      expect(claimed?.attempt).toBe(1);
      expect(
        await queue.claimNext({
          workerId: "worker-b",
          leaseDurationMs: 1_000,
          now: input.availableAt!,
        }),
      ).toBeNull();
      const progress = await queue.updateProgress(
        claimed!.id,
        "worker-a",
        45,
        input.availableAt!,
      );
      expect(progress.progress).toBe(45);
      await queue.renewLease(
        claimed!.id,
        "worker-a",
        2_000,
        new Date(input.availableAt!.getTime() + 500),
      );
      expect(
        await queue.claimNext({
          workerId: "worker-b",
          leaseDurationMs: 1_000,
          now: new Date(input.availableAt!.getTime() + 1_500),
        }),
      ).toBeNull();
      const reclaimed = await queue.claimNext({
        workerId: "worker-b",
        leaseDurationMs: 1_000,
        now: new Date(input.availableAt!.getTime() + 2_501),
      });
      expect(reclaimed?.attempt).toBe(2);
      expect(reclaimed?.workerId).toBe("worker-b");
    });

    it("retries retryable failures at the requested time then dead-letters exhaustion", async () => {
      const queue = await fixture.createAdapter();
      const job = await enqueueAndClaim(queue);
      const retryAt = new Date(job.createdAt.getTime() + 5_000);
      const retrying = await queue.fail(
        job.id,
        "worker-a",
        { message: "temporary", retryable: true },
        retryAt,
        job.createdAt,
      );
      expect(retrying.status).toBe("retrying");
      expect(
        await queue.claimNext({
          workerId: "worker-b",
          leaseDurationMs: 1_000,
          now: new Date(retryAt.getTime() - 1),
        }),
      ).toBeNull();
      const secondAttempt = await queue.claimNext({
        workerId: "worker-b",
        leaseDurationMs: 1_000,
        now: retryAt,
      });
      expect(secondAttempt?.attempt).toBe(2);
      const deadLetter = await queue.fail(
        job.id,
        "worker-b",
        { message: "still failing", retryable: true },
        null,
        retryAt,
      );
      expect(deadLetter.status).toBe("dead-letter");
      expect(deadLetter.completedAt).toEqual(retryAt);
    });

    it("marks permanent failures and supports cancellation of queued jobs", async () => {
      const queue = await fixture.createAdapter();
      const permanentJob = await enqueueAndClaim(queue);
      const failed = await queue.fail(
        permanentJob.id,
        "worker-a",
        { message: "invalid media", retryable: false },
        null,
        permanentJob.createdAt,
      );
      expect(failed.status).toBe("failed");

      const completionInput = makeInput({
        id: "job-complete",
        idempotencyKey: "complete",
      });
      await queue.enqueue(completionInput);
      const completionJob = await queue.claimNext({
        workerId: "worker-c",
        leaseDurationMs: 1_000,
        now: completionInput.createdAt,
      });
      const completed = await queue.complete(
        completionJob!.id,
        "worker-c",
        [],
        completionInput.createdAt,
      );
      expect(completed.status).toBe("succeeded");
      await expect(
        queue.complete(
          completionJob!.id,
          "stale-worker",
          [],
          completionInput.createdAt,
        ),
      ).rejects.toBeInstanceOf(MediaAssetConflictError);

      const input = makeInput({
        id: "job-cancel",
        idempotencyKey: "cancel",
      });
      await queue.enqueue(input);
      const cancelled = await queue.cancel(input.id, input.createdAt);
      expect(cancelled?.status).toBe("cancelled");
      expect(await queue.cancel(input.id, input.createdAt)).toBeNull();
    });
  });
};
