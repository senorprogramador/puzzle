import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type {
  CommerceImage,
  CommerceMoney,
  CommerceRating,
} from "../shared.types";
import type { ProductGridLabel } from "../product-grid/product-grid.types";

export type ProductDetailsVariant =
  | "split"
  | "gallery"
  | "editorial"
  | "tabs"
  | "accordion"
  | "specifications"
  | "features"
  | "comparison"
  | "compact"
  | "full-width"
  | "sticky"
  | "media-led";

export type ProductSpecification = {
  id: string;
  label: string;
  value: ReactNode;
};

export type ProductComparisonRow = {
  id: string;
  label: string;
  productValue: ReactNode;
  comparisonValue: ReactNode;
};

export type ProductDetailsComparison = {
  comparisonName: string;
  rows: readonly ProductComparisonRow[];
};

export type ProductDetailsData = {
  id: string;
  name: string;
  description?: ReactNode;
  media?: readonly CommerceImage[];
  price?: CommerceMoney;
  compareAtPrice?: CommerceMoney;
  rating?: CommerceRating;
  labels?: readonly ProductGridLabel[];
  availability?: ReactNode;
  variantSelector?: ReactNode;
  features?: readonly ReactNode[];
  specifications?: readonly ProductSpecification[];
  comparison?: ProductDetailsComparison;
  actions?: ReactNode;
};

export type ProductDetailsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ProductDetailsVariant;
    product: ProductDetailsData;
    locale?: string;
  };
