import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
  Ref,
} from "react";

/**
 * Supports regular URLs and static image imports.
 *
 * The object shape is compatible with Next.js StaticImageData.
 */
type ImageSourceData = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

type ImageSource = string | ImageSourceData;

type ImageFit = NonNullable<CSSProperties["objectFit"]>;

type ImageRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full"
  | NonNullable<CSSProperties["borderRadius"]>;

type ImagePlaceholder = "empty" | "blur";

/**
 * Additional responsive image sources for the picture element.
 */
type ImageSourceSet = {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
};

type ImageProps = Omit<
  ComponentPropsWithRef<"img">,
  "src" | "alt" | "width" | "height" | "className" | "style" | "ref"
> & {
  /**
   * Image URL or static image import.
   *
   * Can be omitted when fallbackSrc or fallback is provided.
   */
  src?: ImageSource | null;

  /**
   * Alternative text.
   *
   * Use an empty string for decorative images.
   */
  alt: string;

  /**
   * Intrinsic image width in pixels.
   *
   * Automatically inferred from static image imports.
   */
  width?: number;

  /**
   * Intrinsic image height in pixels.
   *
   * Automatically inferred from static image imports.
   */
  height?: number;

  /**
   * Image rendering mode.
   */
  fit?: ImageFit;

  /**
   * Image alignment within its container.
   */
  position?: CSSProperties["objectPosition"];

  /**
   * Container aspect ratio.
   *
   * When provided, the image fills the resulting container.
   */
  aspectRatio?: CSSProperties["aspectRatio"];

  /**
   * Makes the image fill its parent container.
   *
   * The parent must have a defined size.
   */
  fill?: boolean;

  /**
   * Border radius of the image container.
   */
  radius?: ImageRadius;

  /**
   * Alternative image source used when the primary source fails.
   */
  fallbackSrc?: ImageSource | null;

  /**
   * Custom content displayed when no image can be rendered.
   */
  fallback?: ReactNode;

  /**
   * Custom loading content displayed above the image.
   */
  loadingPlaceholder?: ReactNode;

  /**
   * Loading placeholder strategy.
   *
   * Blur requires a blurDataURL, either explicitly provided
   * or included in a static image import.
   */
  placeholder?: ImagePlaceholder;

  /**
   * Small preview image used by the blur placeholder.
   */
  blurDataURL?: string;

  /**
   * Additional sources rendered inside a picture element.
   */
  sources?: ImageSourceSet[];

  /**
   * Framework-specific image component.
   *
   * Overrides Theme.components.image for this instance.
   */
  component?: ElementType;

  /**
   * Additional props forwarded to the configured image component.
   *
   * Useful for framework-specific options such as custom loaders.
   */
  componentProps?: Record<string, unknown>;

  /**
   * Next.js image optimization quality.
   *
   * Forwarded to custom image components.
   */
  quality?: number;

  /**
   * Whether the image should be preloaded.
   *
   * Uses React DOM preload for native images and is forwarded
   * to configured framework components.
   */
  preload?: boolean;

  /**
   * Disables image optimization in compatible image components.
   */
  unoptimized?: boolean;

  /**
   * Class applied to the actual image element.
   */
  className?: string;

  /**
   * Styles applied to the actual image element.
   */
  style?: CSSProperties;

  /**
   * Class applied to the outer container.
   */
  containerClassName?: string;

  /**
   * Styles applied to the outer container.
   */
  containerStyle?: CSSProperties;

  /**
   * Ref to the underlying image element.
   */
  ref?: Ref<HTMLImageElement>;
};

export type {
  ImageProps,
  ImageSource,
  ImageSourceData,
  ImageSourceSet,
  ImageFit,
  ImageRadius,
  ImagePlaceholder,
};
