import { useId } from "react";
import { cn } from "@puzzle-ui/core";
import { Heading, Text } from "@puzzle-ui/ui";
import {
  formatOpeningHoursDate,
  formatOpeningHoursTime,
  formatOpeningHoursWeekday,
  getOpeningHoursStatus,
  OPENING_HOUR_WEEKDAYS,
  validateOpeningHours,
} from "./opening-hours.utils";
import type {
  OpeningHoursDay,
  OpeningHoursInterval,
  OpeningHoursSectionProps,
  OpeningHoursStatus,
  OpeningHoursWeekday,
} from "./opening-hours-section.types";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import "./opening-hours-section.css";

const getStatusLabel = (
  status: OpeningHoursStatus,
  labels: {
    open: OpeningHoursSectionProps["openLabel"];
    closed: OpeningHoursSectionProps["closedLabel"];
    unknown: OpeningHoursSectionProps["unknownStatusLabel"];
  },
) => {
  if (status === "open") return labels.open;
  if (status === "closed") return labels.closed;
  return labels.unknown;
};

const OpeningIntervals = ({
  intervals,
  locale,
}: {
  intervals: readonly OpeningHoursInterval[];
  locale?: string;
}) => (
  <ul className="puzzle-opening-hours-section__intervals">
    {intervals.map((interval, index) => (
      <li key={`${interval.opensAt}-${interval.closesAt}-${index}`}>
        {interval.label ? (
          <span className="puzzle-opening-hours-section__interval-label">
            {interval.label}
          </span>
        ) : null}
        <span>
          {formatOpeningHoursTime(interval.opensAt, locale)}
          {" – "}
          {formatOpeningHoursTime(interval.closesAt, locale)}
        </span>
      </li>
    ))}
  </ul>
);

const ScheduleRows = ({
  days,
  locale,
  closedLabel,
  unknownHoursLabel,
}: {
  days: readonly OpeningHoursDay[];
  locale?: string;
  closedLabel: OpeningHoursSectionProps["closedLabel"];
  unknownHoursLabel: OpeningHoursSectionProps["unknownHoursLabel"];
}) => (
  <dl className="puzzle-opening-hours-section__week">
    {OPENING_HOUR_WEEKDAYS.map((weekday: OpeningHoursWeekday) => {
      const schedule = days.find((item) => item.day === weekday);
      return (
        <div
          className="puzzle-opening-hours-section__day"
          data-closed={schedule?.intervals.length === 0 || undefined}
          data-unknown={!schedule || undefined}
          key={weekday}
        >
          <dt>{formatOpeningHoursWeekday(weekday, locale)}</dt>
          <dd>
            {!schedule ? (
              unknownHoursLabel
            ) : schedule.intervals.length === 0 ? (
              closedLabel
            ) : (
              <OpeningIntervals intervals={schedule.intervals} locale={locale} />
            )}
          </dd>
        </div>
      );
    })}
  </dl>
);

const OpeningHoursSection = ({
  openingHours,
  variant = "expanded",
  showStatus = false,
  statusAt,
  locale,
  openLabel = "Open",
  closedLabel = "Closed",
  unknownStatusLabel = "Status unknown",
  unknownHoursLabel = "Hours not provided",
  currentStatusLabel = "Current status",
  timeZoneLabel = "Venue time zone",
  exceptionsLabel = "Exceptions",
  seasonsLabel = "Seasonal hours",
  children,
  className,
  ...sectionProps
}: OpeningHoursSectionProps) => {
  validateOpeningHours(openingHours);
  const instanceId = useId();
  const status = showStatus
    ? getOpeningHoursStatus(openingHours, statusAt)
    : null;
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;
  const exceptions = openingHours.exceptions ?? [];
  const seasons = openingHours.seasons ?? [];

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-opening-hours-section", className)}
      family="opening-hours"
      variant={variant}
    >
      {status ? (
        <div
          className="puzzle-opening-hours-section__status"
          data-status={status}
          role="status"
          aria-live="polite"
        >
          <span
            className="puzzle-opening-hours-section__status-indicator"
            aria-hidden="true"
          />
          <span className="puzzle-opening-hours-section__status-label">
            {currentStatusLabel}:
          </span>
          <span>{getStatusLabel(status, {
            open: openLabel,
            closed: closedLabel,
            unknown: unknownStatusLabel,
          })}</span>
        </div>
      ) : null}

      {openingHours.timeZone ? (
        <Text as="p" className="puzzle-opening-hours-section__time-zone">
          {timeZoneLabel}: <span>{openingHours.timeZone}</span>
        </Text>
      ) : null}

      <ScheduleRows
        days={openingHours.days}
        locale={locale}
        closedLabel={closedLabel}
        unknownHoursLabel={unknownHoursLabel}
      />

      {exceptions.length ? (
        <section
          className="puzzle-opening-hours-section__periods"
        >
          <Heading level="headline4" as="h3">
            {exceptionsLabel}
          </Heading>
          <ul>
            {exceptions.map((exception) => (
              <li key={exception.id}>
                <div>
                  <strong>{exception.label}</strong>
                  <span>
                    {formatOpeningHoursDate(exception.startDate, locale)}
                    {exception.startDate !== exception.endDate
                      ? ` – ${formatOpeningHoursDate(exception.endDate, locale)}`
                      : ""}
                  </span>
                </div>
                {exception.intervals.length === 0 ? (
                  <span>{closedLabel}</span>
                ) : (
                  <OpeningIntervals intervals={exception.intervals} locale={locale} />
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {seasons.length ? (
        <section
          className="puzzle-opening-hours-section__periods"
        >
          <Heading level="headline4" as="h3">
            {seasonsLabel}
          </Heading>
          {seasons.map((season, index) => (
            <section
              className="puzzle-opening-hours-section__season"
              key={season.id}
              aria-labelledby={`${instanceId}-season-${index}`}
            >
              <div className="puzzle-opening-hours-section__period-heading">
                <Heading
                  id={`${instanceId}-season-${index}`}
                  level="headline4"
                  as="h4"
                >
                  {season.label}
                </Heading>
                <span>
                  {formatOpeningHoursDate(season.startDate, locale)}
                  {" – "}
                  {formatOpeningHoursDate(season.endDate, locale)}
                </span>
              </div>
              <ScheduleRows
                days={season.days}
                locale={locale}
                closedLabel={closedLabel}
                unknownHoursLabel={unknownHoursLabel}
              />
            </section>
          ))}
        </section>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { OpeningHoursSection };
