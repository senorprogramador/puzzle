"use client";

import { cn } from "@puzzle/core";
import { Link } from "../../navigation/link";
import {
  useId,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import "./collapsable-sidebar.css";
import { Text } from "../../typography/text";

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

type CollapsableSidebarGroup = {
  id: string;
  label?: string;
  items: CollapsableSidebarItem[];
};

type CollapsableSidebarEntry = CollapsableSidebarItem | CollapsableSidebarGroup;

type CollapsableSidebarExpansion = "inline" | "over";

type CollapsableSidebarProps = {
  items: CollapsableSidebarEntry[];
  expand?: CollapsableSidebarExpansion;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const isSidebarGroup = (
  entry: CollapsableSidebarEntry,
): entry is CollapsableSidebarGroup => "items" in entry;

type SidebarItemRendererProps = {
  item: CollapsableSidebarItem;
  collapsed: boolean;
};

const SidebarItemRenderer = ({ item, collapsed }: SidebarItemRendererProps) => {
  const className = cn(
    "puzzle-collapsable-sidebar__item",
    item.active && "active",
  );

  const content = (
    <>
      <span className="puzzle-collapsable-sidebar__icon" aria-hidden="true">
        {item.icon}
      </span>

      <span className="puzzle-collapsable-sidebar__label">{item.label}</span>
    </>
  );

  if ("href" in item && item.href !== undefined) {
    return (
      <Link
        className={className}
        href={item.href}
        aria-current={item.active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        data-active={item.active || undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={item.onClick}
      title={collapsed ? item.label : undefined}
      data-active={item.active || undefined}
    >
      {content}
    </button>
  );
};

type SidebarGroupRendererProps = {
  group: CollapsableSidebarGroup;
  collapsed: boolean;
  idPrefix: string;
};

const SidebarGroupRenderer = ({
  group,
  collapsed,
  idPrefix,
}: SidebarGroupRendererProps) => {
  const headingId = `${idPrefix}-${group.id}`;

  return (
    <section
      className="puzzle-collapsable-sidebar__group"
      aria-labelledby={group.label ? headingId : undefined}
    >
      {group.label && (
        <Text
          id={headingId}
          type="overline"
          as="h2"
          className="puzzle-collapsable-sidebar__group-label"
        >
          {group.label}
        </Text>
      )}

      <div className="puzzle-collapsable-sidebar__group-items">
        {group.items.map((item) => (
          <SidebarItemRenderer
            key={item.id}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </div>
    </section>
  );
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

  const idPrefix = `puzzle-sidebar-${useId()}`;

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
      <button
        type="button"
        className="puzzle-collapsable-sidebar__toggle"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        aria-controls={`${idPrefix}-navigation`}
      >
        <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
      </button>

      <nav
        id={`${idPrefix}-navigation`}
        className="puzzle-collapsable-sidebar__navigation"
        aria-label={ariaLabel}
      >
        <div className="puzzle-collapsable-sidebar__sections">
          {items.map((entry) =>
            isSidebarGroup(entry) ? (
              <SidebarGroupRenderer
                key={entry.id}
                group={entry}
                collapsed={collapsed}
                idPrefix={idPrefix}
              />
            ) : (
              <div
                key={entry.id}
                className="puzzle-collapsable-sidebar__group-items"
              >
                <SidebarItemRenderer item={entry} collapsed={collapsed} />
              </div>
            ),
          )}
        </div>
      </nav>
    </aside>
  );
};

export {
  CollapsableSidebar,
  type CollapsableSidebarProps,
  type CollapsableSidebarItem,
  type CollapsableSidebarGroup,
  type CollapsableSidebarEntry,
  type CollapsableSidebarExpansion,
  type SidebarItemBase,
  type WithLink,
  type WithClickHandler,
};
