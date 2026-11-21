import { cropImage as cropSourceImage } from "@puzzle-ui/media/browser";

import type { ImageCrop } from "../image-cropper/image-cropper.types";

type CroppedImage = {
  blob: Blob;
  width?: number;
  height?: number;
  sourceWidth?: number;
  sourceHeight?: number;
};

export const cropImage = async (
  file: File,
  crop: ImageCrop,
  signal: AbortSignal,
): Promise<CroppedImage> => {
  if (crop.x <= 0 && crop.y <= 0 && crop.width >= 1 && crop.height >= 1) {
    if (signal.aborted) {
      const error = new Error("Image processing was aborted.");
      error.name = "AbortError";
      throw error;
    }
    return { blob: file };
  }

  const result = await cropSourceImage(file, {
    crop,
    format: "image/png",
    signal,
  });
  return {
    blob: result.blob,
    width: result.width,
    height: result.height,
    sourceWidth: result.originalWidth,
    sourceHeight: result.originalHeight,
  };
};

export const formatImageUploadSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  const units = ["KB", "MB", "GB"];
  let value = size / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
};
