import "./dashboard-navigation.css";

import type { DashboardUserMenuProps } from "./dashboard-navigation.types";

export const DashboardUserMenu = ({
  trigger,
  children,
  label = "User menu",
  className,
}: DashboardUserMenuProps) => (
  <details
    className={["puzzle-dashboard-user-menu", className]
      .filter(Boolean)
      .join(" ")}
  >
    <summary className="puzzle-dashboard-user-menu__trigger" aria-label={label}>
      {trigger}
    </summary>
    <div className="puzzle-dashboard-user-menu__content">{children}</div>
  </details>
);
