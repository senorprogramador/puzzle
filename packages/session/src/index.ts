export { StorageSessionManager } from "./session.manager";

export { SessionDataManager } from "./session-data.manager";

export { SessionMigrationManager } from "./session.migration";

export {
  createSessionCookieOptions,
  serializeSessionCookie,
  serializeClearedSessionCookie,
  readSessionCookie,
} from "./session.cookies";

export {
  validateRequestOrigin,
  protectStateChangingRequest,
} from "./session.csrf";

export {
  generateSessionToken,
  generateSessionId,
  hashSessionToken,
} from "./utils/session-crypto";

export {
  initializeSessionStorage,
  sessionCollection,
  sessionDataCollection,
  SESSION_COLLECTION,
  SESSION_DATA_COLLECTION,
} from "./session.storage";

export {
  SessionError,
  SessionNotFoundError,
  SessionExpiredError,
  SessionRevokedError,
  SessionSecurityError,
  SessionConfigurationError,
} from "./errors/session.errors";

export type {
  SessionKind,
  SessionRecord,
  SessionStorageRecord,
  SessionDataRecord,
  SessionCookieOptions,
  SessionLifetime,
  SessionDevice,
} from "./types/session.types";

export type {
  CreateSessionInput,
  RotateSessionInput,
  ValidateSessionOptions,
  SessionManagerOptions,
  CreatedSession,
  SessionManager,
} from "./types/session-manager.types";

export type { SessionCookieEnvironment } from "./session.cookies";

export type { CsrfOptions } from "./session.csrf";

export type { SessionDataOptions } from "./session-data.manager";

export type {
  AnonymousMigrationOptions,
  AnonymousMigrationResult,
  SessionMigrationEntry,
  SessionMigrationContext,
} from "./session.migration";

export type { SessionUserLockRecord } from "./types/session-lock.types";
