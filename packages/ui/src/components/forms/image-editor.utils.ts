import type {
  NormalizedImagePoint,
  NormalizedImageRect,
} from "./image-editor.types";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const roundNormalized = (value: number) => Math.round(value * 1_000_000) / 1_000_000;

const normalizePoint = (point: NormalizedImagePoint): NormalizedImagePoint => ({
  x: roundNormalized(clamp(point.x)),
  y: roundNormalized(clamp(point.y)),
});

const normalizeRect = (rect: NormalizedImageRect): NormalizedImageRect => {
  const x = clamp(rect.x);
  const y = clamp(rect.y);
  const width = clamp(rect.width, 0, 1 - x);
  const height = clamp(rect.height, 0, 1 - y);

  return {
    x: roundNormalized(x),
    y: roundNormalized(y),
    width: roundNormalized(width),
    height: roundNormalized(height),
  };
};

const toNormalizedPoint = (
  clientX: number,
  clientY: number,
  bounds: Pick<DOMRect, "left" | "top" | "width" | "height">,
): NormalizedImagePoint => ({
  x: roundNormalized(
    bounds.width > 0 ? clamp((clientX - bounds.left) / bounds.width) : 0,
  ),
  y: roundNormalized(
    bounds.height > 0 ? clamp((clientY - bounds.top) / bounds.height) : 0,
  ),
});

export {
  clamp,
  normalizePoint,
  normalizeRect,
  roundNormalized,
  toNormalizedPoint,
};
