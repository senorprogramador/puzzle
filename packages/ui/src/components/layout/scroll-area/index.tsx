import { cn } from "@puzzle-ui/core";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { getScrollAreaOverflow } from "./scroll-area.utils";
import type { ScrollAreaOrientation } from "./scroll-area.utils";
import "./scroll-area.css";

type ScrollAreaProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /**
   * Content rendered inside the scrollable viewport.
   */
  children?: ReactNode;

  /**
   * The axis or axes that can scroll.
   * @default "vertical"
   */
  orientation?: ScrollAreaOrientation;
};

const ScrollArea = ({
  orientation = "vertical",
  children,
  className,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: ScrollAreaProps) => {
  const overflow = getScrollAreaOverflow(orientation);
  const accessibleName = ariaLabel || ariaLabelledBy;

  return (
    <div
      {...props}
      ref={ref}
      role={role ?? (accessibleName ? "region" : undefined)}
      tabIndex={tabIndex ?? 0}
      className={cn("puzzle-scroll-area", className)}
      data-orientation={orientation}
      style={{ ...overflow, ...props.style }}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </div>
  );
};

export { ScrollArea, type ScrollAreaProps, type ScrollAreaOrientation };
