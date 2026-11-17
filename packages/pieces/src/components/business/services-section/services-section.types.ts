import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessService } from "../shared.types";

export type ServicesSectionVariant =
  | "grid"
  | "cards"
  | "list"
  | "split"
  | "alternating"
  | "featured"
  | "icons"
  | "numbered"
  | "pricing"
  | "editorial"
  | "categorized"
  | "carousel";

export type ServicesSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: ServicesSectionVariant;
    items: readonly BusinessService[];
    featuredService?: BusinessService | string;
  };
