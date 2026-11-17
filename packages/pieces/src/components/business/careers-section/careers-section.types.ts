import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessBenefit, BusinessCareerPosition } from "../shared.types";

export type CareersSectionVariant =
  | "list"
  | "grid"
  | "featured"
  | "departments"
  | "culture"
  | "split"
  | "benefits"
  | "editorial"
  | "cards"
  | "locations"
  | "compact"
  | "hiring";

export type CareersSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CareersSectionVariant;
    positions: readonly BusinessCareerPosition[];
    benefits?: readonly BusinessBenefit[];
    culture?: ReactNode;
    emptyState?: ReactNode;
    featuredPosition?: BusinessCareerPosition | string;
  };
