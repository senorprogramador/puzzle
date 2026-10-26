import { cn } from "@puzzle/core";
import type { SectionProps } from "./types";
import { Container } from "../container/container";

import "./section.css";

export function Section({
  children,
  className,
  theme = "default",
  fullWidth = false,
  noPadding = false,
  compactTop = false,
  compactBottom = false,
}: SectionProps) {
  const content = fullWidth ? children : <Container>{children}</Container>;

  return (
    <section
      className={cn(
        "puzzle-section",
        compactTop && "puzzle-section--compact-top",
        compactBottom && "puzzle-section--compact-bottom",
        noPadding && "puzzle-section--no-padding",
        className,
      )}
      data-theme={theme}
    >
      {content}
    </section>
  );
}
