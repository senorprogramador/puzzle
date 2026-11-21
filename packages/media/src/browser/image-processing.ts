import {
  InvalidMediaFileError,
  MediaProcessingError,
  MediaValidationError,
  UnsupportedMediaError,
} from "../errors/media.errors";
import type { MediaCrop } from "../types/media.types";
import { normalizeMediaCrop } from "../utils/media-validation";
import {
  asFileName,
  createCanvasSurface,
  emitProgress,
  encodeCanvas,
  replaceFileExtension,
  throwIfAborted,
  validateBlob,
  type BrowserMediaProgressCallback,
} from "./browser-utils";
import type { ImageWorkerRequest, ImageWorkerResponse } from "./image-worker-protocol";

export type ImageOutputFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif";

export type ResizeImageOptions = {
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format?: ImageOutputFormat;
  readonly fallbackFormat?: ImageOutputFormat;
  readonly quality?: number;
  readonly maxSourceSizeBytes?: number;
  readonly signal?: AbortSignal;
  readonly onProgress?: BrowserMediaProgressCallback;
};

export type CropImageOptions = ResizeImageOptions & {
  /** Crop coordinates relative to the original, oriented image. */
  readonly crop: MediaCrop;
};

export type ImageProcessingResult = {
  readonly blob: Blob;
  readonly fileName: string;
  readonly width: number;
  readonly height: number;
  readonly originalWidth: number;
  readonly originalHeight: number;
  readonly format: string;
  readonly size: number;
  readonly resized: boolean;
  readonly usedFallbackFormat: boolean;
};

export type ImageVariantProfile = {
  readonly name: string;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly format?: ImageOutputFormat;
  readonly quality?: number;
};

export type CreateImageVariantsOptions = {
  readonly profiles: readonly ImageVariantProfile[];
  /** Explicitly retain the input, including any EXIF/GPS metadata it contains. */
  readonly retainOriginal: boolean;
  readonly format?: ImageOutputFormat;
  readonly fallbackFormat?: ImageOutputFormat;
  readonly quality?: number;
  readonly maxSourceSizeBytes?: number;
  readonly signal?: AbortSignal;
  readonly onProgress?: BrowserMediaProgressCallback;
};

export type ImageVariantsResult = {
  readonly original: Blob | null;
  readonly variants: Readonly<Record<string, ImageProcessingResult>>;
};

type DecodedImage = {
  readonly source: CanvasImageSource;
  readonly width: number;
  readonly height: number;
  close(): void;
};

const isImageOutputFormat = (value: string): value is ImageOutputFormat =>
  value === "image/jpeg" ||
  value === "image/png" ||
  value === "image/webp" ||
  value === "image/avif";

const validateResizeOptions = (
  options: Pick<ResizeImageOptions, "maxWidth" | "maxHeight" | "quality">,
  requireMaximum = true,
): void => {
  if (requireMaximum && options.maxWidth === undefined && options.maxHeight === undefined) {
    throw new MediaValidationError("maxWidth, maxHeight, or both must be provided.");
  }
  for (const [field, value] of [
    ["maxWidth", options.maxWidth],
    ["maxHeight", options.maxHeight],
  ] as const) {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
      throw new MediaValidationError(`${field} must be a positive integer.`);
    }
  }
  if (
    options.quality !== undefined &&
    (!Number.isFinite(options.quality) ||
      options.quality < 0 ||
      options.quality > 1)
  ) {
    throw new MediaValidationError("quality must be a number from 0 to 1.");
  }
};

const validateMaxSourceSize = (
  blob: Blob,
  maximum: number | undefined,
): void => {
  if (maximum !== undefined && (!Number.isSafeInteger(maximum) || maximum < 1)) {
    throw new MediaValidationError("maxSourceSizeBytes must be a positive safe integer.");
  }
  if (maximum !== undefined && blob.size > maximum) {
    throw new MediaValidationError(
      `The image exceeds the configured maximum of ${maximum} bytes.`,
    );
  }
};

const decodeWithImageElement = async (
  blob: Blob,
  signal?: AbortSignal,
): Promise<DecodedImage> => {
  if (
    typeof document === "undefined" ||
    typeof URL === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    throw new MediaProcessingError("No browser image decoder is available.", {
      retryable: false,
    });
  }
  const image = document.createElement("img");
  const url = URL.createObjectURL(blob);
  image.decoding = "async";
  return new Promise<DecodedImage>((resolve, reject) => {
    let settled = false;
    const cleanup = (): void => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
      signal?.removeEventListener("abort", onAbort);
      URL.revokeObjectURL(url);
    };
    const fail = (error: Error): void => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    const onLoad = (): void => {
      if (image.naturalWidth < 1 || image.naturalHeight < 1) {
        fail(new InvalidMediaFileError("The selected image has no valid dimensions."));
        return;
      }
      if (settled) return;
      settled = true;
      cleanup();
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close: () => undefined,
      });
    };
    const onError = (): void =>
      fail(new InvalidMediaFileError("The selected image could not be decoded."));
    const onAbort = (): void => {
      const error = new Error("The image decode was aborted.");
      error.name = "AbortError";
      fail(error);
    };
    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", onError, { once: true });
    signal?.addEventListener("abort", onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }
    image.src = url;
  });
};

const decodeImage = async (
  blob: Blob,
  signal?: AbortSignal,
): Promise<DecodedImage> => {
  throwIfAborted(signal);
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob, {
        imageOrientation: "from-image",
      });
      try {
        throwIfAborted(signal);
      } catch (error) {
        bitmap.close();
        throw error;
      }
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      try {
        const bitmap = await createImageBitmap(blob);
        try {
          throwIfAborted(signal);
        } catch (error) {
          bitmap.close();
          throw error;
        }
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          close: () => bitmap.close(),
        };
      } catch (fallbackError) {
        if (fallbackError instanceof Error && fallbackError.name === "AbortError") {
          throw fallbackError;
        }
        try {
          return await decodeWithImageElement(blob, signal);
        } catch (imageError) {
          if (imageError instanceof Error && imageError.name === "AbortError") {
            throw imageError;
          }
          throw new InvalidMediaFileError("The selected image could not be decoded.", {
            cause: fallbackError ?? error,
          });
        }
      }
    }
  }
  return decodeWithImageElement(blob, signal);
};

const getOutputSize = (
  width: number,
  height: number,
  maxWidth: number | undefined,
  maxHeight: number | undefined,
): { readonly width: number; readonly height: number } => {
  const scale = Math.min(
    1,
    maxWidth === undefined ? 1 : maxWidth / width,
    maxHeight === undefined ? 1 : maxHeight / height,
  );
  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
  };
};

const getDefaultFormat = (type: string): ImageOutputFormat => {
  const normalized = type.toLowerCase();
  if (isImageOutputFormat(normalized)) return normalized;
  return "image/png";
};

export const processImageOnCurrentThread = async (
  image: Blob,
  options: ResizeImageOptions,
  crop?: MediaCrop,
): Promise<ImageProcessingResult> => {
  validateResizeOptions(options, crop === undefined);
  validateBlob(image, "image/");
  validateMaxSourceSize(image, options.maxSourceSizeBytes);
  throwIfAborted(options.signal);
  const requestedFormat = options.format ?? getDefaultFormat(image.type);
  const fallbackFormat = options.fallbackFormat ?? "image/png";
  if (!isImageOutputFormat(requestedFormat) || !isImageOutputFormat(fallbackFormat)) {
    throw new UnsupportedMediaError("The requested output image format is not supported.");
  }
  emitProgress(options.onProgress, "decode", 0);
  const decoded = await decodeImage(image, options.signal);
  try {
    throwIfAborted(options.signal);
    emitProgress(options.onProgress, "decode", 1);
    const source = crop
      ? {
          x: crop.x * decoded.width,
          y: crop.y * decoded.height,
          width: crop.width * decoded.width,
          height: crop.height * decoded.height,
        }
      : { x: 0, y: 0, width: decoded.width, height: decoded.height };
    if (source.width < 1 || source.height < 1) {
      throw new MediaValidationError("The crop must cover at least one source pixel in each dimension.");
    }
    const output = getOutputSize(
      source.width,
      source.height,
      options.maxWidth,
      options.maxHeight,
    );
    const { canvas, context } = createCanvasSurface(output.width, output.height);
    emitProgress(options.onProgress, "resize", 0);
    context.drawImage(
      decoded.source,
      source.x,
      source.y,
      source.width,
      source.height,
      0,
      0,
      output.width,
      output.height,
    );
    throwIfAborted(options.signal);
    emitProgress(options.onProgress, "resize", 1);
    emitProgress(options.onProgress, "encode", 0);
    let blob = await encodeCanvas(
      canvas,
      requestedFormat,
      options.quality,
      options.signal,
    );
    let usedFallbackFormat = blob.type.toLowerCase() !== requestedFormat;
    if (usedFallbackFormat) {
      if (blob.type.toLowerCase() !== fallbackFormat) {
        blob = await encodeCanvas(
          canvas,
          fallbackFormat,
          options.quality,
          options.signal,
        );
      }
      if (blob.type.toLowerCase() !== fallbackFormat) {
        throw new UnsupportedMediaError(
          `The browser cannot encode ${requestedFormat} or fallback ${fallbackFormat}.`,
        );
      }
    }
    throwIfAborted(options.signal);
    emitProgress(options.onProgress, "encode", 1);
    const format = blob.type.toLowerCase();
    return {
      blob,
      fileName: replaceFileExtension(asFileName(image), format),
      width: output.width,
      height: output.height,
      originalWidth: decoded.width,
      originalHeight: decoded.height,
      format,
      size: blob.size,
      resized: output.width !== decoded.width || output.height !== decoded.height,
      usedFallbackFormat,
    };
  } finally {
    decoded.close();
  }
};

const createImageWorker = (): Worker | null => {
  if (
    typeof document === "undefined" ||
    typeof Worker === "undefined" ||
    typeof OffscreenCanvas === "undefined" ||
    typeof createImageBitmap !== "function" ||
    typeof import.meta.url !== "string"
  ) return null;

  try {
    return new Worker(new URL("./image-worker.js", import.meta.url), {
      type: "module",
      name: "puzzle-media-image",
    });
  } catch (error) {
    console.warn("Image worker could not start; processing on the current thread.", error);
    return null;
  }
};

const processImageInWorker = (
  worker: Worker,
  image: Blob,
  options: ResizeImageOptions,
  crop?: MediaCrop,
): Promise<ImageProcessingResult | null> =>
  new Promise((resolve, reject) => {
    let ready = false;
    let settled = false;
    const cleanup = (): void => {
      worker.terminate();
      options.signal?.removeEventListener("abort", onAbort);
    };
    const finish = (action: () => void): void => {
      if (settled) return;
      settled = true;
      cleanup();
      action();
    };
    const onAbort = (): void => {
      finish(() => {
        const error = new Error("The media operation was aborted.");
        error.name = "AbortError";
        reject(error);
      });
    };
    worker.addEventListener("error", (event) => {
      if (!ready) {
        console.warn("Image worker could not load; processing on the current thread.", event.message);
        finish(() => resolve(null));
      } else {
        finish(() => reject(new MediaProcessingError("The image worker failed.", {
          cause: event.error,
        })));
      }
    });
    worker.addEventListener("messageerror", () => {
      finish(() => reject(new MediaProcessingError("The image worker sent an unreadable message.")));
    });
    worker.addEventListener("message", (event: MessageEvent<ImageWorkerResponse>) => {
      const message = event.data;
      switch (message.type) {
        case "ready": {
          ready = true;
          const request: ImageWorkerRequest = {
            image,
            options: {
              maxWidth: options.maxWidth,
              maxHeight: options.maxHeight,
              format: options.format,
              fallbackFormat: options.fallbackFormat,
              quality: options.quality,
              maxSourceSizeBytes: options.maxSourceSizeBytes,
            },
            ...(crop ? { crop } : {}),
          };
          try {
            worker.postMessage(request);
          } catch (error) {
            finish(() => reject(new MediaProcessingError("The image could not be sent to the worker.", {
              cause: error,
              retryable: false,
            })));
          }
          break;
        }
        case "progress":
          try {
            options.onProgress?.(message.progress);
          } catch (error) {
            finish(() => reject(error));
          }
          break;
        case "fallback":
          finish(() => resolve(null));
          break;
        case "result":
          finish(() => resolve(message.result));
          break;
        case "error":
          finish(() => {
            if (message.code === "VALIDATION") reject(new MediaValidationError(message.message));
            else if (message.code === "UNSUPPORTED_MEDIA") reject(new UnsupportedMediaError(message.message));
            else reject(new MediaProcessingError(message.message, { retryable: message.retryable }));
          });
          break;
      }
    });
    options.signal?.addEventListener("abort", onAbort, { once: true });
    if (options.signal?.aborted) onAbort();
  });

const processImage = async (
  image: Blob,
  options: ResizeImageOptions,
  crop?: MediaCrop,
): Promise<ImageProcessingResult> => {
  validateResizeOptions(options, crop === undefined);
  validateBlob(image, "image/");
  validateMaxSourceSize(image, options.maxSourceSizeBytes);
  throwIfAborted(options.signal);
  const requestedFormat = options.format ?? getDefaultFormat(image.type);
  const fallbackFormat = options.fallbackFormat ?? "image/png";
  if (!isImageOutputFormat(requestedFormat) || !isImageOutputFormat(fallbackFormat)) {
    throw new UnsupportedMediaError("The requested output image format is not supported.");
  }
  const worker = createImageWorker();
  if (worker) {
    const result = await processImageInWorker(worker, image, options, crop);
    if (result) return result;
  }
  return processImageOnCurrentThread(image, options, crop);
};

export const resizeImage = async (
  image: Blob,
  options: ResizeImageOptions,
): Promise<ImageProcessingResult> => processImage(image, options);

export const cropImage = async (
  image: Blob,
  options: CropImageOptions,
): Promise<ImageProcessingResult> =>
  processImage(image, options, normalizeMediaCrop(options.crop));

export const createImageVariants = async (
  image: Blob,
  options: CreateImageVariantsOptions,
): Promise<ImageVariantsResult> => {
  validateBlob(image, "image/");
  validateMaxSourceSize(image, options.maxSourceSizeBytes);
  if (!Array.isArray(options.profiles) || options.profiles.length === 0) {
    throw new MediaValidationError("At least one named image profile is required.");
  }
  const names = new Set<string>();
  for (const profile of options.profiles) {
    if (profile.name.trim() === "" || names.has(profile.name)) {
      throw new MediaValidationError("Image profile names must be non-empty and unique.");
    }
    names.add(profile.name);
    validateResizeOptions(profile);
  }
  const variants: Record<string, ImageProcessingResult> = {};
  for (let index = 0; index < options.profiles.length; index += 1) {
    throwIfAborted(options.signal);
    const profile = options.profiles[index];
    if (!profile) continue;
    const result = await resizeImage(image, {
      maxWidth: profile.maxWidth,
      maxHeight: profile.maxHeight,
      format: profile.format ?? options.format,
      fallbackFormat: options.fallbackFormat,
      quality: profile.quality ?? options.quality,
      maxSourceSizeBytes: options.maxSourceSizeBytes,
      signal: options.signal,
      onProgress: (progress) => {
        const segment = 1 / options.profiles.length;
        emitProgress(options.onProgress, progress.stage, (index + progress.progress) * segment);
      },
    });
    Object.defineProperty(variants, profile.name, {
      value: result,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }
  throwIfAborted(options.signal);
  return {
    original: options.retainOriginal ? image : null,
    variants,
  };
};
