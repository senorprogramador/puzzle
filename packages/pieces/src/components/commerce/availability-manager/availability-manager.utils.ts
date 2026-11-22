import type {
  AvailabilityManagerCell,
  AvailabilityManagerDay,
  AvailabilityManagerResource,
} from "./availability-manager.types";

const DAY_MS = 86_400_000;

const isValidDate = (date: Date): boolean =>
  date instanceof Date && Number.isFinite(date.getTime());

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addCalendarDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const addCalendarMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const toDateKey = (date: Date): string => {
  const normalized = startOfDay(date);
  return [
    String(normalized.getFullYear()).padStart(4, "0"),
    String(normalized.getMonth() + 1).padStart(2, "0"),
    String(normalized.getDate()).padStart(2, "0"),
  ].join("-");
};

const datesInMonth = (month: Date): Date[] => {
  const first = startOfMonth(month);
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) =>
    new Date(first.getFullYear(), first.getMonth(), index + 1),
  );
};

const calendarDayDifference = (start: Date, end: Date): number => {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / DAY_MS);
};

const createDayMaps = (resources: readonly AvailabilityManagerResource[]) => {
  const resourceIds = new Set<string>();
  const maps = new Map<string, Map<string, AvailabilityManagerDay>>();
  for (const resource of resources) {
    if (!resource.id || resourceIds.has(resource.id)) {
      throw new TypeError(`Availability resources must have unique non-empty ids.`);
    }
    resourceIds.add(resource.id);
    const days = new Map<string, AvailabilityManagerDay>();
    for (const day of resource.days ?? resource.availability ?? []) {
      if (!isValidDate(day.date)) {
        throw new TypeError(`Availability date for resource "${resource.id}" must be valid.`);
      }
      const key = toDateKey(day.date);
      if (days.has(key)) {
        throw new TypeError(
          `Availability resource "${resource.id}" contains duplicate date "${key}".`,
        );
      }
      days.set(key, day);
    }
    maps.set(resource.id, days);
  }
  return maps;
};

const cellKey = (cell: AvailabilityManagerCell): string =>
  `${cell.resourceId}:${toDateKey(cell.date)}`;

const normalizeCell = (cell: AvailabilityManagerCell): AvailabilityManagerCell => ({
  resourceId: cell.resourceId,
  date: startOfDay(cell.date),
});

const uniqueCells = (
  cells: readonly AvailabilityManagerCell[] = [],
): AvailabilityManagerCell[] => {
  const result: AvailabilityManagerCell[] = [];
  const keys = new Set<string>();
  for (const cell of cells) {
    if (!isValidDate(cell.date)) continue;
    const normalized = normalizeCell(cell);
    const key = cellKey(normalized);
    if (keys.has(key)) continue;
    keys.add(key);
    result.push(normalized);
  }
  return result;
};

const cellsForRange = (
  resourceId: string,
  start: Date,
  end: Date,
): AvailabilityManagerCell[] => {
  const first = startOfDay(start);
  const last = startOfDay(end);
  const direction = first <= last ? 1 : -1;
  const cells: AvailabilityManagerCell[] = [];
  let date = first;
  while (direction === 1 ? date <= last : date >= last) {
    cells.push({ resourceId, date });
    date = addCalendarDays(date, direction);
  }
  return cells;
};

export {
  addCalendarDays,
  addCalendarMonths,
  calendarDayDifference,
  cellKey,
  cellsForRange,
  createDayMaps,
  datesInMonth,
  isValidDate,
  normalizeCell,
  startOfDay,
  startOfMonth,
  toDateKey,
  uniqueCells,
};
