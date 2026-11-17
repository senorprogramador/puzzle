import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessCaseStudy } from "../shared.types";

export type CaseStudiesSectionVariant =
  | "grid"
  | "featured"
  | "split"
  | "masonry"
  | "carousel"
  | "editorial"
  | "metrics"
  | "before-after"
  | "cards"
  | "list"
  | "portfolio"
  | "bento"
  | "horizontal";

export type CaseStudiesSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CaseStudiesSectionVariant;
    items: readonly BusinessCaseStudy[];
    featuredCase?: BusinessCaseStudy | string;
  };
