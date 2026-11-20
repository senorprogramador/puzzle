import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceMoney } from "../shared.types";

export type RatePlanService = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
};

type RatePlanBase = {
  id: string;
  name: ReactNode;
  description?: ReactNode;
  arrangement?: ReactNode;
  pricePerNight: CommerceMoney;
  weeklyPrice?: CommerceMoney;
  includedServices?: readonly RatePlanService[];
  cancellation?: ReactNode;
  featured?: boolean;
  recommendedLabel?: ReactNode;
  disabled?: boolean;
};

export type RatePlan = RatePlanBase &
  (
    | {
        action: ReactNode;
        onSelect?: never;
        actionLabel?: never;
      }
    | {
        action?: never;
        onSelect: () => void;
        actionLabel?: ReactNode;
      }
  );

export type RatePlansSectionProps = MarketingSectionBaseProps<"section"> & {
  plans: readonly RatePlan[];
  locale?: string;
  recommendedLabel?: ReactNode;
  selectLabel?: ReactNode;
  emptyState?: ReactNode;
};
