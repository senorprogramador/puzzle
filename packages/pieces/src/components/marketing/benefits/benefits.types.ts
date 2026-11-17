import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type BenefitsVariant =
  | "grid"
  | "split"
  | "list"
  | "cards"
  | "icons"
  | "numbered"
  | "alternating"
  | "checklist"
  | "editorial"
  | "featured"
  | "compact"
  | "comparison";

export type BenefitItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
  action?: ReactNode;
  featured?: boolean;
};

export type BenefitsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: BenefitsVariant;
    items: readonly BenefitItem[];
  };
