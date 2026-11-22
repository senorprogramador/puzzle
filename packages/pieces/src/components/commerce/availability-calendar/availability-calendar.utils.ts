import type {
  AvailabilityDay,
  AvailabilityDayStatus,
} from "./availability-calendar.types";

const isValidDate = (date: Date): boolean =>
  date instanceof Date && Number.isFinite(date.getTime());

const toDateKey = (date: Date): string => {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const calendarDayDifference = (start: Date, end: Date): number => {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86_400_000);
};

const createAvailabilityMap = (days: readonly AvailabilityDay[]) => {
  const map = new Map<string, AvailabilityDay>();
  for (const day of days) {
    if (!isValidDate(day.date)) {
      throw new TypeError("Availability dates must be valid Date values.");
    }
    const key = toDateKey(day.date);
    if (map.has(key)) {
      throw new TypeError(`Availability contains duplicate date "${key}".`);
    }
    map.set(key, day);
  }
  return map;
};

const isUnavailableStatus = (status?: AvailabilityDayStatus): boolean =>
  status === undefined || status === "unavailable" || status === "blocked";

export {
  calendarDayDifference,
  createAvailabilityMap,
  isUnavailableStatus,
  isValidDate,
  toDateKey,
};
