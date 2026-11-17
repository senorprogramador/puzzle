import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type ResourceSectionVariant =
  | "grid"
  | "featured"
  | "downloads"
  | "categories"
  | "list"
  | "cards"
  | "library"
  | "split"
  | "filterable"
  | "webinars";

export type ResourceItem = {
  id: string;
  title: string;
  description?: ReactNode;
  category?: string;
  type?: string;
  href: string;
  download?: boolean | string;
  featured?: boolean;
  thumbnail?: ReactNode;
  updatedAt?: string;
};

export type ResourceSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ResourceSectionVariant;
    items: readonly ResourceItem[];
    featuredResourceId?: string;
    searchable?: boolean;
    filterable?: boolean;
    emptyState?: ReactNode;
  };
