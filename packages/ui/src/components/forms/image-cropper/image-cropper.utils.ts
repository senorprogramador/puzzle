import type {
  ImageCrop,
  ImageCropAspectRatio,
} from "./image-cropper.types";

import { clamp, normalizeRect, roundNormalized } from "../image-editor.utils";

type ImageDimensions = {
  width: number;
  height: number;
};

const getBaseCrop = (
  dimensions: ImageDimensions | undefined,
  aspectRatio: ImageCropAspectRatio,
): ImageCrop => {
  if (aspectRatio === "free" || !dimensions?.width || !dimensions.height) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const imageRatio = dimensions.width / dimensions.height;
  const width =
    imageRatio > aspectRatio ? aspectRatio / imageRatio : 1;
  const height =
    imageRatio > aspectRatio ? 1 : imageRatio / aspectRatio;

  return normalizeRect({
    x: (1 - width) / 2,
    y: (1 - height) / 2,
    width,
    height,
  });
};

const resizeAroundCenter = (
  crop: ImageCrop,
  width: number,
  height: number,
): ImageCrop => {
  const nextWidth = clamp(width, 0.01, 1);
  const nextHeight = clamp(height, 0.01, 1);
  const centerX = crop.x + crop.width / 2;
  const centerY = crop.y + crop.height / 2;

  return normalizeRect({
    x: centerX - nextWidth / 2,
    y: centerY - nextHeight / 2,
    width: nextWidth,
    height: nextHeight,
  });
};

const createCropAtZoom = (
  crop: ImageCrop,
  dimensions: ImageDimensions | undefined,
  aspectRatio: ImageCropAspectRatio,
  zoom: number,
) => {
  const baseCrop = getBaseCrop(dimensions, aspectRatio);
  const width = baseCrop.width / zoom;
  const height = baseCrop.height / zoom;

  return resizeAroundCenter(crop, width, height);
};

const normalizeCrop = (crop: ImageCrop) => normalizeRect(crop);

const moveCrop = (crop: ImageCrop, dx: number, dy: number) =>
  normalizeRect({
    ...crop,
    x: clamp(crop.x + dx, 0, 1 - crop.width),
    y: clamp(crop.y + dy, 0, 1 - crop.height),
  });

const resizeFreeCrop = (
  crop: ImageCrop,
  dx: number,
  dy: number,
  bounds: Pick<DOMRect, "width" | "height">,
) =>
  normalizeRect({
    ...crop,
    width: clamp(crop.width + dx / Math.max(1, bounds.width), 0.01, 1 - crop.x),
    height: clamp(
      crop.height + dy / Math.max(1, bounds.height),
      0.01,
      1 - crop.y,
    ),
  });

const resizeFixedCrop = (
  crop: ImageCrop,
  dx: number,
  bounds: Pick<DOMRect, "width" | "height">,
  aspectRatio: number,
) => {
  const stageRatio =
    bounds.width > 0 && bounds.height > 0
      ? bounds.width / bounds.height
      : 1;
  const nextWidth = clamp(
    crop.width + dx / Math.max(1, bounds.width),
    0.01,
    Math.min(1 - crop.x, (1 - crop.y) * aspectRatio / stageRatio),
  );
  const nextHeight = nextWidth * stageRatio / aspectRatio;

  return normalizeRect({
    ...crop,
    width: nextWidth,
    height: clamp(nextHeight, 0.01, 1 - crop.y),
  });
};

const getNormalizedZoom = (crop: ImageCrop, baseCrop: ImageCrop) =>
  roundNormalized(Math.max(1, baseCrop.width / Math.max(crop.width, 0.01)));

export {
  createCropAtZoom,
  getBaseCrop,
  getNormalizedZoom,
  moveCrop,
  normalizeCrop,
  resizeAroundCenter,
  resizeFixedCrop,
  resizeFreeCrop,
};
