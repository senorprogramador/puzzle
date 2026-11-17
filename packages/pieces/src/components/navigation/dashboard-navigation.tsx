import type { MouseEvent } from "react";

import "./dashboard-navigation.css";

import type {
  DashboardNavigationItem,
  DashboardNavigationProps,
} from "./dashboard-navigation.types";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

const isItemActive = (href: string, pathname?: string) => {
  if (!pathname) {
    return false;
  }

  const target = normalizePath(href);
  const current = normalizePath(pathname);

  return current === target || (target !== "/" && current.startsWith(`${target}/`));
};

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

const NavigationItems = ({
  items,
  pathname,
  onNavigate,
  collapsed,
}: {
  items: readonly DashboardNavigationItem[];
  pathname?: string;
  onNavigate?: (href: string) => void;
  collapsed?: boolean;
}) => (
  <ul className="puzzle-dashboard-navigation__list">
    {items.map((item) => {
      const active = isItemActive(item.href, pathname);

      return (
        <li className="puzzle-dashboard-navigation__item" key={item.id}>
          <a
            className="puzzle-dashboard-navigation__link"
            href={item.href}
            aria-label={collapsed ? item.label : undefined}
            aria-current={
              pathname && normalizePath(item.href) === normalizePath(pathname)
                ? "page"
                : undefined
            }
            data-active={active || undefined}
            onClick={handleNavigation(item.href, onNavigate)}
          >
            {item.icon && (
              <span
                className="puzzle-dashboard-navigation__icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <span className="puzzle-dashboard-navigation__label">
                {item.label}
              </span>
            )}
          </a>
          {item.children && item.children.length > 0 && !collapsed && (
            <NavigationItems
              items={item.children}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          )}
        </li>
      );
    })}
  </ul>
);

export const DashboardNavigation = ({
  items,
  pathname,
  onNavigate,
  orientation = "vertical",
  collapsed = false,
  label = "Dashboard navigation",
  className,
}: DashboardNavigationProps) => (
  <nav
    className={["puzzle-dashboard-navigation", className]
      .filter(Boolean)
      .join(" ")}
    data-orientation={orientation}
    data-collapsed={collapsed || undefined}
    aria-label={label}
  >
    <NavigationItems
      items={items}
      pathname={pathname}
      onNavigate={onNavigate}
      collapsed={collapsed}
    />
  </nav>
);
