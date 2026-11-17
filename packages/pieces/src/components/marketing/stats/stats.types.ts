import type { ElementType, ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../shared";

export type StatsVariant =
  | "grid"
  | "inline"
  | "cards"
  | "split"
  | "centered"
  | "featured"
  | "horizontal"
  | "vertical"
  | "dashboard"
  | "comparison"
  | "progress"
  | "animated";

export type StatTrend = {
  direction: "up" | "down" | "neutral";
  label: ReactNode;
};

export type StatItem = {
  id: string;
  label: ReactNode;
  value: number | string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
  trend?: StatTrend;
  progress?: number;
  featured?: boolean;
};

export type StatsSectionProps<C extends ElementType = "section"> =
  MarketingSectionBaseProps<C> & {
    variant?: StatsVariant;
    items: readonly StatItem[];
  };
