import type { ElementType, ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@puzzle/core";
import {
  getContainerPresetClass,
  type ContainerWidthPreset,
} from "./container.utils";
import "./container.css";

type ContainerOwnProps<C extends ElementType> = {
  as?: C;
  className?: string;
  children?: ReactNode;
  widthPreset?: ContainerWidthPreset;
};

type ContainerProps<C extends ElementType = "div"> = ContainerOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof ContainerOwnProps<C> | "as">;

const Container = <C extends ElementType = "div">({
  as,
  className,
  children,
  widthPreset = "container",
  ...rest
}: ContainerProps<C>) => {
  const Component = (as ?? "div") as ElementType;

  const classes = cn(
    "puzzle-container",
    getContainerPresetClass(widthPreset),
    className,
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export { Container, type ContainerProps, type ContainerWidthPreset };
