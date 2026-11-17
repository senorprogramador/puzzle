import type { MouseEvent } from "react";

import "./dashboard-navigation.css";

import type { DashboardBreadcrumbsProps } from "./dashboard-navigation.types";

const handleNavigation =
  (href: string, onNavigate?: (href: string) => void) =>
  (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !onNavigate ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onNavigate(href);
  };

export const DashboardBreadcrumbs = ({
  items,
  label = "Breadcrumb",
  onNavigate,
  className,
}: DashboardBreadcrumbsProps) => (
  <nav
    className={["puzzle-dashboard-breadcrumbs", className]
      .filter(Boolean)
      .join(" ")}
    aria-label={label}
  >
    <ol className="puzzle-dashboard-breadcrumbs__list">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <li className="puzzle-dashboard-breadcrumbs__item" key={item.id}>
            {item.href && !isCurrent ? (
              <a
                href={item.href}
                onClick={handleNavigation(item.href, onNavigate)}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current={isCurrent ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
