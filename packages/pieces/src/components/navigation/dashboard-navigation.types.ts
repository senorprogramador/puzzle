import type { ReactNode } from "react";

export type DashboardNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  children?: readonly DashboardNavigationItem[];
};

export type DashboardNavigationProps = {
  items: readonly DashboardNavigationItem[];
  pathname?: string;
  onNavigate?: (href: string) => void;
  orientation?: "horizontal" | "vertical";
  collapsed?: boolean;
  label?: string;
  className?: string;
};

export type DashboardSidebarProps = {
  items: readonly DashboardNavigationItem[];
  pathname?: string;
  onNavigate?: (href: string) => void;
  label?: string;
  collapsed?: boolean;
  className?: string;
};

export type DashboardTopbarProps = {
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export type DashboardUserMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  label?: string;
  className?: string;
};

export type DashboardMobileNavigationProps = {
  items: readonly DashboardNavigationItem[];
  pathname?: string;
  onNavigate?: (href: string) => void;
  label?: string;
  className?: string;
};

export type DashboardBreadcrumbItem = {
  id: string;
  label: ReactNode;
  href?: string;
};

export type DashboardBreadcrumbsProps = {
  items: readonly DashboardBreadcrumbItem[];
  label?: string;
  onNavigate?: (href: string) => void;
  className?: string;
};
