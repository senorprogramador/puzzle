import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type IntegrationsVariant =
  | "grid"
  | "categorized"
  | "featured"
  | "ecosystem"
  | "orbit"
  | "network"
  | "carousel"
  | "list"
  | "grouped"
  | "split"
  | "logo-wall"
  | "connected";

export type IntegrationItem = {
  id: string;
  name: string;
  logo?: ReactNode;
  category?: string;
  description?: ReactNode;
  href?: string;
  featured?: boolean;
};

export type IntegrationsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: IntegrationsVariant;
    items: readonly IntegrationItem[];
    filterable?: boolean;
    centerLabel?: ReactNode;
  };
