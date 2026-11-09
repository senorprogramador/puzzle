export type SessionKind = "anonymous" | "authenticated";

export type SessionRecord = {
  readonly id: string;
  readonly tokenHash: string;
  readonly userId: string | null;
  readonly kind: SessionKind;
  readonly createdAt: Date;
  readonly lastSeenAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type SessionLifetime = {
  readonly idleTimeoutSeconds: number;
  readonly absoluteLifetimeSeconds: number;
};

export type SessionCookieOptions = {
  readonly name?: string;
  readonly path?: "/";
  readonly httpOnly: true;
  readonly secure: boolean;
  readonly sameSite: "lax" | "strict" | "none";
  readonly maxAge?: number;
  readonly domain?: never;
};

export type SessionDevice = {
  readonly sessionId: string;
  readonly kind: SessionKind;
  readonly createdAt: Date;
  readonly lastSeenAt: Date;
  readonly expiresAt: Date;
  readonly current: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export type SessionStorageRecord = SessionRecord & {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly revision: number;
};

export type SessionDataRecord = {
  readonly id: string;
  readonly ownerId: string;
  readonly namespace: string;
  readonly key: string;
  readonly value: unknown;
  readonly expiresAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly revokedAt?: Date | null;
  readonly revision: number;
};
