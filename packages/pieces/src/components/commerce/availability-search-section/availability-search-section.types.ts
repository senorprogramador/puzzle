import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { GuestCount } from "../../business/accommodation.types";

export type AvailabilitySearchVariant = "compact" | "expanded";

export type AvailabilitySearchValues = {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
  accommodationId: string | null;
  flexibleDates: boolean;
};

export type AvailabilitySearchInitialValue = Partial<
  Omit<AvailabilitySearchValues, "guests">
> & {
  guests?: Partial<GuestCount>;
};

export type AvailabilityAccommodationOption = {
  id: string;
  name: string;
  description?: ReactNode;
  disabled?: boolean;
};

export type AvailabilityChildAgeOption = {
  value: number;
  label: string;
};

export type AvailabilitySearchField =
  | "checkIn"
  | "checkOut"
  | "adults"
  | "children"
  | "childAges"
  | "accommodationId";

export type AvailabilitySearchErrors = Partial<
  Record<AvailabilitySearchField, ReactNode>
>;

export type AvailabilitySearchSectionProps = Omit<
  MarketingSectionBaseProps<"section">,
  "children" | "value" | "defaultValue" | "onChange" | "onSubmit"
> & {
  variant?: AvailabilitySearchVariant;
  value?: AvailabilitySearchValues;
  defaultValue?: AvailabilitySearchInitialValue;
  accommodations?: readonly AvailabilityAccommodationOption[];
  childAgeOptions?: readonly AvailabilityChildAgeOption[];
  accommodationRequired?: boolean;
  minAdults?: number;
  maxAdults?: number;
  minChildren?: number;
  maxChildren?: number;
  locale?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  requiredDescription?: ReactNode;
  errors?: AvailabilitySearchErrors;
  error?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: ReactNode;
  loadingLabel?: ReactNode;
  onChange?: (value: AvailabilitySearchValues) => void;
  onSubmit: (value: AvailabilitySearchValues) => void | Promise<void>;
  onValidationError?: (errors: AvailabilitySearchErrors) => void;
};
