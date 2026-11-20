import { cn } from "@puzzle-ui/core";
import { Section, SectionHeader } from "@puzzle-ui/ui";
import type { SectionProps as UISectionProps } from "@puzzle-ui/ui";
import type { ElementType, ReactNode } from "react";
import type { SectionAlignment, SectionRootProps } from "../section";

export type MarketingSectionBaseProps<
  C extends ElementType = "section",
> = Omit<SectionRootProps<C>, "children" | "title"> & {
  actions?: ReactNode;
  alignment?: SectionAlignment;
  children?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  titleAs?: ElementType;
};

type MarketingSectionProps<C extends ElementType> =
  MarketingSectionBaseProps<C> & {
    family: string;
    variant: string;
  };

export const MarketingSection = <C extends ElementType = "section">({
  actions,
  alignment,
  children,
  description,
  eyebrow,
  family,
  title,
  titleAs,
  variant,
  className,
  ...sectionProps
}: MarketingSectionProps<C>) => {
  const hasHeader = Boolean(eyebrow || title || description || actions);
  const nativeProps = sectionProps as UISectionProps<C>;

  return (
    <Section<C>
      {...nativeProps}
      className={cn("puzzle-marketing-section", className)}
      data-marketing-family={family}
      data-variant={variant}
    >
      {hasHeader ? (
        <SectionHeader
          actions={actions}
          alignment={alignment}
          className="puzzle-marketing-section__header"
          description={description}
          eyebrow={eyebrow}
          title={title}
          titleAs={titleAs}
        />
      ) : null}
      {children}
    </Section>
  );
};
