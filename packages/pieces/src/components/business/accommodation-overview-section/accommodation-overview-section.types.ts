import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { AccommodationOverviewItem } from "../accommodation.types";

export type AccommodationOverviewVariant = "grid" | "list" | "carousel";

export type AccommodationOverviewSectionProps<
  C extends ElementType = "section",
> = MarketingSectionBaseProps<C> & {
  variant?: AccommodationOverviewVariant;
  items: readonly AccommodationOverviewItem[];
  locale?: string;
};
