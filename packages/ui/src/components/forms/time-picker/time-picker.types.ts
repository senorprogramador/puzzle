import type { InputHTMLAttributes, ReactNode } from "react";
import type { ResponsiveValue } from "@puzzle-ui/core";

type TimePickerSize = "sm" | "md" | "lg";

type TimePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "children"
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "size"
  | "min"
  | "max"
  | "step"
> & {
  /** Selected time in HH:mm or HH:mm:ss format. */
  value?: string | null;

  /** Initial selected time for uncontrolled usage. */
  defaultValue?: string | null;

  /** Called whenever the selected time changes. */
  onChange?: (value: string | null) => void;

  /** Visible field label. */
  label?: ReactNode;

  /** Supporting text displayed below the control. */
  description?: ReactNode;

  /** Validation error. Set to true to use the default message. */
  error?: ReactNode | boolean;

  /** Earliest selectable time, inclusive. */
  minTime?: string;

  /** Latest selectable time, inclusive. */
  maxTime?: string;

  /** Minute interval when seconds are hidden. */
  minuteStep?: number;

  /** Display seconds in the time input. */
  showSeconds?: boolean;

  /** Second interval when seconds are displayed. */
  secondStep?: number;

  /** Responsive input size. */
  size?: ResponsiveValue<TimePickerSize>;

  /** Responsive full-width layout. */
  fullWidth?: ResponsiveValue<boolean>;

  /** Additional class applied to the outer field. */
  rootClassName?: string;
};

export type { TimePickerProps, TimePickerSize };
