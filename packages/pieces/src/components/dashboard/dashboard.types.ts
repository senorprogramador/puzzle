import type { ReactNode } from "react";

export type DashboardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export type DashboardStatCardTrend = {
  value: ReactNode;
  label: ReactNode;
  direction?: "positive" | "negative" | "neutral";
};

export type DashboardStatCardProps = {
  label: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trend?: DashboardStatCardTrend;
  action?: ReactNode;
  loading?: boolean;
  className?: string;
};

export type DashboardStatGroupProps = {
  children: ReactNode;
  label?: string;
  columns?: 2 | 3 | 4;
  className?: string;
};

export type DashboardActivityItem = {
  id: string;
  description: ReactNode;
  timestamp: ReactNode;
  dateTime?: string;
  avatar?: ReactNode;
  href?: string;
};

export type DashboardActivityFeedProps = {
  items: readonly DashboardActivityItem[];
  title?: ReactNode;
  emptyState?: ReactNode;
  renderItem?: (item: DashboardActivityItem) => ReactNode;
  className?: string;
};

export type DashboardProgressCardProps = {
  title: ReactNode;
  description?: ReactNode;
  value: number;
  status?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export type DashboardShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  topbar?: ReactNode;
  sidebarLabel?: string;
  className?: string;
};
