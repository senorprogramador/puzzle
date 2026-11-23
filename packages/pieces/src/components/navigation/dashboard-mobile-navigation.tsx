import "./dashboard-navigation.css";

import { useRef } from "react";
import { DashboardNavigation } from "./dashboard-navigation";
import type { DashboardMobileNavigationProps } from "./dashboard-navigation.types";

export const DashboardMobileNavigation = ({
  items,
  pathname,
  onNavigate,
  label = "Open navigation",
  className,
}: DashboardMobileNavigationProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const handleNavigate = onNavigate
    ? (href: string) => {
        detailsRef.current?.removeAttribute("open");
        onNavigate(href);
      }
    : undefined;

  return (
    <details
      ref={detailsRef}
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
        onNavigate={handleNavigate}
        label="Mobile navigation"
      />
    </details>
  );
};
