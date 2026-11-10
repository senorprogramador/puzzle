const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const parseTime = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }

  const match = TIME_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
};

const isValidTime = (value?: string | null): boolean =>
  value == null || value === "" || parseTime(value) !== null;

const isTimeWithinBounds = (
  value: string,
  minTime?: string,
  maxTime?: string,
): boolean => {
  const time = parseTime(value);
  const min = parseTime(minTime);
  const max = parseTime(maxTime);

  if (time === null) {
    return false;
  }

  if (min !== null && max !== null && min > max) {
    return false;
  }

  return (min === null || time >= min) && (max === null || time <= max);
};

const normalizeTime = (
  value?: string | null,
  showSeconds = false,
): string | null => {
  if (!value) {
    return null;
  }

  const parsed = parseTime(value);

  if (parsed === null) {
    return null;
  }

  const hours = Math.floor(parsed / 3600);
  const minutes = Math.floor((parsed % 3600) / 60);
  const seconds = parsed % 60;

  const base = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return showSeconds ? `${base}:${String(seconds).padStart(2, "0")}` : base;
};

export { isTimeWithinBounds, isValidTime, normalizeTime, parseTime };
