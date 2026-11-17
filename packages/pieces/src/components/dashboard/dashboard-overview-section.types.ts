import type { ReactNode } from "react";

export type DashboardOverviewSectionVariant =
  | "grid"
  | "cards"
  | "metrics"
  | "split"
  | "compact"
  | "analytics"
  | "welcome"
  | "activity"
  | "full-width"
  | "executive";

export type DashboardOverviewSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  variant?: DashboardOverviewSectionVariant;
  summary?: ReactNode;
  metrics?: ReactNode;
  charts?: ReactNode;
  dateRange?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  error?: ReactNode;
  className?: string;
};
