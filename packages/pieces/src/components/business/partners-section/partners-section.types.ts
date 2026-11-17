import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessPartner } from "../shared.types";

export type PartnersSectionVariant =
  | "grid"
  | "logo-wall"
  | "featured"
  | "categories"
  | "cards"
  | "network"
  | "split"
  | "carousel"
  | "ecosystem"
  | "minimal";

export type PartnersSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: PartnersSectionVariant;
    items: readonly BusinessPartner[];
    featuredPartner?: BusinessPartner | string;
  };
