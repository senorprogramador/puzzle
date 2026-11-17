import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type PricingVariant =
  | "cards"
  | "horizontal"
  | "comparison"
  | "toggle"
  | "table"
  | "featured"
  | "compact"
  | "split"
  | "enterprise"
  | "usage-based"
  | "subscription"
  | "tiered"
  | "minimal"
  | "slider"
  | "calculator";

export type PricingBillingInterval = {
  id: string;
  label: string;
};

export type PricingPlanPrice = {
  intervalId?: string;
  amount: ReactNode;
  currency?: ReactNode;
  interval?: ReactNode;
  originalAmount?: ReactNode;
  discount?: ReactNode;
};

export type PricingFeature = {
  id: string;
  label: ReactNode;
  included?: boolean;
  value?: ReactNode;
};

export type PricingPlan = {
  id: string;
  name: string;
  description?: ReactNode;
  prices?: readonly PricingPlanPrice[];
  customPricing?: ReactNode;
  features?: readonly PricingFeature[];
  usage?: ReactNode;
  badge?: ReactNode;
  cta?: ReactNode;
  highlighted?: boolean;
};

export type PricingCalculator = {
  label: string;
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  unit?: ReactNode;
  formatValue?: (value: number) => ReactNode;
  renderEstimate?: (value: number) => ReactNode;
  onValueChange?: (value: number) => void;
};

export type PricingSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: PricingVariant;
    plans: readonly PricingPlan[];
    billingIntervals?: readonly PricingBillingInterval[];
    billingInterval?: string;
    defaultBillingInterval?: string;
    onBillingIntervalChange?: (intervalId: string) => void;
    calculator?: PricingCalculator;
  };
