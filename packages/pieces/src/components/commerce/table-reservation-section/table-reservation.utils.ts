import type {
  TableReservationErrors,
  TableReservationValues,
} from "./table-reservation-section.types";

export const DEFAULT_TABLE_RESERVATION_VALUES: TableReservationValues = {
  date: null,
  time: null,
  partySize: 2,
  seating: "any",
  seatingPreference: "",
  specialRequests: "",
  guestName: "",
  email: "",
  phone: "",
};

export const normalizeTableReservationValue = (
  value?: Partial<TableReservationValues>,
): TableReservationValues => ({
  ...DEFAULT_TABLE_RESERVATION_VALUES,
  ...value,
});

export const isValidCalendarDate = (value: string | null): value is string => {
  if (!value) {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    year >= 1 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const calendarDateToPickerDate = (value: string | null) => {
  if (!isValidCalendarDate(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year!, month! - 1, day!);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const pickerDateToCalendarDate = (value: Date | null) => {
  if (!value || !Number.isFinite(value.getTime())) {
    return null;
  }

  return `${String(value.getFullYear()).padStart(4, "0")}-${String(
    value.getMonth() + 1,
  ).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const isValidTime = (value: string | null) =>
  value !== null && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

export const validateTableReservation = (
  value: TableReservationValues,
  minPartySize: number,
  maxPartySize: number,
): TableReservationErrors => {
  const errors: TableReservationErrors = {};

  if (!isValidCalendarDate(value.date)) {
    errors.date = "Choose a valid reservation date.";
  }

  if (!isValidTime(value.time)) {
    errors.time = "Choose a valid reservation time.";
  }

  if (
    !Number.isSafeInteger(value.partySize) ||
    value.partySize < minPartySize ||
    value.partySize > maxPartySize
  ) {
    errors.partySize = `Choose a party size from ${minPartySize} to ${maxPartySize}.`;
  }

  if (!["any", "indoor", "outdoor"].includes(value.seating)) {
    errors.seating = "Choose a valid seating option.";
  }

  if (!value.guestName.trim()) {
    errors.guestName = "Enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};

export const mergeTableReservationErrors = (
  ...errors: readonly TableReservationErrors[]
) => Object.assign({}, ...errors);

export const hasTableReservationErrors = (
  errors: TableReservationErrors,
) =>
  Object.values(errors).some(
    (value) => value !== undefined && value !== null && value !== false && value !== "",
  );
