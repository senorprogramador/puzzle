import { useId } from "react";
import { Card, CardContent, Heading, Text } from "@puzzle-ui/ui";
import { EmptyStatePanel } from "../data-display/empty-state-panel";

import "./activity-section.css";

import type {
  ActivityItem,
  ActivitySectionProps,
  ActivitySectionVariant,
} from "./activity-section.types";

const ActivityItemContent = ({ item }: { item: ActivityItem }) => {
  const action = item.href ? (
    <a className="puzzle-activity-section__link" href={item.href}>
      {item.action ?? item.description}
    </a>
  ) : (
    item.action ?? item.description
  );

  return (
    <>
      {item.icon ? (
        <span className="puzzle-activity-section__icon" aria-hidden="true">
          {item.icon}
        </span>
      ) : null}
      {item.actor || action ? (
        <Text as="p" className="puzzle-activity-section__summary">
          {item.actor ? (
            <span className="puzzle-activity-section__actor">{item.actor}</span>
          ) : null}
          {action ? (
            <span className="puzzle-activity-section__action">{action}</span>
          ) : null}
        </Text>
      ) : null}
      {item.description && item.action ? (
        <Text as="p" className="puzzle-activity-section__description">
          {item.description}
        </Text>
      ) : null}
      <time
        className="puzzle-activity-section__time"
        dateTime={item.dateTime}
      >
        {item.timestamp}
      </time>
      {item.metadata ? (
        <div className="puzzle-activity-section__metadata">{item.metadata}</div>
      ) : null}
    </>
  );
};

const ActivityList = ({
  items,
  variant,
  renderItem,
}: {
  items: readonly ActivityItem[];
  variant: ActivitySectionVariant;
  renderItem?: (item: ActivityItem) => React.ReactNode;
}) => (
  <ol
    className="puzzle-activity-section__list"
    aria-label={variant === "horizontal" ? "Activity items" : undefined}
    tabIndex={variant === "horizontal" ? 0 : undefined}
    onKeyDown={
      variant === "horizontal"
        ? (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
              return;
            }

            event.preventDefault();
            event.currentTarget.scrollBy({
              left: event.key === "ArrowRight" ? 80 : -80,
            });
          }
        : undefined
    }
  >
    {items.map((item) => {
      const content = renderItem ? renderItem(item) : <ActivityItemContent item={item} />;
      const contentClassName = [
        variant === "cards"
          ? "puzzle-activity-section__card-content"
          : "puzzle-activity-section__entry",
        item.icon &&
          (variant === "cards"
            ? "puzzle-activity-section__card-content--has-icon"
            : "puzzle-activity-section__entry--has-icon"),
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <li
          key={item.id}
          className="puzzle-activity-section__item"
          data-category={item.category}
        >
          {variant === "cards" ? (
            <Card as="article" className="puzzle-activity-section__card">
              <CardContent className={contentClassName}>
                {content}
              </CardContent>
            </Card>
          ) : (
            <article className={contentClassName}>
              {content}
            </article>
          )}
        </li>
      );
    })}
  </ol>
);

const groupItems = (items: readonly ActivityItem[]) => {
  const groups = new Map<string, { label: React.ReactNode; items: ActivityItem[] }>();

  for (const item of items) {
    const key = item.group ?? "ungrouped";
    const group = groups.get(key);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(key, {
        label: item.groupLabel ?? item.group ?? "Other activity",
        items: [item],
      });
    }
  }

  return [...groups.entries()];
};

export const ActivitySection = ({
  items,
  title = "Recent activity",
  emptyState,
  actions,
  variant = "feed",
  renderItem,
  className,
}: ActivitySectionProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-activity-section", className]
        .filter(Boolean)
        .join(" ")}
      data-variant={variant satisfies ActivitySectionVariant}
      aria-labelledby={titleId}
    >
      <header className="puzzle-activity-section__header">
        <Heading level="headline2" as="h2" id={titleId} className="puzzle-activity-section__title">
          {title}
        </Heading>
        {actions ? (
          <div className="puzzle-activity-section__actions">{actions}</div>
        ) : null}
      </header>

      {items.length ? (
        variant === "grouped" ? (
          <div className="puzzle-activity-section__groups">
            {groupItems(items).map(([groupId, group]) => (
              <section
                className="puzzle-activity-section__group"
                key={groupId}
                aria-label={typeof group.label === "string" ? group.label : undefined}
              >
                <Heading level="headline3" as="h3" className="puzzle-activity-section__group-title">
                  {group.label}
                </Heading>
                <ActivityList
                  items={group.items}
                  variant={variant}
                  renderItem={renderItem}
                />
              </section>
            ))}
          </div>
        ) : (
          <ActivityList
            items={items}
            variant={variant}
            renderItem={renderItem}
          />
        )
      ) : (
        <EmptyStatePanel
          title="No activity yet"
          variant="minimal"
          className="puzzle-activity-section__empty"
        >
          {emptyState ?? "Activity will appear here as your team gets to work."}
        </EmptyStatePanel>
      )}
    </section>
  );
};
