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

export type SessionCookieOptions = {
  readonly name?: string;
  readonly path?: "/";
  readonly httpOnly: true;
  readonly secure: boolean;
  readonly sameSite: "lax" | "strict" | "none";
  readonly maxAge?: number;
  readonly domain?: never;
};

export type SessionLifetime = {
  readonly idleTimeoutSeconds: number;
  readonly absoluteLifetimeSeconds: number;
};
