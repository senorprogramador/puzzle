import "./dashboard-navigation.css";

import { DashboardNavigation } from "./dashboard-navigation";
import type { DashboardMobileNavigationProps } from "./dashboard-navigation.types";

export const DashboardMobileNavigation = ({
  items,
  pathname,
  onNavigate,
  label = "Open navigation",
  className,
}: DashboardMobileNavigationProps) => (
  <details
    className={["puzzle-dashboard-mobile-navigation", className]
      .filter(Boolean)
      .join(" ")}
  >
    <summary className="puzzle-dashboard-mobile-navigation__trigger">
      {label}
    </summary>
    <DashboardNavigation
      items={items}
      pathname={pathname}
      onNavigate={onNavigate}
      label="Mobile navigation"
    />
  </details>
);
