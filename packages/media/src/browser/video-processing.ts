import {
  InvalidMediaFileError,
  MediaProcessingError,
  MediaValidationError,
} from "../errors/media.errors";
import {
  createCanvasSurface,
  emitProgress,
  encodeCanvas,
  throwIfAborted,
  validateBlob,
  type BrowserMediaProgressCallback,
} from "./browser-utils";

export type VideoMetadataOptions = {
  readonly maxSizeBytes?: number;
  readonly maxDurationSeconds?: number;
  readonly signal?: AbortSignal;
  readonly onProgress?: BrowserMediaProgressCallback;
};

export type VideoMetadata = {
  readonly duration: number;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly mimeType: string;
  readonly playbackSupport: "" | "maybe" | "probably";
};

export type CreateVideoPosterOptions = VideoMetadataOptions & {
  readonly timeSeconds?: number;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format?: "image/jpeg" | "image/png" | "image/webp";
  readonly quality?: number;
};

export type VideoPosterResult = {
  readonly blob: Blob;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly timeSeconds: number;
};

type LoadedVideo = {
  readonly element: HTMLVideoElement;
  readonly objectUrl: string;
  cleanup(): void;
};

const validateVideoOptions = (options: VideoMetadataOptions, file: Blob): void => {
  validateBlob(file, "video/");
  if (
    options.maxSizeBytes !== undefined &&
    (!Number.isSafeInteger(options.maxSizeBytes) ||
      options.maxSizeBytes < 1)
  ) {
    throw new MediaValidationError("maxSizeBytes must be a positive safe integer.");
  }
  if (
    options.maxSizeBytes !== undefined &&
    file.size > options.maxSizeBytes
  ) {
    throw new MediaValidationError(
      `The video exceeds the configured maximum of ${options.maxSizeBytes} bytes.`,
    );
  }
  if (
    options.maxDurationSeconds !== undefined &&
    (!Number.isFinite(options.maxDurationSeconds) ||
      options.maxDurationSeconds <= 0)
  ) {
    throw new MediaValidationError("maxDurationSeconds must be positive.");
  }
  throwIfAborted(options.signal);
};

const createLoadedVideo = async (
  file: Blob,
  signal?: AbortSignal,
): Promise<LoadedVideo> => {
  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    throw new MediaProcessingError("Video metadata requires a browser media element.", {
      retryable: false,
    });
  }
  const element = document.createElement("video");
  const objectUrl = URL.createObjectURL(file);
  element.preload = "metadata";
  element.muted = true;
  element.playsInline = true;
  let settled = false;
  let cleanupEvents = (): void => undefined;
  const waitFor = (eventName: "loadedmetadata" | "loadeddata" | "seeked"): Promise<void> =>
    new Promise((resolve, reject) => {
      const cleanup = (): void => {
        element.removeEventListener(eventName, onSuccess);
        element.removeEventListener("error", onError);
        signal?.removeEventListener("abort", onAbort);
      };
      const onSuccess = (): void => {
        cleanup();
        resolve();
      };
      const onError = (): void => {
        cleanup();
        reject(new InvalidMediaFileError("The selected video could not be decoded."));
      };
      const onAbort = (): void => {
        cleanup();
        const error = new Error("Video processing was aborted.");
        error.name = "AbortError";
        reject(error);
      };
      element.addEventListener(eventName, onSuccess, { once: true });
      element.addEventListener("error", onError, { once: true });
      signal?.addEventListener("abort", onAbort, { once: true });
      cleanupEvents = cleanup;
      if (signal?.aborted) onAbort();
    });
  const cleanup = (): void => {
    if (settled) return;
    settled = true;
    cleanupEvents();
    element.pause();
    element.removeAttribute("src");
    element.load();
    URL.revokeObjectURL(objectUrl);
  };
  try {
    const metadataReady = waitFor("loadedmetadata");
    element.src = objectUrl;
    await metadataReady;
    throwIfAborted(signal);
    if (
      !Number.isFinite(element.duration) ||
      element.duration < 0 ||
      element.videoWidth < 1 ||
      element.videoHeight < 1
    ) {
      throw new InvalidMediaFileError("The video has invalid duration or dimensions.");
    }
    return { element, objectUrl, cleanup };
  } catch (error) {
    cleanup();
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof InvalidMediaFileError) throw error;
    throw new InvalidMediaFileError("The selected video metadata could not be read.", {
      cause: error,
    });
  }
};

const readLoadedMetadata = (
  video: HTMLVideoElement,
  file: Blob,
): VideoMetadata => {
  const playbackSupport = video.canPlayType(file.type);
  return {
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
    aspectRatio: video.videoWidth / video.videoHeight,
    mimeType: file.type.toLowerCase(),
    playbackSupport:
      playbackSupport === "probably" || playbackSupport === "maybe"
        ? playbackSupport
        : "",
  };
};

export const readVideoMetadata = async (
  file: Blob,
  options: VideoMetadataOptions = {},
): Promise<VideoMetadata> => {
  validateVideoOptions(options, file);
  emitProgress(options.onProgress, "metadata", 0);
  const loaded = await createLoadedVideo(file, options.signal);
  try {
    const metadata = readLoadedMetadata(loaded.element, file);
    if (
      options.maxDurationSeconds !== undefined &&
      metadata.duration > options.maxDurationSeconds
    ) {
      throw new MediaValidationError(
        `The video duration exceeds the configured maximum of ${options.maxDurationSeconds} seconds.`,
      );
    }
    emitProgress(options.onProgress, "metadata", 1);
    return metadata;
  } finally {
    loaded.cleanup();
  }
};

export const createVideoPoster = async (
  file: Blob,
  options: CreateVideoPosterOptions = {},
): Promise<VideoPosterResult> => {
  validateVideoOptions(options, file);
  if (
    options.maxWidth !== undefined &&
    (!Number.isInteger(options.maxWidth) || options.maxWidth < 1)
  ) {
    throw new MediaValidationError("maxWidth must be a positive integer.");
  }
  if (
    options.maxHeight !== undefined &&
    (!Number.isInteger(options.maxHeight) || options.maxHeight < 1)
  ) {
    throw new MediaValidationError("maxHeight must be a positive integer.");
  }
  if (options.maxWidth === undefined && options.maxHeight === undefined) {
    throw new MediaValidationError("maxWidth, maxHeight, or both must be provided.");
  }
  if (
    options.quality !== undefined &&
    (!Number.isFinite(options.quality) ||
      options.quality < 0 ||
      options.quality > 1)
  ) {
    throw new MediaValidationError("quality must be a number from 0 to 1.");
  }
  const format = options.format ?? "image/jpeg";
  if (
    format !== "image/jpeg" &&
    format !== "image/png" &&
    format !== "image/webp"
  ) {
    throw new MediaValidationError("The requested poster format is not supported.");
  }
  emitProgress(options.onProgress, "metadata", 0);
  const loaded = await createLoadedVideo(file, options.signal);
  try {
    const video = loaded.element;
    const metadata = readLoadedMetadata(video, file);
    if (
      options.maxDurationSeconds !== undefined &&
      metadata.duration > options.maxDurationSeconds
    ) {
      throw new MediaValidationError(
        `The video duration exceeds the configured maximum of ${options.maxDurationSeconds} seconds.`,
      );
    }
    const defaultTime =
      metadata.duration > 0 ? Math.min(1, metadata.duration / 2) : 0;
    const requestedTime = options.timeSeconds ?? defaultTime;
    if (!Number.isFinite(requestedTime) || requestedTime < 0) {
      throw new MediaValidationError("timeSeconds must be a finite non-negative number.");
    }
    const timeSeconds = Math.min(
      requestedTime,
      Math.max(0, metadata.duration - 0.05),
    );
    emitProgress(options.onProgress, "metadata", 1);
    if (timeSeconds > 0) {
      emitProgress(options.onProgress, "seek", 0);
      const seeked = new Promise<void>((resolve, reject) => {
        const onSeeked = (): void => {
          cleanup();
          resolve();
        };
        const onError = (): void => {
          cleanup();
          reject(new InvalidMediaFileError("The selected video frame could not be decoded."));
        };
        const onAbort = (): void => {
          cleanup();
          const error = new Error("Video poster generation was aborted.");
          error.name = "AbortError";
          reject(error);
        };
        const cleanup = (): void => {
          video.removeEventListener("seeked", onSeeked);
          video.removeEventListener("error", onError);
          options.signal?.removeEventListener("abort", onAbort);
        };
        video.addEventListener("seeked", onSeeked, { once: true });
        video.addEventListener("error", onError, { once: true });
        options.signal?.addEventListener("abort", onAbort, { once: true });
        if (options.signal?.aborted) onAbort();
      });
      video.currentTime = timeSeconds;
      await seeked;
      emitProgress(options.onProgress, "seek", 1);
    } else {
      const frameReady = new Promise<void>((resolve, reject) => {
        const onLoaded = (): void => {
          cleanup();
          resolve();
        };
        const onError = (): void => {
          cleanup();
          reject(new InvalidMediaFileError("The initial video frame could not be decoded."));
        };
        const onAbort = (): void => {
          cleanup();
          const error = new Error("Video poster generation was aborted.");
          error.name = "AbortError";
          reject(error);
        };
        const cleanup = (): void => {
          video.removeEventListener("loadeddata", onLoaded);
          video.removeEventListener("error", onError);
          options.signal?.removeEventListener("abort", onAbort);
        };
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
        options.signal?.addEventListener("abort", onAbort, { once: true });
        if (video.readyState >= 2) {
          onLoaded();
        } else if (options.signal?.aborted) {
          onAbort();
        }
      });
      await frameReady;
    }
    throwIfAborted(options.signal);
    const scale = Math.min(
      1,
      options.maxWidth === undefined
        ? 1
        : options.maxWidth / video.videoWidth,
      options.maxHeight === undefined
        ? 1
        : options.maxHeight / video.videoHeight,
    );
    const width = Math.max(1, Math.floor(video.videoWidth * scale));
    const height = Math.max(1, Math.floor(video.videoHeight * scale));
    const { canvas, context } = createCanvasSurface(width, height);
    context.drawImage(video, 0, 0, width, height);
    emitProgress(options.onProgress, "poster", 0);
    const blob = await encodeCanvas(canvas, format, options.quality, options.signal);
    if (blob.type.toLowerCase() !== format) {
      throw new MediaProcessingError(`The browser cannot encode a ${format} poster.`, {
        retryable: false,
      });
    }
    emitProgress(options.onProgress, "poster", 1);
    return { blob, width, height, format: blob.type.toLowerCase(), timeSeconds };
  } finally {
    loaded.cleanup();
  }
};
