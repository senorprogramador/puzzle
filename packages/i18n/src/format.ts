export type NumberFormatOptions = Intl.NumberFormatOptions;
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions;
export type RelativeTimeFormatOptions = Intl.RelativeTimeFormatOptions;
export type ListFormatOptions = Intl.ListFormatOptions;

export const formatNumber = (
  value: number,
  locale: string,
  options?: NumberFormatOptions,
): string => new Intl.NumberFormat(locale, options).format(value);

export const formatCurrency = (
  value: number,
  locale: string,
  currency: string,
  options: Omit<NumberFormatOptions, "style" | "currency"> = {},
): string =>
  new Intl.NumberFormat(locale, {
    ...options,
    style: "currency",
    currency,
  }).format(value);

export const formatDate = (
  value: Date | number,
  locale: string,
  options?: DateTimeFormatOptions,
): string => new Intl.DateTimeFormat(locale, options).format(value);

export const formatRelativeTime = (
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string,
  options?: RelativeTimeFormatOptions,
): string => new Intl.RelativeTimeFormat(locale, options).format(value, unit);

export const formatList = (
  values: readonly string[],
  locale: string,
  options?: ListFormatOptions,
): string => new Intl.ListFormat(locale, options).format(values);
