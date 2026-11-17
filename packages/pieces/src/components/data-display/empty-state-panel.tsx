import { useId, type ReactNode } from "react";
import {
  EmptyState,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
} from "@puzzle-ui/ui";

import "./data-display.css";

export type EmptyStatePanelProps = {
  title: ReactNode;
  description?: ReactNode;
  illustration?: ReactNode;
  illustrationLabel?: string;
  icon?: ReactNode;
  action?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  errorDetails?: ReactNode;
  children?: ReactNode;
  variant?: EmptyStateSectionVariant;
  status?: "status" | "alert" | "off";
  className?: string;
};

export type EmptyStateSectionVariant =
  | "centered"
  | "illustration"
  | "minimal"
  | "card"
  | "split"
  | "search"
  | "error"
  | "success"
  | "onboarding"
  | "full-page"
  | "compact"
  | "action";

export type EmptyStateSectionProps = EmptyStatePanelProps;

const EmptyStateView = ({
  title,
  description,
  illustration,
  illustrationLabel,
  icon,
  action,
  primaryAction,
  secondaryAction,
  errorDetails,
  children,
  variant = "card",
  status,
  className,
  headingLevel,
}: EmptyStatePanelProps & { headingLevel: 2 | 3 }) => {
  const titleId = useId();
  const announcementRole =
    status === "off" ? undefined : (status ?? (variant === "error" ? "alert" : undefined));
  const primary = primaryAction ?? action;
  const renderedTitle =
    headingLevel === 2 ? (
      <h2 id={titleId} className="puzzle-empty-state__title">
        {title}
      </h2>
    ) : (
      <EmptyStateTitle id={titleId}>{title}</EmptyStateTitle>
    );

  return (
    <section
      className={[
        "puzzle-empty-state-panel",
        "puzzle-empty-state-section",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
      aria-live={
        announcementRole === "alert"
          ? "assertive"
          : announcementRole === "status"
            ? "polite"
            : undefined
      }
      role={announcementRole}
      data-variant={variant}
    >
      <EmptyState variant="outlined">
        {illustration || icon ? (
          <EmptyStateMedia
            variant={icon ? "icon" : "default"}
            aria-label={illustrationLabel}
          >
            {icon ?? illustration}
          </EmptyStateMedia>
        ) : null}
        <EmptyStateHeader>
          {renderedTitle}
          {description && (
            <EmptyStateDescription>{description}</EmptyStateDescription>
          )}
        </EmptyStateHeader>
        {children || primary || secondaryAction || errorDetails ? (
          <EmptyStateContent>
            {children}
            {errorDetails ? (
              <details className="puzzle-empty-state-panel__error-details">
                <summary>Error details</summary>
                <div>{errorDetails}</div>
              </details>
            ) : null}
            {primary || secondaryAction ? (
              <div className="puzzle-empty-state-panel__action">
                {primary}
                {secondaryAction}
              </div>
            ) : null}
          </EmptyStateContent>
        ) : null}
      </EmptyState>
    </section>
  );
};

export const EmptyStateSection = (props: EmptyStateSectionProps) => (
  <EmptyStateView {...props} headingLevel={2} />
);

export const EmptyStatePanel = (props: EmptyStatePanelProps) => (
  <EmptyStateView {...props} headingLevel={3} />
);
