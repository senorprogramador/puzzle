import { cn } from "@puzzle/core";
import type { TypographyStyle } from "@puzzle/theme";
import type { ComponentPropsWithRef, ElementType } from "react";

type TextVariant = Omit<
  TypographyStyle,
  "headline1" | "headline2" | "headline3" | "headline4"
>;

type PolymorphicProps<E extends ElementType, OwnProps> = OwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof OwnProps | "as">;

type TextOwnProps = {
  variant?: TextVariant;
};

type TextProps<E extends ElementType = "span"> = PolymorphicProps<
  E,
  TextOwnProps
>;

const Text = <E extends ElementType = "span">({
  as,
  variant = "body1",
  className,
  ...props
}: TextProps<E>) => {
  const Component = as ?? "span";
  const classes = cn("puzzle-text", `puzzle-typography-${variant}`, className);
  return <Component {...props} className={classes}></Component>;
};

export { Text, type TextProps, type TextVariant };
