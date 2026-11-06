type CalendarDay = {
  date: Date;
  key: string;
  outsideMonth: boolean;
};

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const isValidDate = (date: Date): boolean =>
  date instanceof Date && Number.isFinite(date.getTime());

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

const addMonths = (date: Date, amount: number): Date => {
  const day = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);

  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(day, lastDay),
  );
};

const addYears = (date: Date, amount: number): Date =>
  addMonths(date, amount * 12);

const toDateKey = (date: Date): string => {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const isSameMonth = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth();

const getCalendarDays = (month: Date, weekStartsOn: Weekday): CalendarDay[] => {
  const firstDay = startOfMonth(month);
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7;

  const calendarStart = addDays(firstDay, -offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(calendarStart, index);

    return {
      date,
      key: toDateKey(date),
      outsideMonth: !isSameMonth(date, month),
    };
  });
};

const getLastDayOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const sundayRegions = [
  "US",
  "CA",
  "JP",
  "KR",
  "TW",
  "TH",
  "PH",
  "BR",
  "CO",
  "MX",
] as const;

const getLocaleWeekStartsOn = (locale: string): Weekday => {
  try {
    type LocaleWeekInfo = {
      weekInfo?: { firstDay: number };
      getWeekInfo?: () => { firstDay: number };
    };

    type LocaleConstructor = new (locale: string) => LocaleWeekInfo;

    const IntlWithLocale = Intl as unknown as {
      Locale?: LocaleConstructor;
    };

    const Locale = IntlWithLocale.Locale;

    if (Locale) {
      const localeInfo = new Locale(locale);
      const firstDay =
        localeInfo.getWeekInfo?.().firstDay ?? localeInfo.weekInfo?.firstDay;

      if (firstDay !== undefined) {
        return (firstDay % 7) as Weekday;
      }
    }
  } catch {
    const region = locale.split("-").find((part) => /^[A-Z]{2}$/.test(part));
    return (
      region && sundayRegions.includes(region as (typeof sundayRegions)[number])
        ? 0
        : 1
    ) as Weekday;
  }

  // Fall back to Sunday when locale week information is unavailable.
  return 0;
};

const getWeekdayDates = (weekStartsOn: Weekday): Date[] => {
  // January 7, 2024 was a Sunday.
  const sunday = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) =>
    addDays(sunday, weekStartsOn + index),
  );
};

export {
  addDays,
  addMonths,
  addYears,
  getCalendarDays,
  getLastDayOfMonth,
  getLocaleWeekStartsOn,
  getWeekdayDates,
  isSameDay,
  isSameMonth,
  isValidDate,
  startOfDay,
  startOfMonth,
  toDateKey,
  type CalendarDay,
  type Weekday,
};
