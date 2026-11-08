"use client";

import type { KeyboardEventHandler, MouseEventHandler } from "react";

import { cn } from "@puzzle-ui/core";
import { Link } from "../../navigation/link";

import type {
  ButtonLinkProps,
  ButtonNativeProps,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./button.types";

import { ButtonContent } from "./button-content";

import "./button.css";

const getButtonClassName = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  loading: boolean,
  className?: string,
) => {
  return cn(
    "puzzle-button",
    `puzzle-button--${variant}`,
    `puzzle-button--${size}`,
    fullWidth && "puzzle-button--full-width",
    loading && "puzzle-button--loading",
    className,
  );
};

/**
 * Prevents navigation when an anchor is disabled.
 */
const preventDisabledLinkClick: MouseEventHandler<HTMLAnchorElement> = (
  event,
) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Prevents keyboard activation when an anchor is disabled.
 */
const preventDisabledLinkKeyDown: KeyboardEventHandler<HTMLAnchorElement> = (
  event,
) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
  }
};

/**
 * Renders a Button using the configured Puzzle Link component.
 */
const renderLinkButton = ({
  href,
  variant = "primary",
  size = "md",
  leading,
  trailing,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  tabIndex,
  onClick,
  onKeyDown,
  "aria-disabled": ariaDisabled,
  "aria-busy": ariaBusy,
  ...linkProps
}: ButtonLinkProps) => {
  const isDisabled =
    disabled || loading || ariaDisabled === true || ariaDisabled === "true";

  const classes = getButtonClassName(
    variant,
    size,
    fullWidth,
    loading,
    className,
  );

  return (
    <Link
      {...linkProps}
      href={href}
      className={classes}
      aria-disabled={isDisabled ? true : ariaDisabled}
      aria-busy={loading ? true : ariaBusy}
      tabIndex={isDisabled ? -1 : tabIndex}
      onClick={isDisabled ? preventDisabledLinkClick : onClick}
      onKeyDown={isDisabled ? preventDisabledLinkKeyDown : onKeyDown}
    >
      <ButtonContent loading={loading} leading={leading} trailing={trailing}>
        {children}
      </ButtonContent>
    </Link>
  );
};

/**
 * Renders a native HTML button.
 */
const renderNativeButton = ({
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
  "aria-disabled": ariaDisabled,
  "aria-busy": ariaBusy,
  ...buttonProps
}: ButtonNativeProps) => {
  const isDisabled =
    disabled || loading || ariaDisabled === true || ariaDisabled === "true";

  const classes = getButtonClassName(
    variant,
    size,
    fullWidth,
    loading,
    className,
  );

  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled ? true : ariaDisabled}
      aria-busy={loading ? true : ariaBusy}
    >
      <ButtonContent loading={loading} leading={leading} trailing={trailing}>
        {children}
      </ButtonContent>
    </button>
  );
};

const isLinkButton = (props: ButtonProps): props is ButtonLinkProps => {
  return typeof props.href === "string";
};

const Button = (props: ButtonProps) => {
  if (isLinkButton(props)) {
    return renderLinkButton(props);
  }

  return renderNativeButton(props);
};

export { Button, type ButtonProps };
