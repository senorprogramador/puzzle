"use client";

import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useCallback,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@puzzle/core";

import { useDropdownMenuContext } from "./dropdown-menu.context";
import { setRef } from "./dropdown-menu.utils";

import type { DropdownMenuTriggerProps } from "./dropdown-menu.types";

const DropdownMenuTrigger = ({
  asChild = false,
  children,
  id,
  className,
  disabled = false,
  onKeyDown,
  onPointerDown,
  ref,
  ...buttonProps
}: DropdownMenuTriggerProps) => {
  const context = useDropdownMenuContext();

  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      context.triggerRef.current = node;
      setRef(ref, node);
    },
    [context.triggerRef, ref],
  );

  const child = asChild ? Children.only(children) : null;
  const childRef = isValidElement(child)
    ? (child.props as { ref?: Ref<HTMLElement> }).ref
    : undefined;

  const handleChildRef = useCallback(
    (node: HTMLElement | null) => {
      handleRef(node);
      setRef(childRef, node);
    },
    [childRef, handleRef],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);

    if (event.defaultPrevented || disabled || context.disabled) {
      return;
    }

    const target = event.currentTarget;
    const isNativeButton =
      target.tagName === "BUTTON" || target.tagName === "INPUT";
    const isNativeLink =
      target.tagName === "A" && target.hasAttribute("href");
    const needsSyntheticActivation =
      asChild &&
      !isNativeButton &&
      (event.key === " " || (event.key === "Enter" && !isNativeLink));

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      needsSyntheticActivation
    ) {
      event.preventDefault();
      context.openFromKeyboard(event.key === "ArrowUp" ? "last" : "first");
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    onPointerDown?.(event as ReactPointerEvent<HTMLButtonElement>);

    if (!event.defaultPrevented) {
      context.focusPositionRef.current = "first";
    }
  };

  const commonProps = {
    ...buttonProps,
    id,
    ref: handleRef,
    className: cn("puzzle-dropdown-menu__trigger", className),
    "aria-haspopup": "menu" as const,
    "aria-expanded": context.open,
    "aria-controls": context.open ? context.contentId : undefined,
    disabled: disabled || context.disabled,
    "data-state": context.open ? "open" : "closed",
    onKeyDown: handleKeyDown,
    onPointerDown: handlePointerDown,
  };

  if (asChild) {
    if (!isValidElement(child)) {
      throw new Error("DropdownMenu.Trigger with asChild expects one element.");
    }

    if (child.type === Fragment) {
      throw new Error(
        "DropdownMenu.Trigger with asChild expects one non-Fragment element.",
      );
    }

    const childProps = child.props as HTMLAttributes<HTMLElement> & {
      className?: string;
      type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
      disabled?: boolean;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
      onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
    };
    const childDisabled =
      disabled ||
      context.disabled ||
      childProps.disabled === true ||
      childProps["aria-disabled"] === true ||
      childProps["aria-disabled"] === "true";

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (childDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      childProps.onClick?.(event);
      if (!event.defaultPrevented) {
        buttonProps.onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
      }
    };

    return cloneElement(child as unknown as ReactElement<Record<string, unknown>>, {
      ...buttonProps,
      id,
      ref: handleChildRef,
      className: cn(
        "puzzle-dropdown-menu__trigger",
        childProps.className,
        className,
      ),
      role: child.type === "button" ? undefined : "button",
      "aria-haspopup": "menu",
      "aria-expanded": context.open,
      "aria-controls": context.open ? context.contentId : undefined,
      "aria-disabled": childDisabled || undefined,
      disabled: child.type === "button" ? childDisabled : undefined,
      ...(child.type === "button"
        ? { type: buttonProps.type ?? childProps.type ?? "button" }
        : {}),
      tabIndex: childDisabled ? -1 : (childProps.tabIndex ?? 0),
      "data-state": context.open ? "open" : "closed",
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      },
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        childProps.onPointerDown?.(event);
        if (!event.defaultPrevented) {
          handlePointerDown(event);
        }
      },
      onClick: handleClick,
    });
  }

  return (
    <button
      {...(commonProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
    >
      {children}
    </button>
  );
};

export { DropdownMenuTrigger };
