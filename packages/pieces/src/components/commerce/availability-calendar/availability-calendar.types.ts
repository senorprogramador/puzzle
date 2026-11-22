import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { CommerceMoney } from "../shared.types";
import type { DateRange } from "@puzzle-ui/ui";

export type AvailabilityDayStatus =
  | "available"
  | "unavailable"
  | "blocked"
  | "check-in-only"
  | "check-out-only"
  | "changeover";

export type AvailabilityDay = {
  date: Date;
  status: AvailabilityDayStatus;
  label?: ReactNode;
  price?: CommerceMoney;
  indicator?: ReactNode;
};

export type AvailabilityCalendarProps = Omit<
  MarketingSectionBaseProps<"section">,
  "children" | "onChange" | "defaultValue" | "value"
> & {
  availability: readonly AvailabilityDay[];
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  minNights?: number;
  maxNights?: number;
  months?: 1 | 2;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  loading?: boolean;
  error?: ReactNode;
  emptyState?: ReactNode;
  legend?: ReactNode;
  labels?: Partial<Record<AvailabilityDayStatus, ReactNode>>;
  disabled?: boolean;
  onValidationError?: (error: ReactNode) => void;
  calendarLabel?: string;
  className?: string;
};
