import { cn } from "@puzzle-ui/core";
import type { ComponentPropsWithRef } from "react";
import { getSeparatorSemantics } from "./separator.utils";
import type { SeparatorOrientation } from "./separator.utils";
import "./separator.css";

type SeparatorProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "role" | "aria-orientation"
> & {
  /**
   * The orientation of the separator.
   * @default "horizontal"
   */
  orientation?: SeparatorOrientation;

  /**
   * Whether the separator is purely decorative.
   * Decorative separators are hidden from assistive technology.
   * @default true
   */
  decorative?: boolean;
};

const Separator = ({
  orientation = "horizontal",
  decorative = true,
  className,
  ref,
  ...props
}: SeparatorProps) => {
  const semantics = getSeparatorSemantics(orientation, decorative);

  return (
    <div
      {...props}
      {...semantics}
      ref={ref}
      className={cn("puzzle-separator", className)}
      data-orientation={orientation}
    />
  );
};

export { Separator, type SeparatorProps, type SeparatorOrientation };
