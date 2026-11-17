"use client";

import { useCallback, useMemo, useState, type ElementType } from "react";
import { useListFilter } from "@puzzle-ui/hooks";
import {
  Badge,
  Button,
  Carousel,
  CarouselController,
  Card,
  CardContent,
} from "@puzzle-ui/ui";

import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../shared";
import { EmptyStatePanel } from "../../data-display/empty-state-panel";
import type {
  EventItem,
  EventSectionProps,
  EventSectionVariant,
  EventTimeframe,
} from "./event-section.types";

import "./event-section.css";

const parseDate = (date: string, eventId: string, field: string) => {
  const timestamp = Date.parse(date);
  if (!Number.isFinite(timestamp)) {
    throw new RangeError(`Event "${eventId}" has an invalid ${field} date.`);
  }
  return timestamp;
};

const EventCard = ({
  event,
  isPast,
}: {
  event: EventItem;
  isPast: boolean;
}) => (
  <Card as="article" className="puzzle-event-section__card">
    {event.image ? (
      <div className="puzzle-event-section__image">{event.image}</div>
    ) : null}
    <CardContent className="puzzle-event-section__card-content">
      <div className="puzzle-event-section__meta">
        <Badge content={isPast ? "Past" : "Upcoming"} color={isPast ? "secondary" : "info"} />
        {event.category ? <Badge content={event.category} /> : null}
      </div>
      <h3>
        {event.href ? (
          <a href={event.href}>{event.title}</a>
        ) : (
          event.title
        )}
      </h3>
      <p className="puzzle-event-section__date">
        <time dateTime={event.startDate}>
          {event.dateLabel ?? event.startDate}
        </time>
        {event.endDate ? (
          <>
            {" – "}
            <time dateTime={event.endDate}>
              {event.endLabel ?? event.endDate}
            </time>
          </>
        ) : null}
      </p>
      {event.location ? (
        <p className="puzzle-event-section__location">{event.location}</p>
      ) : null}
      {event.description ? <p>{event.description}</p> : null}
      {event.price ? (
        <div className="puzzle-event-section__price">{event.price}</div>
      ) : null}
    </CardContent>
  </Card>
);

const EventSection = <C extends ElementType = "section">({
  variant = "grid",
  events,
  featuredEventId,
  filterable = true,
  referenceDate,
  emptyState,
  children,
  className,
  ...sectionProps
}: EventSectionProps<C>) => {
  validateContentIds(events, "Event");
  const [timeframe, setTimeframe] = useState<EventTimeframe>(
    variant === "past" ? "past" : variant === "upcoming" ? "upcoming" : "all",
  );
  const getSearchText = useCallback(
    (event: EventItem) =>
      `${event.title} ${typeof event.description === "string" ? event.description : ""} ${typeof event.location === "string" ? event.location : ""} ${event.category ?? ""}`,
    [],
  );
  const getCategory = useCallback((event: EventItem) => event.category, []);
  const filter = useListFilter({
    items: events,
    getSearchText,
    getCategory: filterable ? getCategory : undefined,
    enabled: filterable,
  });
  const eventTimes = useMemo(() => {
    const times = new Map<string, { start: number; end: number }>();
    for (const event of events) {
      const start = parseDate(event.startDate, event.id, "start");
      const end = event.endDate
        ? parseDate(event.endDate, event.id, "end")
        : start;
      if (end < start) {
        throw new RangeError(`Event "${event.id}" ends before it starts.`);
      }
      times.set(event.id, { start, end });
    }
    return times;
  }, [events]);
  const referenceTimestamp = referenceDate
    ? referenceDate instanceof Date
      ? referenceDate.getTime()
      : Date.parse(referenceDate)
    : Date.now();

  if (!Number.isFinite(referenceTimestamp)) {
    throw new RangeError("Event referenceDate must be a valid date.");
  }

  const filteredEvents = filter.filteredItems.filter((event) => {
    if (timeframe === "all") {
      return true;
    }
    const eventTime = eventTimes.get(event.id);
    if (!eventTime) {
      return false;
    }
    const isPast = eventTime.end < referenceTimestamp;
    return timeframe === "past" ? isPast : !isPast;
  });
  const orderedEvents = [...filteredEvents].sort((first, second) => {
    const firstTime = eventTimes.get(first.id)?.start ?? 0;
    const secondTime = eventTimes.get(second.id)?.start ?? 0;
    return timeframe === "past"
      ? secondTime - firstTime
      : firstTime - secondTime;
  });
  const featuredEvent =
    orderedEvents.find((event) => event.id === featuredEventId) ??
    orderedEvents.find((event) => event.featured) ??
    orderedEvents[0];
  const displayedEvents =
    variant === "featured" && featuredEvent
      ? orderedEvents.filter((event) => event.id !== featuredEvent.id)
      : orderedEvents;
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  const renderEvent = (event: EventItem) => {
    const times = eventTimes.get(event.id);
    return (
      <EventCard
        event={event}
        isPast={Boolean(times && times.end < referenceTimestamp)}
      />
    );
  };

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-event-section ${className ?? ""}`.trim()}
      family="event"
      variant={variant satisfies EventSectionVariant}
    >
      {filterable ? (
        <div className="puzzle-event-section__filters">
          <div role="group" aria-label="Filter events by date">
            {(["all", "upcoming", "past"] as const).map((value) => (
              <Button
                key={value}
                variant={timeframe === value ? "primary" : "outline"}
                aria-pressed={timeframe === value}
                onClick={() => setTimeframe(value)}
              >
                {value === "all"
                  ? "All events"
                  : value === "upcoming"
                    ? "Upcoming"
                    : "Past"}
              </Button>
            ))}
          </div>
          {filter.categories.length ? (
            <label>
              Category
              <select
                value={filter.selectedCategory}
                onChange={(event) =>
                  filter.setSelectedCategory(event.currentTarget.value)
                }
              >
                <option value="">All categories</option>
                {filter.categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}
      {variant === "featured" && featuredEvent ? (
        <div className="puzzle-event-section__featured">
          {renderEvent(featuredEvent)}
        </div>
      ) : null}
      {orderedEvents.length ? (
        variant === "carousel" ? (
          <CarouselController items={displayedEvents}>
            <Carousel
              ariaLabel="Events"
              getItemKey={(event) => event.id}
              renderItem={renderEvent}
              backButton={
                <Button variant="outline" aria-label="Previous event">
                  Previous
                </Button>
              }
              nextButton={
                <Button variant="outline" aria-label="Next event">
                  Next
                </Button>
              }
            />
          </CarouselController>
        ) : (
          <ol className="puzzle-event-section__items" aria-label="Events">
            {displayedEvents.map((event) => (
              <li key={event.id}>{renderEvent(event)}</li>
            ))}
          </ol>
        )
      ) : (
        <EmptyStatePanel
          title="No events found"
          description="Try another date range or category."
          variant="minimal"
          className="puzzle-event-section__empty"
        >
          {emptyState}
        </EmptyStatePanel>
      )}
      {children}
    </MarketingSection>
  );
};

export { EventSection };
