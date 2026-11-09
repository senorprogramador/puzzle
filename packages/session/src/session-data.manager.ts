import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
} from "@puzzle-ui/storage";

import {
  SESSION_DATA_COLLECTION,
  sessionDataCollection,
} from "./session.storage";

import type { SessionDataRecord } from "./types/session.types";

import { generateSessionId } from "./utils/session-crypto";

export type SessionDataOptions = {
  readonly allowedNamespaces: readonly string[];
  readonly defaultTtlSeconds?: number;
  readonly maximumValueBytes?: number;
  readonly maximumRetries?: number;
  readonly clock?: () => Date;
};

export class SessionDataManager {
  private readonly clock: () => Date;
  private readonly maximumValueBytes: number;
  private readonly maximumRetries: number;

  constructor(
    private readonly storage: StorageAdapter,
    private readonly options: SessionDataOptions,
  ) {
    this.clock = options.clock ?? (() => new Date());
    this.maximumValueBytes = options.maximumValueBytes ?? 16_384;
    this.maximumRetries = options.maximumRetries ?? 5;

    if (!options.allowedNamespaces.length) {
      throw new Error("At least one session data namespace is required.");
    }

    if (
      !Number.isInteger(this.maximumValueBytes) ||
      this.maximumValueBytes < 1
    ) {
      throw new Error("maximumValueBytes must be a positive integer.");
    }

    if (!Number.isInteger(this.maximumRetries) || this.maximumRetries < 1) {
      throw new Error("maximumRetries must be a positive integer.");
    }

    if (
      options.defaultTtlSeconds !== undefined &&
      (!Number.isFinite(options.defaultTtlSeconds) ||
        options.defaultTtlSeconds <= 0)
    ) {
      throw new Error("defaultTtlSeconds must be a positive number.");
    }
  }

  async initialize(): Promise<void> {
    if (!this.storage.capabilities.uniqueConstraints) {
      throw new Error("Session data requires unique storage constraints.");
    }

    await this.storage.registerCollection(sessionDataCollection);
  }

  private assertOwner(ownerId: string): void {
    if (!ownerId.trim()) {
      throw new Error("A valid session owner ID is required.");
    }
  }

  private assertNamespace(namespace: string): void {
    if (!this.options.allowedNamespaces.includes(namespace)) {
      throw new Error(`Session data namespace is not allowed: ${namespace}`);
    }
  }

  private assertKey(key: string): void {
    if (!key.trim()) {
      throw new Error("A valid session data key is required.");
    }
  }

  private assertValue(value: unknown): void {
    let serialized: string;

    try {
      serialized = JSON.stringify(value);
    } catch {
      throw new Error("Session data must be JSON serializable.");
    }

    if (serialized === undefined) {
      throw new Error("Session data must be JSON serializable.");
    }

    const size = new TextEncoder().encode(serialized).byteLength;

    if (size > this.maximumValueBytes) {
      throw new Error("Session data exceeds the maximum allowed size.");
    }
  }

  private query(ownerId: string, namespace: string, key: string) {
    return {
      where: {
        ownerId: { operator: "eq" as const, value: ownerId },
        namespace: { operator: "eq" as const, value: namespace },
        key: { operator: "eq" as const, value: key },
      },
    };
  }

  async set(
    ownerId: string,
    namespace: string,
    key: string,
    value: unknown,
    ttlSeconds = this.options.defaultTtlSeconds,
  ): Promise<void> {
    this.assertOwner(ownerId);
    this.assertNamespace(namespace);
    this.assertKey(key);
    this.assertValue(value);

    if (
      ttlSeconds !== undefined &&
      (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0)
    ) {
      throw new Error("TTL must be a positive number.");
    }

    for (let attempt = 0; attempt < this.maximumRetries; attempt++) {
      const now = this.clock();

      const expiresAt =
        ttlSeconds === undefined
          ? null
          : new Date(now.getTime() + ttlSeconds * 1000);

      const existing = await this.storage.findOne<SessionDataRecord>(
        SESSION_DATA_COLLECTION,
        this.query(ownerId, namespace, key),
      );

      if (existing) {
        try {
          const updated = await this.storage.update<SessionDataRecord>(
            SESSION_DATA_COLLECTION,
            existing.id,
            {
              value,
              expiresAt,
            },
            {
              expectedRevision: existing.revision,
            },
          );

          if (updated) return;
        } catch (error) {
          if (!(error instanceof StorageConflictError)) {
            throw error;
          }
        }

        continue;
      }

      try {
        await this.storage.insert<SessionDataRecord>(SESSION_DATA_COLLECTION, {
          id: generateSessionId(),
          ownerId,
          namespace,
          key,
          value,
          expiresAt,
          createdAt: now,
          updatedAt: now,
          revision: 1,
        });

        return;
      } catch (error) {
        if (
          error instanceof StorageDuplicateError ||
          error instanceof StorageConflictError
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new StorageConflictError(
      "Could not write session data after repeated concurrent modifications.",
    );
  }

  async get<T = unknown>(
    ownerId: string,
    namespace: string,
    key: string,
  ): Promise<T | null> {
    this.assertOwner(ownerId);
    this.assertNamespace(namespace);
    this.assertKey(key);

    const record = await this.storage.findOne<SessionDataRecord>(
      SESSION_DATA_COLLECTION,
      this.query(ownerId, namespace, key),
    );

    if (!record) return null;

    if (
      record.expiresAt &&
      record.expiresAt.getTime() <= this.clock().getTime()
    ) {
      await this.storage
        .delete(SESSION_DATA_COLLECTION, record.id, {
          expectedRevision: record.revision,
        })
        .catch((error) => {
          if (!(error instanceof StorageConflictError)) {
            throw error;
          }
        });

      return null;
    }

    return record.value as T;
  }

  async remove(ownerId: string, namespace: string, key: string): Promise<void> {
    this.assertOwner(ownerId);
    this.assertNamespace(namespace);
    this.assertKey(key);

    for (let attempt = 0; attempt < this.maximumRetries; attempt++) {
      const record = await this.storage.findOne<SessionDataRecord>(
        SESSION_DATA_COLLECTION,
        this.query(ownerId, namespace, key),
      );

      if (!record) return;

      try {
        const deleted = await this.storage.delete(
          SESSION_DATA_COLLECTION,
          record.id,
          {
            expectedRevision: record.revision,
          },
        );

        if (deleted) return;
      } catch (error) {
        if (!(error instanceof StorageConflictError)) {
          throw error;
        }
      }
    }

    throw new StorageConflictError(
      "Could not remove session data after repeated concurrent modifications.",
    );
  }

  async removeExpired(): Promise<number> {
    const now = this.clock();

    return this.storage.deleteMany<SessionDataRecord>(SESSION_DATA_COLLECTION, {
      where: {
        expiresAt: {
          operator: "lte",
          value: now,
        },
      },
    });
  }
}
