"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type RefCallback,
} from "react";

import { preload as preloadImage } from "react-dom";

import { cn } from "@puzzle-ui/core";
import { useThemeComponents } from "@puzzle-ui/theme/components-context";

import type { ImageProps } from "./image.types";

import {
  getImageBlurDataURL,
  getImageDimensions,
  getImageSourceUrl,
  hasImageSource,
  resolveImageRadius,
} from "./image.utils";

import { useImageState } from "./use-image-state";

import "./image.css";

const Image = ({
  src,
  alt,
  width,
  height,
  fit = "cover",
  position = "center",
  aspectRatio,
  fill = false,
  radius,
  fallbackSrc,
  fallback,
  loadingPlaceholder,
  placeholder = "empty",
  blurDataURL,
  sources,
  component,
  componentProps,
  quality,
  preload = false,
  unoptimized,
  className,
  style,
  containerClassName,
  containerStyle,
  loading,
  fetchPriority,
  decoding,
  srcSet,
  sizes,
  crossOrigin,
  referrerPolicy,
  ref,
  onLoad,
  onError,
  ...rest
}: ImageProps) => {
  const configuredImage = useThemeComponents()?.image;

  const Component: ElementType = component ?? configuredImage ?? "img";

  const isNativeImage = Component === "img";

  const { activeSource, usingFallback, status, markLoaded, markError } =
    useImageState(src, fallbackSrc);

  const hasActiveSource = hasImageSource(activeSource);

  const sourceUrl = getImageSourceUrl(activeSource);

  const sourceDimensions = getImageDimensions(activeSource);

  const resolvedWidth = width ?? sourceDimensions?.width;
  const resolvedHeight = height ?? sourceDimensions?.height;

  const resolvedBlurDataURL = blurDataURL ?? getImageBlurDataURL(activeSource);

  const imageRef = useRef<HTMLImageElement | null>(null);

  /**
   * Assigns the image element to both the internal and external refs.
   */
  const setImageRef = useCallback<RefCallback<HTMLImageElement>>(
    (node) => {
      imageRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  /**
   * Handles successful image loading.
   */
  const handleLoad: NonNullable<ImageProps["onLoad"]> = useCallback(
    (event) => {
      markLoaded();
      onLoad?.(event);
    },
    [markLoaded, onLoad],
  );

  /**
   * Handles image loading failures.
   */
  const handleError: NonNullable<ImageProps["onError"]> = useCallback(
    (event) => {
      markError();
      onError?.(event);
    },
    [markError, onError],
  );

  /**
   * Handles images that were loaded before React attached its listeners.
   *
   * This is particularly useful for cached images during hydration.
   */
  useEffect(() => {
    const image = imageRef.current;

    if (!image || !image.complete) {
      return;
    }

    if (image.naturalWidth > 0) {
      markLoaded();
    }
  }, [activeSource, markLoaded]);

  /**
   * Preloads native images using React DOM.
   *
   * Framework image components handle their own preload behavior.
   */
  if (preload && isNativeImage && sourceUrl) {
    preloadImage(sourceUrl, {
      as: "image",
      crossOrigin,
      fetchPriority: fetchPriority ?? "high",
      imageSrcSet: srcSet,
      imageSizes: sizes,
      referrerPolicy,
    });
  }

  const mediaStyle: CSSProperties = {
    ...(fill || aspectRatio
      ? {
          width: "100%",
          height: "100%",
        }
      : {}),
    ...(fill
      ? {
          position: "absolute",
          inset: 0,
        }
      : {}),
    objectFit: fit,
    objectPosition: position,
    ...style,
  };

  const wrapperStyle: CSSProperties = {
    ...(aspectRatio
      ? {
          aspectRatio,
          width: "100%",
        }
      : {}),
    ...(fill
      ? {
          position: "relative",
          display: "block",
          width: "100%",
          ...(aspectRatio ? {} : { height: "100%" }),
        }
      : {}),
    ...(radius
      ? {
          borderRadius: resolveImageRadius(radius),
        }
      : {}),
    ...containerStyle,
  };

  const isLoading = hasActiveSource && status === "loading";

  const shouldShowFallback =
    fallback !== undefined && (!hasActiveSource || status === "error");

  if (!hasActiveSource && !shouldShowFallback) {
    return null;
  }

  const renderedSource = isNativeImage ? sourceUrl : activeSource;

  /**
   * Framework-specific props are only forwarded to custom components.
   * This prevents invalid attributes from leaking onto native img tags.
   */
  const imageElement = createElement(Component, {
    ...(!isNativeImage ? componentProps : {}),
    ...rest,
    key: usingFallback ? "fallback" : "source",
    ref: setImageRef,
    src: renderedSource,
    alt,
    width: resolvedWidth,
    height: resolvedHeight,
    loading,
    fetchPriority,
    decoding,
    crossOrigin,
    referrerPolicy,
    srcSet,
    sizes,
    className: cn("puzzle-image__media", className),
    style: mediaStyle,
    onLoad: handleLoad,
    onError: handleError,
    ...(fill && !isNativeImage ? { fill: true } : {}),
    ...(preload && !isNativeImage ? { preload: true } : {}),
    ...(quality !== undefined && !isNativeImage ? { quality } : {}),
    ...(unoptimized !== undefined && !isNativeImage ? { unoptimized } : {}),
    ...(!isNativeImage && placeholder === "blur" && resolvedBlurDataURL
      ? {
          placeholder: "blur",
          blurDataURL: resolvedBlurDataURL,
        }
      : {}),
  } as never);

  /**
   * Picture sources allow art direction and responsive source selection.
   */
  const media = sources?.length ? (
    <picture className="puzzle-image__picture">
      {sources.map((source, index) => (
        <source
          key={`${source.srcSet}-${index}`}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
          sizes={source.sizes}
        />
      ))}
      {imageElement}
    </picture>
  ) : (
    imageElement
  );

  const showLoadingPlaceholder = isLoading && loadingPlaceholder !== undefined;

  const showBlurPlaceholder =
    isLoading &&
    !loadingPlaceholder &&
    isNativeImage &&
    placeholder === "blur" &&
    Boolean(resolvedBlurDataURL);

  return (
    <div
      className={cn("puzzle-image", containerClassName)}
      style={wrapperStyle}
      data-status={hasActiveSource ? status : "empty"}
      data-image-fill={fill ? "true" : undefined}
      data-image-ratio={aspectRatio ? "true" : undefined}
    >
      {showBlurPlaceholder ? (
        <img
          className="puzzle-image__blur"
          src={resolvedBlurDataURL}
          alt=""
          aria-hidden="true"
        />
      ) : null}

      {showLoadingPlaceholder ? (
        <div className="puzzle-image__placeholder" aria-hidden="true">
          {loadingPlaceholder}
        </div>
      ) : null}

      {shouldShowFallback ? (
        <div
          className="puzzle-image__fallback"
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        >
          {fallback}
        </div>
      ) : (
        media
      )}
    </div>
  );
};

export { Image, type ImageProps };

export type {
  ImageSource,
  ImageSourceData,
  ImageSourceSet,
  ImageFit,
  ImageRadius,
  ImagePlaceholder,
} from "./image.types";
