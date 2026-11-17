import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { EditorialImage } from "../shared";

export type ContentSectionVariant =
  | "single-column"
  | "two-column"
  | "three-column"
  | "split"
  | "image-left"
  | "image-right"
  | "media"
  | "editorial"
  | "quote"
  | "narrow"
  | "wide"
  | "full-width";

export type ContentSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ContentSectionVariant;
    image?: EditorialImage;
    media?: ReactNode;
    columns?: readonly ReactNode[];
    sidebar?: ReactNode;
    attribution?: string;
  };
