import { cn } from "@puzzle-ui/core";
import type { SectionProps } from "./types";
import { getContainerPresetClass } from "../container/container.utils";

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
  as: Component = "section",
}: SectionProps) => {
  const constrainContent = theme !== "default" && !fullWidth;
  const content = (
    <>
      {children}
      {divider && <hr className="puzzle-section--divider" />}
    </>
  );

  return (
    <Component
      className={cn(
        "puzzle-section",
        !fullWidth && !constrainContent && [
          "puzzle-container",
          getContainerPresetClass("container"),
        ],
        compactTop && "puzzle-section--compact-top",
        compactBottom && "puzzle-section--compact-bottom",
        noPadding && "puzzle-section--no-padding",
        className,
      )}
      data-theme={theme}
    >
      {constrainContent ? (
        <div
          className={cn(
            "puzzle-section__content",
            "puzzle-container",
            getContainerPresetClass("container"),
          )}
        >
          {content}
        </div>
      ) : content}
    </Component>
  );
};
