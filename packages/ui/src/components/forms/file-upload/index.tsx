"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import { cn } from "@puzzle-ui/core";
import { Icon } from "@puzzle-ui/icons";

import { LinearProgress } from "../../data-display/progress/linear-progress";

import {
  formatFileSize,
  matchesMimeType,
  validateFiles,
} from "./file-upload.utils";

import type {
  FileUploadProps,
  FileUploadItem,
  FileUploadStatus,
  FileUploadRejection,
  FileUploadRejectionCode,
  FileUploadUploadContext,
  FileUploadUploadHandler,
} from "./file-upload.types";

import "./file-upload.css";

const FileUpload = ({
  accept = [],
  multiple = false,
  maxFiles,
  maxFileSize,
  maxTotalSize,
  name,
  required = false,
  disabled = false,
  title = "Drop files here",
  description = "Drag and drop your files here or browse to select them.",
  browseLabel = "Browse files",
  onChange,
  onReject,
  onUpload,
  className,
  style,
  id,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rootProps
}: FileUploadProps) => {
  const generatedId = useId();

  const inputId = id ?? generatedId;
  const descriptionId = `${generatedId}-description`;

  const inputRef = useRef<HTMLInputElement>(null);
  const itemIdRef = useRef(0);

  const itemsRef = useRef<FileUploadItem[]>([]);
  const controllersRef = useRef(new Map<string, AbortController>());

  const dragDepthRef = useRef(0);

  const [items, setItems] = useState<FileUploadItem[]>([]);
  const [rejections, setRejections] = useState<FileUploadRejection[]>([]);

  const [dragActive, setDragActive] = useState(false);
  const [dragRejected, setDragRejected] = useState(false);

  const acceptAttribute = accept.join(",");

  const commitItems = useCallback(
    (nextItems: FileUploadItem[]) => {
      itemsRef.current = nextItems;
      setItems(nextItems);
      onChange?.(nextItems.map((item) => item.file));
    },
    [onChange],
  );

  const updateItem = useCallback(
    (id: string, update: Partial<FileUploadItem>) => {
      const nextItems = itemsRef.current.map((item) =>
        item.id === id ? { ...item, ...update } : item,
      );

      itemsRef.current = nextItems;
      setItems(nextItems);
    },
    [],
  );

  const uploadItem = useCallback(
    async (id: string, file: File) => {
      if (!onUpload) return;

      controllersRef.current.get(id)?.abort();

      const controller = new AbortController();

      controllersRef.current.set(id, controller);

      updateItem(id, {
        status: "uploading",
        progress: 0,
        error: undefined,
      });

      try {
        await onUpload(file, {
          signal: controller.signal,
          onProgress: (progress) => {
            if (controller.signal.aborted) return;

            const normalizedProgress = Number.isFinite(progress)
              ? Math.min(100, Math.max(0, progress))
              : 0;

            updateItem(id, {
              progress: normalizedProgress,
            });
          },
        });

        if (controller.signal.aborted) return;

        updateItem(id, {
          status: "complete",
          progress: 100,
          error: undefined,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        updateItem(id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed.",
        });
      } finally {
        if (controllersRef.current.get(id) === controller) {
          controllersRef.current.delete(id);
        }
      }
    },
    [onUpload, updateItem],
  );

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      if (disabled || incomingFiles.length === 0) return;

      const existingItems = itemsRef.current;

      const result = validateFiles(
        incomingFiles,
        multiple ? existingItems.map((item) => item.file) : [],
        {
          accept,
          maxFileSize,
          maxTotalSize,
          maxFiles,
          multiple,
        },
      );

      setRejections(result.rejected);

      if (result.rejected.length > 0) {
        onReject?.(result.rejected);
      }

      if (result.accepted.length === 0) return;

      // Single mode replaces the previous selection.
      if (!multiple) {
        existingItems.forEach((item) => {
          controllersRef.current.get(item.id)?.abort();
          controllersRef.current.delete(item.id);
        });
      }

      const acceptedItems: FileUploadItem[] = result.accepted.map((file) => ({
        id: `${generatedId}-${++itemIdRef.current}`,
        file,
        status: onUpload ? "uploading" : "queued",
        progress: 0,
      }));

      const nextItems = multiple
        ? [...existingItems, ...acceptedItems]
        : acceptedItems;

      commitItems(nextItems);

      acceptedItems.forEach((item) => {
        if (onUpload) {
          void uploadItem(item.id, item.file);
        }
      });
    },
    [
      accept,
      commitItems,
      disabled,
      generatedId,
      maxFileSize,
      maxFiles,
      maxTotalSize,
      multiple,
      onReject,
      onUpload,
      uploadItem,
    ],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.currentTarget.files ?? []));

    // Allow selecting the same file again.
    event.currentTarget.value = "";
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    dragDepthRef.current++;

    if (dragDepthRef.current !== 1) return;

    setDragActive(true);

    const types = Array.from(event.dataTransfer.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.type)
      .filter(Boolean);

    const hasRejectedType =
      accept.length > 0 && types.some((type) => !matchesMimeType(type, accept));

    setDragRejected(hasRejectedType);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setDragActive(false);
      setDragRejected(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepthRef.current = 0;

    setDragActive(false);
    setDragRejected(false);

    if (disabled) return;

    addFiles(Array.from(event.dataTransfer.files));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    inputRef.current?.click();
  };

  const removeFile = (id: string) => {
    controllersRef.current.get(id)?.abort();
    controllersRef.current.delete(id);

    const nextItems = itemsRef.current.filter((item) => item.id !== id);

    commitItems(nextItems);
  };

  const retryFile = (item: FileUploadItem) => {
    if (disabled || !onUpload) return;

    void uploadItem(item.id, item.file);
  };

  const openFilePicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => {
        controller.abort();
      });

      controllersRef.current.clear();
    };
  }, []);

  const currentTotalSize = items.reduce(
    (total, item) => total + item.file.size,
    0,
  );

  const isDragRejected = dragActive && dragRejected;

  const resolvedDescription = [ariaDescribedBy, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...rootProps}
      ref={ref}
      className={cn("puzzle-file-upload", className)}
      style={style}
      data-disabled={disabled || undefined}
      data-invalid={ariaInvalid || undefined}
    >
      <input
        ref={inputRef}
        id={inputId}
        className="puzzle-file-upload__input"
        type="file"
        name={name}
        accept={acceptAttribute || undefined}
        multiple={multiple}
        required={required}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        aria-describedby={resolvedDescription}
        aria-invalid={ariaInvalid}
        onChange={handleInputChange}
      />

      <div
        className="puzzle-file-upload__dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel ?? title}
        aria-describedby={resolvedDescription}
        aria-disabled={disabled || undefined}
        data-dragging={dragActive || undefined}
        data-rejected={isDragRejected || undefined}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <span className="puzzle-file-upload__icon" aria-hidden="true">
          <Icon name="lucide:upload-cloud" />
        </span>

        <span className="puzzle-file-upload__title">
          {isDragRejected
            ? "Unsupported file type"
            : dragActive
              ? "Drop your files here"
              : title}
        </span>

        <span className="puzzle-file-upload__description" id={descriptionId}>
          {description}
        </span>

        <span className="puzzle-file-upload__browse">{browseLabel}</span>

        {accept.length > 0 && (
          <span className="puzzle-file-upload__hint">
            Accepted: {accept.join(", ")}
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="puzzle-file-upload__files">
          <div className="puzzle-file-upload__files-header">
            <span>Selected files ({items.length})</span>

            {maxTotalSize !== undefined && (
              <span>
                {formatFileSize(currentTotalSize)}
                {" / "}
                {formatFileSize(maxTotalSize)}
              </span>
            )}
          </div>

          <ul
            className="puzzle-file-upload__list"
            aria-label="Selected files"
            aria-live="polite"
            aria-relevant="additions removals"
          >
            {items.map((item) => (
              <li
                key={item.id}
                className="puzzle-file-upload__item"
                data-status={item.status}
              >
                <span
                  className="puzzle-file-upload__file-icon"
                  aria-hidden="true"
                >
                  <Icon name="lucide:file" />
                </span>

                <div className="puzzle-file-upload__file-content">
                  <div className="puzzle-file-upload__file-header">
                    <span
                      className="puzzle-file-upload__filename"
                      title={item.file.name}
                    >
                      {item.file.name}
                    </span>

                    <span className="puzzle-file-upload__filesize">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>

                  {item.status === "uploading" && (
                    <div className="puzzle-file-upload__progress">
                      <LinearProgress
                        value={item.progress}
                        showTrack
                        aria-label={`Uploading ${item.file.name}`}
                      />

                      <span>{Math.round(item.progress)}%</span>
                    </div>
                  )}

                  {item.status === "queued" && (
                    <span className="puzzle-file-upload__status">
                      Ready to upload
                    </span>
                  )}

                  {item.status === "complete" && (
                    <span
                      className="puzzle-file-upload__status puzzle-file-upload__status--success"
                      role="status"
                    >
                      Upload complete
                    </span>
                  )}

                  {item.status === "error" && (
                    <span
                      className="puzzle-file-upload__status puzzle-file-upload__status--error"
                      role="status"
                    >
                      {item.error ?? "Upload failed."}
                    </span>
                  )}
                </div>

                {item.status === "error" && onUpload && (
                  <button
                    type="button"
                    className="puzzle-file-upload__retry"
                    disabled={disabled}
                    onClick={() => retryFile(item)}
                    aria-label={`Retry upload of ${item.file.name}`}
                  >
                    <Icon name="lucide:refresh-cw" />
                  </button>
                )}

                <button
                  type="button"
                  className="puzzle-file-upload__remove"
                  disabled={disabled}
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => removeFile(item.id)}
                >
                  <Icon name="lucide:x" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {rejections.length > 0 && (
        <div className="puzzle-file-upload__rejections" role="alert">
          {rejections.map((rejection, index) => (
            <div
              key={`${rejection.file.name}-${index}`}
              className="puzzle-file-upload__rejection"
            >
              <Icon name="lucide:alert-circle" />

              <span>
                <strong>{rejection.file.name}</strong>
                {" — "}
                {rejection.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export {
  FileUpload,
  type FileUploadProps,
  type FileUploadItem,
  type FileUploadStatus,
  type FileUploadRejection,
  type FileUploadRejectionCode,
  type FileUploadUploadContext,
  type FileUploadUploadHandler,
};
