"use client";

import {
  useMemo,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import {
  DateRangePicker,
  type DateRange,
  type DateRangeDayState,
} from "@puzzle-ui/ui";
import { MarketingSection } from "../../marketing/shared";
import type {
  AvailabilityCalendarProps,
  AvailabilityDay,
  AvailabilityDayStatus,
} from "./availability-calendar.types";
import {
  calendarDayDifference,
  createAvailabilityMap,
  isUnavailableStatus,
  toDateKey,
} from "./availability-calendar.utils";

import "./availability-calendar.css";

const DEFAULT_LABELS: Record<AvailabilityDayStatus, ReactNode> = {
  available: "Available",
  unavailable: "Unavailable",
  blocked: "Blocked",
  "check-in-only": "Check-in only",
  "check-out-only": "Check-out only",
  changeover: "Changeover",
};

const AvailabilityCalendar = ({
  availability,
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  minNights,
  maxNights,
  months = 1,
  locale,
  weekStartsOn,
  loading = false,
  error,
  emptyState = "No availability has been supplied for these dates.",
  legend,
  labels,
  disabled = false,
  onValidationError,
  calendarLabel = "Choose stay dates",
  className,
  ...sectionProps
}: AvailabilityCalendarProps) => {
  const availabilityMap = useMemo(
    () => createAvailabilityMap(availability),
    [availability],
  );
  const statusLabels = { ...DEFAULT_LABELS, ...labels };
  const isEmpty = availability.length === 0;

  const validateRange = (range: DateRange): ReactNode | undefined => {
    if (!range.start || !range.end) return undefined;
    const nights = calendarDayDifference(range.start, range.end);
    if (nights <= 0) return "Check-out must be after check-in.";
    if (minNights !== undefined && nights < minNights) {
      return `Select at least ${minNights} night${minNights === 1 ? "" : "s"}.`;
    }
    if (maxNights !== undefined && nights > maxNights) {
      return `Select no more than ${maxNights} nights.`;
    }

    const start = availabilityMap.get(toDateKey(range.start));
    const end = availabilityMap.get(toDateKey(range.end));
    if (isUnavailableStatus(start?.status)) return "Check-in is not available on this date.";
    if (isUnavailableStatus(end?.status)) return "Check-out is not available on this date.";
    if (start?.status === "check-out-only") return "This date is available for check-out only.";
    if (end?.status === "check-in-only") return "This date is available for check-in only.";

    let cursor = new Date(range.start.getTime());
    while (cursor < range.end) {
      const day = availabilityMap.get(toDateKey(cursor));
      if (isUnavailableStatus(day?.status)) {
        return "The selected stay includes unavailable dates.";
      }
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    return undefined;
  };

  const dayContent = (date: Date, _state: DateRangeDayState) => {
    const day = availabilityMap.get(toDateKey(date));
    if (!day) return null;
    return (
      <span
        className="puzzle-availability-calendar__day-detail"
        data-status={day.status}
      >
        {day.indicator ??
          day.label ??
          (day.price ? formatPrice(day.price, locale) : statusLabels[day.status])}
      </span>
    );
  };

  const shouldDisableDate = (date: Date) => {
    const day = availabilityMap.get(toDateKey(date));
    return isUnavailableStatus(day?.status);
  };

  return (
    <MarketingSection
      {...sectionProps}
      className={cn("puzzle-availability-calendar", className)}
      family="availability-calendar"
      variant="calendar"
    >
      <div className="puzzle-availability-calendar__content">
        {loading ? (
          <div className="puzzle-availability-calendar__status" role="status">
            Loading availability…
          </div>
        ) : null}
        {error ? (
          <div className="puzzle-availability-calendar__error" role="alert">
            {error}
          </div>
        ) : null}
        {isEmpty && !loading && !error ? (
          <div className="puzzle-availability-calendar__status" role="status">
            {emptyState}
          </div>
        ) : null}
        <DateRangePicker
          label={undefined}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          months={months}
          locale={locale}
          weekStartsOn={weekStartsOn}
          shouldDisableDate={shouldDisableDate}
          validateRange={validateRange}
          onValidationError={onValidationError}
          dayContent={dayContent}
          disabled={disabled || loading || isEmpty}
          calendarLabel={calendarLabel}
          aria-label="Choose check-in and check-out"
          placeholder="Choose check-in and check-out"
          startPlaceholder="Check-in"
          endPlaceholder="Check-out"
          fullWidth
        />
        {legend ?? (
          <ul className="puzzle-availability-calendar__legend" aria-label="Availability legend">
            {(Object.keys(DEFAULT_LABELS) as AvailabilityDayStatus[]).map((status) => (
              <li className="puzzle-availability-calendar__legend-item" key={status}>
                <span className="puzzle-availability-calendar__status-marker" data-status={status} aria-hidden="true" />
                <span>{statusLabels[status]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MarketingSection>
  );
};

const formatPrice = (
  price: AvailabilityDay["price"],
  locale?: string,
): string | null => {
  if (!price) return null;
  const currency = price.currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) return `${price.amount} ${price.currency}`;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(price.amount);
};

export { AvailabilityCalendar };
