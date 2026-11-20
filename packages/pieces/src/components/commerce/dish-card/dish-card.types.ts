import type { ReactNode } from "react";
import type { DietaryInformationVariant } from "../dietary-information";
import type { RestaurantDish } from "../restaurant-menu.types";

export type DishCardVariant = "compact" | "standard" | "featured";
export type DishCardHeadingAs = "h3" | "h4" | "h5" | "h6";

export type DishCardProps = {
  dish: RestaurantDish;
  variant?: DishCardVariant;
  headingAs?: DishCardHeadingAs;
  locale?: string;
  featuredLabel?: ReactNode;
  popularLabel?: ReactNode;
  dietaryInformationVariant?: DietaryInformationVariant;
  showDietaryDetailsPopover?: boolean;
  mediaSlot?: ReactNode;
  contentSlot?: ReactNode;
  actions?: ReactNode;
  className?: string;
};
