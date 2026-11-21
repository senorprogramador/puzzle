import type { CSSProperties } from "react";

type ImageBoxImage = {
  src: string;
  alt: string;
  title?: string;
};

type ImageBoxProps = {
  images: ImageBoxImage[];
  aspectRatio?: number;
  gap?: number | string;
  radius?: number | string;
  className?: string;
  /** Forward unoptimized to a configured framework image component. */
  unoptimized?: boolean;
  onImageClick?: (image: ImageBoxImage, index: number) => void;
  onViewAll?: () => void;
};

type ImageBoxStyle = CSSProperties & {
  "--puzzle-image-box-aspect-ratio": string;
  "--puzzle-image-box-gap"?: string;
  "--puzzle-image-box-radius"?: string;
};

type ImageBoxSupportingStyle = CSSProperties & {
  "--puzzle-image-box-rows": number;
};

export type {
  ImageBoxImage,
  ImageBoxProps,
  ImageBoxStyle,
  ImageBoxSupportingStyle,
};
