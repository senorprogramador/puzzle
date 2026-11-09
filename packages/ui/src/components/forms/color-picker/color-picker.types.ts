import type { ComponentPropsWithRef, ReactNode } from "react";

export type ColorPickerFormat = "hex" | "hexa" | "rgb" | "hsl";

export type ColorPickerSwatch =
  | string
  | {
      value: string;
      label?: string;
    };

export type ColorPickerProps = Omit<
  ComponentPropsWithRef<"button">,
  "children" | "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;

  label?: ReactNode;
  description?: ReactNode;
  placeholder?: string;

  colors?: readonly ColorPickerSwatch[];

  format?: ColorPickerFormat;

  clearable?: boolean;
  clearLabel?: string;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  position?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";

  rootClassName?: string;
  popoverClassName?: string;
};
