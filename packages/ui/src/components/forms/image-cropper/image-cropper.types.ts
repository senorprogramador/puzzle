import type { ComponentPropsWithRef } from "react";

import type { NormalizedImageRect } from "../image-editor.types";

type ImageCrop = NormalizedImageRect;
type ImageCropAspectRatio = number | "free";

type ImageCropAspectRatioPreset = {
  label: string;
  value: ImageCropAspectRatio;
};

type ImageCropperProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange" | "value" | "defaultValue" | "src"
> & {
  /** Source image URL. The component does not fetch, upload, or persist it. */
  src: string;

  /** Alternative text for the source image. */
  alt: string;

  /** Accessible name for the cropper group. */
  label?: string;

  /** Controlled crop rectangle, normalized to the source image bounds. */
  value?: ImageCrop;

  /** Initial crop rectangle for uncontrolled usage. */
  defaultValue?: ImageCrop;

  /** Called with a normalized crop whenever it changes. */
  onChange?: (crop: ImageCrop) => void;

  /** Active output aspect ratio, or "free" for unconstrained resizing. */
  aspectRatio?: ImageCropAspectRatio;

  /** Aspect-ratio buttons shown above the image. */
  aspectRatioPresets?: readonly ImageCropAspectRatioPreset[];

  /** Called when the selected aspect-ratio preset changes. */
  onAspectRatioChange?: (aspectRatio: ImageCropAspectRatio) => void;

  /** Maximum selectable zoom. Defaults to 3. */
  maxZoom?: number;

  /** Whether the cropper is disabled. */
  disabled?: boolean;

  /** Class applied to the outer cropper element. */
  className?: string;
};

export type {
  ImageCrop,
  ImageCropAspectRatio,
  ImageCropAspectRatioPreset,
  ImageCropperProps,
};
