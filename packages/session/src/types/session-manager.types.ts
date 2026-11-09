import type { SessionRecord } from "./session.types";

export type CreateSessionInput = {
  readonly userId: string | null;
  readonly kind: "anonymous" | "authenticated";
  readonly expiresAt: Date;
  readonly metadata?: Readonly<Record<string, unknown>>;
};

export interface SessionManager {
  create(input: CreateSessionInput): Promise<{ readonly session: SessionRecord; readonly token: string }>;
  validate(token: string): Promise<SessionRecord | null>;
  rotate(sessionId: string): Promise<{ readonly session: SessionRecord; readonly token: string }>;
  revoke(sessionId: string): Promise<void>;
  revokeAll(userId: string): Promise<void>;
}
