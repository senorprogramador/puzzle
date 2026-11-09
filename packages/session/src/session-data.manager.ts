import type { StorageAdapter } from "@puzzle-ui/storage";

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
  readonly clock?: () => Date;
};

export class SessionDataManager {
  private readonly clock: () => Date;
  private readonly maximumValueBytes: number;

  constructor(
    private readonly storage: StorageAdapter,
    private readonly options: SessionDataOptions,
  ) {
    this.clock = options.clock ?? (() => new Date());
    this.maximumValueBytes = options.maximumValueBytes ?? 16_384;

    if (!options.allowedNamespaces.length) {
      throw new Error("At least one session data namespace is required.");
    }

    if (
      !Number.isInteger(this.maximumValueBytes) ||
      this.maximumValueBytes < 1
    ) {
      throw new Error("maximumValueBytes must be a positive integer.");
    }
  }

  async initialize(): Promise<void> {
    await this.storage.registerCollection(sessionDataCollection);
  }

  private assertNamespace(namespace: string): void {
    if (!this.options.allowedNamespaces.includes(namespace)) {
      throw new Error(`Session data namespace is not allowed: ${namespace}`);
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

  async set(
    ownerId: string,
    namespace: string,
    key: string,
    value: unknown,
    ttlSeconds = this.options.defaultTtlSeconds,
  ): Promise<void> {
    if (!ownerId || !key) {
      throw new Error("An owner ID and key are required.");
    }

    this.assertNamespace(namespace);
    this.assertValue(value);

    if (
      ttlSeconds !== undefined &&
      (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0)
    ) {
      throw new Error("TTL must be a positive number.");
    }

    const now = this.clock();

    const expiresAt =
      ttlSeconds === undefined
        ? null
        : new Date(now.getTime() + ttlSeconds * 1000);

    const existing = await this.storage.findOne<SessionDataRecord>(
      SESSION_DATA_COLLECTION,
      {
        where: {
          ownerId: { operator: "eq", value: ownerId },
          namespace: { operator: "eq", value: namespace },
          key: { operator: "eq", value: key },
        },
      },
    );

    if (existing) {
      await this.storage.update<SessionDataRecord>(
        SESSION_DATA_COLLECTION,
        existing.id,
        { value, expiresAt },
        { expectedRevision: existing.revision },
      );

      return;
    }

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
  }

  async get<T = unknown>(
    ownerId: string,
    namespace: string,
    key: string,
  ): Promise<T | null> {
    this.assertNamespace(namespace);

    const record = await this.storage.findOne<SessionDataRecord>(
      SESSION_DATA_COLLECTION,
      {
        where: {
          ownerId: { operator: "eq", value: ownerId },
          namespace: { operator: "eq", value: namespace },
          key: { operator: "eq", value: key },
        },
      },
    );

    if (!record) return null;

    if (
      record.expiresAt &&
      record.expiresAt.getTime() <= this.clock().getTime()
    ) {
      await this.storage.delete(SESSION_DATA_COLLECTION, record.id, {
        expectedRevision: record.revision,
      });

      return null;
    }

    return record.value as T;
  }

  async remove(ownerId: string, namespace: string, key: string): Promise<void> {
    this.assertNamespace(namespace);

    const record = await this.storage.findOne<SessionDataRecord>(
      SESSION_DATA_COLLECTION,
      {
        where: {
          ownerId: { operator: "eq", value: ownerId },
          namespace: { operator: "eq", value: namespace },
          key: { operator: "eq", value: key },
        },
      },
    );

    if (record) {
      await this.storage.delete(SESSION_DATA_COLLECTION, record.id, {
        expectedRevision: record.revision,
      });
    }
  }

  async removeExpired(): Promise<number> {
    const now = this.clock();

    return this.storage.deleteMany<SessionDataRecord>(SESSION_DATA_COLLECTION, {
      where: {
        expiresAt: { operator: "lte", value: now },
      },
    });
  }
}
