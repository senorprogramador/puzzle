import type {
  ContainerProps,
  SectionHeaderAlignment,
  SectionProps as UISectionProps,
  SectionTheme as UISectionTheme,
} from "@puzzle-ui/ui";
import type { ElementType } from "react";

export type SectionAlignment = SectionHeaderAlignment;

export type SectionContentWidth = NonNullable<ContainerProps["widthPreset"]>;

export type SectionTheme = UISectionTheme;

export type SectionRootProps<C extends ElementType = "section"> = Omit<
  UISectionProps<C>,
  "compactTop" | "compactBottom" | "divider"
>;
