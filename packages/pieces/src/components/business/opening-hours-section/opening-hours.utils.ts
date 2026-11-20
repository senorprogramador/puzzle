import { validateContentIds } from "../../content/shared";
import type {
  OpeningHours,
  OpeningHoursDay,
  OpeningHoursInterval,
  OpeningHoursStatus,
  OpeningHoursWeekday,
} from "./opening-hours-section.types";

export const OPENING_HOUR_WEEKDAYS: readonly OpeningHoursWeekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const parseDate = (value: string, field: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new RangeError(`${field} must be a valid YYYY-MM-DD date.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`${field} must be a valid YYYY-MM-DD date.`);
  }

  return date.getTime();
};

const parseTime = (value: string, allowEndOfDay: boolean) => {
  if (allowEndOfDay && value === "24:00") {
    return 24 * 60;
  }

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    throw new RangeError(
      "Opening-hour times must use 24-hour HH:mm notation; only a closing time may be 24:00.",
    );
  }

  return Number(match[1]) * 60 + Number(match[2]);
};

const validateIntervals = (intervals: readonly OpeningHoursInterval[]) => {
  let previousClose = -1;

  for (const interval of intervals) {
    const opensAt = parseTime(interval.opensAt, false);
    const closesAt = parseTime(interval.closesAt, true);

    if (opensAt >= closesAt || opensAt < previousClose) {
      throw new RangeError(
        "Opening-hour intervals must be chronological, non-overlapping, and close after they open.",
      );
    }

    previousClose = closesAt;
  }
};

const validateDays = (days: readonly OpeningHoursDay[]) => {
  const seenDays = new Set<OpeningHoursWeekday>();

  for (const entry of days) {
    if (!OPENING_HOUR_WEEKDAYS.includes(entry.day) || seenDays.has(entry.day)) {
      throw new TypeError("Opening hours must contain at most one entry per weekday.");
    }

    seenDays.add(entry.day);
    validateIntervals(entry.intervals);
  }
};

const validateRanges = (
  ranges: readonly { startDate: string; endDate: string }[],
  field: string,
) => {
  const sorted = ranges
    .map((range) => {
      const start = parseDate(range.startDate, `${field} startDate`);
      const end = parseDate(range.endDate, `${field} endDate`);

      if (start > end) {
        throw new RangeError(`${field} startDate must not be after endDate.`);
      }

      return { start, end };
    })
    .sort((left, right) => left.start - right.start);

  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index]!.start <= sorted[index - 1]!.end) {
      throw new RangeError(`${field} date ranges must not overlap.`);
    }
  }
};

export const validateOpeningHours = (openingHours: OpeningHours) => {
  validateDays(openingHours.days);

  const seasons = openingHours.seasons ?? [];
  validateContentIds(seasons, "Opening-hours season");
  validateRanges(seasons, "Opening-hours season");
  seasons.forEach((season) => validateDays(season.days));

  const exceptions = openingHours.exceptions ?? [];
  validateContentIds(exceptions, "Opening-hours exception");
  validateRanges(exceptions, "Opening-hours exception");
  exceptions.forEach((exception) => validateIntervals(exception.intervals));

  if (openingHours.timeZone !== undefined) {
    new Intl.DateTimeFormat("en-US", { timeZone: openingHours.timeZone });
  }
};

const getDateKey = (year: number, month: number, day: number) =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const isInRange = (
  dateKey: string,
  range: { startDate: string; endDate: string },
) => dateKey >= range.startDate && dateKey <= range.endDate;

const getDayIntervals = (
  openingHours: OpeningHours,
  dateKey: string,
  weekday: OpeningHoursWeekday,
) => {
  const exception = openingHours.exceptions?.find((item) =>
    isInRange(dateKey, item),
  );
  if (exception) {
    return exception.intervals;
  }

  const season = openingHours.seasons?.find((item) =>
    isInRange(dateKey, item),
  );
  const schedule = season?.days ?? openingHours.days;
  return schedule.find((item) => item.day === weekday)?.intervals;
};

const getLocalTimeParts = (instant: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  const weekday = values.weekday?.toLowerCase() as OpeningHoursWeekday | undefined;

  if (
    !values.year ||
    !values.month ||
    !values.day ||
    !values.hour ||
    !values.minute ||
    !weekday ||
    !OPENING_HOUR_WEEKDAYS.includes(weekday)
  ) {
    throw new RangeError("Could not resolve the local time in the provided time zone.");
  }

  return {
    dateKey: getDateKey(
      Number(values.year),
      Number(values.month),
      Number(values.day),
    ),
    weekday,
    minuteOfDay: Number(values.hour) * 60 + Number(values.minute),
  };
};

export const getOpeningHoursStatus = (
  openingHours: OpeningHours,
  statusAt?: Date,
): OpeningHoursStatus => {
  if (statusAt !== undefined && !Number.isFinite(statusAt.getTime())) {
    throw new RangeError("statusAt must be a valid Date.");
  }

  if (!openingHours.timeZone || !statusAt) {
    return "unknown";
  }

  const localTime = getLocalTimeParts(statusAt, openingHours.timeZone);
  const intervals = getDayIntervals(
    openingHours,
    localTime.dateKey,
    localTime.weekday,
  );

  if (intervals === undefined) {
    return "unknown";
  }
  if (intervals.length === 0) {
    return "closed";
  }

  const isOpen = intervals.some((interval) => {
    const opensAt = parseTime(interval.opensAt, false);
    const closesAt = parseTime(interval.closesAt, true);
    return localTime.minuteOfDay >= opensAt && localTime.minuteOfDay < closesAt;
  });

  return isOpen ? "open" : "closed";
};

export const formatOpeningHoursTime = (value: string, locale?: string) => {
  if (value === "24:00") {
    return value;
  }

  const [hour, minute] = value.split(":").map(Number);
  const referenceDate = new Date(Date.UTC(2020, 0, 1, hour, minute));
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(referenceDate);
};

export const formatOpeningHoursDate = (value: string, locale?: string) => {
  const timestamp = parseDate(value, "Opening-hours date");
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(timestamp);
};

export const formatOpeningHoursWeekday = (
  weekday: OpeningHoursWeekday,
  locale?: string,
) => {
  const dayIndex = OPENING_HOUR_WEEKDAYS.indexOf(weekday);
  const referenceDate = new Date(Date.UTC(2023, 0, dayIndex + 2));
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  }).format(referenceDate);
};
