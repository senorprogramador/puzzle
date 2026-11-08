import { cn } from "@puzzle-ui/core";
import { cloneElement, isValidElement, type ReactElement, type ReactNode, Children } from "react";
import { Section } from "../section";
import { type SectionProps } from "../section/types";

const isSection = (node: ReactNode): node is ReactElement<SectionProps> =>
  isValidElement(node) && node.type === Section;

type SectionStackProps = {
  children: ReactNode;
  className?: string;
  divideY?: boolean;
};

const SectionStack = ({ children, className, divideY }: SectionStackProps) => {
  const sections = Children.toArray(children);

  const enhancedSections = sections.map((child, index) => {
    if (!isSection(child)) {
      return child;
    }

    const previous = sections[index - 1];
    const next = sections[index + 1];

    const previousTheme = isSection(previous)
      ? (previous.props.theme ?? "default")
      : undefined;

    const nextTheme = isSection(next)
      ? (next.props.theme ?? "default")
      : undefined;

    const theme = child.props.theme ?? "default";
    return cloneElement(child, {
      compactTop: previousTheme === theme && index > 0,
      compactBottom: nextTheme === theme && index < sections.length - 1,
      divider: divideY && index < sections.length - 1,
    });
  });

  return (
    <div className={cn("puzzle-section-stack", className)}>
      {enhancedSections}
    </div>
  );
};

export { SectionStack, type SectionStackProps };
