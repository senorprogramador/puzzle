import "./dashboard-navigation.css";

import type { DashboardTopbarProps } from "./dashboard-navigation.types";

export const DashboardTopbar = ({
  children,
  actions,
  className,
}: DashboardTopbarProps) => (
  <header
    className={["puzzle-dashboard-topbar", className].filter(Boolean).join(" ")}
  >
    <div className="puzzle-dashboard-topbar__content">{children}</div>
    {actions && (
      <div className="puzzle-dashboard-topbar__actions">{actions}</div>
    )}
  </header>
);
