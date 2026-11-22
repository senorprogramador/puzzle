import type { ReactNode } from "react";

export type SiteHeaderVariant =
  | "default"
  | "transparent"
  | "overlay"
  | "minimal"
  | "centered";

export type SiteNavigationItem = {
  id: string;
  label: ReactNode;
  href?: string;
  description?: ReactNode;
  children?: readonly SiteNavigationItem[];
  disabled?: boolean;
  external?: boolean;
  active?: boolean;
};

export type SiteHeaderProps = {
  logo: ReactNode;
  items?: readonly SiteNavigationItem[];
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  localeSwitcher?: ReactNode;
  utilityNavigation?: ReactNode;
  variant?: SiteHeaderVariant;
  sticky?: boolean;
  scrolled?: boolean;
  mobileMenuTrigger?: ReactNode;
  mobileMenuLabel?: string;
  mobileMenuTitle?: ReactNode;
  closeLabel?: string;
  navigationLabel?: string;
  className?: string;
};
