"use client";

import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@puzzle-ui/core";

import { Popout, type PopoutTriggerProps } from "../popout";

import {
  DropdownMenuContext,
  type DropdownMenuContextValue,
  type FocusPosition,
} from "./dropdown-menu.context";
import { focusElement } from "./dropdown-menu.utils";
import { DropdownMenuContent } from "./dropdown-menu-content";
import { DropdownMenuTrigger } from "./dropdown-menu-trigger";

import type {
  DropdownMenuContentProps,
  DropdownMenuProps,
  DropdownMenuTriggerProps,
} from "./dropdown-menu.types";

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

const DropdownMenu = ({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  position = "bottom",
  align = "start",
  offset = 8,
  collisionPadding = 8,
  matchTriggerWidth = false,
  triggerClassName,
  contentClassName,
}: DropdownMenuProps) => {
  const baseId = useId();
  const generatedTriggerId = `${baseId}-trigger`;
  const generatedContentId = `${baseId}-content`;

  const childElements = getMenuElements(children);
  const triggers = childElements.filter(
    (child) => child.type === DropdownMenuTrigger,
  );
  const contents = childElements.filter(
    (child) => child.type === DropdownMenuContent,
  );
  const triggerElement = triggers[0] as
    | ReactElement<DropdownMenuTriggerProps>
    | undefined;
  const contentElement = contents[0] as
    | ReactElement<DropdownMenuContentProps>
    | undefined;

  if (
    triggers.length !== 1 ||
    contents.length !== 1 ||
    !triggerElement ||
    !contentElement
  ) {
    throw new Error(
      "DropdownMenu requires exactly one DropdownMenu.Trigger and one DropdownMenu.Content.",
    );
  }

  const triggerChild = triggerElement.props.asChild
    ? Children.only(triggerElement.props.children)
    : null;
  const triggerChildProps = isValidElement(triggerChild)
    ? (triggerChild.props as {
        id?: string;
        disabled?: boolean;
        "aria-disabled"?: boolean | "true" | "false";
      })
    : undefined;
  const triggerDisabled =
    disabled ||
    triggerElement.props.disabled === true ||
    triggerElement.props["aria-disabled"] === true ||
    triggerElement.props["aria-disabled"] === "true" ||
    triggerChildProps?.disabled === true ||
    triggerChildProps?.["aria-disabled"] === true ||
    triggerChildProps?.["aria-disabled"] === "true";

  const controlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen =
    !triggerDisabled && (controlled ? (open ?? false) : internalOpen);

  useEffect(() => {
    if (triggerDisabled && !controlled && internalOpen) {
      setInternalOpen(false);
      onOpenChange?.(false);
    }
  }, [controlled, internalOpen, onOpenChange, triggerDisabled]);

  const triggerRef = useRef<HTMLElement | null>(null);
  const focusPositionRef = useRef<FocusPosition>("first");
  const keyboardFocusPendingRef = useRef(false);

  const triggerId =
    triggerElement.props.id ?? triggerChildProps?.id ?? generatedTriggerId;
  const contentId = contentElement.props.id ?? generatedContentId;

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      if (triggerDisabled && nextOpen) {
        keyboardFocusPendingRef.current = false;
        return;
      }

      if (nextOpen && !keyboardFocusPendingRef.current) {
        focusPositionRef.current = "first";
      }

      keyboardFocusPendingRef.current = false;

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

  const openFromKeyboard = useCallback(
    (focusPosition: FocusPosition) => {
      focusPositionRef.current = focusPosition;
      keyboardFocusPendingRef.current = true;
      changeOpen(true);
    },
    [changeOpen],
  );

  const close = useCallback(
    (restoreFocus: boolean) => {
      changeOpen(false);

      if (restoreFocus) {
        focusElement(triggerRef.current ?? undefined);
      }
    },
    [changeOpen],
  );

  const context: DropdownMenuContextValue = {
    open: isOpen,
    disabled: triggerDisabled,
    triggerId,
    contentId,
    triggerRef,
    focusPositionRef,
    changeOpen,
    openFromKeyboard,
    close,
  };

  const trigger = cloneElement(triggerElement, {
    id: triggerId,
    disabled: triggerDisabled,
    className: cn(triggerElement.props.className, triggerClassName),
  });

  const content = cloneElement(contentElement, {
    id: contentId,
    className: cn(contentElement.props.className, contentClassName),
  });

  return (
    <DropdownMenuContext.Provider value={context}>
      <Popout
        trigger={trigger as unknown as ReactElement<PopoutTriggerProps>}
        open={isOpen}
        onOpenChange={changeOpen}
        position={position}
        align={align}
        offset={offset}
        collisionPadding={collisionPadding}
        matchTriggerWidth={matchTriggerWidth}
        closeOnOutsideClick
        closeOnEscape
        toggleOnClick
        contentClassName="puzzle-dropdown-menu__popover"
      >
        {content}
      </Popout>
    </DropdownMenuContext.Provider>
  );
};

export { DropdownMenu };
