import { Heading, Text } from "@puzzle-ui/ui";
import { useId } from "react";

import "./dashboard.css";

import type { DashboardStatCardProps } from "./dashboard.types";

export const DashboardStatCard = ({
  label,
  value,
  description,
  icon,
  trend,
  action,
  loading = false,
  className,
}: DashboardStatCardProps) => {
  const labelId = useId();

  return (
    <article
      className={["puzzle-dashboard-stat-card", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={labelId}
      aria-busy={loading || undefined}
    >
      <div className="puzzle-dashboard-stat-card__header">
        <Heading level="headline2" as="h2" id={labelId} className="puzzle-dashboard-stat-card__label">
          {label}
        </Heading>
        {icon && (
          <span className="puzzle-dashboard-stat-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <span
          className="puzzle-dashboard-stat-card__skeleton"
          aria-hidden="true"
        />
      ) : value !== undefined ? (
        <Text as="p" className="puzzle-dashboard-stat-card__value">{value}</Text>
      ) : null}
      {description && !loading && (
        <Text as="p" className="puzzle-dashboard-stat-card__description">{description}</Text>
      )}
      {trend && !loading && (
        <Text as="p"
          className="puzzle-dashboard-stat-card__trend"
          data-direction={trend.direction ?? "neutral"}
        >
          <span>{trend.value}</span>
          <span>{trend.label}</span>
        </Text>
      )}
      {action && (
        <div className="puzzle-dashboard-stat-card__action">{action}</div>
      )}
    </article>
  );
};
