import { cn } from "@puzzle/core";
import type { ComponentPropsWithRef, ElementType } from "react";
import "./sidebar.css";

type SidebarOwnProps<C extends ElementType> = {
  as?: C;
};

type SidebarProps<C extends ElementType = "aside"> = SidebarOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof SidebarOwnProps<C> | "as">;

const Sidebar = <C extends ElementType = "aside">({
  as,
  className,
  children,
  ...props
}: SidebarProps<C>) => {
  const Component = as ?? "aside";
  const classes = cn("puzzle-sidebar", className);
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export { Sidebar, type SidebarProps };
