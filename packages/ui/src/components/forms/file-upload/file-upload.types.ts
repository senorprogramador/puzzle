import type { ComponentPropsWithRef } from "react";

type FileUploadStatus = "queued" | "uploading" | "complete" | "error";

type FileUploadRejectionCode =
  | "file-type"
  | "file-too-large"
  | "total-too-large"
  | "too-many-files";

type FileUploadRejection = {
  file: File;
  code: FileUploadRejectionCode;
  message: string;
};

type FileUploadUploadContext = {
  onProgress: (progress: number) => void;
  signal: AbortSignal;
};

type FileUploadUploadHandler = (
  file: File,
  context: FileUploadUploadContext,
) => Promise<void>;

type FileUploadItem = {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  error?: string;
};

type FileUploadProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange" | "onDrop"
> & {
  /** Accepted MIME types. Supports wildcards such as image/*. */
  accept?: readonly string[];

  /** Allow multiple files. Defaults to false. */
  multiple?: boolean;

  /** Maximum number of selected files. Only applies to multiple mode. */
  maxFiles?: number;

  /** Maximum size per file, in bytes. */
  maxFileSize?: number;

  /** Maximum combined size of selected files, in bytes. */
  maxTotalSize?: number;

  /** Native form field name. */
  name?: string;

  /** Marks the file input as required. */
  required?: boolean;

  /** Whether the component is disabled. */
  disabled?: boolean;

  /** Dropzone title. */
  title?: string;

  /** Supporting text inside the dropzone. */
  description?: string;

  /** Text displayed as the file picker action. */
  browseLabel?: string;

  /** Called whenever the accepted file list changes. */
  onChange?: (files: File[]) => void;

  /** Called when one or more files are rejected. */
  onReject?: (rejections: FileUploadRejection[]) => void;

  /** Upload handler. Accepted files are uploaded automatically. */
  onUpload?: FileUploadUploadHandler;
};

export type {
  FileUploadProps,
  FileUploadItem,
  FileUploadStatus,
  FileUploadRejection,
  FileUploadRejectionCode,
  FileUploadUploadContext,
  FileUploadUploadHandler,
};
