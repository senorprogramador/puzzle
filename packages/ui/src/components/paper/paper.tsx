import { cn } from "@puzzle/core";
import type { ComponentPropsWithRef, ElementType } from "react";
import "./paper.css";

type PaperOwnProps<C extends ElementType> = {
  as?: C;
  elevation?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;
};

type PaperProps<C extends ElementType> = PaperOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof PaperOwnProps<C>>;

const Paper = <C extends ElementType = "div">({
  as,
  elevation = 1,
  children,
  className,
  ...rest
}: PaperProps<C>) => {
  const Component = as || "div";
  const classes = cn("puzzle-paper", `elevation-${elevation}`, className);
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export { Paper, type PaperProps };
