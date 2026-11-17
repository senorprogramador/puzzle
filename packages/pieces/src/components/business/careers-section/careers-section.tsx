import type { ElementType, ReactNode } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../../content/shared";
import type { BusinessBenefit, BusinessCareerPosition } from "../shared.types";
import type {
  CareersSectionProps,
  CareersSectionVariant,
} from "./careers-section.types";

import "../shared.css";
import "./careers-section.css";

const PositionList = ({
  items,
  compact = false,
}: {
  items: readonly BusinessCareerPosition[];
  compact?: boolean;
}) =>
  items.length ? (
    <ul className="puzzle-business-section__list puzzle-careers-section__positions">
      {items.map((position) => (
        <li key={position.id}>
          <article
            className="puzzle-careers-section__position"
            data-featured={position.featured || undefined}
            data-compact={compact || undefined}
          >
            <h3>
              {position.href ? (
                <a href={position.href}>{position.title}</a>
              ) : (
                position.title
              )}
            </h3>
            <ul
              className="puzzle-careers-section__metadata"
              aria-label={`${position.title} details`}
            >
              {position.department ? <li>{position.department}</li> : null}
              {position.location ? <li>{position.location}</li> : null}
              {position.employmentType ? (
                <li>{position.employmentType}</li>
              ) : null}
            </ul>
            {position.description ? <p>{position.description}</p> : null}
          </article>
        </li>
      ))}
    </ul>
  ) : null;

const groupPositions = (
  positions: readonly BusinessCareerPosition[],
  groupBy: "department" | "location",
) => {
  const groups = new Map<string, BusinessCareerPosition[]>();

  for (const position of positions) {
    const label = position[groupBy] ?? "Other";
    groups.set(label, [...(groups.get(label) ?? []), position]);
  }

  return [...groups];
};

const GroupedPositions = ({
  positions,
  groupBy,
}: {
  positions: readonly BusinessCareerPosition[];
  groupBy: "department" | "location";
}) => {
  const groups = groupPositions(positions, groupBy);

  return groups.length ? (
    <div className="puzzle-careers-section__groups">
      {groups.map(([label, jobs]) => (
        <section className="puzzle-careers-section__group" key={label}>
          <h3>{label}</h3>
          <PositionList items={jobs} />
        </section>
      ))}
    </div>
  ) : null;
};

const BenefitsList = ({ items }: { items: readonly BusinessBenefit[] }) =>
  items.length ? (
    <ul className="puzzle-business-section__list puzzle-careers-section__benefits">
      {items.map((benefit) => (
        <li key={benefit.id}>
          <article>
            <h3>{benefit.title}</h3>
            {benefit.description ? <p>{benefit.description}</p> : null}
          </article>
        </li>
      ))}
    </ul>
  ) : null;

const CareersSection = <C extends ElementType = "section">({
  variant = "list",
  positions,
  benefits = [],
  culture,
  emptyState = "There are no open positions right now.",
  featuredPosition,
  children,
  className,
  ...sectionProps
}: CareersSectionProps<C>) => {
  validateContentIds(positions, "Career position");
  validateContentIds(benefits, "Career benefit");

  const featured =
    typeof featuredPosition === "string"
      ? positions.find((position) => position.id === featuredPosition)
      : featuredPosition ??
        positions.find((position) => position.featured) ??
        (variant === "featured" ? positions[0] : undefined);
  const remaining = featured
    ? positions.filter((position) => position.id !== featured.id)
    : positions;

  let content: ReactNode = positions.length ? (
    <PositionList items={positions} compact={variant === "compact"} />
  ) : (
    <p className="puzzle-careers-section__empty">{emptyState}</p>
  );

  if (variant === "departments" || variant === "locations") {
    content = (
      <GroupedPositions
        positions={positions}
        groupBy={variant === "departments" ? "department" : "location"}
      />
    );
    if (!positions.length) {
      content = <p className="puzzle-careers-section__empty">{emptyState}</p>;
    }
  } else if (variant === "featured" || variant === "hiring") {
    content = (
      <div className="puzzle-careers-section__featured-layout">
        {featured ? <PositionList items={[featured]} /> : null}
        <PositionList items={remaining} compact={variant === "hiring"} />
        {!positions.length ? (
          <p className="puzzle-careers-section__empty">{emptyState}</p>
        ) : null}
      </div>
    );
  }

  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-careers-section ${className ?? ""}`.trim()}
      family="careers"
      variant={variant satisfies CareersSectionVariant}
    >
      <div className="puzzle-careers-section__content">
        {culture ? (
          <div className="puzzle-careers-section__culture">{culture}</div>
        ) : null}
        {content}
        {benefits.length ? <BenefitsList items={benefits} /> : null}
      </div>
      {children}
    </MarketingSection>
  );
};

export { CareersSection };
