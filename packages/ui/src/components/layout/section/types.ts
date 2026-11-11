import { type ComponentPropsWithRef, type ElementType } from "react";

export type SectionTheme =
  | "default"
  | "light"
  | "dark"
  | "primary"
  | "secondary"
  | "accent";

export type SectionOwnProps<C extends ElementType = "section"> = {
  as?: C;
  theme?: SectionTheme;
  fullWidth?: boolean;
  noPadding?: boolean;

  /** Internal: set by SectionStack. */
  compactTop?: boolean;
  compactBottom?: boolean;
  divider?: boolean;
};

export type SectionProps<C extends ElementType = "section"> = Omit<
  ComponentPropsWithRef<C>,
  keyof SectionOwnProps<C> | "as"
> &
  SectionOwnProps<C>;
