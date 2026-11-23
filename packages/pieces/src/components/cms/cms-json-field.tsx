"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CmsValue } from "@puzzle-ui/cms";
import { JsonEditor } from "@puzzle-ui/ui";
import type { ContentEditorFieldContext } from "./cms.types";
import { isJsonValue } from "./cms.utils";

const useInvalidJsonDrafts = (onInvalidDraftChange?: (invalid: boolean) => void) => {
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<string>>(new Set());
  const setValidity = useCallback((fieldKey: string, valid: boolean) => {
    setInvalidFields((current) => {
      if (current.has(fieldKey) === !valid) return current;
      const next = new Set(current);
      if (valid) next.delete(fieldKey);
      else next.add(fieldKey);
      return next;
    });
  }, []);
  const hasInvalidDraft = invalidFields.size > 0;
  useEffect(() => {
    onInvalidDraftChange?.(hasInvalidDraft);
  }, [hasInvalidDraft, onInvalidDraftChange]);
  return { hasInvalidDraft, setValidity };
};

const CmsJsonField = ({
  field,
  value,
  error,
  disabled,
  onChange,
  onValidityChange,
  validateValue,
}: ContentEditorFieldContext & {
  onValidityChange: (fieldKey: string, valid: boolean) => void;
  validateValue?: (value: CmsValue) => string | null;
}) => {
  const serializedValue = JSON.stringify(value ?? null, null, 2);
  const [source, setSource] = useState(serializedValue);
  const [draftError, setDraftError] = useState<string | null>(null);
  const lastEmitted = useRef<string | null>(null);

  useEffect(() => {
    const emitted = lastEmitted.current;
    lastEmitted.current = null;
    if (emitted === serializedValue) return;
    setSource(serializedValue);
    setDraftError(null);
    onValidityChange(field.key, true);
  }, [field.key, onValidityChange, serializedValue]);

  useEffect(() => () => onValidityChange(field.key, true), [field.key, onValidityChange]);

  return (
    <JsonEditor
      label={field.label}
      description={`Edit ${field.label} as JSON-compatible content.`}
      value={source}
      onChange={(nextSource) => {
        setSource(nextSource);
        let parsed: unknown;
        try {
          parsed = JSON.parse(nextSource);
        } catch (parseError) {
          if (!(parseError instanceof SyntaxError)) throw parseError;
          setDraftError("Enter valid JSON before continuing.");
          onValidityChange(field.key, false);
          return;
        }
        if (!isJsonValue(parsed)) {
          setDraftError("JSON numbers must be finite.");
          onValidityChange(field.key, false);
          return;
        }
        const validationError = validateValue?.(parsed) ?? null;
        if (validationError) {
          setDraftError(validationError);
          onValidityChange(field.key, false);
          return;
        }
        setDraftError(null);
        onValidityChange(field.key, true);
        lastEmitted.current = JSON.stringify(parsed, null, 2);
        onChange(parsed);
      }}
      disabled={disabled}
      required={field.required}
      error={draftError ?? error}
      validate={(parsed) => isJsonValue(parsed)
        ? validateValue?.(parsed) ?? null
        : "JSON numbers must be finite."}
    />
  );
};

export { useInvalidJsonDrafts, CmsJsonField };
