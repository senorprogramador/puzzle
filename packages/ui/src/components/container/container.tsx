import type { ElementType, ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@puzzle/core";
import "./container.css";

type ContainerOwnProps<C extends ElementType> = {
  as?: C;
  className?: string;
  children?: ReactNode;
};

type ContainerProps<C extends ElementType = "div"> = ContainerOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof ContainerOwnProps<C> | "as">;

const Container = <C extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<C>) => {
  const Component = (as ?? "div") as ElementType;
  const classes = cn("puzzle-container", className);

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export { Container, type ContainerProps };
