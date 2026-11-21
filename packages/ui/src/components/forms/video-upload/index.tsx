"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  createVideoPoster,
  readVideoMetadata,
  type BrowserMediaProgress,
} from "@puzzle-ui/media/browser";
import { cn } from "@puzzle-ui/core";

import { LinearProgress } from "../../data-display/progress/linear-progress";
import { FileUpload } from "../file-upload";

import type {
  VideoUploadItem,
  VideoUploadProps,
  VideoUploadServerStatus,
  VideoUploadSession,
  VideoUploadStatus,
} from "./video-upload.types";

import "./video-upload.css";

const createPreviewUrl = (file: Blob): string =>
  typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
    ? URL.createObjectURL(file)
    : "";

const revokePreviewUrl = (url: string): void => {
  if (url && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
    URL.revokeObjectURL(url);
  }
};

const formatSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB"];
  let value = size / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
};

const formatDuration = (duration: number): string => {
  const seconds = Math.max(0, Math.floor(duration));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
    : `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const statusLabels: Record<VideoUploadStatus, string> = {
  preparing: "Reading video metadata and preparing poster",
  prepared: "Ready to upload",
  uploading: "Uploading",
  paused: "Upload paused",
  uploaded: "Uploaded · awaiting processing status",
  processing: "Server processing",
  ready: "Video ready",
  failed: "Upload or processing failed",
  cancelled: "Upload cancelled",
};

const VideoUpload = ({
  accept = ["video/*"],
  multiple = false,
  maxFiles,
  maxFileSize,
  maxTotalSize,
  maxDurationSeconds,
  posterOptions,
  name,
  required,
  disabled = false,
  title = "Drop videos here",
  description = "Choose videos to preview metadata and upload with your client.",
  browseLabel = "Browse videos",
  onChange,
  onReject,
  onUpload,
  onProgress,
  onStatusChange,
  className,
  style,
  id,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rootProps
}: VideoUploadProps) => {
  const generatedId = useId();
  const itemIdRef = useRef(0);
  const itemsRef = useRef<VideoUploadItem[]>([]);
  const controllersRef = useRef(new Map<File, AbortController>());
  const sessionsRef = useRef(new Map<File, VideoUploadSession>());
  const [items, setItems] = useState<VideoUploadItem[]>([]);

  const commitItems = useCallback((nextItems: VideoUploadItem[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
  }, []);

  const updateItem = useCallback(
    (file: File, update: Partial<VideoUploadItem>) => {
      const nextItems = itemsRef.current.map((item) =>
        item.file === file ? { ...item, ...update } : item,
      );
      commitItems(nextItems);
    },
    [commitItems],
  );

  const setStatus = useCallback(
    (file: File, status: VideoUploadStatus, error?: string) => {
      updateItem(file, { status, error });
      onStatusChange?.(file, status);
    },
    [onStatusChange, updateItem],
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

  const startUpload = useCallback(
    async (
      file: File,
      metadata: NonNullable<VideoUploadItem["metadata"]>,
      poster: NonNullable<VideoUploadItem["poster"]>,
      controller: AbortController,
    ) => {
      if (!onUpload) {
        setStatus(file, "prepared");
        if (controllersRef.current.get(file) === controller) {
          controllersRef.current.delete(file);
        }
        return;
      }

      const isCurrent = (): boolean =>
        !controller.signal.aborted &&
        controllersRef.current.get(file) === controller &&
        itemsRef.current.some((item) => item.file === file);
      setStatus(file, "uploading");
      updateProgress(file, 0);

      try {
        const session = await onUpload(file, {
          signal: controller.signal,
          metadata,
          poster,
          onProgress: (progress) => {
            if (isCurrent()) updateProgress(file, progress);
          },
          onStatusChange: (status, error) => {
            if (!isCurrent()) return;
            setStatus(file, status, error);
          },
        });
        if (!isCurrent()) {
          await session.cancel?.();
          return;
        }
        sessionsRef.current.set(file, session);
        const progress = itemsRef.current.find(
          (item) => item.file === file,
        )?.progress;
        updateItem(file, { progress });
        await session.done;
        if (!isCurrent()) return;
        updateProgress(file, 100);
        const currentStatus = itemsRef.current.find(
          (item) => item.file === file,
        )?.status;
        if (currentStatus === "uploading" || currentStatus === "paused") {
          setStatus(file, "uploaded");
        }
      } catch (error) {
        if (!isCurrent()) return;
        setStatus(
          file,
          "failed",
          error instanceof Error ? error.message : "Video upload failed.",
        );
      }
    },
    [onProgress, onUpload, setStatus, updateProgress],
  );

  const prepareFile = useCallback(
    async (file: File) => {
      controllersRef.current.get(file)?.abort();
      sessionsRef.current.delete(file);
      const controller = new AbortController();
      controllersRef.current.set(file, controller);
      setStatus(file, "preparing");
      updateItem(file, { progress: 0 });

      const isCurrent = (): boolean =>
        !controller.signal.aborted &&
        controllersRef.current.get(file) === controller &&
        itemsRef.current.some((item) => item.file === file);
      const reportPreparationProgress = (progress: BrowserMediaProgress): void => {
        if (isCurrent()) updateProgress(file, progress.progress * 100);
      };

      try {
        const metadata = await readVideoMetadata(file, {
          maxSizeBytes: maxFileSize,
          maxDurationSeconds,
          signal: controller.signal,
          onProgress: (progress) =>
            reportPreparationProgress({
              ...progress,
              progress: progress.progress * 0.4,
            }),
        });
        const poster = await createVideoPoster(file, {
          maxSizeBytes: maxFileSize,
          maxDurationSeconds,
          maxWidth: posterOptions?.maxWidth ?? 640,
          maxHeight: posterOptions?.maxHeight ?? 360,
          format: posterOptions?.format,
          quality: posterOptions?.quality,
          timeSeconds: posterOptions?.timeSeconds,
          signal: controller.signal,
          onProgress: (progress) =>
            reportPreparationProgress({
              ...progress,
              progress: 0.4 + progress.progress * 0.6,
            }),
        });
        if (!isCurrent()) return;

        const item = itemsRef.current.find((entry) => entry.file === file);
        const posterUrl = createPreviewUrl(poster.blob);
        if (item?.posterUrl) revokePreviewUrl(item.posterUrl);
        updateItem(file, {
          metadata,
          poster,
          posterUrl,
          progress: 100,
          error: undefined,
        });
        updateProgress(file, 100);
        await startUpload(file, metadata, poster, controller);
      } catch (error) {
        if (!isCurrent()) return;
        setStatus(
          file,
          "failed",
          error instanceof Error ? error.message : "Video preparation failed.",
        );
      }
    },
    [
      maxDurationSeconds,
      maxFileSize,
      posterOptions?.format,
      posterOptions?.maxHeight,
      posterOptions?.maxWidth,
      posterOptions?.quality,
      posterOptions?.timeSeconds,
      setStatus,
      startUpload,
      updateItem,
      updateProgress,
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
        void sessionsRef.current.get(item.file)?.cancel?.();
        controllersRef.current.delete(item.file);
        sessionsRef.current.delete(item.file);
        revokePreviewUrl(item.previewUrl);
        revokePreviewUrl(item.posterUrl);
      }
      const added: VideoUploadItem[] = [];
      for (const file of files) {
        if (retained.some((item) => item.file === file)) continue;
        added.push({
          id: `${generatedId}-${++itemIdRef.current}`,
          file,
          previewUrl: createPreviewUrl(file),
          posterUrl: "",
          status: "preparing",
          progress: 0,
        });
      }
      commitItems([...retained, ...added]);
      onChange?.(files);
      added.forEach((item) => void prepareFile(item.file));
    },
    [commitItems, generatedId, onChange, prepareFile],
  );

  const cancelItem = (item: VideoUploadItem) => {
    controllersRef.current.get(item.file)?.abort();
    void sessionsRef.current.get(item.file)?.cancel?.();
    controllersRef.current.delete(item.file);
    sessionsRef.current.delete(item.file);
    setStatus(item.file, "cancelled", "Upload cancelled.");
  };

  const pauseItem = async (item: VideoUploadItem) => {
    const session = sessionsRef.current.get(item.file);
    if (!session?.pause) return;
    try {
      await session.pause();
      setStatus(item.file, "paused");
    } catch (error) {
      setStatus(
        item.file,
        "failed",
        error instanceof Error ? error.message : "Could not pause the upload.",
      );
    }
  };

  const resumeItem = async (item: VideoUploadItem) => {
    const session = sessionsRef.current.get(item.file);
    if (!session?.resume) return;
    try {
      await session.resume();
      setStatus(item.file, "uploading");
    } catch (error) {
      setStatus(
        item.file,
        "failed",
        error instanceof Error ? error.message : "Could not resume the upload.",
      );
    }
  };

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort());
      sessionsRef.current.forEach((session) => void session.cancel?.());
      controllersRef.current.clear();
      sessionsRef.current.clear();
      itemsRef.current.forEach((item) => {
        revokePreviewUrl(item.previewUrl);
        revokePreviewUrl(item.posterUrl);
      });
    };
  }, []);

  return (
    <div
      {...rootProps}
      ref={ref}
      className={cn("puzzle-video-upload", className)}
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
        <div className="puzzle-video-upload__items" aria-live="polite">
          {items.map((item) => (
            <section
              key={item.id}
              className="puzzle-video-upload__item"
              data-status={item.status}
              aria-label={`Video details for ${item.file.name}`}
            >
              {item.previewUrl && (
                <video
                  className="puzzle-video-upload__preview"
                  src={item.previewUrl}
                  poster={item.posterUrl || undefined}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`Preview ${item.file.name}`}
                />
              )}
              <div className="puzzle-video-upload__metadata">
                <strong>{item.file.name}</strong>
                <span>{formatSize(item.file.size)}</span>
                {item.metadata && (
                  <>
                    <span>
                      {formatDuration(item.metadata.duration)} ·{" "}
                      {item.metadata.width} × {item.metadata.height}px ·{" "}
                      {item.metadata.mimeType}
                    </span>
                    <span>
                      Playback support:{" "}
                      {item.metadata.playbackSupport || "unknown"}
                    </span>
                  </>
                )}
              </div>

              {(item.status === "preparing" ||
                item.status === "uploading" ||
                item.status === "paused") && (
                <div className="puzzle-video-upload__progress">
                  <LinearProgress
                    value={item.progress}
                    showTrack
                    aria-label={`${statusLabels[item.status]} ${item.file.name}`}
                  />
                  <span>{Math.round(item.progress)}%</span>
                </div>
              )}

              {item.status === "failed" && (
                <p className="puzzle-video-upload__status puzzle-video-upload__status--error" role="alert">
                  {item.error || statusLabels[item.status]}
                </p>
              )}
              {item.status !== "failed" && (
                <p className="puzzle-video-upload__status" role="status">
                  {statusLabels[item.status]}
                </p>
              )}

              <div className="puzzle-video-upload__actions">
                {(item.status === "preparing" ||
                  item.status === "uploading" ||
                  item.status === "paused") && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => cancelItem(item)}
                  >
                    Cancel
                  </button>
                )}
                {item.status === "uploading" &&
                  sessionsRef.current.get(item.file)?.pause && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => void pauseItem(item)}
                    >
                      Pause
                    </button>
                  )}
                {item.status === "paused" &&
                  sessionsRef.current.get(item.file)?.resume && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => void resumeItem(item)}
                    >
                      Resume
                    </button>
                  )}
                {(item.status === "failed" || item.status === "cancelled") && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => void prepareFile(item.file)}
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

export { VideoUpload };
export type {
  VideoUploadContext,
  VideoUploadHandler,
  VideoUploadProps,
  VideoUploadServerStatus,
  VideoUploadSession,
  VideoUploadStatus,
} from "./video-upload.types";
