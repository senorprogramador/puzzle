import { Badge } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  RoadmapItem,
  RoadmapSectionProps,
  RoadmapStatus,
  RoadmapVariant,
} from "./roadmap.types";
import "./roadmap.css";

const statusLabels: Record<RoadmapStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
  delayed: "Delayed",
  "on-hold": "On hold",
};

const validateItems = (items: readonly RoadmapItem[]) => {
  items.forEach((item) => {
    if (
      item.progress !== undefined &&
      (!Number.isFinite(item.progress) || item.progress < 0 || item.progress > 100)
    ) {
      throw new RangeError(
        `Progress for roadmap item "${item.id}" must be between 0 and 100.`,
      );
    }

    if (!statusLabels[item.status]) {
      throw new RangeError(`Unknown roadmap status "${item.status}".`);
    }
  });
};

const RoadmapCard = ({
  item,
  variant,
}: {
  item: RoadmapItem;
  variant: RoadmapVariant;
}) => (
  <li data-status={item.status}>
    <article className="puzzle-roadmap__item">
      <div className="puzzle-roadmap__item-header">
        <h3>{item.title}</h3>
        <Badge
          content={item.statusLabel ?? statusLabels[item.status]}
          className="puzzle-roadmap__status"
        />
      </div>
      {item.date != null ? (
        <p className="puzzle-roadmap__date">{item.date}</p>
      ) : null}
      {item.group ? (
        <p className="puzzle-roadmap__group">{item.group}</p>
      ) : null}
      {item.description ? <p>{item.description}</p> : null}
      {variant === "progress" && item.progress !== undefined ? (
        <progress
          className="puzzle-roadmap__progress"
          value={item.progress}
          max={100}
          aria-label={`${item.title} progress`}
        >
          {item.progress}%
        </progress>
      ) : null}
    </article>
  </li>
);

const groupItems = (
  items: readonly RoadmapItem[],
  getGroup: (item: RoadmapItem) => string | undefined,
) => {
  const groups = new Map<string, RoadmapItem[]>();

  items.forEach((item) => {
    const label = getGroup(item) ?? "Other milestones";
    groups.set(label, [...(groups.get(label) ?? []), item]);
  });

  return [...groups.entries()];
};

const GroupedRoadmap = ({
  items,
  variant,
  getGroup,
}: {
  items: readonly RoadmapItem[];
  variant: RoadmapVariant;
  getGroup: (item: RoadmapItem) => string | undefined;
}) => (
  <div
    className="puzzle-roadmap__groups"
    role={variant === "columns" ? "region" : undefined}
    aria-label={variant === "columns" ? "Roadmap columns" : undefined}
    tabIndex={variant === "columns" ? 0 : undefined}
  >
    {groupItems(items, getGroup).map(([group, groupItems]) => (
      <section key={group} className="puzzle-roadmap__group">
        <h3>{group}</h3>
        <ol className="puzzle-roadmap__list">
          {groupItems.map((item) => (
            <RoadmapCard key={item.id} item={item} variant={variant} />
          ))}
        </ol>
      </section>
    ))}
  </div>
);

const RoadmapSection = <C extends ElementType = "section">({
  variant = "timeline",
  items,
  children,
  className,
  ...sectionProps
}: RoadmapSectionProps<C>) => {
  validateItems(items);

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-roadmap ${className ?? ""}`.trim()}
      family="roadmap"
      variant={variant}
    >
      {items.length && variant === "kanban" ? (
        <div
          className="puzzle-roadmap__kanban"
          role="region"
          aria-label="Roadmap board"
          tabIndex={0}
        >
          {(Object.keys(statusLabels) as RoadmapStatus[]).map((status) => {
            const statusItems = items.filter((item) => item.status === status);

            return (
              <section key={status} aria-label={statusLabels[status]}>
                <h3>{statusLabels[status]}</h3>
                <ol className="puzzle-roadmap__list">
                  {statusItems.map((item) => (
                    <RoadmapCard key={item.id} item={item} variant={variant} />
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      ) : items.length && variant === "quarters" ? (
        <GroupedRoadmap
          items={items}
          variant={variant}
          getGroup={(item) => item.group}
        />
      ) : items.length && variant === "columns" ? (
        <GroupedRoadmap
          items={items}
          variant={variant}
          getGroup={(item) => item.group}
        />
      ) : items.length && variant === "grouped" ? (
        <GroupedRoadmap
          items={items}
          variant={variant}
          getGroup={(item) => item.group}
        />
      ) : items.length && variant === "release" ? (
        <GroupedRoadmap
          items={items}
          variant={variant}
          getGroup={(item) => item.release ?? item.group}
        />
      ) : items.length && variant === "horizontal" ? (
        <div
          className="puzzle-roadmap__horizontal"
          role="region"
          aria-label="Roadmap timeline"
          tabIndex={0}
        >
          <ol className="puzzle-roadmap__list">
            {items.map((item) => (
              <RoadmapCard key={item.id} item={item} variant={variant} />
            ))}
          </ol>
        </div>
      ) : items.length ? (
        <ol className="puzzle-roadmap__list">
          {items.map((item) => (
            <RoadmapCard key={item.id} item={item} variant={variant} />
          ))}
        </ol>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { RoadmapSection };
