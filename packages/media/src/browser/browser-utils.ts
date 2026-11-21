import {
  MediaCapabilityError,
  MediaProcessingError,
  MediaValidationError,
} from "../errors/media.errors";

export type BrowserMediaProgress = {
  readonly stage: "decode" | "resize" | "encode" | "metadata" | "seek" | "poster";
  readonly progress: number;
};

export type BrowserMediaProgressCallback = (
  progress: BrowserMediaProgress,
) => void;

export type CanvasSurface = {
  readonly canvas: HTMLCanvasElement | OffscreenCanvas;
  readonly context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
};

export const throwIfAborted = (signal?: AbortSignal): void => {
  if (!signal?.aborted) return;
  const error = new Error("The media operation was aborted.");
  error.name = "AbortError";
  throw error;
};

export const createCanvasSurface = (
  width: number,
  height: number,
): CanvasSurface => {
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: true });
    if (context) return { canvas, context };
  }
  if (typeof document === "undefined") {
    throw new MediaCapabilityError("browser canvas");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    throw new MediaCapabilityError("HTMLCanvasElement 2D context");
  }
  return { canvas, context };
};

export const encodeCanvas = async (
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type: string,
  quality: number | undefined,
  signal?: AbortSignal,
): Promise<Blob> => {
  throwIfAborted(signal);
  try {
    if ("convertToBlob" in canvas) {
      const result = await canvas.convertToBlob({
        type,
        ...(quality !== undefined ? { quality } : {}),
      });
      throwIfAborted(signal);
      return result;
    }
    const result = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new MediaProcessingError("The browser could not encode the canvas."));
        },
        type,
        quality,
      );
    });
    throwIfAborted(signal);
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    if (error instanceof MediaProcessingError) throw error;
    throw new MediaProcessingError("The browser failed to encode media.", {
      cause: error,
      retryable: false,
    });
  }
};

export const validateBlob = (blob: Blob, expectedPrefix: string): void => {
  if (!blob || typeof blob.size !== "number" || !Number.isSafeInteger(blob.size) || blob.size < 1) {
    throw new MediaValidationError("The selected media file must not be empty.");
  }
  if (
    typeof blob.type !== "string" ||
    !blob.type.toLowerCase().startsWith(expectedPrefix)
  ) {
    throw new MediaValidationError(
      `The selected file must have a ${expectedPrefix} MIME type.`,
    );
  }
};

export const emitProgress = (
  callback: BrowserMediaProgressCallback | undefined,
  stage: BrowserMediaProgress["stage"],
  progress: number,
): void => {
  callback?.({ stage, progress });
};

export const asFileName = (blob: Blob): string => {
  const candidate = blob as Blob & { readonly name?: unknown };
  return typeof candidate.name === "string" ? candidate.name : "media";
};

export const replaceFileExtension = (
  fileName: string,
  mimeType: string,
): string => {
  const extension =
    mimeType === "image/jpeg"
      ? "jpg"
      : mimeType === "image/png"
        ? "png"
        : mimeType === "image/webp"
          ? "webp"
          : mimeType === "image/avif"
            ? "avif"
            : mimeType.split("/")[1]?.split(";")[0] ?? "bin";
  const basename = fileName.replace(/\.[^.]+$/, "") || "media";
  return `${basename}.${extension}`;
};
