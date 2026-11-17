import "./dashboard.css";

import type { DashboardShellProps } from "./dashboard.types";

export const DashboardShell = ({
  children,
  sidebar,
  topbar,
  sidebarLabel = "Sidebar",
  className,
}: DashboardShellProps) => (
  <div
    className={["puzzle-dashboard-shell", className].filter(Boolean).join(" ")}
    data-has-sidebar={sidebar ? "true" : "false"}
  >
    {topbar && (
      <div className="puzzle-dashboard-shell__topbar">{topbar}</div>
    )}
    <div className="puzzle-dashboard-shell__layout">
      {sidebar && (
        <aside
          className="puzzle-dashboard-shell__sidebar"
          aria-label={sidebarLabel}
        >
          {sidebar}
        </aside>
      )}
      <main className="puzzle-dashboard-shell__main">{children}</main>
    </div>
  </div>
);
