import type { ReactNode } from "react";
import type { CommerceImage, CommerceMoney } from "./shared.types";

export type DietaryInformationItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
};

export type DietaryTag = DietaryInformationItem;
export type Allergen = DietaryInformationItem;

export type RestaurantDish = {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  price: CommerceMoney;
  image?: CommerceImage;
  dietaryTags?: readonly DietaryTag[];
  allergens?: readonly Allergen[];
  featured?: boolean;
  popular?: boolean;
  portionSize?: ReactNode;
};

export type RestaurantMenuCategory = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  dishes: readonly RestaurantDish[];
};

export type RestaurantMenu = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  categories: readonly RestaurantMenuCategory[];
};

export type RestaurantMenuDietaryFilter = {
  id: string;
  label: string;
};
