"use client";

import {
  useCallback,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";

import { cn } from "@puzzle-ui/core";

import {
  RadioGroupContext,
  useDropdownMenuContext,
  useRadioGroupContext,
} from "./dropdown-menu.context";

import type {
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
} from "./dropdown-menu.types";

const DropdownMenuRadioGroup = ({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  ...groupProps
}: DropdownMenuRadioGroupProps) => {
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
        className={cn("puzzle-dropdown-menu__radio-group", className)}
        role="group"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const DropdownMenuRadioItem = ({
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
}: DropdownMenuRadioItemProps) => {
  const context = useDropdownMenuContext();
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
      className={cn("puzzle-dropdown-menu__item", className)}
      role="menuitemradio"
      tabIndex={-1}
      disabled={itemDisabled}
      aria-disabled={itemDisabled || undefined}
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      data-puzzle-dropdown-menu-item="true"
      data-text-value={textValue}
      onClick={handleClick}
    >
      <span className="puzzle-dropdown-menu__indicator" aria-hidden="true">
        {checked ? "●" : ""}
      </span>
      <span className="puzzle-dropdown-menu__item-label">{children}</span>
    </button>
  );
};

export { DropdownMenuRadioGroup, DropdownMenuRadioItem };
