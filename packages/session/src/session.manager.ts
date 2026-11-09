import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
} from "@puzzle-ui/storage";

import {
  SessionConfigurationError,
  SessionNotFoundError,
} from "./errors/session.errors";

import {
  generateSessionId,
  generateSessionToken,
  hashSessionToken,
} from "./utils/session-crypto";

import {
  SESSION_COLLECTION,
  SESSION_USER_LOCK_COLLECTION,
  sessionCollection,
  sessionUserLockCollection,
} from "./session.storage";

import type {
  SessionDevice,
  SessionRecord,
  SessionStorageRecord,
} from "./types/session.types";

import type { SessionUserLockRecord } from "./types/session-lock.types";

import type {
  CreatedSession,
  CreateSessionInput,
  SessionManager,
  SessionManagerOptions,
  ValidateSessionOptions,
  RotateSessionInput,
} from "./types/session-manager.types";

const DEFAULT_OPTIONS: SessionManagerOptions = {
  lifetime: {
    idleTimeoutSeconds: 60 * 60 * 24 * 7,
    absoluteLifetimeSeconds: 60 * 60 * 24 * 30,
  },
  maximumSessionsPerUser: 10,
  touchIntervalSeconds: 60,
};

const toPublicSession = (record: SessionStorageRecord): SessionRecord => ({
  id: record.id,
  tokenHash: record.tokenHash,
  userId: record.userId,
  kind: record.kind,
  createdAt: record.createdAt,
  lastSeenAt: record.lastSeenAt,
  expiresAt: record.expiresAt,
  revokedAt: record.revokedAt,
  metadata: record.metadata,
});

const isActive = (session: SessionStorageRecord, now: Date): boolean =>
  session.revokedAt === null && session.expiresAt.getTime() > now.getTime();

const validateOptions = (options: SessionManagerOptions): void => {
  const { idleTimeoutSeconds, absoluteLifetimeSeconds } = options.lifetime;

  if (
    !Number.isFinite(idleTimeoutSeconds) ||
    !Number.isFinite(absoluteLifetimeSeconds) ||
    idleTimeoutSeconds <= 0 ||
    absoluteLifetimeSeconds <= 0 ||
    idleTimeoutSeconds > absoluteLifetimeSeconds
  ) {
    throw new SessionConfigurationError(
      "Session lifetimes must be positive and the idle timeout cannot exceed the absolute lifetime.",
    );
  }

  if (
    options.maximumSessionsPerUser !== undefined &&
    (!Number.isInteger(options.maximumSessionsPerUser) ||
      options.maximumSessionsPerUser < 1)
  ) {
    throw new SessionConfigurationError(
      "maximumSessionsPerUser must be a positive integer.",
    );
  }

  if (
    options.touchIntervalSeconds !== undefined &&
    (!Number.isFinite(options.touchIntervalSeconds) ||
      options.touchIntervalSeconds < 0)
  ) {
    throw new SessionConfigurationError(
      "touchIntervalSeconds must be a non-negative number.",
    );
  }
};

export class StorageSessionManager implements SessionManager {
  private readonly options: SessionManagerOptions;
  private readonly collection: string;
  private readonly clock: () => Date;

  constructor(
    private readonly storage: StorageAdapter,
    options: Partial<SessionManagerOptions> = {},
  ) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      lifetime: {
        ...DEFAULT_OPTIONS.lifetime,
        ...options.lifetime,
      },
    };

    validateOptions(this.options);

    this.collection = options.collectionName ?? SESSION_COLLECTION;
    this.clock = options.clock ?? (() => new Date());

    if (
      !storage.capabilities.uniqueConstraints ||
      !storage.capabilities.conditionalWrites ||
      !storage.capabilities.atomicBatch
    ) {
      throw new SessionConfigurationError(
        "The storage adapter does not support the atomicity required by session management.",
      );
    }
  }

  async initialize(): Promise<void> {
    await this.storage.registerCollection({
      ...sessionCollection,
      name: this.collection,
    });

    await this.storage.registerCollection(sessionUserLockCollection);
  }

  private now(): Date {
    return this.clock();
  }

  private absoluteExpiry(createdAt: Date): Date {
    return new Date(
      createdAt.getTime() +
        this.options.lifetime.absoluteLifetimeSeconds * 1000,
    );
  }

  private idleExpiry(lastSeenAt: Date): Date {
    return new Date(
      lastSeenAt.getTime() + this.options.lifetime.idleTimeoutSeconds * 1000,
    );
  }

  private effectiveExpiry(createdAt: Date, lastSeenAt: Date): Date {
    return new Date(
      Math.min(
        this.absoluteExpiry(createdAt).getTime(),
        this.idleExpiry(lastSeenAt).getTime(),
      ),
    );
  }

  private async createRecord(
    input: CreateSessionInput,
    now: Date,
  ): Promise<CreatedSession> {
    if (input.kind === "authenticated" && !input.userId) {
      throw new SessionConfigurationError(
        "Authenticated sessions require a user ID.",
      );
    }

    if (input.kind === "anonymous" && input.userId !== null) {
      throw new SessionConfigurationError(
        "Anonymous sessions cannot have a user ID.",
      );
    }

    const token = generateSessionToken();
    const tokenHash = await hashSessionToken(token);

    const absoluteExpiry = this.absoluteExpiry(now);
    const requestedExpiry = input.expiresAt ?? absoluteExpiry;

    if (
      !(requestedExpiry instanceof Date) ||
      !Number.isFinite(requestedExpiry.getTime()) ||
      requestedExpiry.getTime() <= now.getTime()
    ) {
      throw new SessionConfigurationError(
        "Session expiration must be a valid future date.",
      );
    }

    const record: SessionStorageRecord = {
      id: generateSessionId(),
      tokenHash,
      userId: input.userId,
      kind: input.kind,
      createdAt: now,
      updatedAt: now,
      revision: 1,
      lastSeenAt: now,
      expiresAt: new Date(
        Math.min(
          requestedExpiry.getTime(),
          absoluteExpiry.getTime(),
          this.idleExpiry(now).getTime(),
        ),
      ),
      revokedAt: null,
      metadata: input.metadata,
    };

    return {
      session: toPublicSession(record),
      token,
    };
  }

  private toStorageRecord(session: SessionRecord): SessionStorageRecord {
    return {
      ...session,
      updatedAt: session.lastSeenAt,
      revision: 1,
    };
  }

  async create(input: CreateSessionInput): Promise<CreatedSession> {
    const created = await this.createRecord(input, this.now());

    if (!input.userId) {
      await this.storage.insert<SessionStorageRecord>(
        this.collection,
        this.toStorageRecord(created.session),
      );

      return created;
    }

    await this.createAuthenticatedSessionAtomically(input.userId, created);

    return created;
  }

  private async createAuthenticatedSessionAtomically(
    userId: string,
    created: CreatedSession,
  ): Promise<void> {
    const maximum = this.options.maximumSessionsPerUser;

    for (let attempt = 0; attempt < 8; attempt++) {
      const now = this.now();

      const lock = await this.storage.findOne<SessionUserLockRecord>(
        SESSION_USER_LOCK_COLLECTION,
        {
          where: {
            userId: { operator: "eq", value: userId },
          },
        },
      );

      const sessions = await this.storage.findMany<SessionStorageRecord>(
        this.collection,
        {
          where: {
            userId: { operator: "eq", value: userId },
            revokedAt: { operator: "eq", value: null },
          },
          orderBy: [
            { field: "lastSeenAt", direction: "desc" },
            { field: "createdAt", direction: "desc" },
          ],
        },
      );

      const active = sessions.filter((session) => isActive(session, now));

      const excess =
        maximum === undefined ? [] : active.slice(Math.max(0, maximum - 1));

      const operations: (
        | StorageBatchOperation<SessionStorageRecord>
        | StorageBatchOperation<SessionUserLockRecord>
      )[] = [];

      if (lock) {
        operations.push({
          type: "update",
          collection: SESSION_USER_LOCK_COLLECTION,
          id: lock.id,
          condition: {
            expectedRevision: lock.revision,
          },
          changes: {},
        });
      } else {
        operations.push({
          type: "insert",
          collection: SESSION_USER_LOCK_COLLECTION,
          record: {
            id: generateSessionId(),
            userId,
            createdAt: now,
            updatedAt: now,
            revision: 1,
          },
        });
      }

      operations.push({
        type: "insert",
        collection: this.collection,
        record: this.toStorageRecord(created.session),
      });

      for (const session of excess) {
        operations.push({
          type: "update",
          collection: this.collection,
          id: session.id,
          condition: {
            expectedRevision: session.revision,
          },
          changes: {
            revokedAt: now,
          },
        });
      }

      try {
        await this.storage.atomicBatch<
          SessionStorageRecord | SessionUserLockRecord
        >(operations);

        return;
      } catch (error) {
        if (
          error instanceof StorageConflictError ||
          error instanceof StorageDuplicateError
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new SessionConfigurationError(
      "Could not acquire the user session concurrency lock after repeated conflicts.",
    );
  }

  async validate(
    token: string,
    options: ValidateSessionOptions = {},
  ): Promise<SessionRecord | null> {
    if (!token) return null;

    const tokenHash = await hashSessionToken(token);

    const session = await this.storage.findOne<SessionStorageRecord>(
      this.collection,
      {
        where: {
          tokenHash: { operator: "eq", value: tokenHash },
        },
      },
    );

    if (!session) return null;

    const now = this.now();

    if (!isActive(session, now)) return null;

    if (
      this.idleExpiry(session.lastSeenAt).getTime() <= now.getTime() ||
      this.absoluteExpiry(session.createdAt).getTime() <= now.getTime()
    ) {
      await this.revoke(session.id);
      return null;
    }

    const touch =
      options.touch !== false &&
      now.getTime() - session.lastSeenAt.getTime() >=
        (this.options.touchIntervalSeconds ?? 60) * 1000;

    if (!touch) return toPublicSession(session);

    try {
      const updated = await this.storage.update<SessionStorageRecord>(
        this.collection,
        session.id,
        {
          lastSeenAt: now,
          expiresAt: this.effectiveExpiry(session.createdAt, now),
        },
        { expectedRevision: session.revision },
      );

      return updated ? toPublicSession(updated) : null;
    } catch (error) {
      if (error instanceof StorageConflictError) {
        return null;
      }

      throw error;
    }
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    const session = await this.storage.findById<SessionStorageRecord>(
      this.collection,
      sessionId,
    );

    if (!session || !isActive(session, this.now())) return null;

    const now = this.now();

    if (
      this.idleExpiry(session.lastSeenAt).getTime() <= now.getTime() ||
      this.absoluteExpiry(session.createdAt).getTime() <= now.getTime()
    ) {
      await this.revoke(sessionId);
      return null;
    }

    return toPublicSession(session);
  }

  async rotate(input: RotateSessionInput): Promise<CreatedSession> {
    const current = await this.storage.findById<SessionStorageRecord>(
      this.collection,
      input.sessionId,
    );

    const now = this.now();

    if (
      !current ||
      !isActive(current, now) ||
      this.idleExpiry(current.lastSeenAt).getTime() <= now.getTime() ||
      this.absoluteExpiry(current.createdAt).getTime() <= now.getTime()
    ) {
      throw new SessionNotFoundError();
    }

    const created = await this.createRecord(
      {
        userId: current.userId,
        kind: current.kind,
        metadata: input.metadata ?? current.metadata,
      },
      now,
    );

    const operations: StorageBatchOperation<SessionStorageRecord>[] = [
      {
        type: "insert",
        collection: this.collection,
        record: this.toStorageRecord(created.session),
      },
      {
        type: "update",
        collection: this.collection,
        id: current.id,
        condition: {
          expectedRevision: current.revision,
        },
        changes: {
          revokedAt: now,
        },
      },
    ];

    await this.storage.atomicBatch(operations);

    return created;
  }

  async revoke(sessionId: string): Promise<void> {
    const session = await this.storage.findById<SessionStorageRecord>(
      this.collection,
      sessionId,
    );

    if (!session || session.revokedAt) return;

    await this.storage.update<SessionStorageRecord>(
      this.collection,
      sessionId,
      { revokedAt: this.now() },
      { expectedRevision: session.revision },
    );
  }

  async revokeAll(userId: string): Promise<void> {
    if (!userId) {
      throw new SessionConfigurationError(
        "A user ID is required to revoke sessions.",
      );
    }

    await this.storage.updateMany<SessionStorageRecord>(
      this.collection,
      {
        where: {
          userId: { operator: "eq", value: userId },
          revokedAt: { operator: "eq", value: null },
        },
      },
      { revokedAt: this.now() },
    );
  }

  async list(
    userId: string,
    currentSessionId?: string,
  ): Promise<readonly SessionDevice[]> {
    const now = this.now();

    const sessions = await this.storage.findMany<SessionStorageRecord>(
      this.collection,
      {
        where: {
          userId: { operator: "eq", value: userId },
          revokedAt: { operator: "eq", value: null },
        },
        orderBy: [{ field: "lastSeenAt", direction: "desc" }],
      },
    );

    return sessions
      .filter(
        (session) =>
          isActive(session, now) &&
          this.idleExpiry(session.lastSeenAt).getTime() > now.getTime() &&
          this.absoluteExpiry(session.createdAt).getTime() > now.getTime(),
      )
      .map((session) => ({
        sessionId: session.id,
        kind: session.kind,
        createdAt: session.createdAt,
        lastSeenAt: session.lastSeenAt,
        expiresAt: session.expiresAt,
        current: session.id === currentSessionId,
        metadata: session.metadata,
      }));
  }
}
