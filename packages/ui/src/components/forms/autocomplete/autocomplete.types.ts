import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";
import type { ResponsiveValue } from "@puzzle/core";
import type { PopoutAlignment, PopoutPosition } from "../../overlays/popout";

type AutocompleteSize = "sm" | "md" | "lg";

type AutocompleteOption<T = string> = {
  id?: string | number;
  value: T;
  label: string;
  description?: ReactNode;
  group?: string;
  disabled?: boolean;
};

type AutocompleteInputChangeReason = "input" | "reset" | "clear" | "select";

type AutocompleteOptionRenderState = {
  selected: boolean;
  active: boolean;
  disabled: boolean;
  multiple: boolean;
};

type AutocompleteValue<T, FreeSolo extends boolean = false> =
  | T
  | (FreeSolo extends true ? string : never);

type AutocompleteBaseProps<T, FreeSolo extends boolean = false> = Omit<
  ComponentPropsWithRef<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "name"
  | "form"
  | "size"
  | "multiple"
  | "role"
  | "aria-autocomplete"
> & {
  options: readonly AutocompleteOption<T>[];

  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode | boolean;

  disabled?: boolean;
  required?: boolean;

  freeSolo?: FreeSolo;
  multiple?: boolean;

  name?: string;
  form?: string;

  serializeValue?: (value: AutocompleteValue<T, FreeSolo>) => string;

  isOptionEqualToValue?: (
    option: AutocompleteOption<T>,
    value: AutocompleteValue<T, FreeSolo>,
  ) => boolean;

  filterOptions?: (
    options: readonly AutocompleteOption<T>[],
    inputValue: string,
  ) => readonly AutocompleteOption<T>[];

  renderOption?: (
    option: AutocompleteOption<T>,
    state: AutocompleteOptionRenderState,
  ) => ReactNode;

  inputValue?: string;
  defaultInputValue?: string;

  onInputChange?: (
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  openOnFocus?: boolean;
  autoHighlight?: boolean;
  clearOnBlur?: boolean;
  clearOnEscape?: boolean;
  clearable?: boolean;

  clearLabel?: string;
  removeOptionLabel?: string;

  loading?: boolean;
  loadingText?: ReactNode;
  noOptionsText?: ReactNode;

  requiredMessage?: string;

  closeOnSelect?: boolean;
  maxSelected?: number;
  filterSelectedOptions?: boolean;
  maxOptions?: number;

  position?: PopoutPosition;
  align?: PopoutAlignment;
  offset?: number;
  collisionPadding?: number;
  matchTriggerWidth?: boolean;

  menuMaxHeight?: CSSProperties["maxHeight"];

  size?: ResponsiveValue<AutocompleteSize>;
  fullWidth?: ResponsiveValue<boolean>;

  className?: string;
  inputClassName?: string;
  popoverClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
};

type AutocompleteSingleProps<
  T = string,
  FreeSolo extends boolean = false,
> = Omit<AutocompleteBaseProps<T, FreeSolo>, "freeSolo"> & {
  multiple?: false;
  freeSolo?: FreeSolo;

  value?: NoInfer<AutocompleteValue<T, FreeSolo>>;
  defaultValue?: NoInfer<AutocompleteValue<T, FreeSolo>>;

  onChange?: (
    value: NoInfer<AutocompleteValue<T, FreeSolo>> | undefined,
  ) => void;
};

type AutocompleteMultipleProps<
  T = string,
  FreeSolo extends boolean = false,
> = Omit<AutocompleteBaseProps<T, FreeSolo>, "freeSolo"> & {
  multiple: true;
  freeSolo?: FreeSolo;

  value?: readonly NoInfer<AutocompleteValue<T, FreeSolo>>[];
  defaultValue?: readonly NoInfer<AutocompleteValue<T, FreeSolo>>[];

  onChange?: (value: NoInfer<AutocompleteValue<T, FreeSolo>>[]) => void;
};

type AutocompleteProps<T = string, FreeSolo extends boolean = false> =
  | AutocompleteSingleProps<T, FreeSolo>
  | AutocompleteMultipleProps<T, FreeSolo>;

export type {
  AutocompleteBaseProps,
  AutocompleteInputChangeReason,
  AutocompleteMultipleProps,
  AutocompleteOption,
  AutocompleteOptionRenderState,
  AutocompleteProps,
  AutocompleteSingleProps,
  AutocompleteSize,
  AutocompleteValue,
};
