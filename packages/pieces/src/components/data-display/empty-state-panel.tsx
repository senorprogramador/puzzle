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
  action?: ReactNode;
  className?: string;
};

export const EmptyStatePanel = ({
  title,
  description,
  illustration,
  action,
  className,
}: EmptyStatePanelProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-empty-state-panel", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <EmptyState variant="outlined">
        {illustration && <EmptyStateMedia>{illustration}</EmptyStateMedia>}
        <EmptyStateHeader>
          <EmptyStateTitle id={titleId}>{title}</EmptyStateTitle>
          {description && (
            <EmptyStateDescription>{description}</EmptyStateDescription>
          )}
        </EmptyStateHeader>
        {action && <EmptyStateContent>{action}</EmptyStateContent>}
      </EmptyState>
    </section>
  );
};
