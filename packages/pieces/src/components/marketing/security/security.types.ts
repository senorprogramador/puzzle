import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type SecurityVariant =
  | "grid"
  | "badges"
  | "compliance"
  | "split"
  | "certifications"
  | "checklist"
  | "cards"
  | "featured"
  | "dark"
  | "metrics"
  | "audit"
  | "trust-center";

export type SecurityItem = {
  id: string;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  category?: string;
  label?: ReactNode;
  value?: ReactNode;
  href?: string;
  featured?: boolean;
};

export type SecuritySectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: SecurityVariant;
    items: readonly SecurityItem[];
    auditInfo?: ReactNode;
  };
