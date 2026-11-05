import type { CSSProperties } from "react";
import type { ImageRadius, ImageSource } from "./image.types";

/**
 * Checks whether an image source contains a usable URL.
 */
const hasImageSource = (
  source: ImageSource | null | undefined,
): source is ImageSource => {
  if (typeof source === "string") {
    return source.trim().length > 0;
  }

  return typeof source?.src === "string" && source.src.length > 0;
};

/**
 * Resolves a source to a regular URL.
 *
 * Static image objects are converted to their `src` property.
 */
const getImageSourceUrl = (
  source: ImageSource | null | undefined,
): string | undefined => {
  if (!hasImageSource(source)) {
    return undefined;
  }

  return typeof source === "string" ? source : source.src;
};

/**
 * Retrieves intrinsic dimensions from static image imports.
 */
const getImageDimensions = (source: ImageSource | null | undefined) => {
  if (typeof source !== "object" || source === null) {
    return undefined;
  }

  return {
    width: source.width,
    height: source.height,
  };
};

/**
 * Resolves an explicitly provided or statically imported blur image.
 */
const getImageBlurDataURL = (
  source: ImageSource | null | undefined,
): string | undefined => {
  if (typeof source !== "object" || source === null) {
    return undefined;
  }

  return source.blurDataURL;
};

/**
 * Resolves semantic radius values to Puzzle theme tokens.
 */
const resolveImageRadius = (
  radius?: ImageRadius,
): CSSProperties["borderRadius"] => {
  if (radius === undefined) {
    return undefined;
  }

  const radiusTokens: Record<string, string> = {
    none: "0",
    sm: "var(--puzzle-radius-sm, 0.25rem)",
    md: "var(--puzzle-radius-md, 0.5rem)",
    lg: "var(--puzzle-radius-lg, 0.75rem)",
    xl: "var(--puzzle-radius-xl, 1rem)",
    full: "var(--puzzle-radius-full, 9999px)",
  };

  return radiusTokens[radius] ?? radius;
};

export {
  hasImageSource,
  getImageSourceUrl,
  getImageDimensions,
  getImageBlurDataURL,
  resolveImageRadius,
};
