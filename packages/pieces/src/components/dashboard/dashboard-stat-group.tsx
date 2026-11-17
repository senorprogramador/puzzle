import "./dashboard.css";

import type { DashboardStatGroupProps } from "./dashboard.types";

export const DashboardStatGroup = ({
  children,
  label = "Dashboard statistics",
  columns = 3,
  className,
}: DashboardStatGroupProps) => (
  <section
    className={["puzzle-dashboard-stat-group", className]
      .filter(Boolean)
      .join(" ")}
    data-columns={columns}
    aria-label={label}
  >
    {children}
  </section>
);
