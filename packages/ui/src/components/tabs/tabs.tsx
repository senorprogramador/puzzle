"use client";

import { cn } from "@puzzle/core";
import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import "./tabs.css";

type TabElement = ReactElement<TabsTabProps, typeof TabsTab>;

const isTabElement = (child: ReactNode): child is TabElement =>
  isValidElement<TabsTabProps>(child) && child.type === TabsTab;

type TabsPosition = "top" | "bottom" | "left" | "right";

type TabsTabProps = {
  /** Unique identifier of the tab. */
  id: string;

  /** Content rendered inside the tab trigger. */
  tab: ReactNode;

  /** Content rendered inside the tab panel. */
  children: ReactNode;
};

type TabsProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  /** Position of the tab navigation. Defaults to top. */
  tabBarPosition?: TabsPosition;

  /** Initially active tab. Defaults to the first tab. */
  initialActiveId?: string;

  /** Active tab for controlled usage. */
  activeId?: string;

  /** Called whenever a tab is activated. */
  onActivate?: (tabId: string) => void;

  /** Keep all tab panel contents mounted. Defaults to false. */
  forceMountContent?: boolean;

  children: ReactNode;
};

const TabsTab = ({ children }: TabsTabProps) => <>{children}</>;

const TabsRoot = ({
  tabBarPosition = "top",
  initialActiveId,
  activeId,
  onActivate,
  forceMountContent = false,
  children,
  className,
  ...rootProps
}: TabsProps) => {
  const generatedId = useId();
  const isControlled = activeId !== undefined;

  const tabs = Children.toArray(children).filter(isTabElement);

  const firstTabId = tabs[0]?.props.id;

  const [uncontrolledActiveId, setUncontrolledActiveId] = useState<
    string | undefined
  >(() => initialActiveId ?? firstTabId);

  const requestedActiveId = isControlled ? activeId : uncontrolledActiveId;

  // Always resolve to a valid tab, even when tabs change dynamically.
  const currentActiveId = tabs.some((tab) => tab.props.id === requestedActiveId)
    ? requestedActiveId
    : firstTabId;

  const isVertical = tabBarPosition === "left" || tabBarPosition === "right";

  const previousActiveIndex = useRef(
    Math.max(
      0,
      tabs.findIndex((tab) => tab.props.id === currentActiveId),
    ),
  );

  const currentActiveIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.props.id === currentActiveId),
  );

  const slideDirection =
    currentActiveIndex > previousActiveIndex.current
      ? 1
      : currentActiveIndex < previousActiveIndex.current
        ? -1
        : 0;

  if (currentActiveId !== tabs[previousActiveIndex.current]?.props.id) {
    previousActiveIndex.current = currentActiveIndex;
  }

  const activateTab = (tabId: string) => {
    if (!tabs.some((tab) => tab.props.id === tabId)) {
      return;
    }

    if (!isControlled) {
      setUncontrolledActiveId(tabId);
    }

    onActivate?.(tabId);
  };

  const getTabId = (tabId: string) =>
    `${generatedId}-tab-${encodeURIComponent(tabId)}`;

  const getPanelId = (tabId: string) =>
    `${generatedId}-panel-${encodeURIComponent(tabId)}`;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        if (!isVertical) {
          nextIndex = (index + 1) % tabs.length;
        }
        break;

      case "ArrowLeft":
        if (!isVertical) {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        }
        break;

      case "ArrowDown":
        if (isVertical) {
          nextIndex = (index + 1) % tabs.length;
        }
        break;

      case "ArrowUp":
        if (isVertical) {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        }
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = tabs.length - 1;
        break;
    }

    if (nextIndex === undefined || tabs.length === 0) {
      return;
    }

    event.preventDefault();

    const nextTab = tabs[nextIndex];

    activateTab(nextTab.props.id);

    document.getElementById(getTabId(nextTab.props.id))?.focus();
  };

  return (
    <div
      {...rootProps}
      className={cn("puzzle-tabs", `puzzle-tabs--${tabBarPosition}`, className)}
      data-orientation={isVertical ? "vertical" : "horizontal"}
      data-position={tabBarPosition}
    >
      <div
        className="puzzle-tabs__list"
        role="tablist"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
      >
        {tabs.map((tab, index) => {
          const { id, tab: tabContent } = tab.props;
          const isActive = id === currentActiveId;

          return (
            <button
              key={id}
              id={getTabId(id)}
              type="button"
              role="tab"
              className="puzzle-tabs__trigger"
              aria-selected={isActive}
              aria-controls={getPanelId(id)}
              tabIndex={isActive ? 0 : -1}
              data-state={isActive ? "active" : "inactive"}
              onClick={() => activateTab(id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tabContent}
            </button>
          );
        })}
      </div>

      <div
        className="puzzle-tabs__content"
        data-direction={slideDirection}
        data-position={tabBarPosition}
      >
        {tabs.map((tab) => {
          const { id, children: content } = tab.props;
          const isActive = id === currentActiveId;

          if (!forceMountContent && !isActive) {
            return null;
          }

          return (
            <div
              key={id}
              id={getPanelId(id)}
              role="tabpanel"
              aria-labelledby={getTabId(id)}
              aria-hidden={!isActive}
              hidden={!isActive}
              tabIndex={0}
              className="puzzle-tabs__panel"
              data-state={isActive ? "active" : "inactive"}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Tabs = Object.assign(TabsRoot, {
  Tab: TabsTab,
});

export { Tabs, TabsTab, type TabsProps, type TabsTabProps, type TabsPosition };
