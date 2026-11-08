import { BREAKPOINTS, cn } from "@puzzle-ui/core";
import {
  Children,
  cloneElement,
  createElement,
  Fragment,
  isValidElement,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
} from "react";
import type { ResponsiveValue } from "@puzzle-ui/core";
import "./stack.css";

type StackDirection = "row" | "col";
type ResponsiveDirection = ResponsiveValue<StackDirection>;

type StackMainAlignment =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "around"
  | "between"
  | "evenly";

type StackCrossAlignment = "start" | "center" | "end" | "stretch";

type StackRowProps = {
  direction: "row";
  alignH?: StackMainAlignment;
  alignV?: StackCrossAlignment;
};

type StackColProps = {
  direction?: "col";
  alignH?: StackCrossAlignment;
  alignV?: StackMainAlignment;
};

type StackResponsiveProps = {
  direction: ResponsiveDirection;
  alignH?: StackMainAlignment;
  alignV?: StackMainAlignment;
};

type StackOwnProps<C extends ElementType> = {
  as?: C;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  gap?: "0" | "xs" | "sm" | "md" | "lg" | "xl";
  divider?: ReactNode;
  reverse?: boolean;
} & (StackRowProps | StackColProps | StackResponsiveProps);

type StackProps<C extends ElementType = "div"> = StackOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof StackOwnProps<C> | "as">;

const Stack = ({
  as: Component = "div",
  direction = "col",
  alignH,
  alignV,
  wrap = "nowrap",
  gap = "md",
  divider,
  reverse = false,
  children,
  className,
  ...props
}: StackProps<ElementType>) => {
  const directions: ResponsiveDirection =
    typeof direction === "string"
      ? { mobile: direction }
      : {
          ...direction,
          mobile: direction.mobile ?? "col",
        };

  const directionClasses = BREAKPOINTS.flatMap((breakpoint) => {
    const value = directions[breakpoint];

    return value ? [`direction-${breakpoint}-${value}`] : [];
  });

  const hasAlignment = alignH !== undefined || alignV !== undefined;

  const classes = cn(
    "puzzle-stack",
    ...directionClasses,
    reverse && "reverse",
    wrap,
    `gap-${gap}`,
    alignH && `align-h-${alignH}`,
    alignV && `align-v-${alignV}`,
    hasAlignment && "has-alignment",
    className,
  );

  const childrenWithDividers = divider
    ? Children.toArray(children).flatMap((child, index, arr) => {
        if (index === arr.length - 1) {
          return [child];
        }

        // Children keep the keys assigned by Children.toArray; only dividers get new ones.
        const dividerKey = `stack-divider-${isValidElement(child) ? child.key : index}`;
        const clonedDivider = isValidElement(divider)
          ? cloneElement(divider, { key: dividerKey })
          : createElement(Fragment, { key: dividerKey }, divider);

        return [child, clonedDivider];
      })
    : children;

  return (
    <Component className={classes} {...props}>
      {childrenWithDividers}
    </Component>
  );
};

export {
  Stack,
  type StackProps,
  type ResponsiveDirection,
  type StackMainAlignment,
  type StackCrossAlignment,
};
