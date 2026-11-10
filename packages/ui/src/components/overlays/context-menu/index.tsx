"use client";

import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  Fragment,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type MutableRefObject,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";

import { cn } from "@puzzle-ui/core";

import {
  Popout,
  usePopoutPositioned,
  type PopoutTriggerProps,
} from "../popout";

import {
  findMenuItemIndexByText,
  findNextMenuItemIndex,
  focusElement,
  getEnabledMenuItems,
  getMenuItemText,
  setRef,
} from "./context-menu.utils";

import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from "./context-menu.types";

import "./context-menu.css";

type ContextMenuPoint = {
  x: number;
  y: number;
};

type FocusPosition = "first" | "last";

type ContextMenuContextValue = {
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  focusPositionRef: RefObject<FocusPosition>;
  openAt: (point: ContextMenuPoint, position?: FocusPosition) => void;
  changeOpen: (open: boolean) => void;
  close: (restoreFocus?: boolean) => void;
};

type RadioGroupContextValue = {
  value: string | undefined;
  setValue: (value: string) => void;
};

type SubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  close: (restoreFocus?: boolean) => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);
const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
const SubContext = createContext<SubContextValue | null>(null);

const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error(
      "ContextMenu components must be rendered inside ContextMenu.",
    );
  }

  return context;
};

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error(
      "ContextMenu.RadioItem must be rendered inside ContextMenu.RadioGroup.",
    );
  }

  return context;
};

const useSubContext = () => {
  const context = useContext(SubContext);

  if (!context) {
    throw new Error(
      "ContextMenu.SubTrigger and SubContent must be rendered inside ContextMenu.Sub.",
    );
  }

  return context;
};

const getMenuElements = (children: ReactNode): ReactElement[] =>
  Children.toArray(children).flatMap((child): ReactElement[] => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return getMenuElements(child.props.children);
    }

    return isValidElement(child) ? [child] : [];
  });

const ContextMenuRoot = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  triggerClassName,
  contentClassName,
}: ContextMenuProps) => {
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const childElements = getMenuElements(children);
  const triggers = childElements.filter(
    (child) => child.type === ContextMenuTrigger,
  );
  const contents = childElements.filter(
    (child) => child.type === ContextMenuContent,
  );

  const triggerElement = triggers[0] as
    | ReactElement<ContextMenuTriggerProps>
    | undefined;
  const contentElement = contents[0] as
    | ReactElement<ContextMenuContentProps>
    | undefined;

  if (
    triggers.length !== 1 ||
    contents.length !== 1 ||
    !triggerElement ||
    !contentElement
  ) {
    throw new Error(
      "ContextMenu requires exactly one ContextMenu.Trigger and one ContextMenu.Content.",
    );
  }

  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerDisabled = disabled || triggerElement.props.disabled === true;
  const isOpen =
    !triggerDisabled && (controlled ? (open ?? false) : internalOpen);

  const [point, setPoint] = useState<ContextMenuPoint>({
    x: 0,
    y: 0,
  });

  const triggerRef = useRef<HTMLElement | null>(null);
  const focusPositionRef = useRef<FocusPosition>("first");

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (triggerDisabled && nextOpen) {
        return;
      }

      if (nextOpen === isOpen) {
        return;
      }

      if (!controlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlled, isOpen, onOpenChange, triggerDisabled],
  );

  const openAt = useCallback(
    (nextPoint: ContextMenuPoint, position: FocusPosition = "first") => {
      if (triggerDisabled) {
        return;
      }

      setPoint({
        x: Math.max(0, nextPoint.x),
        y: Math.max(0, nextPoint.y),
      });

      focusPositionRef.current = position;
      changeOpen(true);
    },
    [changeOpen, triggerDisabled],
  );

  const close = useCallback(
    (restoreFocus = false) => {
      changeOpen(false);

      if (restoreFocus) {
        focusElement(triggerRef.current ?? undefined);
      }
    },
    [changeOpen],
  );

  const context = useMemo<ContextMenuContextValue>(
    () => ({
      open: isOpen,
      disabled: triggerDisabled,
      triggerId,
      contentId,
      triggerRef,
      focusPositionRef,
      openAt,
      changeOpen,
      close,
    }),
    [isOpen, triggerDisabled, triggerId, contentId, openAt, changeOpen, close],
  );

  const trigger = cloneElement(triggerElement, {
    id: triggerId,
    disabled: triggerDisabled,
    className: cn(triggerElement.props.className, triggerClassName),
  });

  const content = cloneElement(contentElement, {
    id: contentId,
    className: cn(contentElement.props.className, contentClassName),
  });

  const anchor = (
    <span
      aria-hidden="true"
      className="puzzle-context-menu__anchor"
      style={{
        left: point.x,
        top: point.y,
      }}
      tabIndex={-1}
    />
  );

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const ownerDocument = triggerRef.current.ownerDocument;

    const handleOutsidePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target;

      if (!(target instanceof ownerDocument.defaultView!.Node)) {
        return;
      }

      if (
        triggerRef.current?.contains(target) ||
        (target instanceof Element &&
          target.closest(".puzzle-context-menu__popover"))
      ) {
        return;
      }

      changeOpen(false);
    };

    ownerDocument.addEventListener(
      "pointerdown",
      handleOutsidePointerDown,
      true,
    );

    return () => {
      ownerDocument.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
        true,
      );
    };
  }, [isOpen, changeOpen]);

  return (
    <ContextMenuContext.Provider value={context}>
      {trigger}

      <Popout
        trigger={anchor as ReactElement<PopoutTriggerProps>}
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            changeOpen(true);
          } else {
            close(true);
          }
        }}
        position="bottom"
        align="start"
        offset={0}
        collisionPadding={8}
        closeOnOutsideClick={false}
        closeOnEscape
        contentClassName="puzzle-context-menu__popover"
      >
        {content}
      </Popout>
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({
  children,
  asChild = false,
  disabled = false,
  id,
  className,
  ref,
  onContextMenu,
  onClick,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...triggerProps
}: ContextMenuTriggerProps) => {
  const context = useContextMenuContext();
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const isDisabled = disabled || context.disabled;

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearLongPress, [clearLongPress]);

  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      context.triggerRef.current = node;
      setRef(ref, node);
    },
    [context.triggerRef, ref],
  );

  const handleContextMenu = (event: MouseEvent<HTMLElement>) => {
    onContextMenu?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    event.preventDefault();
    context.triggerRef.current = event.currentTarget;

    context.openAt({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || isDisabled || event.button !== 0) {
      return;
    }

    if (event.ctrlKey) {
      event.preventDefault();
      context.triggerRef.current = event.currentTarget;
      context.openAt({
        x: event.clientX,
        y: event.clientY,
      });
      return;
    }

    if (context.open) {
      context.close(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    if (
      event.key === "ContextMenu" ||
      (event.shiftKey && event.key === "F10")
    ) {
      event.preventDefault();
      context.triggerRef.current = target;
      context.openAt({ x: rect.left, y: rect.bottom });
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      context.triggerRef.current = target;
      context.openAt(
        { x: rect.left, y: rect.bottom },
        event.key === "ArrowUp" ? "last" : "first",
      );
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    onPointerDown?.(event);

    if (event.defaultPrevented || isDisabled || event.pointerType !== "touch") {
      return;
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    const target = event.currentTarget;

    longPressTimerRef.current = setTimeout(() => {
      const rect = target.getBoundingClientRect();

      context.triggerRef.current = target;
      context.openAt({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }, 550);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    onPointerMove?.(event);

    const start = pointerStartRef.current;

    if (
      start &&
      (Math.abs(event.clientX - start.x) > 10 ||
        Math.abs(event.clientY - start.y) > 10)
    ) {
      clearLongPress();
      pointerStartRef.current = null;
    }
  };

  const handlePointerEnd = (
    event: PointerEvent<HTMLElement>,
    callback?: (event: PointerEvent<HTMLElement>) => void,
  ) => {
    callback?.(event);
    clearLongPress();
    pointerStartRef.current = null;
  };

  const commonProps = {
    ...triggerProps,
    id,
    ref: handleRef,
    className: cn("puzzle-context-menu__trigger", className),
    role: "button",
    tabIndex: isDisabled ? -1 : (triggerProps.tabIndex ?? 0),
    "aria-haspopup": "menu" as const,
    "aria-expanded": context.open,
    "aria-controls": context.open ? context.contentId : undefined,
    "aria-disabled": isDisabled || undefined,
    "data-state": context.open ? "open" : "closed",
    onContextMenu: handleContextMenu,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: (event: PointerEvent<HTMLElement>) =>
      handlePointerEnd(event, onPointerUp),
    onPointerCancel: (event: PointerEvent<HTMLElement>) =>
      handlePointerEnd(event, onPointerCancel),
  };

  if (!asChild) {
    return <div {...commonProps}>{children}</div>;
  }

  const child = Children.only(children);

  if (!isValidElement(child) || child.type === Fragment) {
    throw new Error(
      "ContextMenu.Trigger with asChild expects one non-Fragment element.",
    );
  }

  const childProps = child.props as HTMLAttributes<HTMLElement> & {
    ref?: Ref<HTMLElement>;
    className?: string;
    disabled?: boolean;
    onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
    onPointerMove?: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp?: (event: PointerEvent<HTMLElement>) => void;
    onPointerCancel?: (event: PointerEvent<HTMLElement>) => void;
  };

  const childDisabled =
    isDisabled ||
    childProps.disabled === true ||
    childProps["aria-disabled"] === true ||
    childProps["aria-disabled"] === "true";

  return cloneElement(child as ReactElement<Record<string, unknown>>, {
    ...commonProps,
    ref: (node: HTMLElement | null) => {
      handleRef(node);
      setRef(childProps.ref, node);
    },
    className: cn(
      "puzzle-context-menu__trigger",
      childProps.className,
      className,
    ),
    role: child.type === "button" ? undefined : "button",
    tabIndex: childDisabled ? -1 : (childProps.tabIndex ?? 0),
    "aria-disabled": childDisabled || undefined,
    disabled: child.type === "button" ? childDisabled : undefined,
    onContextMenu: (event: MouseEvent<HTMLElement>) => {
      if (childDisabled) {
        event.preventDefault();
        return;
      }

      childProps.onContextMenu?.(event);

      if (!event.defaultPrevented) {
        handleContextMenu(event);
      }
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (childDisabled) {
        return;
      }

      childProps.onClick?.(event);

      if (!event.defaultPrevented) {
        handleClick(event);
      }
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (!event.defaultPrevented) {
        handleKeyDown(event);
      }
    },
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerDown?.(event);
      if (!event.defaultPrevented) {
        handlePointerDown(event);
      }
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerMove?.(event);
      if (!event.defaultPrevented) {
        handlePointerMove(event);
      }
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerUp?.(event);
      handlePointerEnd(event);
    },
    onPointerCancel: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerCancel?.(event);
      handlePointerEnd(event);
    },
  });
};

const ContextMenuContent = ({
  children,
  id,
  className,
  style,
  maxHeight = "min(24rem, calc(100dvh - 1rem))",
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...contentProps
}: ContextMenuContentProps) => {
  const context = useContextMenuContext();
  const positioned = usePopoutPositioned();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialFocusDoneRef = useRef(false);

  useEffect(() => {
    if (!context.open) {
      initialFocusDoneRef.current = false;
      typeaheadRef.current = "";

      if (typeaheadTimerRef.current !== null) {
        clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = null;
      }
    }
  }, [context.open]);

  useEffect(() => {
    if (!context.open || !positioned || initialFocusDoneRef.current) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    initialFocusDoneRef.current = true;

    const items = getEnabledMenuItems(menu);
    const target =
      context.focusPositionRef.current === "last"
        ? items[items.length - 1]
        : items[0];

    focusElement(target ?? menu);
  }, [context.open, context.focusPositionRef, positioned]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current !== null) {
        clearTimeout(typeaheadTimerRef.current);
      }
    },
    [],
  );

  const focusIndex = (items: HTMLElement[], index: number) => {
    if (index >= 0 && index < items.length) {
      focusElement(items[index]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.close(true);
      return;
    }

    if (event.key === "Tab") {
      const ownerDocument = event.currentTarget.ownerDocument;
      const trigger = context.triggerRef.current;
      const selector = [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        "input:not([disabled]):not([type='hidden'])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "iframe",
        "summary",
        "[contenteditable='true']",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");

      const tabbableElements = Array.from(
        ownerDocument.querySelectorAll<HTMLElement>(selector),
      ).filter((element) => {
        if (
          menu.contains(element) ||
          element.hidden ||
          element.tabIndex < 0 ||
          element.getAttribute("aria-disabled") === "true" ||
          element.closest("[hidden], [inert], [aria-hidden='true']")
        ) {
          return false;
        }

        const computedStyle =
          ownerDocument.defaultView?.getComputedStyle(element);

        return (
          computedStyle?.display !== "none" &&
          computedStyle?.visibility !== "hidden"
        );
      });

      const triggerIndex = trigger ? tabbableElements.indexOf(trigger) : -1;
      const direction = event.shiftKey ? -1 : 1;
      const targetIndex = triggerIndex + direction;
      const target =
        triggerIndex >= 0 && tabbableElements.length > 0
          ? tabbableElements[
              (targetIndex + tabbableElements.length) % tabbableElements.length
            ]
          : undefined;

      context.close(false);

      if (target) {
        event.preventDefault();
        focusElement(target);
      }

      return;
    }

    const items = getEnabledMenuItems(menu);
    const activeIndex = items.indexOf(
      menu.ownerDocument.activeElement as HTMLElement,
    );

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const direction = event.key === "ArrowDown" ? 1 : -1;
      const startIndex =
        activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;

      const nextIndex = findNextMenuItemIndex(
        items.map(() => ({ disabled: false })),
        startIndex,
        direction,
      );

      focusIndex(items, nextIndex);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusIndex(items, event.key === "Home" ? 0 : items.length - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      const activeItem = items[activeIndex];

      if (activeItem?.hasAttribute("data-puzzle-context-menu-sub-trigger")) {
        event.preventDefault();
        activeItem.click();
      }

      return;
    }

    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const nextBuffer = `${typeaheadRef.current}${event.key}`;
    const repeatedCharacter = [...nextBuffer].every(
      (character) =>
        character.toLocaleLowerCase() === nextBuffer[0]!.toLocaleLowerCase(),
    );
    const query = repeatedCharacter ? event.key : nextBuffer;

    typeaheadRef.current = query;

    if (typeaheadTimerRef.current !== null) {
      clearTimeout(typeaheadTimerRef.current);
    }

    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadRef.current = "";
      typeaheadTimerRef.current = null;
    }, 500);

    const nextIndex = findMenuItemIndexByText(
      items.map((item) => ({
        text: getMenuItemText(item),
      })),
      query,
      activeIndex,
    );

    focusIndex(items, nextIndex);
  };

  return (
    <div
      {...contentProps}
      ref={menuRef}
      id={id ?? context.contentId}
      className={cn("puzzle-context-menu__content", className)}
      role="menu"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabel ? undefined : (ariaLabelledBy ?? context.triggerId)
      }
      tabIndex={-1}
      data-state={context.open ? "open" : "closed"}
      style={{ ...style, maxHeight }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

const ContextMenuItem = ({
  children,
  className,
  disabled = false,
  "aria-disabled": ariaDisabled,
  textValue,
  closeOnSelect = true,
  variant = "default",
  onClick,
  onSelect,
  ...itemProps
}: ContextMenuItemProps) => {
  const context = useContextMenuContext();
  const itemDisabled =
    disabled || ariaDisabled === true || ariaDisabled === "true";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (itemDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    onSelect?.(event);

    if (!event.defaultPrevented && closeOnSelect) {
      context.close(true);
    }
  };

  return (
    <button
      {...(itemProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      className={cn(
        "puzzle-context-menu__item",
        variant === "danger" && "puzzle-context-menu__item--danger",
        className,
      )}
      role="menuitem"
      tabIndex={-1}
      disabled={itemDisabled}
      aria-disabled={itemDisabled || undefined}
      data-puzzle-context-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      <span className="puzzle-context-menu__item-label">{children}</span>
    </button>
  );
};

const ContextMenuGroup = ({
  children,
  className,
  "aria-label": ariaLabel,
  ...groupProps
}: ContextMenuGroupProps) => (
  <div
    {...groupProps}
    className={cn("puzzle-context-menu__group", className)}
    role="group"
    aria-label={ariaLabel}
  >
    {children}
  </div>
);

const ContextMenuLabel = ({
  children,
  className,
  ...labelProps
}: ContextMenuLabelProps) => (
  <div {...labelProps} className={cn("puzzle-context-menu__label", className)}>
    {children}
  </div>
);

const ContextMenuSeparator = ({
  className,
  ...separatorProps
}: ContextMenuSeparatorProps) => (
  <div
    {...separatorProps}
    className={cn("puzzle-context-menu__separator", className)}
    role="separator"
    aria-orientation="horizontal"
  />
);

const ContextMenuCheckboxItem = ({
  children,
  checked,
  defaultChecked = false,
  onCheckedChange,
  closeOnSelect = false,
  textValue,
  className,
  disabled = false,
  "aria-disabled": ariaDisabled,
  onClick,
  onSelect,
  ...itemProps
}: ContextMenuCheckboxItemProps) => {
  const context = useContextMenuContext();
  const itemDisabled =
    disabled || ariaDisabled === true || ariaDisabled === "true";
  const controlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const resolvedChecked = checked ?? internalChecked;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (itemDisabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    onSelect?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const nextChecked = resolvedChecked !== true;

    if (!controlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);

    if (closeOnSelect) {
      context.close(true);
    }
  };

  return (
    <button
      {...(itemProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      className={cn("puzzle-context-menu__item", className)}
      role="menuitemcheckbox"
      tabIndex={-1}
      disabled={itemDisabled}
      aria-disabled={itemDisabled || undefined}
      aria-checked={
        resolvedChecked === "indeterminate" ? "mixed" : resolvedChecked
      }
      data-state={
        resolvedChecked === "indeterminate"
          ? "indeterminate"
          : resolvedChecked
            ? "checked"
            : "unchecked"
      }
      data-puzzle-context-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      <span className="puzzle-context-menu__indicator" aria-hidden="true">
        {resolvedChecked === "indeterminate" ? "−" : resolvedChecked ? "✓" : ""}
      </span>
      <span className="puzzle-context-menu__item-label">{children}</span>
    </button>
  );
};

const ContextMenuRadioGroup = ({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  ...groupProps
}: ContextMenuRadioGroupProps) => {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const resolvedValue = controlled ? value : internalValue;

  const setValue = useCallback(
    (nextValue: string) => {
      if (nextValue === resolvedValue) {
        return;
      }

      if (!controlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [controlled, onValueChange, resolvedValue],
  );

  return (
    <RadioGroupContext.Provider value={{ value: resolvedValue, setValue }}>
      <div
        {...groupProps}
        className={cn("puzzle-context-menu__group", className)}
        role="group"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const ContextMenuRadioItem = ({
  children,
  value,
  closeOnSelect = true,
  textValue,
  className,
  disabled = false,
  "aria-disabled": ariaDisabled,
  onClick,
  onSelect,
  ...itemProps
}: ContextMenuRadioItemProps) => {
  const context = useContextMenuContext();
  const radioGroup = useRadioGroupContext();
  const checked = radioGroup.value === value;
  const itemDisabled =
    disabled || ariaDisabled === true || ariaDisabled === "true";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (itemDisabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    onSelect?.(event);

    if (event.defaultPrevented) {
      return;
    }

    radioGroup.setValue(value);

    if (closeOnSelect) {
      context.close(true);
    }
  };

  return (
    <button
      {...(itemProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      className={cn("puzzle-context-menu__item", className)}
      role="menuitemradio"
      tabIndex={-1}
      disabled={itemDisabled}
      aria-disabled={itemDisabled || undefined}
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-puzzle-context-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      <span className="puzzle-context-menu__indicator" aria-hidden="true">
        {checked ? "●" : ""}
      </span>
      <span className="puzzle-context-menu__item-label">{children}</span>
    </button>
  );
};

const ContextMenuSub = ({
  children,
  defaultOpen = false,
}: ContextMenuSubProps) => {
  const rootContext = useContextMenuContext();
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const elements = getMenuElements(children);
  const triggers = elements.filter(
    (child) => child.type === ContextMenuSubTrigger,
  );
  const contents = elements.filter(
    (child) => child.type === ContextMenuSubContent,
  );

  const triggerElement = triggers[0] as
    | ReactElement<ContextMenuSubTriggerProps>
    | undefined;
  const contentElement = contents[0] as
    | ReactElement<ContextMenuSubContentProps>
    | undefined;

  if (
    triggers.length !== 1 ||
    contents.length !== 1 ||
    !triggerElement ||
    !contentElement
  ) {
    throw new Error(
      "ContextMenu.Sub requires exactly one SubTrigger and one SubContent.",
    );
  }

  useEffect(() => {
    if (!rootContext.open) {
      setOpen(false);
    }
  }, [rootContext.open]);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      focusElement(triggerRef.current ?? undefined);
    }
  }, []);

  const subContext = useMemo<SubContextValue>(
    () => ({
      open,
      setOpen,
      triggerId,
      contentId,
      triggerRef,
      close,
    }),
    [open, triggerId, contentId, close],
  );

  const trigger = cloneElement(triggerElement, {
    id: triggerId,
  });

  const content = cloneElement(contentElement, {
    id: contentId,
  });

  return (
    <SubContext.Provider value={subContext}>
      <Popout
        trigger={trigger as ReactElement<PopoutTriggerProps>}
        open={open}
        onOpenChange={setOpen}
        position="right"
        align="start"
        offset={4}
        collisionPadding={8}
        action="hover"
        closeOnOutsideClick
        closeOnEscape
        contentClassName="puzzle-context-menu__popover puzzle-context-menu__submenu-popover"
      >
        {content}
      </Popout>
    </SubContext.Provider>
  );
};

const ContextMenuSubTrigger = forwardRef<
  HTMLButtonElement,
  ContextMenuSubTriggerProps
>(
  (
    { children, className, disabled = false, onClick, onKeyDown, ...props },
    ref,
  ) => {
    const context = useSubContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented && !disabled) {
        context.setOpen(true);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);

      if (!event.defaultPrevented && !disabled && event.key === "ArrowRight") {
        event.preventDefault();
        context.setOpen(true);
      }

      if (!event.defaultPrevented && !disabled && event.key === "ArrowLeft") {
        event.preventDefault();
        context.close(true);
      }
    };

    return (
      <button
        {...props}
        ref={(node) => {
          context.triggerRef.current = node;
          setRef(ref, node);
        }}
        id={context.triggerId}
        type="button"
        role="menuitem"
        tabIndex={-1}
        className={cn("puzzle-context-menu__item", className)}
        aria-haspopup="menu"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-puzzle-context-menu-item="true"
        data-puzzle-context-menu-sub-trigger="true"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={() => {
          if (!disabled) {
            context.setOpen(true);
          }
        }}
      >
        <span className="puzzle-context-menu__item-label">{children}</span>
        <span
          className="puzzle-context-menu__submenu-indicator"
          aria-hidden="true"
        >
          ›
        </span>
      </button>
    );
  },
);

ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = ({
  children,
  id,
  className,
  style,
  maxHeight = "min(24rem, calc(100dvh - 1rem))",
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...contentProps
}: ContextMenuSubContentProps) => {
  const context = useSubContext();
  const positioned = usePopoutPositioned();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialFocusDoneRef = useRef(false);

  useEffect(() => {
    if (!context.open) {
      initialFocusDoneRef.current = false;
      typeaheadRef.current = "";

      if (typeaheadTimerRef.current !== null) {
        clearTimeout(typeaheadTimerRef.current);
        typeaheadTimerRef.current = null;
      }
    }
  }, [context.open]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current !== null) {
        clearTimeout(typeaheadTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!context.open || !positioned || initialFocusDoneRef.current) {
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    initialFocusDoneRef.current = true;
    const items = getEnabledMenuItems(menu);
    focusElement(items[0] ?? menu);
  }, [context.open, positioned]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    event.stopPropagation();

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      context.close(true);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.close(true);
      return;
    }

    const menu = menuRef.current;

    if (!menu) {
      return;
    }

    const items = getEnabledMenuItems(menu);
    const activeIndex = items.indexOf(
      menu.ownerDocument.activeElement as HTMLElement,
    );

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const direction = event.key === "ArrowDown" ? 1 : -1;
      const startIndex =
        activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;

      const nextIndex = findNextMenuItemIndex(
        items.map(() => ({ disabled: false })),
        startIndex,
        direction,
      );

      if (nextIndex >= 0) {
        focusElement(items[nextIndex]);
      }

      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const target = event.key === "Home" ? items[0] : items[items.length - 1];

      if (target) {
        focusElement(target);
      }

      return;
    }

    if (
      event.key.length !== 1 ||
      event.key === " " ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const nextBuffer = `${typeaheadRef.current}${event.key}`;
    const repeatedCharacter = [...nextBuffer].every(
      (character) =>
        character.toLocaleLowerCase() === nextBuffer[0]!.toLocaleLowerCase(),
    );
    const query = repeatedCharacter ? event.key : nextBuffer;

    typeaheadRef.current = query;

    if (typeaheadTimerRef.current !== null) {
      clearTimeout(typeaheadTimerRef.current);
    }

    typeaheadTimerRef.current = setTimeout(() => {
      typeaheadRef.current = "";
      typeaheadTimerRef.current = null;
    }, 500);

    const nextIndex = findMenuItemIndexByText(
      items.map((item) => ({
        text: getMenuItemText(item),
      })),
      query,
      activeIndex,
    );

    if (nextIndex >= 0) {
      focusElement(items[nextIndex]);
    }
  };

  return (
    <div
      {...contentProps}
      ref={menuRef}
      id={id ?? context.contentId}
      className={cn("puzzle-context-menu__content", className)}
      role="menu"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabel ? undefined : (ariaLabelledBy ?? context.triggerId)
      }
      tabIndex={-1}
      data-state={context.open ? "open" : "closed"}
      style={{ ...style, maxHeight }}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};

type ContextMenuComponent = typeof ContextMenuRoot & {
  Trigger: typeof ContextMenuTrigger;
  Content: typeof ContextMenuContent;
  Item: typeof ContextMenuItem;
  Group: typeof ContextMenuGroup;
  Label: typeof ContextMenuLabel;
  Separator: typeof ContextMenuSeparator;
  CheckboxItem: typeof ContextMenuCheckboxItem;
  RadioGroup: typeof ContextMenuRadioGroup;
  RadioItem: typeof ContextMenuRadioItem;
  Sub: typeof ContextMenuSub & {
    Trigger: typeof ContextMenuSubTrigger;
    Content: typeof ContextMenuSubContent;
  };
  SubTrigger: typeof ContextMenuSubTrigger;
  SubContent: typeof ContextMenuSubContent;
};

const ContextMenuSubCompound = Object.assign(ContextMenuSub, {
  Trigger: ContextMenuSubTrigger,
  Content: ContextMenuSubContent,
});

const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Sub: ContextMenuSubCompound,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
}) as ContextMenuComponent;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSubCompound as ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};

export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuGroupProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
};

export type {
  ContextMenuItemVariant,
  ContextMenuCheckedState,
} from "./context-menu.types";
