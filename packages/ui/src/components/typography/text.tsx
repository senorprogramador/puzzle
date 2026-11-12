import { cn } from "@puzzle-ui/core";
import type { TypographyStyle } from "@puzzle-ui/theme";
import type { ComponentPropsWithRef, CSSProperties, ElementType } from "react";

type TextType = Omit<
  TypographyStyle,
  "headline1" | "headline2" | "headline3" | "headline4"
>;

type PolymorphicProps<E extends ElementType, OwnProps> = OwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof OwnProps | "as">;

type TextOwnProps = {
  type?: TextType;
  textAlign?: CSSProperties["textAlign"];
};

type TextProps<E extends ElementType = "span"> = PolymorphicProps<
  E,
  TextOwnProps
>;

const Text = <E extends ElementType = "span">({
  as,
  type = "body1",
  className,
  textAlign,
  style,
  ...props
}: TextProps<E>) => {
  const Component = as ?? "span";
  const classes = cn("puzzle-text", `puzzle-typography-${type}`, className);
  return (
    <Component
      {...props}
      className={classes}
      style={textAlign === undefined ? style : { ...style, textAlign }}
    ></Component>
  );
};

export { Text, type TextProps, type TextType };
