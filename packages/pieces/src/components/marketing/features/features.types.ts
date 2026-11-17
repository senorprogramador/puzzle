import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type FeaturesVariant =
  | "grid"
  | "bento"
  | "alternating"
  | "split"
  | "cards"
  | "icons"
  | "numbered"
  | "tabs"
  | "accordion"
  | "sticky"
  | "horizontal"
  | "vertical"
  | "media-grid"
  | "asymmetric"
  | "editorial"
  | "compact"
  | "full-width";

export type FeatureItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
  action?: ReactNode;
  content?: ReactNode;
  featured?: boolean;
};

export type FeaturesSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: FeaturesVariant;
    items: readonly FeatureItem[];
  };
