import type { HTMLAttributes } from "react";
import { cn } from "@puzzle-ui/core";
import { getEmptyStateClasses } from "./empty-state.utils";

import "./empty-state.css";

type EmptyStateSize = "sm" | "md" | "lg";
type EmptyStateVariant = "default" | "outlined" | "filled";
type EmptyStateMediaVariant = "default" | "icon";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  size?: EmptyStateSize;
  variant?: EmptyStateVariant;
};

type EmptyStatePartProps = HTMLAttributes<HTMLDivElement>;

type EmptyStateMediaProps = EmptyStatePartProps & {
  variant?: EmptyStateMediaVariant;
};

const EmptyState = ({
  size = "md",
  variant = "default",
  className,
  children,
  ...props
}: EmptyStateProps) => (
  <div
    {...props}
    className={getEmptyStateClasses(size, variant, className)}
    data-size={size}
    data-variant={variant}
  >
    {children}
  </div>
);

const EmptyStateHeader = ({
  className,
  children,
  ...props
}: EmptyStatePartProps) => (
  <div {...props} className={cn("puzzle-empty-state__header", className)}>
    {children}
  </div>
);

const EmptyStateMedia = ({
  variant = "default",
  className,
  children,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  role,
  ...props
}: EmptyStateMediaProps) => (
  <div
    {...props}
    className={cn(
      "puzzle-empty-state__media",
      `puzzle-empty-state__media--${variant}`,
      className,
    )}
    data-variant={variant}
    role={ariaLabel ? (role ?? "img") : role}
    aria-label={ariaLabel}
    aria-hidden={ariaLabel ? undefined : (ariaHidden ?? true)}
  >
    {children}
  </div>
);

const EmptyStateTitle = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} className={cn("puzzle-empty-state__title", className)}>
    {children}
  </h3>
);

const EmptyStateDescription = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn("puzzle-empty-state__description", className)}>
    {children}
  </p>
);

const EmptyStateContent = ({
  className,
  children,
  ...props
}: EmptyStatePartProps) => (
  <div {...props} className={cn("puzzle-empty-state__content", className)}>
    {children}
  </div>
);

export {
  EmptyState,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateContent,
  type EmptyStateProps,
  type EmptyStateSize,
  type EmptyStateVariant,
  type EmptyStateMediaProps,
  type EmptyStateMediaVariant,
};
