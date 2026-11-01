"use client";

import { cn } from "@puzzle/core";
import {
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { BottomNavigation, BottomNavigationItem } from "../bottom-navigation";
import "./collapsable-sidebar.css";

type SidebarItemBase = {
  id: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
};

type WithLink = {
  href: string;
  onClick?: never;
};

type WithClickHandler = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  href?: never;
};

type CollapsableSidebarItem = SidebarItemBase & (WithLink | WithClickHandler);

type CollapsableSidebarExpansion = "inline" | "over";

type CollapsableSidebarProps = {
  items: CollapsableSidebarItem[];
  expand?: CollapsableSidebarExpansion;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const CollapsableSidebar = ({
  items,
  expand = "inline",
  collapsed: controlledCollapsed,
  defaultCollapsed = true,
  onCollapsedChange,
  ariaLabel = "Main navigation",
  className,
  style,
}: CollapsableSidebarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed;

    if (!isControlled) {
      setInternalCollapsed(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  };

  const classes = cn(
    "puzzle-collapsable-sidebar",
    `expand-${expand}`,
    collapsed && "collapsed",
    className,
  );

  return (
    <aside
      className={classes}
      data-collapsed={collapsed}
      data-expand={expand}
      style={style}
    >
      <nav
        className="puzzle-collapsable-sidebar__navigation"
        aria-label={ariaLabel}
      >
        <div className="puzzle-collapsable-sidebar__items">
          {items.map((item) => {
            const content = (
              <>
                <span
                  className="puzzle-collapsable-sidebar__icon"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>

                <span className="puzzle-collapsable-sidebar__label">
                  {item.label}
                </span>
              </>
            );

            const itemClassName = cn(
              "puzzle-collapsable-sidebar__item",
              item.active && "active",
            );

            if ("href" in item && item.href) {
              return (
                <a
                  key={item.id}
                  className={itemClassName}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  data-active={item.active || undefined}
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                className={itemClassName}
                onClick={item.onClick}
                aria-pressed={item.active}
                title={collapsed ? item.label : undefined}
                data-active={item.active || undefined}
              >
                {content}
              </button>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        className="puzzle-collapsable-sidebar__toggle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
      </button>

      <BottomNavigation
        className="puzzle-collapsable-sidebar__mobile"
        ariaLabel={ariaLabel}
      >
        {items.map((item) => (
          <BottomNavigationItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            href={"href" in item ? item.href : undefined}
            onClick={"onClick" in item ? item.onClick : undefined}
            active={item.active}
          />
        ))}
      </BottomNavigation>
    </aside>
  );
};

export {
  CollapsableSidebar,
  type CollapsableSidebarProps,
  type CollapsableSidebarItem,
  type CollapsableSidebarExpansion,
  type SidebarItemBase,
  type WithLink,
  type WithClickHandler,
};
