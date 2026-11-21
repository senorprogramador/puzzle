/**
 * A rectangle normalized to the bounds of an image. Coordinates and dimensions
 * are fractions in the inclusive 0..1 range, independent of source pixel size.
 */
type NormalizedImageRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** A point normalized to the bounds of an image. */
type NormalizedImagePoint = {
  x: number;
  y: number;
};

/** JSON-safe scalar metadata for a hotspot. */
type ImageHotspotData = Readonly<
  Record<string, string | number | boolean | null>
>;

export type {
  ImageHotspotData,
  NormalizedImagePoint,
  NormalizedImageRect,
};
