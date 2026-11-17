import type { ElementType } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { BusinessDepartment, BusinessProfile } from "../shared.types";

export type TeamSectionVariant =
  | "grid"
  | "cards"
  | "featured"
  | "leadership"
  | "departments"
  | "horizontal"
  | "carousel"
  | "editorial"
  | "compact"
  | "asymmetric"
  | "profile"
  | "split";

export type TeamSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: TeamSectionVariant;
    items?: readonly BusinessProfile[];
    departments?: readonly BusinessDepartment[];
    featuredMember?: BusinessProfile | string;
  };
