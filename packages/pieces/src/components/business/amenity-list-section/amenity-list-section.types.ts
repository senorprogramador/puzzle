import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { AmenityCategory } from "../accommodation.types";

export type AmenityListVariant = "compact" | "expanded";
export type AmenityListLayout = "grid" | "list";

export type AmenityListSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: AmenityListVariant;
    layout?: AmenityListLayout;
    categories: readonly AmenityCategory[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
  };
