import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from "react";

type RadioGroupOrientation = "horizontal" | "vertical";

type RadioGroupSize = "sm" | "md" | "lg";

type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "disabled" | "dir"
> & {
  /** Currently selected value. Enables controlled usage. */
  value?: string | null;

  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;

  /** Called when another option is selected. */
  onValueChange?: (value: string) => void;

  /** Name shared by all native radio inputs. */
  name?: string;

  /** Visible group label rendered as a legend. */
  label?: ReactNode;

  /** Supporting description for the group. */
  description?: ReactNode;

  /** Validation error message. */
  error?: ReactNode | boolean;

  /** Explicitly controls the invalid state. */
  invalid?: boolean;

  /** Marks the group as required. */
  required?: boolean;

  /** Disables all options. */
  disabled?: boolean;

  /** Layout direction. Defaults to vertical. */
  orientation?: RadioGroupOrientation;

  /** Visual size. Defaults to md. */
  size?: RadioGroupSize;

  /** Text direction for keyboard navigation. */
  dir?: "ltr" | "rtl";

  /** Whether keyboard navigation wraps around. */
  loop?: boolean;

  children: ReactNode;
};

type RadioProps = Omit<
  ComponentPropsWithRef<"input">,
  | "children"
  | "type"
  | "name"
  | "value"
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "required"
  | "size"
  | "className"
  | "style"
  | "tabIndex"
  | "form"
> & {
  /** Unique option value within the group. */
  value: string;

  /** Visible option label. */
  label?: ReactNode;

  /** Alternative to label for JSX composition. */
  children?: ReactNode;

  /** Supporting text displayed below the label. */
  description?: ReactNode;

  /** Disables this option individually. */
  disabled?: boolean;

  /** Class applied to the root label. */
  className?: string;

  /** Inline styles applied to the root label. */
  style?: CSSProperties;
};

export type {
  RadioGroupOrientation,
  RadioGroupSize,
  RadioGroupProps,
  RadioProps,
};
