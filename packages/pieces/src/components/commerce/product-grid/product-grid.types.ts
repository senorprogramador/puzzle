import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceImage, CommerceMoney, CommerceRating } from "../shared.types";

export type ProductGridVariant =
  | "grid"
  | "masonry"
  | "featured"
  | "horizontal"
  | "carousel"
  | "compact"
  | "editorial"
  | "collection"
  | "category"
  | "list"
  | "asymmetric"
  | "bento"
  | "mixed"
  | "minimal";

export type ProductGridLabel = {
  id: string;
  content: ReactNode;
};

export type ProductGridItem = {
  id: string;
  name: string;
  price: CommerceMoney;
  image?: CommerceImage;
  compareAtPrice?: CommerceMoney;
  labels?: readonly ProductGridLabel[];
  rating?: CommerceRating;
  description?: ReactNode;
  category?: string;
  collection?: string;
  href?: string;
  action?: ReactNode;
  featured?: boolean;
};

export type ProductGridSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ProductGridVariant;
    items: readonly ProductGridItem[];
    locale?: string;
  };
