import { cn } from "@puzzle-ui/core";
import type { ComponentPropsWithRef, CSSProperties, ElementType } from "react";

type HeadingLevel =
  | "display1"
  | "display2"
  | "headline1"
  | "headline2"
  | "headline3"
  | "headline4";

type PolymorphicProps<E extends ElementType, OwnProps> = OwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof OwnProps | "as">;

type HeadingOwnProps = {
  level: HeadingLevel;
  textAlign?: CSSProperties["textAlign"];
};

type HeadingProps<E extends ElementType = "h2"> = PolymorphicProps<
  E,
  HeadingOwnProps
>;

const Heading = <E extends ElementType = "h2">({
  level,
  as,
  className,
  textAlign,
  style,
  ...props
}: HeadingProps<E>) => {
  const Component = as ?? "h2";
  const classes = cn("puzzle-heading", `puzzle-typography-${level}`, className);
  return (
    <Component
      {...props}
      className={classes}
      style={textAlign === undefined ? style : { ...style, textAlign }}
    ></Component>
  );
};

export { Heading, type HeadingProps, type HeadingLevel };
