import type {
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from "react";
import type { HeadingLevel } from "../../typography/heading";

type SectionHeaderOwnProps = {
  actions?: ReactNode;
  alignment?: SectionHeaderAlignment;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  titleAs?: ElementType;
  titleId?: string;
  titleLevel?: HeadingLevel;
};

export type SectionHeaderAlignment = "start" | "center" | "end";

export type SectionHeaderProps = Omit<
  ComponentPropsWithRef<"header">,
  keyof SectionHeaderOwnProps | "children"
> &
  SectionHeaderOwnProps;
