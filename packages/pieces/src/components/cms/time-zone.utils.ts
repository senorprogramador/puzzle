const dateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

const getDateTimeParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
};

const parseWallTime = (value: string) => {
  const match = dateTimePattern.exec(value);
  if (!match) {
    throw new RangeError("Enter a valid local date and time.");
  }
  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const check = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59
  ) {
    throw new RangeError("Enter a valid local date and time.");
  }
  return { year, month, day, hour, minute };
};

const matchesWallTime = (
  date: Date,
  desired: ReturnType<typeof parseWallTime>,
  timeZone: string,
) => {
  const parts = getDateTimeParts(date, timeZone);
  return (
    Number(parts.year) === desired.year &&
    Number(parts.month) === desired.month &&
    Number(parts.day) === desired.day &&
    Number(parts.hour) === desired.hour &&
    Number(parts.minute) === desired.minute
  );
};

export const toInstantInTimeZone = (value: string, timeZone: string) => {
  const desired = parseWallTime(value);
  const targetAsUtc = Date.UTC(
    desired.year,
    desired.month - 1,
    desired.day,
    desired.hour,
    desired.minute,
  );
  const possibleInstants: number[] = [];

  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const instant = new Date(targetAsUtc - offsetMinutes * 60_000);
    if (matchesWallTime(instant, desired, timeZone)) {
      possibleInstants.push(instant.getTime());
    }
  }

  if (possibleInstants.length === 0) {
    throw new RangeError(
      "That local time does not exist in the selected time zone because of a clock change.",
    );
  }

  return new Date(Math.min(...possibleInstants));
};

export const toDateTimeInputValue = (date: Date, timeZone: string) => {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("The scheduled date is invalid.");
  }
  const parts = getDateTimeParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
};
