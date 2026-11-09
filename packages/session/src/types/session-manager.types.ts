import type {
  SessionDevice,
  SessionKind,
  SessionRecord,
} from "./session.types";

export type CreateSessionInput = {
  readonly userId: string | null;
  readonly kind: SessionKind;
  readonly expiresAt?: Date;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type RotateSessionInput = {
  readonly sessionId: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type ValidateSessionOptions = {
  readonly touch?: boolean;
};

export type SessionManagerOptions = {
  readonly lifetime: {
    readonly idleTimeoutSeconds: number;
    readonly absoluteLifetimeSeconds: number;
  };
  readonly collectionName?: string;
  readonly maximumSessionsPerUser?: number;
  readonly touchIntervalSeconds?: number;
  readonly clock?: () => Date;
};

export type CreatedSession = {
  readonly session: SessionRecord;
  readonly token: string;
};

export interface SessionManager {
  create(input: CreateSessionInput): Promise<CreatedSession>;

  validate(
    token: string,
    options?: ValidateSessionOptions,
  ): Promise<SessionRecord | null>;

  rotate(input: RotateSessionInput): Promise<CreatedSession>;

  revoke(sessionId: string): Promise<void>;

  revokeAll(userId: string): Promise<void>;

  list(
    userId: string,
    currentSessionId?: string,
  ): Promise<readonly SessionDevice[]>;

  get(sessionId: string): Promise<SessionRecord | null>;
}
