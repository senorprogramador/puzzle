"use client";

import { useState } from "react";
import type { CmsEntryStatus } from "@puzzle-ui/cms";
import { Select } from "@puzzle-ui/ui";
import type { EditorialCalendarItem, EditorialCalendarProps } from "./cms.types";

const dateKeyInTimeZone = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const utcDateKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

const calendarTitle = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
    timeZone,
  }).format(date);

export const EditorialCalendar = ({
  items,
  timeZone,
  initialMonth = new Date(),
  loading = false,
  onSelectItem,
  onMonthChange,
  className,
}: EditorialCalendarProps) => {
  const [month, setMonth] = useState(
    new Date(Date.UTC(initialMonth.getUTCFullYear(), initialMonth.getUTCMonth(), 1, 12)),
  );
  const [status, setStatus] = useState<CmsEntryStatus | "all">("all");
  const filtered = items.filter((item) => status === "all" || item.status === status);
  const start = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1));
  const offset = (start.getUTCDay() + 6) % 7;
  const gridStart = new Date(start.getTime() - offset * 86_400_000);
  const days = Array.from({ length: 42 }, (_, index) =>
    new Date(gridStart.getTime() + index * 86_400_000),
  );
  const itemsByDate = new Map<string, EditorialCalendarItem[]>();
  const invalidDateCount = filtered.filter((item) =>
    Number.isNaN(new Date(item.scheduledAt).getTime()),
  ).length;
  for (const item of filtered) {
    const scheduledDate = new Date(item.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) continue;
    const key = dateKeyInTimeZone(scheduledDate, timeZone);
    const bucket = itemsByDate.get(key) ?? [];
    bucket.push(item);
    itemsByDate.set(key, bucket);
  }
  const changeMonth = (delta: number) => {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + delta, 1, 12));
    setMonth(next);
    onMonthChange?.(next);
  };

  return (
    <section
      className={["puzzle-cms-calendar", className].filter(Boolean).join(" ")}
      aria-label={`Editorial calendar in ${timeZone}`}
    >
      <header className="puzzle-cms-calendar__header">
        <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>Previous</button>
        <h2>{calendarTitle(month, timeZone)}</h2>
        <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>Next</button>
        <label>
          Status
          <Select<CmsEntryStatus | "all">
            aria-label="Status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ]}
            value={status}
            onChange={(next) => {
              if (next !== undefined) setStatus(next);
            }}
          />
        </label>
      </header>
      {loading ? <p role="status">Loading schedule…</p> : null}
      {invalidDateCount > 0 ? (
        <p role="alert">
          {invalidDateCount} scheduled item{invalidDateCount === 1 ? "" : "s"} has an invalid date and cannot be placed.
        </p>
      ) : null}
      <div className="puzzle-cms-calendar__grid" role="grid" aria-label={calendarTitle(month, "UTC")}>
        <div className="puzzle-cms-calendar__row" role="row">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div className="puzzle-cms-calendar__weekday" role="columnheader" key={day}>
              {day}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <div className="puzzle-cms-calendar__row" role="row" key={`week-${weekIndex}`}>
            {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
              const key = utcDateKey(day);
              const dateItems = itemsByDate.get(key) ?? [];
              const inMonth = day.getUTCMonth() === month.getUTCMonth();
              return (
                <div
                  className="puzzle-cms-calendar__day"
                  role="gridcell"
                  key={key}
                  aria-label={`${key}, ${dateItems.length} scheduled items`}
                  data-outside-month={!inMonth || undefined}
                >
                  <time dateTime={key}>{day.getUTCDate()}</time>
                  <ul>
                    {dateItems.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => onSelectItem?.(item)}>
                          <span>{item.title}</span>
                          <small>{new Intl.DateTimeFormat(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone,
                          }).format(new Date(item.scheduledAt))} · {item.locale}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};
