"use client";

import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

import { cn } from "@puzzle-ui/core";

import { useDropdownMenuContext } from "./dropdown-menu.context";

import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
} from "./dropdown-menu.types";

const DropdownMenuItem = ({
  asChild = false,
  children,
  className,
  disabled = false,
  "aria-disabled": ariaDisabled,
  textValue,
  closeOnSelect = true,
  variant = "default",
  onClick,
  onKeyDown,
  onSelect,
  ...itemProps
}: DropdownMenuItemProps) => {
  const context = useDropdownMenuContext();
  const itemDisabled =
    disabled || ariaDisabled === true || ariaDisabled === "true";

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (itemDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);

    if (event.defaultPrevented) {
      return;
    }

    onSelect?.(event);

    if (!event.defaultPrevented && closeOnSelect) {
      context.close(true);
    }
  };

  const classes = cn(
    "puzzle-dropdown-menu__item",
    variant === "danger" && "puzzle-dropdown-menu__item--danger",
    className,
  );

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child) || child.type === Fragment) {
      throw new Error(
        "DropdownMenu.Item with asChild expects one non-Fragment element.",
      );
    }

    const childProps = child.props as HTMLAttributes<HTMLElement> & {
      className?: string;
      type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
      disabled?: boolean;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
      onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    };
    const childDisabled =
      itemDisabled ||
      childProps.disabled === true ||
      childProps["aria-disabled"] === true ||
      childProps["aria-disabled"] === "true";

    return cloneElement(child as unknown as ReactElement<Record<string, unknown>>, {
      ...itemProps,
      role: "menuitem",
      tabIndex: -1,
      "aria-disabled": childDisabled || undefined,
      disabled: child.type === "button" ? childDisabled : undefined,
      ...(child.type === "button"
        ? { type: itemProps.type ?? childProps.type ?? "button" }
        : {}),
      "data-puzzle-dropdown-menu-item": "true",
      "data-text-value": textValue,
      className: cn(classes, childProps.className),
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (childDisabled) {
          event.preventDefault();
          event.stopPropagation();
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
          onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>);
        }

        if (event.defaultPrevented || childDisabled || event.key !== " ") {
          return;
        }

        event.preventDefault();
        event.currentTarget.click();
      },
    });
  }

  return (
    <button
      {...(itemProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      type="button"
      className={classes}
      role="menuitem"
      tabIndex={-1}
      disabled={itemDisabled}
      aria-disabled={itemDisabled || undefined}
      data-puzzle-dropdown-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const DropdownMenuGroup = ({
  children,
  className,
  "aria-label": ariaLabel,
  ...groupProps
}: DropdownMenuGroupProps) => (
  <div
    {...groupProps}
    className={cn("puzzle-dropdown-menu__group", className)}
    role="group"
    aria-label={ariaLabel}
  >
    {children}
  </div>
);

const DropdownMenuLabel = ({
  children,
  className,
  ...labelProps
}: DropdownMenuLabelProps) => (
  <div
    {...labelProps}
    className={cn("puzzle-dropdown-menu__label", className)}
  >
    {children}
  </div>
);

const DropdownMenuSeparator = ({
  className,
  ...separatorProps
}: DropdownMenuSeparatorProps) => (
  <div
    {...separatorProps}
    className={cn("puzzle-dropdown-menu__separator", className)}
    role="separator"
    aria-orientation="horizontal"
  />
);

const DropdownMenuCheckboxItem = ({
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
}: DropdownMenuCheckboxItemProps) => {
  const context = useDropdownMenuContext();
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
      className={cn("puzzle-dropdown-menu__item", className)}
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
      data-puzzle-dropdown-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      <span className="puzzle-dropdown-menu__indicator" aria-hidden="true">
        {resolvedChecked === "indeterminate" ? "−" : resolvedChecked ? "✓" : ""}
      </span>
      <span className="puzzle-dropdown-menu__item-label">{children}</span>
    </button>
  );
};

export {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
