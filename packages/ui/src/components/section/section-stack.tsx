import { cn } from "@puzzle/core";
import { cloneElement, isValidElement, type ReactNode, Children } from "react";
import { type SectionProps } from "./types";

type SectionStackProps = {
  children: ReactNode;
  className?: string;
};

const SectionStack = ({ children, className }: SectionStackProps) => {
  const sections = Children.toArray(children);

  const enhancedSections = sections.map((child, index) => {
    if (!isValidElement<SectionProps>(child)) {
      return child;
    }

    const previous = sections[index - 1];
    const next = sections[index + 1];

    const previousTheme = isValidElement<SectionProps>(previous)
      ? (previous.props.theme ?? "default")
      : undefined;

    const nextTheme = isValidElement<SectionProps>(next)
      ? (next.props.theme ?? "default")
      : undefined;

    const theme = child.props.theme ?? "default";
    return cloneElement(child, {
      compactTop: previousTheme === theme && index > 0,
      compactBottom: nextTheme === theme && index < sections.length - 1,
    });
  });

  return (
    <div className={cn("puzzle-section-stack", className)}>
      {enhancedSections}
    </div>
  );
};

export { SectionStack, type SectionStackProps };
