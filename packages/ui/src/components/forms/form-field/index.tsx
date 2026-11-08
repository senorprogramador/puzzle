import {
  cloneElement,
  useId,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@puzzle-ui/core";

import { Label } from "../label";
import { resolveFormFieldState } from "./form-field-state";

import "./form-field.css";

type FormFieldProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  /** Visible label associated with the control. */
  label?: ReactNode;

  /** Supporting text displayed below the control. */
  description?: ReactNode;

  /** Validation error message. */
  error?: ReactNode | boolean;

  /** Explicitly controls the invalid state. Defaults to whether an error exists. */
  invalid?: boolean;

  /** Marks the control as required. */
  required?: boolean;

  /** Disables the control. */
  disabled?: boolean;

  /** ID applied to the actual form control. */
  controlId?: string;

  /** Displays an optional indicator beside the label. */
  optional?: boolean;

  /** A single Puzzle control or native form element. */
  children: ReactElement;
};

const FormField = ({
  label,
  description,
  error,
  invalid,
  required = false,
  disabled = false,
  controlId,
  optional = false,
  className,
  children,
  ...rootProps
}: FormFieldProps) => {
  const generatedId = useId();

  const child = children as ReactElement<Record<string, unknown>>;
  const childProps = child.props;

  const {
    resolvedControlId,
    isInvalid,
    errorContent,
    hasError,
    descriptionId,
    errorId,
    describedBy,
  } = resolveFormFieldState({
    generatedId,
    controlId,
    childProps,
    description,
    error,
    invalid,
  });

  const control = cloneElement(child, {
    id: resolvedControlId,
    required: required || childProps.required === true,
    disabled: disabled || childProps.disabled === true,
    "aria-describedby": describedBy,
    "aria-invalid": isInvalid ? true : childProps["aria-invalid"],
  });

  return (
    <div
      {...rootProps}
      className={cn("puzzle-form-field", className)}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
    >
      {label != null && (
        <Label
          htmlFor={resolvedControlId}
          required={required}
          optional={optional}
          className="puzzle-form-field__label"
        >
          {label}
        </Label>
      )}

      <div className="puzzle-form-field__control">{control}</div>

      {description != null && (
        <div id={descriptionId} className="puzzle-form-field__description">
          {description}
        </div>
      )}

      {hasError && (
        <div
          id={errorId}
          className="puzzle-form-field__error"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorContent}
        </div>
      )}
    </div>
  );
};

export { FormField, type FormFieldProps };
