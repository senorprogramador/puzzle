import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ResponsiveValue } from "@puzzle-ui/core";
import type { PopoutAlignment, PopoutPosition } from "../../overlays/popout";

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

export type DateRangeDayState = {
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
};

type DateRangePickerSize = "sm" | "md" | "lg";

export type DateRangePickerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "children"
  | "value"
  | "defaultValue"
  | "onChange"
  | "disabled"
  | "form"
  | "name"
  | "size"
  | "type"
> & {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onChange?: (value: DateRange) => void;
  label?: ReactNode;
  placeholder?: ReactNode;
  startPlaceholder?: ReactNode;
  endPlaceholder?: ReactNode;
  description?: ReactNode;
  error?: ReactNode | boolean;
  disabled?: boolean;
  required?: boolean;
  requiredDescription?: ReactNode;
  clearable?: boolean;
  clearLabel?: string;
  startName?: string;
  endName?: string;
  form?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  shouldDisableDate?: (date: Date) => boolean;
  validateRange?: (value: DateRange) => ReactNode | undefined;
  onValidationError?: (error: ReactNode) => void;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dateFormat?: Intl.DateTimeFormatOptions;
  months?: 1 | 2;
  dayContent?: (date: Date, state: DateRangeDayState) => ReactNode;
  size?: ResponsiveValue<DateRangePickerSize>;
  fullWidth?: ResponsiveValue<boolean>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: PopoutPosition;
  align?: PopoutAlignment;
  offset?: number;
  collisionPadding?: number;
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  rootClassName?: string;
  popoverClassName?: string;
};

export type { DateRangePickerSize };
