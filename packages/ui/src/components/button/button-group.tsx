"use client";

import { cn } from "@puzzle/core";
import {
  type MouseEvent,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  Children,
  isValidElement,
  cloneElement,
  useState,
} from "react";
import type { ButtonVariant } from "./button.types";
import "./button-group.css";
import { type ButtonProps } from "./button";

type ButtonGroupOwnProps<C extends ElementType> = {
  as?: C;
  variant?: ButtonVariant;
  exclusive?: boolean;
  direction?: "row" | "column";
  initialActiveIndices?: number[];
  onClick?: (
    clickedIndex: number,
    active: boolean,
    e: MouseEvent<HTMLButtonElement>,
  ) => void;
  className?: string;
  children?: ReactNode;
};

type ButtonGroupProps<C extends ElementType = "div"> = ButtonGroupOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof ButtonGroupOwnProps<C> | "as">;

const ButtonGroup = <C extends ElementType = "div">({
  as,
  className,
  variant,
  direction = "row",
  exclusive = false,
  initialActiveIndices = [],
  onClick,
  children,
  ...props
}: ButtonGroupProps<C>) => {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(
    new Set(initialActiveIndices),
  );

  const Component = (as ?? "div") as ElementType;
  const classes = cn(
    "puzzle-button-group",
    `puzzle-button-group--${direction}`,
    className,
  );

  const clonedChildren = Children.map(children, (child, index) => {
    if (!isValidElement<ButtonProps>(child)) {
      return child;
    }
    const isActive = activeIndices.has(index);
    const resolvedVariant =
      variant === "toggle" && isActive ? "toggle-active" : variant;
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      setActiveIndices((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          if (exclusive) {
            newSet.clear();
          }
          newSet.add(index);
        }
        const active = newSet.has(index);
        onClick?.(index, active, e);
        return newSet;
      });
    };
    return cloneElement(child, {
      ...child.props,
      variant: resolvedVariant,
      onClick: handleClick,
    });
  });

  return (
    <Component className={classes} {...props}>
      {clonedChildren}
    </Component>
  );
};

export { ButtonGroup, type ButtonGroupProps };
