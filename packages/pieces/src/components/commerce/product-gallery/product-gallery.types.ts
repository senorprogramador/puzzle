import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceImage } from "../shared.types";

export type ProductGalleryVariant =
  | "grid"
  | "masonry"
  | "featured"
  | "carousel"
  | "thumbnails"
  | "split"
  | "editorial"
  | "fullscreen"
  | "stacked"
  | "collage"
  | "horizontal"
  | "vertical";

export type ProductGalleryImage = CommerceImage & {
  id: string;
  caption?: string;
};

export type ProductGallerySectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ProductGalleryVariant;
    images: readonly ProductGalleryImage[];
    initialImageId?: string;
    lightbox?: boolean;
    zoom?: boolean;
  };
