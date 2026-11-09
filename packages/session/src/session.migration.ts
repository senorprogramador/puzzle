import {
  StorageConflictError,
  type StorageAdapter,
  type StorageBatchOperation,
} from "@puzzle-ui/storage";

import { SessionSecurityError } from "./errors/session.errors";

import { SESSION_COLLECTION, SESSION_DATA_COLLECTION } from "./session.storage";

import type {
  SessionDataRecord,
  SessionStorageRecord,
} from "./types/session.types";

import {
  generateSessionId,
  generateSessionToken,
  hashSessionToken,
} from "./utils/session-crypto";

export type SessionMigrationEntry = {
  readonly sourceIds: readonly string[];
  readonly namespace: string;
  readonly key: string;
  readonly value: unknown;
  readonly expiresAt: Date | null;
};

export type SessionMigrationContext = {
  readonly anonymousSession: SessionStorageRecord;
  readonly targetUserId: string;
  readonly records: readonly SessionDataRecord[];
};

export type AnonymousMigrationOptions = {
  readonly allowedNamespaces: readonly string[];
  readonly maximumRecords?: number;
  readonly maximumTotalBytes?: number;
  readonly maximumEntryBytes?: number;
  readonly idleTimeoutSeconds: number;
  readonly absoluteLifetimeSeconds: number;
  readonly clock?: () => Date;

  readonly merge?: (
    context: SessionMigrationContext,
  ) =>
    | readonly SessionMigrationEntry[]
    | Promise<readonly SessionMigrationEntry[]>;
};

export type AnonymousMigrationResult = {
  readonly session: {
    readonly id: string;
    readonly userId: string;
    readonly kind: "authenticated";
    readonly createdAt: Date;
    readonly lastSeenAt: Date;
    readonly expiresAt: Date;
    readonly revokedAt: null;
    readonly metadata?: Readonly<Record<string, unknown>>;
  };
  readonly token: string;
  readonly migratedRecords: number;
};

const serialize = (value: unknown): string => {
  let result: string | undefined;

  try {
    result = JSON.stringify(value);
  } catch {
    throw new SessionSecurityError(
      "Migrated session data must be JSON serializable.",
    );
  }

  if (result === undefined) {
    throw new SessionSecurityError(
      "Migrated session data must be JSON serializable.",
    );
  }

  return result;
};

const toBytes = (value: unknown): number =>
  new TextEncoder().encode(serialize(value)).byteLength;

const defaultMerge = (
  records: readonly SessionDataRecord[],
): readonly SessionMigrationEntry[] =>
  records.map((record) => ({
    sourceIds: [record.id],
    namespace: record.namespace,
    key: record.key,
    value: record.value,
    expiresAt: record.expiresAt,
  }));

export class SessionMigrationManager {
  private readonly clock: () => Date;

  constructor(
    private readonly storage: StorageAdapter,
    private readonly options: AnonymousMigrationOptions,
  ) {
    this.clock = options.clock ?? (() => new Date());

    if (
      !options.allowedNamespaces.length ||
      !Number.isFinite(options.idleTimeoutSeconds) ||
      !Number.isFinite(options.absoluteLifetimeSeconds) ||
      options.idleTimeoutSeconds <= 0 ||
      options.absoluteLifetimeSeconds <= 0 ||
      options.idleTimeoutSeconds > options.absoluteLifetimeSeconds
    ) {
      throw new Error("Invalid anonymous session migration configuration.");
    }

    if (
      options.maximumRecords !== undefined &&
      (!Number.isInteger(options.maximumRecords) || options.maximumRecords < 0)
    ) {
      throw new Error("maximumRecords must be a non-negative integer.");
    }

    if (
      options.maximumTotalBytes !== undefined &&
      (!Number.isInteger(options.maximumTotalBytes) ||
        options.maximumTotalBytes < 0)
    ) {
      throw new Error("maximumTotalBytes must be a non-negative integer.");
    }
  }

  async migrate(input: {
    readonly anonymousSessionId: string;
    readonly userId: string;
    readonly metadata?: Readonly<Record<string, unknown>>;
  }): Promise<AnonymousMigrationResult> {
    if (!input.anonymousSessionId || !input.userId) {
      throw new SessionSecurityError(
        "An anonymous session ID and authenticated user ID are required.",
      );
    }

    const now = this.clock();

    const oldSession = await this.storage.findById<SessionStorageRecord>(
      SESSION_COLLECTION,
      input.anonymousSessionId,
    );

    if (
      !oldSession ||
      oldSession.kind !== "anonymous" ||
      oldSession.userId !== null ||
      oldSession.revokedAt !== null
    ) {
      throw new SessionSecurityError(
        "The anonymous session is not eligible for migration.",
      );
    }

    if (
      oldSession.expiresAt.getTime() <= now.getTime() ||
      oldSession.lastSeenAt.getTime() +
        this.options.idleTimeoutSeconds * 1000 <=
        now.getTime() ||
      oldSession.createdAt.getTime() +
        this.options.absoluteLifetimeSeconds * 1000 <=
        now.getTime()
    ) {
      throw new SessionSecurityError("The anonymous session has expired.");
    }

    const allRecords = await this.storage.findMany<SessionDataRecord>(
      SESSION_DATA_COLLECTION,
      {
        where: {
          ownerId: {
            operator: "eq",
            value: oldSession.id,
          },
        },
      },
    );

    const records = allRecords.filter(
      (record) =>
        this.options.allowedNamespaces.includes(record.namespace) &&
        (!record.expiresAt || record.expiresAt.getTime() > now.getTime()),
    );

    const maximumRecords = this.options.maximumRecords ?? 100;
    const maximumTotalBytes = this.options.maximumTotalBytes ?? 65_536;
    const maximumEntryBytes = this.options.maximumEntryBytes ?? 16_384;

    if (records.length > maximumRecords) {
      throw new SessionSecurityError(
        "Anonymous session contains too many records to migrate.",
      );
    }

    const sourceBytes = records.reduce(
      (total, record) => total + toBytes(record.value),
      0,
    );

    if (sourceBytes > maximumTotalBytes) {
      throw new SessionSecurityError(
        "Anonymous session data exceeds the migration size limit.",
      );
    }

    const entries = this.options.merge
      ? await this.options.merge({
          anonymousSession: oldSession,
          targetUserId: input.userId,
          records,
        })
      : defaultMerge(records);

    this.validateEntries(
      entries,
      records,
      now,
      maximumEntryBytes,
      maximumTotalBytes,
    );

    const token = generateSessionToken();
    const tokenHash = await hashSessionToken(token);
    const id = generateSessionId();

    const absoluteExpiry = new Date(
      now.getTime() + this.options.absoluteLifetimeSeconds * 1000,
    );

    const idleExpiry = new Date(
      now.getTime() + this.options.idleTimeoutSeconds * 1000,
    );

    const expiresAt = new Date(
      Math.min(absoluteExpiry.getTime(), idleExpiry.getTime()),
    );

    const nextSession: SessionStorageRecord = {
      id,
      tokenHash,
      userId: input.userId,
      kind: "authenticated",
      createdAt: now,
      updatedAt: now,
      revision: 1,
      lastSeenAt: now,
      expiresAt,
      revokedAt: null,
      metadata: input.metadata,
    };

    const sourceMap = new Map(records.map((record) => [record.id, record]));

    const usedIds = new Set<string>();

    const operations: (
      | StorageBatchOperation<SessionStorageRecord>
      | StorageBatchOperation<SessionDataRecord>
    )[] = [
      {
        type: "insert",
        collection: SESSION_COLLECTION,
        record: nextSession,
      },
      {
        type: "update",
        collection: SESSION_COLLECTION,
        id: oldSession.id,
        condition: {
          expectedRevision: oldSession.revision,
        },
        changes: {
          revokedAt: now,
        },
      },
    ];

    for (const entry of entries) {
      const sources = entry.sourceIds.map((sourceId) => {
        const source = sourceMap.get(sourceId);

        if (!source || usedIds.has(sourceId)) {
          throw new SessionSecurityError(
            "The migration merge callback returned an invalid or duplicate source ID.",
          );
        }

        usedIds.add(sourceId);

        return source;
      });

      const primary = sources[0];

      if (!primary) {
        throw new SessionSecurityError(
          "A migration entry must have at least one source record.",
        );
      }

      operations.push({
        type: "update",
        collection: SESSION_DATA_COLLECTION,
        id: primary.id,
        condition: {
          expectedRevision: primary.revision,
        },
        changes: {
          ownerId: id,
          namespace: entry.namespace,
          key: entry.key,
          value: entry.value,
          expiresAt: entry.expiresAt,
        },
      });

      for (const duplicate of sources.slice(1)) {
        operations.push({
          type: "delete",
          collection: SESSION_DATA_COLLECTION,
          id: duplicate.id,
          condition: {
            expectedRevision: duplicate.revision,
          },
        });
      }
    }

    try {
      await this.storage.atomicBatch<SessionStorageRecord | SessionDataRecord>(
        operations,
      );
    } catch (error) {
      if (error instanceof StorageConflictError) {
        throw new SessionSecurityError(
          "The anonymous session was already migrated or modified concurrently.",
        );
      }

      throw error;
    }

    return {
      session: {
        id,
        userId: input.userId,
        kind: "authenticated",
        createdAt: now,
        lastSeenAt: now,
        expiresAt,
        revokedAt: null,
        metadata: input.metadata,
      },
      token,
      migratedRecords: entries.length,
    };
  }

  private validateEntries(
    entries: readonly SessionMigrationEntry[],
    records: readonly SessionDataRecord[],
    now: Date,
    maximumEntryBytes: number,
    maximumTotalBytes: number,
  ): void {
    const allowedIds = new Set(records.map((record) => record.id));
    const sourceIds = new Set<string>();
    const targetKeys = new Set<string>();

    let totalBytes = 0;

    for (const entry of entries) {
      if (
        !entry.sourceIds.length ||
        !entry.namespace ||
        !entry.key ||
        !this.options.allowedNamespaces.includes(entry.namespace)
      ) {
        throw new SessionSecurityError(
          "The migration merge callback returned an invalid entry.",
        );
      }

      const targetKey = `${entry.namespace}\0${entry.key}`;

      if (targetKeys.has(targetKey)) {
        throw new SessionSecurityError(
          "The migration merge callback returned duplicate target keys.",
        );
      }

      targetKeys.add(targetKey);

      for (const sourceId of entry.sourceIds) {
        if (!allowedIds.has(sourceId) || sourceIds.has(sourceId)) {
          throw new SessionSecurityError(
            "The migration merge callback referenced an invalid source record.",
          );
        }

        sourceIds.add(sourceId);
      }

      if (entry.expiresAt && entry.expiresAt.getTime() <= now.getTime()) {
        throw new SessionSecurityError(
          "The migration merge callback returned expired data.",
        );
      }

      const size = toBytes(entry.value);

      if (size > maximumEntryBytes) {
        throw new SessionSecurityError(
          "A migrated session data entry exceeds the maximum allowed size.",
        );
      }

      totalBytes += size;
    }

    if (totalBytes > maximumTotalBytes) {
      throw new SessionSecurityError(
        "Merged session data exceeds the maximum allowed size.",
      );
    }
  }
}
