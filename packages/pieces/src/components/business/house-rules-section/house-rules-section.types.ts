import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type HouseRule = {
  id: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
};

export type HouseRuleCategory = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  rules: readonly HouseRule[];
};

export type HouseRulesVariant = "compact" | "expanded";

export type HouseRulesSectionProps = MarketingSectionBaseProps<"section"> & {
  categories: readonly HouseRuleCategory[];
  variant?: HouseRulesVariant;
  collapsible?: boolean;
  defaultOpen?: boolean;
  emptyState?: ReactNode;
};
