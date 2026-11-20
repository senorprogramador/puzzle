import type { ReactNode } from "react";
import type { Allergen, DietaryTag } from "../restaurant-menu.types";

export type DietaryInformationVariant = "compact" | "expanded";

export type DietaryInformationProps = {
  tags?: readonly DietaryTag[];
  allergens?: readonly Allergen[];
  variant?: DietaryInformationVariant;
  dietaryHeading?: ReactNode;
  allergenHeading?: ReactNode;
  showDetailsPopover?: boolean;
  detailsLabel?: ReactNode;
  popoverTitle?: ReactNode;
  closeLabel?: string;
  className?: string;
};
