import type {
  ImageOutputFormat,
  ImageProcessingResult,
  ImageVariantProfile,
} from "@puzzle-ui/media/browser";

import type { FileUploadProps } from "../file-upload/file-upload.types";
import type { ImageCrop } from "../image-cropper/image-cropper.types";
import type { ImageHotspotEditorValue } from "../image-hotspot-editor/image-hotspot-editor.types";

type ImageUploadStatus =
  | "processing"
  | "uploading"
  | "ready"
  | "uploaded"
  | "failed"
  | "cancelled";

type ImageUploadResult = {
  /** Processed default output, ready for a caller-owned upload transport. */
  file: File;
  /** Processing metadata for the default output. */
  processed: ImageProcessingResult;
  /** Source dimensions after browser orientation has been applied. */
  sourceDimensions: { width: number; height: number };
  /** The source file only when `retainOriginal` is explicitly enabled. */
  original: File | null;
  /** Optional, named responsive or editorial outputs. */
  variants: Readonly<Record<string, ImageProcessingResult>>;
  /** Normalized crop in the original source image coordinate space. */
  crop: ImageCrop | null;
  /** Normalized focal point and hotspots in the original source coordinate space. */
  hotspots: ImageHotspotEditorValue | null;
};

type ImageUploadContext = {
  signal: AbortSignal;
  onProgress: (progress: number) => void;
};

type ImageUploadHandler = (
  result: ImageUploadResult,
  context: ImageUploadContext,
) => Promise<void>;

type ImageUploadProps = Omit<
  FileUploadProps,
  "onChange" | "onUpload" | "accept"
> & {
  /** Accepted MIME types. Defaults to image/*. */
  accept?: readonly string[];
  /** Maximum output width in pixels. Defaults to 2048. */
  maxWidth?: number;
  /** Maximum output height in pixels. Defaults to 2048. */
  maxHeight?: number;
  /** Output quality from 0 to 1. */
  quality?: number;
  /** Output image format. */
  format?: ImageOutputFormat;
  /** Optional named outputs in addition to the default processed file. */
  profiles?: readonly ImageVariantProfile[];
  /** Explicitly include the unmodified source file in the upload result. */
  retainOriginal?: boolean;
  /** Enable crop selection; cropped output is uploaded only after confirmation. */
  enableCrop?: boolean;
  /** Aspect ratio used by the optional crop control. Defaults to free. */
  cropAspectRatio?: number | "free";
  /** Enable focal point and hotspot editing. */
  enableHotspots?: boolean;
  /** Called after local processing when an upload handler is supplied. */
  onUpload?: ImageUploadHandler;
  /** Called whenever the selected source files change. */
  onChange?: (files: File[]) => void;
  /** Called for local processing and upload progress, normalized to 0–100. */
  onProgress?: (file: File, progress: number) => void;
  /** Called when the crop selection changes. */
  onCropChange?: (file: File, crop: ImageCrop) => void;
  /** Called when focal point or hotspot data changes. */
  onHotspotsChange?: (file: File, value: ImageHotspotEditorValue) => void;
};

type ImageUploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: ImageUploadStatus;
  progress: number;
  sourceWidth?: number;
  sourceHeight?: number;
  result?: ImageProcessingResult;
  variants?: Readonly<Record<string, ImageProcessingResult>>;
  crop: ImageCrop;
  hotspots: ImageHotspotEditorValue;
  error?: string;
};

export type {
  ImageUploadContext,
  ImageUploadHandler,
  ImageUploadItem,
  ImageUploadProps,
  ImageUploadResult,
  ImageUploadStatus,
};
