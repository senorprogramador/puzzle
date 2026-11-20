import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";

export type TableReservationSeating = "any" | "indoor" | "outdoor";

export type TableReservationValues = {
  date: string | null;
  time: string | null;
  partySize: number;
  seating: TableReservationSeating;
  seatingPreference: string;
  specialRequests: string;
  guestName: string;
  email: string;
  phone: string;
};

export type TableReservationInitialValue = Partial<TableReservationValues>;
export type TableReservationField = keyof TableReservationValues;
export type TableReservationErrors = Partial<
  Record<TableReservationField, ReactNode>
>;

export type TableReservationSectionProps = Omit<
  MarketingSectionBaseProps<"section">,
  "value" | "defaultValue" | "onChange" | "onSubmit"
> & {
  value?: TableReservationValues;
  defaultValue?: TableReservationInitialValue;
  minPartySize?: number;
  maxPartySize?: number;
  locale?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  requiredDescription?: ReactNode;
  errors?: TableReservationErrors;
  error?: ReactNode;
  success?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  dateLabel?: ReactNode;
  timeLabel?: ReactNode;
  partySizeLabel?: ReactNode;
  seatingLabel?: ReactNode;
  anySeatingLabel?: string;
  indoorLabel?: string;
  outdoorLabel?: string;
  seatingPreferenceLabel?: ReactNode;
  specialRequestsLabel?: ReactNode;
  guestNameLabel?: ReactNode;
  emailLabel?: ReactNode;
  phoneLabel?: ReactNode;
  submitLabel?: ReactNode;
  loadingLabel?: ReactNode;
  bookingHref?: string;
  bookingLinkLabel?: ReactNode;
  bookingLinkDescription?: ReactNode;
  calendarLabel?: string;
  onChange?: (value: TableReservationValues) => void;
  onSubmit?: (value: TableReservationValues) => void | Promise<void>;
  onValidationError?: (errors: TableReservationErrors) => void;
  className?: string;
};
