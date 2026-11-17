import { useId } from "react";

import "./dashboard.css";

import type {
  DashboardActivityFeedProps,
  DashboardActivityItem,
} from "./dashboard.types";

const DefaultActivityItem = ({ item }: { item: DashboardActivityItem }) => {
  const description = item.href ? (
    <a className="puzzle-dashboard-activity-feed__link" href={item.href}>
      {item.description}
    </a>
  ) : (
    item.description
  );

  return (
    <>
      {item.avatar && (
        <span className="puzzle-dashboard-activity-feed__avatar">
          {item.avatar}
        </span>
      )}
      <div className="puzzle-dashboard-activity-feed__content">
        <p className="puzzle-dashboard-activity-feed__description">
          {description}
        </p>
        <time
          className="puzzle-dashboard-activity-feed__time"
          dateTime={item.dateTime}
        >
          {item.timestamp}
        </time>
      </div>
    </>
  );
};

export const DashboardActivityFeed = ({
  items,
  title = "Recent activity",
  emptyState = "No recent activity.",
  renderItem,
  className,
}: DashboardActivityFeedProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-dashboard-activity-feed", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="puzzle-dashboard-activity-feed__title">
        {title}
      </h2>
      {items.length === 0 ? (
        <div className="puzzle-dashboard-activity-feed__empty">
          {emptyState}
        </div>
      ) : (
        <ol className="puzzle-dashboard-activity-feed__list">
          {items.map((item) => (
            <li className="puzzle-dashboard-activity-feed__item" key={item.id}>
              {renderItem ? (
                renderItem(item)
              ) : (
                <DefaultActivityItem item={item} />
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};
