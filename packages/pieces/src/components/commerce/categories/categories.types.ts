import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceImage } from "../shared.types";

export type CategoriesVariant =
  | "grid"
  | "image-grid"
  | "cards"
  | "horizontal"
  | "carousel"
  | "editorial"
  | "featured"
  | "split"
  | "list"
  | "compact";

export type CategoryItem = {
  id: string;
  title: string;
  image?: CommerceImage;
  description?: ReactNode;
  href?: string;
  featured?: boolean;
};

export type CategoriesSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CategoriesVariant;
    items: readonly CategoryItem[];
  };
