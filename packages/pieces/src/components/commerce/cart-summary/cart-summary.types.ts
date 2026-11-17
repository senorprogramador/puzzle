import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceImage, CommerceMoney } from "../shared.types";

export type CartSummaryVariant =
  | "sidebar"
  | "compact"
  | "full"
  | "card"
  | "sticky"
  | "checkout"
  | "split"
  | "minimal"
  | "detailed"
  | "mobile";

export type CartSummaryItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: CommerceMoney;
  lineTotal?: CommerceMoney;
  image?: CommerceImage;
  description?: ReactNode;
  href?: string;
};

export type CartSummaryAdjustment = {
  id: string;
  label: string;
  amount: CommerceMoney;
};

export type CartSummaryTotals = {
  subtotal?: CommerceMoney;
  discounts?: readonly CartSummaryAdjustment[];
  shipping?: CommerceMoney;
  total?: CommerceMoney;
};

export type CartSummarySectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: CartSummaryVariant;
    items: readonly CartSummaryItem[];
    totals?: CartSummaryTotals;
    emptyState?: ReactNode;
    locale?: string;
  };
