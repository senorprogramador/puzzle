import { Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  EditorialDate,
  EditorialFigure,
  validateContentIds,
} from "../shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  TimelineEvent,
  TimelineSectionProps,
  TimelineSectionVariant,
} from "./timeline-section.types";
import "./timeline-section.css";

const TimelineEventCard = ({
  item,
  index,
  variant,
}: {
  item: TimelineEvent;
  index: number;
  variant: TimelineSectionVariant;
}) => (
  <li className="puzzle-timeline-section__item">
    <article className="puzzle-timeline-section__event">
      <span className="puzzle-timeline-section__node" aria-hidden="true">
        {item.icon ?? (variant === "numbered" ? index + 1 : null)}
      </span>
      <div className="puzzle-timeline-section__content">
        {item.date ? (
          <Text as="p" className="puzzle-timeline-section__date">
            <EditorialDate date={item.date} />
          </Text>
        ) : null}
        <Heading level="headline3" as="h3">{item.title}</Heading>
        {item.description ? <div>{item.description}</div> : null}
        {item.image ? (
          <EditorialFigure
            image={item.image}
            className="puzzle-timeline-section__figure"
          />
        ) : null}
        {item.action ? (
          <div className="puzzle-timeline-section__action">{item.action}</div>
        ) : null}
      </div>
    </article>
  </li>
);

const TimelineSection = <C extends ElementType = "section">({
  variant = "vertical",
  items,
  children,
  className,
  ...sectionProps
}: TimelineSectionProps<C>) => {
  validateContentIds(items, "Timeline event");

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-timeline-section ${className ?? ""}`.trim()}
      family="timeline"
      variant={variant satisfies TimelineSectionVariant}
    >
      {items.length ? (
        <ol
          className="puzzle-timeline-section__items"
          aria-label="Timeline events"
          tabIndex={variant === "horizontal" ? 0 : undefined}
        >
          {items.map((item, index) => (
            <TimelineEventCard
              key={item.id}
              item={item}
              index={index}
              variant={variant}
            />
          ))}
        </ol>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { TimelineSection };
