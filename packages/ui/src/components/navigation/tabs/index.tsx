"use client";

import { useRovingFocus } from "@puzzle/hooks";
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

  /** Prevents this tab from being selected or focused. */
  disabled?: boolean;

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

  const firstEnabledTabId = tabs.find((tab) => !tab.props.disabled)?.props.id;

  const [uncontrolledActiveId, setUncontrolledActiveId] = useState<
    string | undefined
  >(() => initialActiveId ?? firstEnabledTabId);

  const requestedActiveId = isControlled ? activeId : uncontrolledActiveId;

  const currentActiveId = tabs.some(
    (tab) => tab.props.id === requestedActiveId && !tab.props.disabled,
  )
    ? requestedActiveId
    : firstEnabledTabId;

  const isVertical = tabBarPosition === "left" || tabBarPosition === "right";
  const dir = rootProps.dir === "rtl" ? "rtl" : "ltr";

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

  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: tabs.map((tab) => ({
      id: tab.props.id,
      disabled: tab.props.disabled,
    })),
    orientation: isVertical ? "vertical" : "horizontal",
    dir,
    initialActiveId: currentActiveId,
  });

  const isKeyboardNavigation = useRef(false);

  const activateTab = (tabId: string) => {
    if (
      !tabs.some((tab) => tab.props.id === tabId && !tab.props.disabled)
    ) {
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
    id: string,
  ) => {
    isKeyboardNavigation.current = true;

    try {
      rovingFocus.onItemKeyDown(event, id);
    } finally {
      isKeyboardNavigation.current = false;
    }
  };

  const handleFocus = (id: string) => {
    rovingFocus.onItemFocus(id);

    // Tabs use automatic activation: moving keyboard focus also activates
    // the newly focused tab.
    if (isKeyboardNavigation.current) {
      activateTab(id);
    }
  };

  const handleClick = (id: string) => {
    rovingFocus.onItemFocus(id);
    activateTab(id);
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
        {tabs.map((tab) => {
          const { id, tab: tabContent, disabled = false } = tab.props;
          const isActive = id === currentActiveId;

          return (
            <button
              key={id}
              ref={rovingFocus.getItemRef(id)}
              id={getTabId(id)}
              type="button"
              role="tab"
              className="puzzle-tabs__trigger"
              disabled={disabled}
              aria-selected={isActive}
              aria-controls={getPanelId(id)}
              tabIndex={disabled ? -1 : isActive ? 0 : -1}
              data-state={isActive ? "active" : "inactive"}
              onClick={() => handleClick(id)}
              onFocus={() => handleFocus(id)}
              onKeyDown={(event) => handleKeyDown(event, id)}
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

          // The panel element always exists so every tab's aria-controls
          // resolves; only inactive content is unmounted.
          return (
            <div
              key={id}
              id={getPanelId(id)}
              role="tabpanel"
              aria-labelledby={getTabId(id)}
              hidden={!isActive}
              tabIndex={0}
              className="puzzle-tabs__panel"
              data-state={isActive ? "active" : "inactive"}
            >
              {forceMountContent || isActive ? content : null}
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
