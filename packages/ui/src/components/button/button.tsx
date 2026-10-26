"use client";

import { createElement } from "react";
import type {
  ComponentPropsWithRef,
  ElementType,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@puzzle/core";
import "./button.css";
import { type ElementProp } from "../../types";
import { type ButtonVariant } from "./button.types";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

type ButtonOwnProps<C extends ElementType> = {
  as?: C;
  variant?: ButtonVariant;
  size?: ButtonSize;

  leading?: ReactNode;
  trailing?: ReactNode;

  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;

  className?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  tabIndex?: number;

  "aria-label"?: string;
  "aria-busy"?: boolean;
  "aria-disabled"?: boolean;

  onClick?: ElementProp<C, "onClick">;
  onKeyDown?: ElementProp<C, "onKeyDown">;
};

type ButtonProps<C extends ElementType = "button"> = ButtonOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof ButtonOwnProps<C> | "as">;

const Button = <C extends ElementType = "button">(props: ButtonProps<C>) => {
  const {
    as,
    variant = "primary",
    size = "md",
    leading,
    trailing,
    loading = false,
    disabled = false,
    fullWidth = false,
    className,
    children,
    type = "button",
    tabIndex,
    onClick,
    onKeyDown,
    ref,
    "aria-disabled": ariaDisabled,
    "aria-busy": ariaBusy,
    ...rest
  } = props;

  const Component = (as ?? "button") as ElementType;
  const isNativeButton = Component === "button";
  const resolvedType = isNativeButton ? (type ?? "button") : undefined;
  const isDisabled = disabled || loading || ariaDisabled === true;

  const classes = cn(
    "puzzle-button",
    `puzzle-button--${variant}`,
    `puzzle-button--${size}`,
    fullWidth && "puzzle-button--full-width",
    loading && "puzzle-button--loading",
    className,
  );

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (typeof onClick === "function") {
      (onClick as (event: never) => void)(event as never);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    if (isDisabled) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (typeof onKeyDown === "function") {
      (onKeyDown as (event: never) => void)(event as never);
    }
  };

  const elementProps = {
    ...rest,
    ref,
    className: classes,
    type: resolvedType,
    disabled: isNativeButton ? isDisabled : undefined,
    "aria-disabled": !isNativeButton && isDisabled ? true : ariaDisabled,
    "aria-busy": loading ? true : ariaBusy,
    tabIndex: !isNativeButton && isDisabled ? -1 : tabIndex,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  return createElement(
    Component,
    elementProps as never,
    <>
      {loading ? (
        <span className="puzzle-button__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              opacity=".25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ) : leading != null ? (
        <span className="puzzle-button__leading">{leading}</span>
      ) : null}

      {children != null && (
        <span className="puzzle-button__content">{children}</span>
      )}

      {trailing != null && (
        <span className="puzzle-button__trailing">{trailing}</span>
      )}
    </>,
  );
};

export { Button, type ButtonProps };
