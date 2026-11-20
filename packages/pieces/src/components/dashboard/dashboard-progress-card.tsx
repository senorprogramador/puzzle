import { useId } from "react";
import { LinearProgress, Heading, Text } from "@puzzle-ui/ui";

import "./dashboard.css";

import type { DashboardProgressCardProps } from "./dashboard.types";

export const DashboardProgressCard = ({
  title,
  description,
  value,
  status,
  action,
  className,
}: DashboardProgressCardProps) => {
  const titleId = useId();

  return (
    <article
      className={["puzzle-dashboard-progress-card", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <div className="puzzle-dashboard-progress-card__header">
        <div>
          <Heading level="headline2" as="h2" id={titleId} className="puzzle-dashboard-progress-card__title">
            {title}
          </Heading>
          {description && (
            <Text as="p" className="puzzle-dashboard-progress-card__description">
              {description}
            </Text>
          )}
        </div>
        <span className="puzzle-dashboard-progress-card__value">{value}%</span>
      </div>
      <LinearProgress
        className="puzzle-dashboard-progress-card__progress"
        value={value}
        aria-labelledby={titleId}
      />
      {(status || action) && (
        <div className="puzzle-dashboard-progress-card__footer">
          {status && (
            <span className="puzzle-dashboard-progress-card__status">
              {status}
            </span>
          )}
          {action && (
            <div className="puzzle-dashboard-progress-card__action">
              {action}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
