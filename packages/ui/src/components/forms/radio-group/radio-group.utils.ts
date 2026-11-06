import type { ReactNode } from "react";

type RadioGroupErrorState = {
  isInvalid: boolean;
  errorContent: ReactNode | undefined;
  hasError: boolean;
};

const mergeDescribedBy = (
  ...values: Array<string | undefined>
): string | undefined => {
  const ids = new Set<string>();

  for (const value of values) {
    if (!value) {
      continue;
    }

    for (const id of value.trim().split(/\s+/)) {
      if (id) {
        ids.add(id);
      }
    }
  }

  return ids.size > 0 ? Array.from(ids).join(" ") : undefined;
};

const resolveRadioGroupError = (
  error: ReactNode | boolean | undefined,
  invalid?: boolean,
): RadioGroupErrorState => {
  const errorContent = error === true ? "Invalid value" : error;

  const isInvalid =
    invalid ?? (error !== undefined && error !== null && error !== false);

  const hasError =
    isInvalid &&
    errorContent !== undefined &&
    errorContent !== null &&
    errorContent !== false;

  return {
    isInvalid,
    errorContent,
    hasError,
  };
};

export { mergeDescribedBy, resolveRadioGroupError, type RadioGroupErrorState };
