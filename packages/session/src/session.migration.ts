import type {
  StorageAdapter,
  StorageBatchOperation,
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

export type AnonymousMigrationOptions = {
  readonly allowedNamespaces: readonly string[];
  readonly maximumRecords?: number;
  readonly maximumTotalBytes?: number;
  readonly idleTimeoutSeconds: number;
  readonly absoluteLifetimeSeconds: number;
  readonly clock?: () => Date;
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

export class SessionMigrationManager {
  private readonly clock: () => Date;

  constructor(
    private readonly storage: StorageAdapter,
    private readonly options: AnonymousMigrationOptions,
  ) {
    this.clock = options.clock ?? (() => new Date());

    if (
      options.idleTimeoutSeconds <= 0 ||
      options.absoluteLifetimeSeconds <= 0 ||
      options.idleTimeoutSeconds > options.absoluteLifetimeSeconds
    ) {
      throw new Error("Invalid migration session lifetime.");
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
      oldSession.revokedAt !== null ||
      oldSession.expiresAt.getTime() <= now.getTime()
    ) {
      throw new SessionSecurityError(
        "The anonymous session is not eligible for migration.",
      );
    }

    if (
      now.getTime() - oldSession.lastSeenAt.getTime() >
      this.options.idleTimeoutSeconds * 1000
    ) {
      throw new SessionSecurityError(
        "The anonymous session has expired due to inactivity.",
      );
    }

    if (
      now.getTime() - oldSession.createdAt.getTime() >
      this.options.absoluteLifetimeSeconds * 1000
    ) {
      throw new SessionSecurityError(
        "The anonymous session has reached its absolute lifetime.",
      );
    }

    const records = await this.storage.findMany<SessionDataRecord>(
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

    const allowed = records.filter((record) =>
      this.options.allowedNamespaces.includes(record.namespace),
    );

    const maximumRecords = this.options.maximumRecords ?? 100;
    const maximumTotalBytes = this.options.maximumTotalBytes ?? 65_536;

    if (allowed.length > maximumRecords) {
      throw new SessionSecurityError(
        "Anonymous session contains too many records to migrate.",
      );
    }

    const totalBytes = allowed.reduce((total, record) => {
      return (
        total +
        new TextEncoder().encode(JSON.stringify(record.value)).byteLength
      );
    }, 0);

    if (totalBytes > maximumTotalBytes) {
      throw new SessionSecurityError(
        "Anonymous session data exceeds the migration size limit.",
      );
    }

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
      ...allowed.map<StorageBatchOperation<SessionDataRecord>>((record) => ({
        type: "update",
        collection: SESSION_DATA_COLLECTION,
        id: record.id,
        condition: {
          expectedRevision: record.revision,
        },
        changes: {
          ownerId: id,
        },
      })),
    ];

    await this.storage.atomicBatch<SessionStorageRecord | SessionDataRecord>(
      operations,
    );

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
      migratedRecords: allowed.length,
    };
  }
}
