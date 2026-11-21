import type {
  MediaChecksum,
  MediaObjectReference,
} from "./media.types";

export type MediaUploadMode = "single" | "multipart";
export type MediaUploadState =
  | "pending"
  | "completed"
  | "aborted"
  | "expired";

export type MediaUploadConstraints = {
  readonly tenantId: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly expectedSize?: number;
  readonly expectedChecksum?: MediaChecksum;
  readonly expiresInMs: number;
  readonly objectPrefix?: string;
};

export type MediaUploadTarget = {
  readonly url: string;
  readonly method: "PUT";
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: Date;
};

export type MediaMultipartPartTarget = {
  readonly partNumber: number;
  readonly url: string;
  readonly method: "PUT";
  readonly headers: Readonly<Record<string, string>>;
  readonly expiresAt: Date;
};

/**
 * An ephemeral upload capability. Never persist or log its URL, headers, or
 * provider upload ID. Object keys remain server-side.
 */
export type MediaUploadSession = {
  readonly id: string;
  readonly tenantId: string;
  readonly mode: MediaUploadMode;
  readonly state: MediaUploadState;
  readonly expectedSize?: number;
  readonly expectedChecksum?: MediaChecksum;
  readonly expiresAt: Date;
  readonly uploadTarget?: MediaUploadTarget;
  readonly partSizeBytes?: number;
};

export type MediaStoredObject = {
  readonly object: MediaObjectReference;
  readonly tenantId: string;
  readonly mimeType: string;
  readonly size: number;
  readonly checksum?: MediaChecksum;
  readonly createdAt: Date;
};

export type MediaReadTarget = {
  readonly url: string;
  readonly expiresAt: Date;
};

export type MediaObjectSummary = {
  readonly object: MediaObjectReference;
  readonly tenantId: string;
  readonly size: number;
  readonly mimeType: string;
  readonly checksum?: MediaChecksum;
  readonly createdAt: Date;
};

export type MediaObjectPage = {
  readonly items: readonly MediaObjectSummary[];
  readonly nextCursor: string | null;
};

export type MediaMultipartCompletedPart = {
  readonly partNumber: number;
  readonly etag: string;
};

export type MediaObjectListInput = {
  readonly cursor?: string;
  readonly first: number;
  readonly olderThan?: Date;
};

export interface MediaObjectStorageAdapter {
  /** Create a short-lived target bound to the tenant and declared constraints. */
  createUploadIntent(input: MediaUploadConstraints): Promise<MediaUploadSession>;

  /** Create a resumable multipart intent; the provider upload ID stays server-side. */
  createMultipartUpload(
    input: MediaUploadConstraints & { readonly partSizeBytes: number },
  ): Promise<MediaUploadSession>;

  /** Create short-lived targets for validated part numbers in an active session. */
  createMultipartPartTargets(
    sessionId: string,
    partNumbers: readonly number[],
    expiresInMs: number,
  ): Promise<readonly MediaMultipartPartTarget[]>;

  /**
   * Verify the completed object's actual size/checksum and finalize idempotently.
   * A repeated completion for the same completed session must return the object.
   */
  completeUpload(
    sessionId: string,
    parts?: readonly MediaMultipartCompletedPart[],
  ): Promise<MediaStoredObject>;

  /** Abort an incomplete intent. Repeated aborts should be harmless. */
  abortUpload(sessionId: string): Promise<boolean>;

  getUploadSession(sessionId: string): Promise<MediaUploadSession | null>;

  /** Return metadata for an exact internal object reference, or null if absent. */
  getObjectMetadata(
    object: MediaObjectReference,
  ): Promise<MediaStoredObject | null>;

  /** Issue a short-lived read capability only for an existing object. */
  createReadTarget(
    object: MediaObjectReference,
    expiresInMs: number,
  ): Promise<MediaReadTarget>;

  /** Delete an exact object reference; deleting an absent object is harmless. */
  deleteObject(object: MediaObjectReference): Promise<boolean>;

  /** List objects using a stable exclusive cursor, optionally older than a cutoff. */
  listObjects(input: MediaObjectListInput): Promise<MediaObjectPage>;

  /** List incomplete sessions whose expiry is at or before `before`. */
  listExpiredUploadSessions(
    before: Date,
    first: number,
  ): Promise<readonly MediaUploadSession[]>;
}
