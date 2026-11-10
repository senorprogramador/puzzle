import type { ComponentPropsWithRef } from "react";

type RatingSize = "sm" | "md" | "lg";

type RatingProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue" | "role" | "value"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  precision?: 0.5 | 1;
  size?: RatingSize;
  readOnly?: boolean;
  disabled?: boolean;
  color?: string;
  emptyColor?: string;
};

export type { RatingProps, RatingSize };
