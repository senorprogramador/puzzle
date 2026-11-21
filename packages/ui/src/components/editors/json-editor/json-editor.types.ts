import type { ComponentPropsWithoutRef, ReactNode } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type JsonEditorError = {
  type: "parse" | "validation";
  message: string;
};

type JsonEditorResult =
  | {
      valid: true;
      value: JsonValue;
    }
  | {
      valid: false;
      error: JsonEditorError;
    };

type JsonEditorProps = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "children" | "defaultValue" | "onChange" | "value"
> & {
  /** Visible label associated with the JSON source textarea. */
  label: ReactNode;

  /** Controlled JSON source. */
  value?: string;

  /** Initial JSON source for uncontrolled usage. */
  defaultValue?: string;

  /** Called whenever the source text changes. */
  onChange?: (source: string) => void;

  /** Supporting text associated with the textarea. */
  description?: ReactNode;

  /** External validation message. `true` uses the default message. */
  error?: ReactNode | boolean;

  /** Explicitly marks the editor invalid. */
  invalid?: boolean;

  /** Validates parsed JSON and returns an error message, or `null` when valid. */
  validate?: (value: JsonValue) => string | null;

  /** Called when the user explicitly validates the current source. */
  onValidate?: (result: JsonEditorResult) => void;

  /** Indentation width used by the Format action. */
  formatIndent?: number;

  /** Visible and accessible label for the Format action. */
  formatLabel?: string;

  /** Visible and accessible label for the Validate action. */
  validateLabel?: string;

  /** Message announced after successful validation or formatting. */
  successMessage?: string;

  /** Additional class applied to the root element. */
  rootClassName?: string;

  /** Additional class applied to the textarea. */
  className?: string;
};

export type {
  JsonEditorError,
  JsonEditorProps,
  JsonEditorResult,
  JsonValue,
};
