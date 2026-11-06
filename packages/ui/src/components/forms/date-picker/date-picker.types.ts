import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ResponsiveValue } from "@puzzle/core";
import type { PopoutAlignment, PopoutPosition } from "../../overlays/popout";

type DatePickerSize = "sm" | "md" | "lg";

type DatePickerProps = Omit<
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
  /** Selected date. Use null to represent an empty value. */
  value?: Date | null;

  /** Initial selected date for uncontrolled usage. */
  defaultValue?: Date | null;

  /** Called whenever the selected date changes. */
  onChange?: (value: Date | null) => void;

  /** Visible field label. */
  label?: ReactNode;

  /** Text displayed when no date is selected. */
  placeholder?: ReactNode;

  /** Supporting text displayed below the control. */
  description?: ReactNode;

  /** Validation error. Set to true to use the default message. */
  error?: ReactNode | boolean;

  /** Disables the entire control. */
  disabled?: boolean;

  /** Marks the date field as required. */
  required?: boolean;

  /** Allows the selected date to be cleared. */
  clearable?: boolean;

  /** Accessible name of the clear button. */
  clearLabel?: string;

  /** Name used for native form submission. */
  name?: string;

  /** Form ID for native form association. */
  form?: string;

  /** Earliest selectable date, inclusive. */
  minDate?: Date;

  /** Latest selectable date, inclusive. */
  maxDate?: Date;

  /** Explicitly disabled dates. */
  disabledDates?: readonly Date[];

  /** Custom date availability callback. */
  shouldDisableDate?: (date: Date) => boolean;

  /** Locale used for formatting and calendar labels. */
  locale?: string;

  /** First day of the week. Sunday = 0, Monday = 1, etc. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Custom format for the selected date. */
  dateFormat?: Intl.DateTimeFormatOptions;

  /** Responsive trigger size. */
  size?: ResponsiveValue<DatePickerSize>;

  /** Responsive full-width layout. */
  fullWidth?: ResponsiveValue<boolean>;

  /** Controls the calendar visibility. */
  open?: boolean;

  /** Initial calendar visibility. */
  defaultOpen?: boolean;

  /** Called whenever the calendar visibility changes. */
  onOpenChange?: (open: boolean) => void;

  /** Calendar placement. */
  position?: PopoutPosition;

  /** Calendar alignment. */
  align?: PopoutAlignment;

  /** Distance between the trigger and calendar. */
  offset?: number;

  /** Minimum distance from viewport edges. */
  collisionPadding?: number;

  /** Accessible name of the calendar dialog. */
  calendarLabel?: string;

  /** Accessible label for the previous-month button. */
  previousMonthLabel?: string;

  /** Accessible label for the next-month button. */
  nextMonthLabel?: string;

  /** Additional class applied to the outer field. */
  rootClassName?: string;

  /** Additional class applied to the calendar popover. */
  popoverClassName?: string;
};

export type { DatePickerProps, DatePickerSize };
