import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { EditorialImage } from "../shared";

export type GallerySectionVariant =
  | "grid"
  | "masonry"
  | "justified"
  | "bento"
  | "featured"
  | "carousel"
  | "collage"
  | "editorial"
  | "fullscreen"
  | "thumbnails"
  | "horizontal"
  | "vertical"
  | "asymmetric"
  | "mixed"
  | "portfolio";

export type GalleryItem = {
  id: string;
  image: EditorialImage;
  caption?: ReactNode;
  href?: string;
  featured?: boolean;
};

export type GallerySectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: GallerySectionVariant;
    items: readonly GalleryItem[];
    lightbox?: boolean;
  };
