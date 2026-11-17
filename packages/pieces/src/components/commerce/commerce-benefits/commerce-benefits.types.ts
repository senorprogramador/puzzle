import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type CommerceBenefitsVariant =
  | "grid"
  | "inline"
  | "icons"
  | "cards"
  | "banner"
  | "split"
  | "compact"
  | "trust"
  | "shipping"
  | "service";

export type CommerceBenefitKind =
  | "shipping"
  | "returns"
  | "warranty"
  | "secure-checkout"
  | "service";

export type CommerceBenefitItem = {
  id: string;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  kind?: CommerceBenefitKind;
  label?: ReactNode;
  href?: string;
  action?: ReactNode;
};

export type CommerceBenefitsSectionProps<
  C extends ElementType = "section",
> = MarketingSectionBaseProps<C> & {
  variant?: CommerceBenefitsVariant;
  items: readonly CommerceBenefitItem[];
};
