"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import { cn } from "@puzzle-ui/core";

import { Button } from "../../actions/button";
import type {
  JsonEditorError,
  JsonEditorProps,
  JsonEditorResult,
  JsonValue,
} from "./json-editor.types";

import "./json-editor.css";

type SourceResult = {
  source: string;
  result: JsonEditorResult;
};

const hasNonFiniteNumber = (value: JsonValue): boolean => {
  if (typeof value === "number") return !Number.isFinite(value);
  if (Array.isArray(value)) return value.some(hasNonFiniteNumber);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(hasNonFiniteNumber);
  }
  return false;
};

const parseJson = (source: string): JsonEditorResult => {
  try {
    const value = JSON.parse(source) as JsonValue;
    if (hasNonFiniteNumber(value)) {
      return {
        valid: false,
        error: {
          type: "parse",
          message: "JSON numbers must be within the finite JavaScript number range.",
        },
      };
    }
    return {
      valid: true,
      value,
    };
  } catch (error) {
    return {
      valid: false,
      error: {
        type: "parse",
        message:
          error instanceof Error ? error.message : "The JSON could not be parsed.",
      },
    };
  }
};

const validateParsedJson = (
  result: JsonEditorResult,
  validate?: (value: JsonValue) => string | null,
): JsonEditorResult => {
  if (!result.valid || !validate) {
    return result;
  }

  const validationMessage = validate(result.value);

  return validationMessage
    ? {
        valid: false,
        error: {
          type: "validation",
          message: validationMessage,
        },
      }
    : result;
};

const JsonEditor = ({
  label,
  value,
  defaultValue = "",
  onChange,
  description,
  error,
  invalid,
  validate,
  onValidate,
  formatIndent = 2,
  formatLabel = "Format JSON",
  validateLabel = "Validate JSON",
  successMessage = "Valid JSON.",
  rootClassName,
  className,
  rows = 12,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...textareaProps
}: JsonEditorProps) => {
  const generatedId = useId();
  const textareaId = id ?? `${generatedId}-source`;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;

  const [internalSource, setInternalSource] = useState(defaultValue);
  const [sourceResult, setSourceResult] = useState<SourceResult | null>(null);
  const source = value === undefined ? internalSource : value;

  const currentResult =
    sourceResult?.source === source ? sourceResult.result : null;
  const hasInternalError = currentResult?.valid === false;
  const hasExternalError =
    error !== undefined && error !== null && error !== false;
  const hasError =
    hasExternalError || hasInternalError || invalid === true;
  const isInvalid = invalid ?? hasError;
  const errorContent: ReactNode = hasExternalError
    ? error === true
      ? "Invalid JSON."
      : error
    : hasInternalError
      ? (currentResult as Extract<JsonEditorResult, { valid: false }>).error
          .message
      : invalid
        ? "Invalid JSON."
        : null;

  const describedBy = [
    ariaDescribedBy,
    description != null ? descriptionId : null,
    errorContent != null ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  const updateSource = (nextSource: string) => {
    if (value === undefined) {
      setInternalSource(nextSource);
    }
    onChange?.(nextSource);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateSource(event.currentTarget.value);
  };

  const validateSource = () => {
    const result = validateParsedJson(parseJson(source), validate);

    setSourceResult({ source, result });
    onValidate?.(result);
  };

  const formatSource = () => {
    const parsed = parseJson(source);
    const result = validateParsedJson(parsed, validate);

    if (!parsed.valid) {
      setSourceResult({ source, result });
      onValidate?.(result);
      return;
    }

    const formatted = JSON.stringify(parsed.value, null, formatIndent);
    const nextSource = formatted ?? source;

    updateSource(nextSource);
    setSourceResult({
      source: nextSource,
      result,
    });
    onValidate?.(result);
  };

  return (
    <div
      className={cn("puzzle-json-editor", rootClassName)}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
    >
      <label className="puzzle-json-editor__label" htmlFor={textareaId}>
        {label}
        {required && (
          <span className="puzzle-json-editor__required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      {description != null && (
        <p id={descriptionId} className="puzzle-json-editor__description">
          {description}
        </p>
      )}

      <textarea
        {...textareaProps}
        id={textareaId}
        className={cn("puzzle-json-editor__textarea", className)}
        value={source}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        wrap="off"
        aria-describedby={describedBy || undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        onChange={handleChange}
      />

      {errorContent != null && (
        <p
          id={errorId}
          className="puzzle-json-editor__error"
          role="alert"
          aria-atomic="true"
        >
          {errorContent}
        </p>
      )}

      {currentResult?.valid === true && !hasExternalError && !isInvalid && (
        <p className="puzzle-json-editor__success" role="status">
          {successMessage}
        </p>
      )}

      <div className="puzzle-json-editor__actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || readOnly}
          onClick={formatSource}
        >
          {formatLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || readOnly}
          onClick={validateSource}
        >
          {validateLabel}
        </Button>
      </div>
    </div>
  );
};

export {
  JsonEditor,
  type JsonEditorError,
  type JsonEditorProps,
  type JsonEditorResult,
  type JsonValue,
};
