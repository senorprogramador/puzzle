import { cn } from "@puzzle/core";
import type { ComponentPropsWithRef, ElementType } from "react";

type HeadingVariant =
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
  variant: HeadingVariant;
};

type HeadingProps<E extends ElementType = "h2"> = PolymorphicProps<
  E,
  HeadingOwnProps
>;

const Heading = <E extends ElementType = "h2">({
  variant,
  as,
  className,
  ...props
}: HeadingProps<E>) => {
  const Component = as ?? "h2";
  const classes = cn(
    "puzzle-heading",
    `puzzle-typography-${variant}`,
    className,
  );
  return <Component className={classes} {...props}></Component>;
};

export { Heading, type HeadingProps, type HeadingVariant };
