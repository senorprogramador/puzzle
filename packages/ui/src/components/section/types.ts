import { type ReactNode } from "react";

export type SectionTheme =
  | "default"
  | "light"
  | "dark"
  | "primary"
  | "secondary"
  | "accent";

export type SectionProps = {
  children?: ReactNode;
  className?: string;
  theme?: SectionTheme;
  fullWidth?: boolean;
  noPadding?: boolean;

  /** Internal: set by SectionStack. */
  compactTop?: boolean;
  compactBottom?: boolean;
};
