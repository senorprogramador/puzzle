import {
  addMoney,
  compareMoney,
  createMoney,
  subtractMoney,
  type Money,
} from "./money";

export type BookingStatus =
  | "draft"
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "cancelled"
  | "expired"
  | "completed";

export type BookingPaymentPolicy =
  | { readonly type: "none" }
  | { readonly type: "deposit"; readonly amount: Money }
  | { readonly type: "full" }
  | { readonly type: "external"; readonly reference?: string };

export type BookingGuestCounts = {
  readonly adults: number;
  readonly children?: number;
  readonly childAges?: readonly number[];
};

export type BookingDateRange = {
  readonly checkIn: Date;
  readonly checkOut: Date;
};

export type AvailabilityQuery = BookingDateRange & {
  readonly guests: BookingGuestCounts;
  readonly resourceId?: string;
};

export type AvailabilityConstraint = {
  readonly minimumStayNights?: number;
  readonly maximumStayNights?: number;
  readonly closedCheckIn?: boolean;
  readonly closedCheckOut?: boolean;
  readonly closedDates?: readonly Date[];
};

export type AvailabilityResult = {
  readonly resourceId: string;
  readonly available: boolean;
  readonly constraints?: AvailabilityConstraint;
  readonly metadata?: Readonly<Record<string, string>>;
};

export type BookingPriceLine = {
  readonly id: string;
  readonly label: string;
  readonly amount: Money;
  readonly kind:
    | "base"
    | "discount"
    | "tax"
    | "fee"
    | "service"
    | "deposit";
};

export type BookingPriceInput = {
  readonly base: Money;
  readonly lines?: readonly BookingPriceLine[];
};

export type BookingTotals = {
  readonly subtotal: Money;
  readonly discounts: Money;
  readonly taxes: Money;
  readonly fees: Money;
  readonly total: Money;
};

export type Booking = {
  readonly id: string;
  readonly resourceId: string;
  readonly dates: BookingDateRange;
  readonly guests: BookingGuestCounts;
  readonly status: BookingStatus;
  readonly paymentPolicy: BookingPaymentPolicy;
  readonly totals: BookingTotals;
  readonly paidAmount?: Money;
  readonly ratePlanId?: string;
  readonly metadata?: Readonly<Record<string, string>>;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

const BOOKING_TRANSITIONS: Readonly<
  Record<BookingStatus, readonly BookingStatus[]>
> = {
  draft: ["pending", "cancelled", "expired"],
  pending: ["awaiting_payment", "confirmed", "cancelled", "expired"],
  awaiting_payment: ["confirmed", "cancelled", "expired"],
  confirmed: ["cancelled", "completed"],
  cancelled: [],
  expired: [],
  completed: [],
};

export class BookingValidationError extends Error {
  readonly code = "INVALID_BOOKING";

  constructor(message: string) {
    super(message);
    this.name = "BookingValidationError";
  }
}

export class BookingTransitionError extends Error {
  readonly code = "INVALID_BOOKING_TRANSITION";
  readonly from: BookingStatus;
  readonly to: BookingStatus;

  constructor(from: BookingStatus, to: BookingStatus) {
    super(`Invalid booking transition from ${from} to ${to}`);
    this.name = "BookingTransitionError";
    this.from = from;
    this.to = to;
  }
}

const assertDate = (value: Date, label: string) => {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new BookingValidationError(`${label} must be a valid Date.`);
  }
};

export const getBookingNights = (dates: BookingDateRange): number => {
  assertDate(dates.checkIn, "Check-in");
  assertDate(dates.checkOut, "Check-out");
  const checkIn = Date.UTC(
    dates.checkIn.getUTCFullYear(),
    dates.checkIn.getUTCMonth(),
    dates.checkIn.getUTCDate(),
  );
  const checkOut = Date.UTC(
    dates.checkOut.getUTCFullYear(),
    dates.checkOut.getUTCMonth(),
    dates.checkOut.getUTCDate(),
  );
  const nights = Math.round((checkOut - checkIn) / 86_400_000);
  if (nights <= 0) {
    throw new BookingValidationError("Check-out must be after check-in.");
  }
  return nights;
};

export const validateGuestCounts = (guests: BookingGuestCounts): void => {
  if (!Number.isSafeInteger(guests.adults) || guests.adults < 1) {
    throw new BookingValidationError("At least one adult guest is required.");
  }
  const children = guests.children ?? 0;
  if (!Number.isSafeInteger(children) || children < 0) {
    throw new BookingValidationError("Children must be a non-negative integer.");
  }
  if (
    guests.childAges &&
    (guests.childAges.length !== children ||
      guests.childAges.some(
        (age) => !Number.isSafeInteger(age) || age < 0 || age > 17,
      ))
  ) {
    throw new BookingValidationError(
      "Child ages must match the child count and contain ages from 0 to 17.",
    );
  }
};

export const validateAvailabilityQuery = (query: AvailabilityQuery): void => {
  getBookingNights(query);
  validateGuestCounts(query.guests);
  if (query.resourceId !== undefined && !query.resourceId.trim()) {
    throw new BookingValidationError("Resource ID must not be empty.");
  }
};

export const validateAvailabilityConstraints = (
  dates: BookingDateRange,
  constraints: AvailabilityConstraint,
): void => {
  const nights = getBookingNights(dates);
  if (
    constraints.minimumStayNights !== undefined &&
    (!Number.isSafeInteger(constraints.minimumStayNights) ||
      constraints.minimumStayNights < 1 ||
      nights < constraints.minimumStayNights)
  ) {
    throw new BookingValidationError("The stay is shorter than the minimum stay.");
  }
  if (
    constraints.maximumStayNights !== undefined &&
    (!Number.isSafeInteger(constraints.maximumStayNights) ||
      constraints.maximumStayNights < 1 ||
      nights > constraints.maximumStayNights)
  ) {
    throw new BookingValidationError("The stay exceeds the maximum stay.");
  }
  if (constraints.closedCheckIn || constraints.closedCheckOut) {
    throw new BookingValidationError("The selected arrival or departure date is closed.");
  }
  const closedDates = constraints.closedDates ?? [];
  if (
    closedDates.some((date) => {
      assertDate(date, "Closed date");
      const time = date.getTime();
      return time >= dates.checkIn.getTime() && time < dates.checkOut.getTime();
    })
  ) {
    throw new BookingValidationError("The selected stay includes a closed date.");
  }
};

export const calculateBookingTotals = ({
  base,
  lines = [],
}: BookingPriceInput): BookingTotals => {
  let discounts = createMoney(0, base.currency, { allowUnknownCurrencies: true });
  let taxes = createMoney(0, base.currency, { allowUnknownCurrencies: true });
  let fees = createMoney(0, base.currency, { allowUnknownCurrencies: true });
  let subtotal = base;

  for (const line of lines) {
    if (line.amount.currency !== base.currency) {
      throw new BookingValidationError("All booking prices must use one currency.");
    }
    if (line.kind === "discount") {
      discounts = addMoney(discounts, line.amount);
    } else if (line.kind === "tax") {
      taxes = addMoney(taxes, line.amount);
    } else if (line.kind === "fee" || line.kind === "service") {
      fees = addMoney(fees, line.amount);
    } else {
      subtotal = addMoney(subtotal, line.amount);
    }
  }

  const total = addMoney(subtractMoney(addMoney(subtotal, taxes), discounts), fees);
  return Object.freeze({ subtotal, discounts, taxes, fees, total });
};

export const requiredBookingPayment = (
  policy: BookingPaymentPolicy,
  totals: BookingTotals,
): Money => {
  if (policy.type === "none" || policy.type === "external") {
    return createMoney(0, totals.total.currency, { allowUnknownCurrencies: true });
  }
  if (policy.type === "deposit") {
    if (policy.amount.currency !== totals.total.currency) {
      throw new BookingValidationError("Deposit and booking totals must use one currency.");
    }
    if (compareMoney(policy.amount, totals.total) > 0) {
      throw new BookingValidationError("Deposit cannot exceed the booking total.");
    }
    return policy.amount;
  }
  return totals.total;
};

export const canTransitionBooking = (
  from: BookingStatus,
  to: BookingStatus,
): boolean => BOOKING_TRANSITIONS[from]?.includes(to) ?? false;

export const validateBookingTransition = (
  from: BookingStatus,
  to: BookingStatus,
): void => {
  if (!canTransitionBooking(from, to)) {
    throw new BookingTransitionError(from, to);
  }
};

export const transitionBooking = (
  booking: Booking,
  status: BookingStatus,
): Booking => {
  validateBookingTransition(booking.status, status);
  return Object.freeze({ ...booking, status, updatedAt: new Date() });
};

export const createBooking = (
  input: Omit<Booking, "status"> & { status?: BookingStatus },
): Booking => {
  validateAvailabilityQuery({ ...input.dates, guests: input.guests, resourceId: input.resourceId });
  requiredBookingPayment(input.paymentPolicy, input.totals);
  return Object.freeze({ ...input, status: input.status ?? "draft" });
};
