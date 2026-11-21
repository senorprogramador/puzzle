import type {
  MediaMultipartCompletedPart,
  MediaMultipartPartTarget,
  MediaObjectStorageAdapter,
  MediaUploadSession,
} from "../../src";

export type MediaObjectStorageConformanceFixture = {
  readonly createAdapter: () => Promise<MediaObjectStorageAdapter>;
  readonly uploadSingle: (
    adapter: MediaObjectStorageAdapter,
    session: MediaUploadSession,
    bytes: Uint8Array,
    contentType: string,
  ) => Promise<void>;
  readonly uploadMultipart: (
    adapter: MediaObjectStorageAdapter,
    session: MediaUploadSession,
    targets: readonly MediaMultipartPartTarget[],
    bytes: Uint8Array,
    contentType: string,
  ) => Promise<readonly MediaMultipartCompletedPart[]>;
};
