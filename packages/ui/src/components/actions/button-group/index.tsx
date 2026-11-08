"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@puzzle-ui/core";

import "./button-group.css";

type ButtonGroupOwnProps<C extends ElementType> = {
  as?: C;
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  spacing?: number | string;
  className?: string;
  children?: ReactNode;
};

type ButtonGroupProps<C extends ElementType = "div"> = ButtonGroupOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof ButtonGroupOwnProps<C> | "as">;

const ButtonGroup = <C extends ElementType = "div">({
  as,
  orientation = "horizontal",
  attached = false,
  fullWidth = false,
  disabled = false,
  spacing,
  className,
  children,
  style,
  ...props
}: ButtonGroupProps<C>) => {
  const Component = as ?? "div";

  const classes = cn(
    "puzzle-button-group",
    `puzzle-button-group--${orientation}`,
    attached && "puzzle-button-group--attached",
    fullWidth && "puzzle-button-group--full-width",
    disabled && "puzzle-button-group--disabled",
    className,
  );

  const groupStyle = {
    ...style,
    ...(spacing !== undefined
      ? {
          "--puzzle-button-group-gap":
            typeof spacing === "number" ? `${spacing}px` : spacing,
        }
      : {}),
  } as ComponentPropsWithRef<C>["style"];

  return (
    <Component
      {...props}
      className={classes}
      style={groupStyle}
      role={props.role ?? "group"}
      aria-disabled={disabled || undefined}
    >
      {Children.map(children, (child) =>
        disabled && isValidElement<{ disabled?: boolean }>(child)
          ? cloneElement(child, { disabled: true })
          : child,
      )}
    </Component>
  );
};

export { ButtonGroup, type ButtonGroupProps };
