import type {
  ComponentPropsWithoutRef,
  FocusEventHandler,
  InputHTMLAttributes,
  KeyboardEventHandler,
  Ref,
  ReactNode,
} from "react";

type TokenInputMode = "numeric" | "alphanumeric";

type TokenInputSize = "sm" | "md" | "lg";

type TokenInputProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "id" | "onChange" | "onFocus" | "onBlur" | "onKeyDown"
> & {
  /** Number of characters in the token. Defaults to 6. */
  length?: number;

  /** Controlled token value. */
  value?: string;

  /** Initial value for uncontrolled usage. */
  defaultValue?: string;

  /** Called whenever the token value changes. */
  onValueChange?: (value: string) => void;

  /** Called when the token transitions from incomplete to complete. */
  onComplete?: (value: string) => void;

  /** Allowed characters. Defaults to numeric. */
  mode?: TokenInputMode;

  /** Masks the entered characters. */
  mask?: boolean;

  /** Disables all inputs. */
  disabled?: boolean;

  /** Makes all inputs read-only. */
  readOnly?: boolean;

  /** Marks every character input as required. */
  required?: boolean;

  /** Visual size of the individual character slots. */
  size?: TokenInputSize;

  /** Visible label associated with the first input. */
  label?: ReactNode;

  /** ID applied to the first native input. */
  id?: string;

  /** Name used for native form submission. */
  name?: string;

  /** Associates the hidden form input with a form. */
  form?: string;

  /** Input mode for the native character inputs. */
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];

  /** Autocomplete mode for the first character input. */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];

  /** Ref forwarded to the first native input. */
  ref?: Ref<HTMLInputElement>;

  /** Called when an individual character input receives focus. */
  onFocus?: FocusEventHandler<HTMLInputElement>;

  /** Called when an individual character input loses focus. */
  onBlur?: FocusEventHandler<HTMLInputElement>;

  /** Called when an individual character input receives a key event. */
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

export type { TokenInputProps, TokenInputMode, TokenInputSize };
