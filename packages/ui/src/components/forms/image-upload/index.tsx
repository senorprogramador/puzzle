"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  createImageVariants,
  resizeImage,
  type BrowserMediaProgress,
  type ImageOutputFormat,
  type ImageProcessingResult,
} from "@puzzle-ui/media/browser";
import { cn } from "@puzzle-ui/core";

import { LinearProgress } from "../../data-display/progress/linear-progress";
import { FileUpload } from "../file-upload";
import { ImageCropper } from "../image-cropper";
import { ImageHotspotEditor } from "../image-hotspot-editor";

import { cropImage, formatImageUploadSize } from "./image-upload.utils";
import type {
  ImageUploadItem,
  ImageUploadProps,
  ImageUploadResult,
} from "./image-upload.types";

import "./image-upload.css";

const FULL_CROP = { x: 0, y: 0, width: 1, height: 1 };
const EMPTY_HOTSPOTS = { focalPoint: null, hotspots: [] };
const IMAGE_OUTPUT_FORMATS = new Set<ImageOutputFormat>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const createPreviewUrl = (file: File): string =>
  typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
    ? URL.createObjectURL(file)
    : "";

const revokePreviewUrl = (url: string): void => {
  if (url && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
    URL.revokeObjectURL(url);
  }
};

const makeOutputFile = (file: File, result: ImageProcessingResult): File =>
  new File([result.blob], result.fileName || file.name, {
    type: result.format || result.blob.type,
    lastModified: file.lastModified,
  });

const ImageUpload = ({
  accept = ["image/*"],
  multiple = false,
  maxFiles,
  maxFileSize,
  maxTotalSize,
  name,
  required,
  disabled = false,
  title = "Drop images here",
  description = "Choose images to prepare previews and responsive variants.",
  browseLabel = "Browse images",
  onChange,
  onReject,
  onUpload,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.85,
  format,
  profiles,
  retainOriginal = false,
  enableCrop = false,
  cropAspectRatio = "free",
  enableHotspots = false,
  onProgress,
  onCropChange,
  onHotspotsChange,
  className,
  style,
  id,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rootProps
}: ImageUploadProps) => {
  const generatedId = useId();
  const itemIdRef = useRef(0);
  const itemsRef = useRef<ImageUploadItem[]>([]);
  const controllersRef = useRef(new Map<File, AbortController>());
  const [items, setItems] = useState<ImageUploadItem[]>([]);

  const commitItems = useCallback((nextItems: ImageUploadItem[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
  }, []);

  const updateItem = useCallback(
    (file: File, update: Partial<ImageUploadItem>) => {
      const nextItems = itemsRef.current.map((item) =>
        item.file === file ? { ...item, ...update } : item,
      );
      commitItems(nextItems);
    },
    [commitItems],
  );

  const updateProgress = useCallback(
    (file: File, progress: number) => {
      const normalized = Number.isFinite(progress)
        ? Math.min(100, Math.max(0, progress))
        : 0;
      updateItem(file, { progress: normalized });
      onProgress?.(file, normalized);
    },
    [onProgress, updateItem],
  );

  const uploadPrepared = useCallback(
    async (
      file: File,
      prepared: ImageUploadResult,
      controller: AbortController,
    ) => {
      if (!onUpload) return;
      updateItem(file, {
        status: "uploading",
        progress: 0,
        error: undefined,
      });

      try {
        await onUpload(prepared, {
          signal: controller.signal,
          onProgress: (progress) => {
            if (!controller.signal.aborted) updateProgress(file, progress);
          },
        });
        if (controller.signal.aborted) return;
        updateItem(file, { status: "uploaded", progress: 100, error: undefined });
        onProgress?.(file, 100);
      } catch (error) {
        if (controller.signal.aborted) return;
        updateItem(file, {
          status: "failed",
          error: error instanceof Error ? error.message : "Image upload failed.",
        });
      } finally {
        if (controllersRef.current.get(file) === controller) {
          controllersRef.current.delete(file);
        }
      }
    },
    [onProgress, onUpload, updateItem, updateProgress],
  );

  const processFile = useCallback(
    async (
      file: File,
      crop: ImageUploadItem["crop"],
      hotspots: ImageUploadItem["hotspots"],
      uploadWhenReady: boolean,
    ) => {
      controllersRef.current.get(file)?.abort();
      const controller = new AbortController();
      controllersRef.current.set(file, controller);
      updateItem(file, {
        status: "processing",
        progress: 0,
        error: undefined,
        result: undefined,
        variants: undefined,
        crop,
        hotspots,
      });

      const isCurrent = (): boolean =>
        !controller.signal.aborted &&
        controllersRef.current.get(file) === controller &&
        itemsRef.current.some((item) => item.file === file);
      const reportProcessingProgress = (
        progress: BrowserMediaProgress,
        start = 0,
        range = 100,
      ): void => {
        if (isCurrent()) {
          updateProgress(file, start + progress.progress * range);
        }
      };

      try {
        const cropped = enableCrop
          ? await cropImage(file, crop, controller.signal)
          : undefined;
        if (!isCurrent()) return;

        const processingSource = cropped?.blob ?? file;
        const outputFormat =
          format ??
          (IMAGE_OUTPUT_FORMATS.has(file.type.toLowerCase() as ImageOutputFormat)
            ? (file.type.toLowerCase() as ImageOutputFormat)
            : undefined);
        const result = await resizeImage(processingSource, {
          maxWidth,
          maxHeight,
          quality,
          format: outputFormat,
          maxSourceSizeBytes: maxFileSize,
          signal: controller.signal,
          onProgress: (progress) =>
            reportProcessingProgress(
              progress,
              0,
              profiles?.length ? 45 : 100,
            ),
        });
        let variants: Readonly<Record<string, ImageProcessingResult>> = {};
        if (profiles?.length) {
          const named = await createImageVariants(processingSource, {
            profiles,
            retainOriginal: false,
            quality,
            format: outputFormat,
            maxSourceSizeBytes: maxFileSize,
            signal: controller.signal,
            onProgress: (progress) =>
              reportProcessingProgress(progress, 50, 50),
          });
          variants = named.variants;
        }
        if (!isCurrent()) return;

        const prepared: ImageUploadResult = {
          file: makeOutputFile(file, result),
          processed: result,
          sourceDimensions: {
            width: cropped?.sourceWidth ?? result.originalWidth,
            height: cropped?.sourceHeight ?? result.originalHeight,
          },
          original: retainOriginal ? file : null,
          variants,
          crop: enableCrop ? crop : null,
          hotspots: enableHotspots ? hotspots : null,
        };
        updateItem(file, {
          status: "ready",
          progress: 100,
          sourceWidth: prepared.sourceDimensions.width,
          sourceHeight: prepared.sourceDimensions.height,
          result,
          variants,
          error: undefined,
        });
        onProgress?.(file, 100);

        if (uploadWhenReady && onUpload) {
          await uploadPrepared(file, prepared, controller);
        } else if (controllersRef.current.get(file) === controller) {
          controllersRef.current.delete(file);
        }
      } catch (error) {
        if (!isCurrent()) return;
        controllersRef.current.delete(file);
        updateItem(file, {
          status: "failed",
          error:
            error instanceof Error ? error.message : "Image processing failed.",
        });
      }
    },
    [
      enableCrop,
      enableHotspots,
      format,
      maxFileSize,
      maxHeight,
      maxWidth,
      onProgress,
      onUpload,
      profiles,
      quality,
      retainOriginal,
      updateItem,
      updateProgress,
      uploadPrepared,
    ],
  );

  const handleFilesChange = useCallback(
    (files: File[]) => {
      const selectedFiles = new Set(files);
      const retained = itemsRef.current.filter((item) =>
        selectedFiles.has(item.file),
      );
      for (const item of itemsRef.current) {
        if (selectedFiles.has(item.file)) continue;
        controllersRef.current.get(item.file)?.abort();
        controllersRef.current.delete(item.file);
        revokePreviewUrl(item.previewUrl);
      }
      const added: ImageUploadItem[] = [];
      for (const file of files) {
        if (retained.some((item) => item.file === file)) continue;
        added.push({
          id: `${generatedId}-${++itemIdRef.current}`,
          file,
          previewUrl: createPreviewUrl(file),
          status: "processing",
          progress: 0,
          crop: FULL_CROP,
          hotspots: EMPTY_HOTSPOTS,
        });
      }
      commitItems([...retained, ...added]);
      onChange?.(files);
      for (const item of added) {
        void processFile(
          item.file,
          item.crop,
          item.hotspots,
          Boolean(onUpload && !enableCrop && !enableHotspots),
        );
      }
    },
    [
      commitItems,
      enableCrop,
      enableHotspots,
      generatedId,
      onChange,
      onUpload,
      processFile,
    ],
  );

  const cancelItem = (item: ImageUploadItem) => {
    controllersRef.current.get(item.file)?.abort();
    controllersRef.current.delete(item.file);
    updateItem(item.file, {
      status: "cancelled",
      error: "Image processing or upload was cancelled.",
    });
  };

  const uploadItem = (item: ImageUploadItem) => {
    const preparedResult = item.result;
    if (!preparedResult || !onUpload) return;
    const controller = new AbortController();
    controllersRef.current.set(item.file, controller);
    const prepared: ImageUploadResult = {
      file: makeOutputFile(item.file, preparedResult),
      processed: preparedResult,
      sourceDimensions: {
        width: item.sourceWidth ?? preparedResult.originalWidth,
        height: item.sourceHeight ?? preparedResult.originalHeight,
      },
      original: retainOriginal ? item.file : null,
      variants: item.variants ?? {},
      crop: enableCrop ? item.crop : null,
      hotspots: enableHotspots ? item.hotspots : null,
    };
    void uploadPrepared(item.file, prepared, controller);
  };

  const retryItem = (item: ImageUploadItem) => {
    if (item.result && onUpload) {
      uploadItem(item);
      return;
    }
    void processFile(
      item.file,
      item.crop,
      item.hotspots,
      Boolean(onUpload && !enableCrop && !enableHotspots),
    );
  };

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
      itemsRef.current.forEach((item) => revokePreviewUrl(item.previewUrl));
    };
  }, []);

  return (
    <div
      {...rootProps}
      ref={ref}
      className={cn("puzzle-image-upload", className)}
      style={style}
      data-disabled={disabled || undefined}
      data-invalid={ariaInvalid || undefined}
    >
      <FileUpload
        id={id ?? generatedId}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        maxTotalSize={maxTotalSize}
        name={name}
        required={required}
        disabled={disabled}
        title={title}
        description={description}
        browseLabel={browseLabel}
        onChange={handleFilesChange}
        onReject={onReject}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />

      {items.length > 0 && (
        <div className="puzzle-image-upload__items" aria-live="polite">
          {items.map((item) => (
            <section
              key={item.id}
              className="puzzle-image-upload__item"
              data-status={item.status}
              aria-label={`Image details for ${item.file.name}`}
            >
              <div className="puzzle-image-upload__summary">
                {item.previewUrl && (
                  <img
                    className="puzzle-image-upload__preview"
                    src={item.previewUrl}
                    alt={`Preview of ${item.file.name}`}
                  />
                )}
                <div className="puzzle-image-upload__metadata">
                  <strong>{item.file.name}</strong>
                  <span>{formatImageUploadSize(item.file.size)}</span>
                  {item.sourceWidth !== undefined &&
                    item.sourceHeight !== undefined && (
                      <span>
                        Source: {item.sourceWidth} × {item.sourceHeight}px
                      </span>
                    )}
                  {item.result && (
                    <span>
                      Processed: {item.result.width} × {item.result.height}px ·{" "}
                      {formatImageUploadSize(item.result.size)}
                      {item.result.size < item.file.size
                        ? ` (−${Math.round((1 - item.result.size / item.file.size) * 100)}%)`
                        : ""}
                    </span>
                  )}
                  {item.variants &&
                    Object.entries(item.variants).map(([name, variant]) => (
                      <span key={name}>
                        {name}: {variant.width} × {variant.height}px ·{" "}
                        {formatImageUploadSize(variant.size)}
                      </span>
                    ))}
                </div>
              </div>

              {enableCrop && item.previewUrl && (
                <ImageCropper
                  src={item.previewUrl}
                  alt={`Crop ${item.file.name}`}
                  label={`Crop ${item.file.name}`}
                  aspectRatio={cropAspectRatio}
                  value={item.crop}
                  disabled={disabled || item.status === "uploading"}
                  onChange={(crop) => {
                    onCropChange?.(item.file, crop);
                    updateItem(item.file, { crop });
                    void processFile(item.file, crop, item.hotspots, false);
                  }}
                />
              )}

              {enableHotspots && item.previewUrl && (
                <ImageHotspotEditor
                  src={item.previewUrl}
                  alt={`Annotate ${item.file.name}`}
                  label={`Focal point and hotspots for ${item.file.name}`}
                  value={item.hotspots}
                  disabled={disabled || item.status === "uploading"}
                  onChange={(hotspots) => {
                    onHotspotsChange?.(item.file, hotspots);
                    updateItem(item.file, { hotspots });
                  }}
                />
              )}

              {item.status === "processing" && (
                <div className="puzzle-image-upload__progress">
                  <LinearProgress
                    value={item.progress}
                    showTrack
                    aria-label={`Processing ${item.file.name}`}
                  />
                  <span>Preparing image… {Math.round(item.progress)}%</span>
                </div>
              )}
              {item.status === "uploading" && (
                <div className="puzzle-image-upload__progress">
                  <LinearProgress
                    value={item.progress}
                    showTrack
                    aria-label={`Uploading ${item.file.name}`}
                  />
                  <span>Uploading… {Math.round(item.progress)}%</span>
                </div>
              )}
              {item.status === "ready" && (
                <p className="puzzle-image-upload__status" role="status">
                  {onUpload && (enableCrop || enableHotspots)
                    ? "Ready to upload"
                    : "Image ready"}
                </p>
              )}
              {item.status === "uploaded" && (
                <p className="puzzle-image-upload__status" role="status">
                  Upload complete
                </p>
              )}
              {item.status === "failed" && (
                <p className="puzzle-image-upload__status puzzle-image-upload__status--error" role="alert">
                  {item.error}
                </p>
              )}
              {item.status === "cancelled" && (
                <p className="puzzle-image-upload__status" role="status">
                  {item.error}
                </p>
              )}

              <div className="puzzle-image-upload__actions">
                {(item.status === "processing" || item.status === "uploading") && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => cancelItem(item)}
                  >
                    Cancel
                  </button>
                )}
                {item.status === "ready" &&
                  onUpload &&
                  (enableCrop || enableHotspots) && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => uploadItem(item)}
                  >
                    Upload image
                  </button>
                )}
                {(item.status === "failed" || item.status === "cancelled") && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => retryItem(item)}
                  >
                    Retry
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export { ImageUpload };
export type {
  ImageUploadContext,
  ImageUploadHandler,
  ImageUploadProps,
  ImageUploadResult,
  ImageUploadStatus,
} from "./image-upload.types";
