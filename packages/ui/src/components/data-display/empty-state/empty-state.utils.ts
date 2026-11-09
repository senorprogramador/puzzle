import { cn } from "@puzzle-ui/core";

type EmptyStateSize = "sm" | "md" | "lg";
type EmptyStateVariant = "default" | "outlined" | "filled";

const getEmptyStateClasses = (
  size: EmptyStateSize,
  variant: EmptyStateVariant,
  className?: string,
) =>
  cn(
    "puzzle-empty-state",
    `puzzle-empty-state--${size}`,
    `puzzle-empty-state--${variant}`,
    className,
  );

export { getEmptyStateClasses };
