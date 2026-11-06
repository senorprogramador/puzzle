import type { ReactNode } from "react";

type FormFieldStateInput = {
  generatedId: string;
  controlId?: string;
  childProps: Record<string, unknown>;
  description?: ReactNode;
  error?: ReactNode | boolean;
  invalid?: boolean;
};

const resolveFormFieldState = ({
  generatedId,
  controlId,
  childProps,
  description,
  error,
  invalid,
}: FormFieldStateInput) => {
  const resolvedControlId =
    controlId ??
    (typeof childProps.id === "string" ? childProps.id : generatedId);

  const isInvalid =
    invalid ?? (error !== undefined && error !== null && error !== false);

  const errorContent = error === true ? "Invalid value" : error;
  const hasError =
    isInvalid && errorContent !== undefined && errorContent !== null;

  const descriptionId =
    description != null ? `${resolvedControlId}-description` : undefined;

  const errorId = hasError ? `${resolvedControlId}-error` : undefined;

  const existingDescribedBy =
    typeof childProps["aria-describedby"] === "string"
      ? childProps["aria-describedby"]
      : undefined;

  const describedBy =
    [existingDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  return {
    resolvedControlId,
    isInvalid,
    errorContent,
    hasError,
    descriptionId,
    errorId,
    describedBy,
  };
};

export { resolveFormFieldState };
