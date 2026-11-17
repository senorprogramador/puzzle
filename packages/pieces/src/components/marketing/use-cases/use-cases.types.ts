import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type UseCasesVariant =
  | "grid"
  | "cards"
  | "tabs"
  | "split"
  | "alternating"
  | "persona"
  | "industry"
  | "bento"
  | "featured"
  | "list"
  | "editorial"
  | "carousel"
  | "categorized";

export type UseCaseItem = {
  id: string;
  title: string;
  description?: ReactNode;
  persona?: string;
  industry?: string;
  category?: string;
  benefits?: readonly ReactNode[];
  media?: ReactNode;
  action?: ReactNode;
  featured?: boolean;
};

export type UseCasesSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: UseCasesVariant;
    items: readonly UseCaseItem[];
    filterable?: boolean;
  };
