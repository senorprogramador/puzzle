"use client";

import { cn } from "@puzzle/core";
import { type ComponentPropsWithRef, type ElementType } from "react";
import "./backdrop.css";
import { Transition } from "../transition/transition";

type BackdropOwnProps<C extends ElementType> = {
  as?: C;
  open?: boolean;
  onClick?: () => void;
};

type BackdropProps<C extends ElementType = "div"> = BackdropOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof BackdropOwnProps<C> | "as">;

const Backdrop = <C extends ElementType = "div">({
  as,
  open = true,
  onClick,
  className,
  children,
  ...props
}: BackdropProps<C>) => {
  const Component = as ?? "div";
  const classes = cn("puzzle-backdrop", className);

  return (
    <Transition visible={open} template="fade">
      <Component className={classes} {...props} onClick={onClick}>
        {children}
      </Component>
    </Transition>
  );
};

export { Backdrop, type BackdropProps };
