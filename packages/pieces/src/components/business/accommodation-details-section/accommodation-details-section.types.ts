import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { AccommodationDetails } from "../accommodation.types";

export type AccommodationDetailsVariant = "split" | "stacked";

export type AccommodationDetailsSectionProps<
  C extends ElementType = "section",
> = MarketingSectionBaseProps<C> & {
  variant?: AccommodationDetailsVariant;
  accommodation: AccommodationDetails;
  media?: ReactNode;
  facilities?: ReactNode;
};
