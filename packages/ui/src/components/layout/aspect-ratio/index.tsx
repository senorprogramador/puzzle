import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { getAspectRatioStyle } from "./aspect-ratio.utils";
import "./aspect-ratio.css";

type AspectRatioOwnProps<C extends ElementType> = {
  as?: C;
  ratio?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type AspectRatioProps<C extends ElementType = "div"> = AspectRatioOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof AspectRatioOwnProps<C> | "as">;

const AspectRatio = <C extends ElementType = "div">({
  as,
  ratio = 1,
  className,
  style,
  children,
  ...rest
}: AspectRatioProps<C>) => {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn("puzzle-aspect-ratio", className)}
      style={getAspectRatioStyle(ratio, style)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export { AspectRatio, type AspectRatioProps };
