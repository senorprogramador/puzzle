import type { ElementType, ReactNode } from "react";
import type { MediaFrameType } from "@puzzle-ui/ui";
import type { MarketingSectionBaseProps } from "../shared";

export type ProductShowcaseVariant =
  | "split"
  | "centered"
  | "browser"
  | "desktop"
  | "mobile"
  | "device-stack"
  | "gallery"
  | "tabs"
  | "carousel"
  | "sticky"
  | "bento"
  | "full-width"
  | "layered"
  | "editorial"
  | "video"
  | "interactive";

export type ProductShowcaseAnnotation = {
  id: string;
  label: string;
  description: ReactNode;
};

export type ProductShowcaseItem = {
  id: string;
  title: ReactNode;
  media: ReactNode;
  description?: ReactNode;
  caption?: ReactNode;
  frame?: MediaFrameType;
  annotations?: readonly ProductShowcaseAnnotation[];
  action?: ReactNode;
  featured?: boolean;
};

export type ProductShowcaseSectionProps<
  C extends ElementType = "section",
> = MarketingSectionBaseProps<C> & {
  variant?: ProductShowcaseVariant;
  items: readonly ProductShowcaseItem[];
};
