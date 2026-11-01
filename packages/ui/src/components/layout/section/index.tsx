import { cn } from "@puzzle/core";
import type { SectionProps } from "./types";

import "./section.css";
import "../container/container.css";

export const Section = ({
  children,
  className,
  theme = "default",
  fullWidth = false,
  noPadding = false,
  compactTop = false,
  compactBottom = false,
  divider = false,
}: SectionProps) => {
  return (
    <section
      className={cn(
        "puzzle-section",
        !fullWidth && "puzzle-container",
        compactTop && "puzzle-section--compact-top",
        compactBottom && "puzzle-section--compact-bottom",
        noPadding && "puzzle-section--no-padding",
        className,
      )}
      data-theme={theme}
    >
      {children}
      {divider && <hr className="puzzle-section--divider" />}
    </section>
  );
};
