import type { ReactNode } from "react";

export type ActivitySectionVariant =
  | "timeline"
  | "list"
  | "feed"
  | "grouped"
  | "cards"
  | "compact"
  | "avatars"
  | "audit"
  | "split"
  | "horizontal";

export type ActivityItem = {
  id: string;
  actor?: ReactNode;
  action?: ReactNode;
  timestamp: ReactNode;
  dateTime?: string;
  icon?: ReactNode;
  description?: ReactNode;
  metadata?: ReactNode;
  group?: string;
  groupLabel?: ReactNode;
  category?: string;
  href?: string;
};

export type ActivitySectionProps = {
  items: readonly ActivityItem[];
  title?: ReactNode;
  emptyState?: ReactNode;
  actions?: ReactNode;
  variant?: ActivitySectionVariant;
  renderItem?: (item: ActivityItem) => ReactNode;
  className?: string;
};
