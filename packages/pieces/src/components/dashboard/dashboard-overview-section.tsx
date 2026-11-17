import { useId } from "react";
import { Skeleton } from "@puzzle-ui/ui";

import "./dashboard-overview-section.css";

import type {
  DashboardOverviewSectionProps,
  DashboardOverviewSectionVariant,
} from "./dashboard-overview-section.types";

export const DashboardOverviewSection = ({
  title,
  description,
  eyebrow,
  variant = "grid",
  summary,
  metrics,
  charts,
  dateRange,
  actions,
  children,
  loading = false,
  error,
  className,
}: DashboardOverviewSectionProps) => {
  const titleId = useId();

  return (
    <section
      className={[
        "puzzle-dashboard-overview",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-variant={variant satisfies DashboardOverviewSectionVariant}
      aria-labelledby={titleId}
      aria-busy={loading && !error || undefined}
    >
      <header className="puzzle-dashboard-overview__header">
        <div className="puzzle-dashboard-overview__heading">
          {eyebrow ? (
            <p className="puzzle-dashboard-overview__eyebrow">{eyebrow}</p>
          ) : null}
          <h2 id={titleId} className="puzzle-dashboard-overview__title">
            {title}
          </h2>
          {description ? (
            <p className="puzzle-dashboard-overview__description">
              {description}
            </p>
          ) : null}
        </div>
        {dateRange || actions ? (
          <div className="puzzle-dashboard-overview__controls">
            {dateRange ? (
              <div className="puzzle-dashboard-overview__date-range">
                {dateRange}
              </div>
            ) : null}
            {actions ? (
              <div className="puzzle-dashboard-overview__actions">
                {actions}
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      {error ? (
        <div className="puzzle-dashboard-overview__error" role="alert">
          {error}
        </div>
      ) : loading ? (
        <div
          className="puzzle-dashboard-overview__loading"
          role="status"
          aria-label="Loading dashboard overview"
        >
          <span>Loading dashboard data</span>
          <div className="puzzle-dashboard-overview__skeletons" aria-hidden="true">
            <Skeleton height="5rem" />
            <Skeleton height="5rem" />
            <Skeleton height="5rem" />
          </div>
          <Skeleton height="12rem" />
        </div>
      ) : (
        <div className="puzzle-dashboard-overview__body">
          {summary ? (
            <div className="puzzle-dashboard-overview__summary">{summary}</div>
          ) : null}
          {metrics ? (
            <div className="puzzle-dashboard-overview__metrics">{metrics}</div>
          ) : null}
          {charts ? (
            <div className="puzzle-dashboard-overview__charts">{charts}</div>
          ) : null}
          {children ? (
            <div className="puzzle-dashboard-overview__widgets">{children}</div>
          ) : null}
        </div>
      )}
    </section>
  );
};
