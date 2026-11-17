import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type ComparisonVariant =
  | "table"
  | "cards"
  | "split"
  | "versus"
  | "checklist"
  | "feature-matrix"
  | "pricing"
  | "highlighted"
  | "horizontal"
  | "vertical"
  | "compact"
  | "interactive";

export type ComparisonOption = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  featured?: boolean;
};

export type ComparisonFeature = {
  id: string;
  label: ReactNode;
  values: Readonly<
    Record<string, boolean | string | number | ReactNode | null | undefined>
  >;
};

type ComparisonSectionBaseProps<C extends ElementType> =
  MarketingSectionBaseProps<C> & {
    options: readonly ComparisonOption[];
    features: readonly ComparisonFeature[];
    highlightedOptionId?: string;
    comparisonLabel?: string;
  };

export type ComparisonSectionProps<C extends ElementType = "section"> =
  ComparisonSectionBaseProps<C> &
    (
      | {
          variant: "interactive";
          selectedOptionId?: string;
          defaultSelectedOptionId?: string;
          onSelectionChange?: (optionId: string) => void;
        }
      | {
          variant?: Exclude<ComparisonVariant, "interactive">;
          selectedOptionId?: never;
          defaultSelectedOptionId?: never;
          onSelectionChange?: never;
        }
    );
