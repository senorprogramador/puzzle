import { DashboardNavigation } from "./dashboard-navigation";
import type { DashboardSidebarProps } from "./dashboard-navigation.types";

export const DashboardSidebar = ({
  items,
  pathname,
  onNavigate,
  label = "Workspace navigation",
  collapsed = false,
  className,
}: DashboardSidebarProps) => (
  <DashboardNavigation
    items={items}
    pathname={pathname}
    onNavigate={onNavigate}
    label={label}
    collapsed={collapsed}
    className={["puzzle-dashboard-sidebar", className]
      .filter(Boolean)
      .join(" ")}
  />
);
