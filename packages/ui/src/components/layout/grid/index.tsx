import { BREAKPOINTS, cn, type ResponsiveValue } from "@puzzle-ui/core";
import {
  createElement,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import "./grid.css";

type GridGap = "0" | "xs" | "sm" | "md" | "lg" | "xl";
type GridAlignment = "start" | "center" | "end" | "stretch";
type GridTracks = number | string;
type GridSpan = number | "full";
type GridLine = number | "auto";
type GridAutoFlow = NonNullable<CSSProperties["gridAutoFlow"]>;

type RootProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type GridOwnProps<C extends ElementType> = RootProps<C> & {
  columns?: ResponsiveValue<GridTracks>;
  rows?: ResponsiveValue<GridTracks>;
  minChildWidth?: ResponsiveValue<string>;
  gap?: ResponsiveValue<GridGap>;
  rowGap?: ResponsiveValue<GridGap>;
  columnGap?: ResponsiveValue<GridGap>;
  alignH?: ResponsiveValue<GridAlignment>;
  alignV?: ResponsiveValue<GridAlignment>;
  autoFlow?: ResponsiveValue<GridAutoFlow>;
};

type GridProps<C extends ElementType = "div"> = GridOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof GridOwnProps<C>>;

type GridItemOwnProps<C extends ElementType> = RootProps<C> & {
  colSpan?: ResponsiveValue<GridSpan>;
  rowSpan?: ResponsiveValue<number>;
  colStart?: ResponsiveValue<GridLine>;
  rowStart?: ResponsiveValue<GridLine>;
  alignH?: ResponsiveValue<GridAlignment | "auto">;
  alignV?: ResponsiveValue<GridAlignment | "auto">;
};

type GridItemProps<C extends ElementType = "div"> = GridItemOwnProps<C> &
  Omit<ComponentPropsWithRef<C>, keyof GridItemOwnProps<C>>;

type GridStyle = CSSProperties &
  Record<`--puzzle-grid-${string}`, string | number | undefined>;

const responsiveStyle = <T extends string | number>(
  property: string,
  value: ResponsiveValue<T>,
  format: (value: T) => string | number = (value) => value,
): GridStyle => {
  const styles: GridStyle = {};
  if (value === undefined) return styles;

  let current = typeof value === "object" ? value.mobile : value;
  for (const breakpoint of BREAKPOINTS) {
    if (typeof value === "object") {
      current = value[breakpoint] ?? current;
    }
    styles[`--puzzle-grid-${property}-${breakpoint}`] = format(current);
  }
  return styles;
};

const positiveInteger = (value: number, prop: string) => {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`Grid ${prop} must be a positive integer.`);
  }
  return value;
};

const tracks = (value: GridTracks) =>
  typeof value === "number"
    ? `repeat(${positiveInteger(value, "columns/rows")}, minmax(0, 1fr))`
    : value;

const span = (value: number) => `span ${positiveInteger(value, "span")}`;

const line = (value: GridLine) => {
  if (typeof value === "number" && (!Number.isInteger(value) || value === 0)) {
    throw new RangeError("Grid start lines must be non-zero integers or auto.");
  }
  return value;
};

const gaps: Record<GridGap, string> = {
  "0": "0",
  xs: "var(--puzzle-space-1, 0.25rem)",
  sm: "var(--puzzle-space-2, 0.5rem)",
  md: "var(--puzzle-space-4, 1rem)",
  lg: "var(--puzzle-space-8, 2rem)",
  xl: "var(--puzzle-space-16, 4rem)",
};

const Grid = <C extends ElementType = "div">({
  as,
  columns = 1,
  rows = "none",
  minChildWidth,
  gap = "md",
  rowGap = gap,
  columnGap = gap,
  alignH = "stretch",
  alignV = "stretch",
  autoFlow = "row",
  children,
  className,
  style,
  ...props
}: GridProps<C>) =>
  createElement(
    as ?? "div",
    {
      ...props,
      className: cn("puzzle-grid", className),
      style: {
        ...responsiveStyle("columns", columns, tracks),
        ...responsiveStyle(
          "columns",
          minChildWidth,
          (width) => `repeat(auto-fit, minmax(min(100%, ${width}), 1fr))`,
        ),
        ...responsiveStyle("rows", rows, tracks),
        ...responsiveStyle("row-gap", rowGap, (value) => gaps[value]),
        ...responsiveStyle("column-gap", columnGap, (value) => gaps[value]),
        ...responsiveStyle("align-h", alignH),
        ...responsiveStyle("align-v", alignV),
        ...responsiveStyle("auto-flow", autoFlow),
        ...style,
      },
    },
    children,
  );

const GridItem = <C extends ElementType = "div">({
  as,
  colSpan = 1,
  rowSpan = 1,
  colStart,
  rowStart = "auto",
  alignH = "auto",
  alignV = "auto",
  children,
  className,
  style,
  ...props
}: GridItemProps<C>) =>
  createElement(
    as ?? "div",
    {
      ...props,
      className: cn("puzzle-grid-item", className),
      style: {
        ...responsiveStyle("item-column-end", colSpan, (value) =>
          value === "full" ? "-1" : span(value),
        ),
        ...responsiveStyle("item-column-start", colSpan, (value) =>
          value === "full" ? "1" : "auto",
        ),
        ...responsiveStyle("item-row-span", rowSpan, span),
        ...responsiveStyle("item-column-start", colStart, line),
        ...responsiveStyle("item-row-start", rowStart, line),
        ...responsiveStyle("item-align-h", alignH),
        ...responsiveStyle("item-align-v", alignV),
        ...style,
      },
    },
    children,
  );

export {
  Grid,
  GridItem,
  type GridProps,
  type GridItemProps,
  type GridGap,
  type GridAlignment,
  type GridTracks,
  type GridSpan,
  type GridLine,
  type GridAutoFlow,
};
