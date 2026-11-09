import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
} from "@puzzle-ui/storage";

import { AuthConfigurationError } from "./errors/auth.errors";
import { AUTH_RATE_LIMIT_COLLECTION } from "./auth.storage";

import type { AuthRateLimitStorageRecord } from "./types/auth-lifecycle.types";
import type { RateLimitProvider } from "./providers/provider.types";
import { authRateLimitCollection } from "./auth.storage";

export type StorageRateLimitProviderOptions = {
  readonly collectionName?: string;
  readonly clock?: () => Date;
  readonly maximumRetries?: number;
};

export class StorageRateLimitProvider implements RateLimitProvider {
  private readonly collection: string;
  private readonly clock: () => Date;
  private readonly maximumRetries: number;

  constructor(
    private readonly storage: StorageAdapter,
    options: StorageRateLimitProviderOptions = {},
  ) {
    this.collection = options.collectionName ?? AUTH_RATE_LIMIT_COLLECTION;
    this.clock = options.clock ?? (() => new Date());
    this.maximumRetries = options.maximumRetries ?? 12;

    if (
      !storage.capabilities.uniqueConstraints ||
      !storage.capabilities.conditionalWrites
    ) {
      throw new AuthConfigurationError(
        "The storage-backed rate limiter requires unique constraints and conditional writes.",
      );
    }

    if (!Number.isInteger(this.maximumRetries) || this.maximumRetries < 1) {
      throw new AuthConfigurationError(
        "maximumRetries must be a positive integer.",
      );
    }
  }

  async initialize(): Promise<void> {
    await this.storage.registerCollection({
      ...authRateLimitCollection,
      name: this.collection,
    });
  }

  async consume(input: {
    readonly key: string;
    readonly limit: number;
    readonly windowSeconds: number;
  }): Promise<{
    readonly allowed: boolean;
    readonly remaining: number;
    readonly resetAt: Date;
  }> {
    if (
      typeof input.key !== "string" ||
      input.key.length === 0 ||
      !Number.isInteger(input.limit) ||
      input.limit < 1 ||
      !Number.isFinite(input.windowSeconds) ||
      input.windowSeconds <= 0
    ) {
      throw new AuthConfigurationError("The rate-limit request is invalid.");
    }

    for (let attempt = 0; attempt < this.maximumRetries; attempt++) {
      const now = this.clock();

      if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
        throw new AuthConfigurationError(
          "The rate-limit clock returned an invalid date.",
        );
      }

      const current = await this.storage.findById<AuthRateLimitStorageRecord>(
        this.collection,
        input.key,
      );

      if (!current) {
        const resetAt = new Date(now.getTime() + input.windowSeconds * 1000);

        try {
          await this.storage.insert<AuthRateLimitStorageRecord>(
            this.collection,
            {
              id: input.key,
              windowStartedAt: now,
              resetAt,
              windowSeconds: input.windowSeconds,
              count: 1,
              createdAt: now,
              updatedAt: now,
              revision: 1,
            },
          );

          return {
            allowed: true,
            remaining: Math.max(0, input.limit - 1),
            resetAt,
          };
        } catch (error) {
          if (error instanceof StorageDuplicateError) {
            continue;
          }

          throw error;
        }
      }

      const expired =
        current.resetAt.getTime() <= now.getTime() ||
        current.windowSeconds !== input.windowSeconds;

      const nextCount = expired
        ? 1
        : Math.min(current.count + 1, Number.MAX_SAFE_INTEGER);

      const resetAt = expired
        ? new Date(now.getTime() + input.windowSeconds * 1000)
        : current.resetAt;

      try {
        const updated = await this.storage.update<AuthRateLimitStorageRecord>(
          this.collection,
          current.id,
          {
            windowStartedAt: expired ? now : current.windowStartedAt,
            resetAt,
            windowSeconds: input.windowSeconds,
            count: nextCount,
          },
          {
            expectedRevision: current.revision,
          },
        );

        if (!updated) {
          continue;
        }

        return {
          allowed: nextCount <= input.limit,
          remaining: Math.max(0, input.limit - nextCount),
          resetAt,
        };
      } catch (error) {
        if (error instanceof StorageConflictError) {
          continue;
        }

        throw error;
      }
    }

    throw new AuthConfigurationError(
      "The rate limiter could not update its counter after repeated storage conflicts.",
    );
  }
}
