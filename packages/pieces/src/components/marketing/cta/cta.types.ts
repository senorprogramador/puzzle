import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type CTAVariant =
  | "centered"
  | "split"
  | "banner"
  | "card"
  | "full-width"
  | "image"
  | "background"
  | "gradient"
  | "newsletter"
  | "trial"
  | "download"
  | "contact"
  | "app"
  | "minimal"
  | "editorial"
  | "floating";

export type CTASectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CTAVariant;
    media?: ReactNode;
    primaryAction?: ReactNode;
    secondaryAction?: ReactNode;
  };
