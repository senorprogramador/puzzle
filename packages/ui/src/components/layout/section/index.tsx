import { cn } from "@puzzle-ui/core";
import type { ElementType } from "react";
import type { SectionProps } from "./types";
import { getContainerPresetClass } from "../container/container.utils";

import "./section.css";
import "../container/container.css";

export const Section = <C extends ElementType = "section">({
  children,
  className,
  style,
  theme = "default",
  fullWidth = false,
  noPadding = false,
  compactTop = false,
  compactBottom = false,
  divider = false,
  as,
  ...props
}: SectionProps<C>) => {
  const Component = as ?? "section";
  const constrainContent = theme !== "default" && !fullWidth;
  const content = (
    <>
      {children}
      {divider && <hr className="puzzle-section--divider" />}
    </>
  );

  return (
    <Component
      {...props}
      className={cn(
        "puzzle-section",
        !fullWidth &&
          !constrainContent && [
            "puzzle-container",
            getContainerPresetClass("container"),
          ],
        compactTop && "puzzle-section--compact-top",
        compactBottom && "puzzle-section--compact-bottom",
        noPadding && "puzzle-section--no-padding",
        className,
      )}
      style={style}
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
      ) : (
        content
      )}
    </Component>
  );
};
