import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { DietaryInformationVariant } from "../dietary-information";
import type { DishCardVariant } from "../dish-card";
import type {
  RestaurantMenu,
  RestaurantMenuDietaryFilter,
} from "../restaurant-menu.types";

export type RestaurantMenuSectionProps =
  MarketingSectionBaseProps<"section"> & {
    menus: readonly RestaurantMenu[];
    locale?: string;
    cardVariant?: DishCardVariant;
    dietaryInformationVariant?: DietaryInformationVariant;
    showDietaryDetailsPopover?: boolean;
    featuredLabel?: ReactNode;
    popularLabel?: ReactNode;
    dietaryFilters?: readonly RestaurantMenuDietaryFilter[];
    selectedDietaryTagId?: string | null;
    onDietaryFilterChange?: (tagId: string | null) => void;
    categoryNavigationLabel?: string;
    filterLabel?: ReactNode;
    allDishesLabel?: ReactNode;
    emptyState?: ReactNode;
    filterEmptyState?: ReactNode;
  };
