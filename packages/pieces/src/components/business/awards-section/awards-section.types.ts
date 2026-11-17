import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessAward } from "../shared.types";

export type AwardsSectionVariant =
  | "grid"
  | "list"
  | "featured"
  | "badges"
  | "timeline"
  | "cards"
  | "logo-wall"
  | "split"
  | "compact"
  | "editorial";

export type AwardsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: AwardsSectionVariant;
    items: readonly BusinessAward[];
    featuredAward?: BusinessAward | string;
  };
