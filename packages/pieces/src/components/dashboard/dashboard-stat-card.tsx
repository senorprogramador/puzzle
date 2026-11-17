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
        <h2 id={labelId} className="puzzle-dashboard-stat-card__label">
          {label}
        </h2>
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
        <p className="puzzle-dashboard-stat-card__value">{value}</p>
      ) : null}
      {description && !loading && (
        <p className="puzzle-dashboard-stat-card__description">{description}</p>
      )}
      {trend && !loading && (
        <p
          className="puzzle-dashboard-stat-card__trend"
          data-direction={trend.direction ?? "neutral"}
        >
          <span>{trend.value}</span>
          <span>{trend.label}</span>
        </p>
      )}
      {action && (
        <div className="puzzle-dashboard-stat-card__action">{action}</div>
      )}
    </article>
  );
};
