import { StorageConflictError, type StorageAdapter } from "@puzzle-ui/storage";

import {
  SessionConfigurationError,
  SessionNotFoundError,
} from "./errors/session.errors";

import {
  generateSessionId,
  generateSessionToken,
  hashSessionToken,
} from "./utils/session-crypto";

import { SESSION_COLLECTION, sessionCollection } from "./session.storage";

import type {
  SessionDevice,
  SessionRecord,
  SessionStorageRecord,
} from "./types/session.types";

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
    const absolute = this.absoluteExpiry(createdAt);
    const idle = this.idleExpiry(lastSeenAt);

    return absolute.getTime() < idle.getTime() ? absolute : idle;
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

    if (requestedExpiry.getTime() <= now.getTime()) {
      throw new SessionConfigurationError(
        "Session expiration must be in the future.",
      );
    }

    const expiresAt = new Date(
      Math.min(
        requestedExpiry.getTime(),
        absoluteExpiry.getTime(),
        this.idleExpiry(now).getTime(),
      ),
    );

    const record: SessionStorageRecord = {
      id: generateSessionId(),
      tokenHash,
      userId: input.userId,
      kind: input.kind,
      createdAt: now,
      updatedAt: now,
      revision: 1,
      lastSeenAt: now,
      expiresAt,
      revokedAt: null,
      metadata: input.metadata,
    };

    return {
      session: toPublicSession(record),
      token,
    };
  }

  async create(input: CreateSessionInput): Promise<CreatedSession> {
    const now = this.now();
    const created = await this.createRecord(input, now);

    try {
      await this.storage.insert<SessionStorageRecord>(
        this.collection,
        created.session as SessionStorageRecord,
      );
    } catch (error) {
      if (error instanceof StorageConflictError) {
        throw new SessionConfigurationError(
          "Session creation conflicted with existing storage state.",
        );
      }

      throw error;
    }

    if (input.userId) {
      await this.enforceSessionLimit(input.userId);
    }

    return created;
  }

  private async enforceSessionLimit(userId: string): Promise<void> {
    const maximum = this.options.maximumSessionsPerUser;

    if (maximum === undefined) return;

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

    const now = this.now();
    const active = sessions.filter((session) => isActive(session, now));

    const excess = active.slice(maximum);

    for (const session of excess) {
      await this.revoke(session.id);
    }
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

    const idleExpiry = this.idleExpiry(session.lastSeenAt);
    const absoluteExpiry = this.absoluteExpiry(session.createdAt);

    if (
      idleExpiry.getTime() <= now.getTime() ||
      absoluteExpiry.getTime() <= now.getTime()
    ) {
      await this.revoke(session.id);
      return null;
    }

    const touch =
      options.touch !== false &&
      now.getTime() - session.lastSeenAt.getTime() >=
        (this.options.touchIntervalSeconds ?? 60) * 1000;

    if (!touch) {
      return toPublicSession(session);
    }

    const nextLastSeenAt = now;
    const nextExpiry = this.effectiveExpiry(session.createdAt, nextLastSeenAt);

    const updated = await this.storage.update<SessionStorageRecord>(
      this.collection,
      session.id,
      {
        lastSeenAt: nextLastSeenAt,
        expiresAt: nextExpiry,
      },
      { expectedRevision: session.revision },
    );

    if (!updated) return null;

    return toPublicSession(updated);
  }

  async get(sessionId: string): Promise<SessionRecord | null> {
    const session = await this.storage.findById<SessionStorageRecord>(
      this.collection,
      sessionId,
    );

    if (!session || !isActive(session, this.now())) return null;

    if (
      this.idleExpiry(session.lastSeenAt).getTime() <= this.now().getTime() ||
      this.absoluteExpiry(session.createdAt).getTime() <= this.now().getTime()
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

    if (!current || !isActive(current, now)) {
      throw new SessionNotFoundError();
    }

    if (
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

    const next = {
      ...created.session,
      updatedAt: now,
      revision: 1,
    } as SessionStorageRecord;

    const result = await this.storage.atomicBatch<SessionStorageRecord>([
      {
        type: "insert",
        collection: this.collection,
        record: next,
      },
      {
        type: "update",
        collection: this.collection,
        id: current.id,
        condition: { expectedRevision: current.revision },
        changes: {
          revokedAt: now,
        },
      },
    ]);

    if (result.results[1]?.type !== "update" || !result.results[1].record) {
      await this.revoke(created.session.id);
      throw new SessionNotFoundError();
    }

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
      .filter((session) => isActive(session, now))
      .filter(
        (session) =>
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
