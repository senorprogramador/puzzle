export type DateRange = {
  start: Date;
  end: Date;
};

const assertValidDate = (date: Date, label: string) => {
  if (!Number.isFinite(date.getTime())) {
    throw new RangeError(`${label} must be a valid Date.`);
  }
};

export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string,
) => {
  if (!Number.isFinite(amount)) {
    throw new RangeError("Currency amount must be a finite number.");
  }

  if (typeof currency !== "string" || currency.trim() === "") {
    throw new TypeError("Currency must be a non-empty ISO 4217 code.");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions = {},
) => {
  if (!Number.isFinite(value)) {
    throw new RangeError("Number value must be a finite number.");
  }

  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatDate = (
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
) => {
  assertValidDate(date, "Date");
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatDateRange = (
  range: DateRange,
  locale: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
) => {
  assertValidDate(range.start, "Date range start");
  assertValidDate(range.end, "Date range end");

  if (range.start.getTime() > range.end.getTime()) {
    throw new RangeError("Date range start must not be after its end.");
  }

  return new Intl.DateTimeFormat(locale, options).formatRange(
    range.start,
    range.end,
  );
};

export const formatTime = (
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" },
) => {
  assertValidDate(date, "Date");
  return new Intl.DateTimeFormat(locale, options).format(date);
};
