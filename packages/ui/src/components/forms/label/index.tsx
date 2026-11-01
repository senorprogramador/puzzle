import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@puzzle/core";
import "./label.css";

type LabelProps = Omit<ComponentPropsWithoutRef<"label">, "children"> & {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
};

const Label = ({
  children,
  required = false,
  optional = false,
  className,
  ...props
}: LabelProps) => (
  <label {...props} className={cn("puzzle-label", className)}>
    <span className="puzzle-label__text">{children}</span>

    {required && (
      <span className="puzzle-label__required" aria-hidden="true">
        *
      </span>
    )}

    {optional && <span className="puzzle-label__optional">Optional</span>}
  </label>
);

export { Label, type LabelProps };
