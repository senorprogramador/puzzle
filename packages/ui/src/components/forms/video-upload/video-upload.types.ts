import type {
  CreateVideoPosterOptions,
  VideoMetadata,
  VideoPosterResult,
} from "@puzzle-ui/media/browser";

import type { FileUploadProps } from "../file-upload/file-upload.types";

type VideoUploadStatus =
  | "preparing"
  | "prepared"
  | "uploading"
  | "paused"
  | "uploaded"
  | "processing"
  | "ready"
  | "failed"
  | "cancelled";

type VideoUploadServerStatus = "processing" | "ready" | "failed";

type VideoUploadSession = {
  /** Resolves when the injected upload action has transferred the file. */
  done: Promise<void>;
  /** Optional resumable controls provided by the injected client. */
  pause?: () => void | Promise<void>;
  resume?: () => void | Promise<void>;
  cancel?: () => void | Promise<void>;
};

type VideoUploadContext = {
  signal: AbortSignal;
  metadata: VideoMetadata;
  poster: VideoPosterResult;
  onProgress: (progress: number) => void;
  /** Report server-side processing states after or during upload. */
  onStatusChange: (
    status: VideoUploadServerStatus,
    error?: string,
  ) => void;
};

type VideoUploadHandler = (
  file: File,
  context: VideoUploadContext,
) => VideoUploadSession | Promise<VideoUploadSession>;

type VideoUploadProps = Omit<
  FileUploadProps,
  "onChange" | "onUpload" | "accept"
> & {
  /** Accepted MIME types. Defaults to video/*. */
  accept?: readonly string[];
  /** Maximum accepted duration in seconds. */
  maxDurationSeconds?: number;
  /** Maximum output dimensions for the local poster. */
  posterOptions?: Pick<
    CreateVideoPosterOptions,
    "maxWidth" | "maxHeight" | "format" | "quality" | "timeSeconds"
  >;
  /** Injected resumable upload action. No upload is started without this handler. */
  onUpload?: VideoUploadHandler;
  /** Called whenever the selected source files change. */
  onChange?: (files: File[]) => void;
  /** Called for upload progress, normalized to 0–100. */
  onProgress?: (file: File, progress: number) => void;
  /** Called for upload and server-processing state changes. */
  onStatusChange?: (file: File, status: VideoUploadStatus) => void;
};

type VideoUploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  posterUrl: string;
  status: VideoUploadStatus;
  progress: number;
  metadata?: VideoMetadata;
  poster?: VideoPosterResult;
  error?: string;
};

export type {
  VideoUploadContext,
  VideoUploadHandler,
  VideoUploadItem,
  VideoUploadProps,
  VideoUploadServerStatus,
  VideoUploadSession,
  VideoUploadStatus,
};
