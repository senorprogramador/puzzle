import { useEffect, useId, useState } from "react";

import { assertSafeCssValue } from "@puzzle-ui/core";
import {
  Button,
  NumberInput,
  Select,
  TextInput,
  type SelectOption,
} from "@puzzle-ui/ui";
import type { ThemeTokenRegistryEntry } from "@puzzle-ui/theme";

import {
  formatDimensionValue,
  formatDurationValue,
  parseDimensionValue,
  parseDurationValue,
} from "./theme-studio-model";

const DIMENSION_UNITS = [
  { value: "", label: "unitless" },
  { value: "px", label: "px" },
  { value: "rem", label: "rem" },
  { value: "em", label: "em" },
  { value: "ch", label: "ch" },
  { value: "%", label: "%" },
  { value: "vw", label: "vw" },
  { value: "vh", label: "vh" },
  { value: "vmin", label: "vmin" },
  { value: "vmax", label: "vmax" },
  { value: "pt", label: "pt" },
] as const satisfies readonly SelectOption<string>[];

const DURATION_UNITS = [
  { value: "ms", label: "ms" },
  { value: "s", label: "s" },
] as const satisfies readonly SelectOption<string>[];

const readableName = (name: string): string =>
  name.replace(/([a-z])([A-Z])/g, "$1 $2");

const decimalPlaces = (value: string): number =>
  Math.min(12, value.split(".")[1]?.length ?? 0);

type ThemeTokenFieldProps = {
  entry: ThemeTokenRegistryEntry;
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
};

const ThemeTokenField = ({
  entry,
  value,
  onChange,
  onReset,
}: ThemeTokenFieldProps) => {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string>();
  const generatedId = useId();
  const inputId = `${generatedId}-input`;
  const errorId = `${generatedId}-error`;
  const hintId = `${generatedId}-hint`;
  const title = readableName(entry.name);

  useEffect(() => setDraft(value), [value]);

  const commit = (nextValue: string) => {
    setDraft(nextValue);

    try {
      const safeValue = assertSafeCssValue(
        nextValue,
        `Theme Studio ${entry.group}.${entry.name}`,
      );
      onChange(safeValue);
      setError(undefined);
    } catch (validationError) {
      if (!(validationError instanceof TypeError)) throw validationError;
      setError(validationError.message);
    }
  };

  const describedBy = error ? `${hintId} ${errorId}` : hintId;
  const numericValue =
    entry.inputKind === "dimension"
      ? parseDimensionValue(value)
      : entry.inputKind === "duration"
        ? parseDurationValue(value)
        : entry.inputKind === "number" &&
            value.trim() !== "" &&
            Number.isFinite(Number(value))
          ? { value: Number(value), unit: "" }
          : null;
  const canUseNumericEditor =
    entry.inputKind === "number"
      ? numericValue !== null
      : (entry.inputKind === "dimension" || entry.inputKind === "duration") &&
        numericValue !== null;

  const handleNumericChange = (amount: number, unit: string) => {
    const formatted =
      entry.inputKind === "duration"
        ? formatDurationValue(amount, unit)
        : formatDimensionValue(amount, unit);
    if (formatted !== null) commit(formatted);
  };

  return (
    <div
      className={`theme-studio-token-field${canUseNumericEditor ? "" : " theme-studio-token-field--complex"}`}
    >
      <div className="theme-studio-token-field__heading">
        <label htmlFor={inputId}>
          <strong>{title}</strong>
          <code>{entry.cssVariable}</code>
        </label>
        <Button
          variant="link"
          size="sm"
          aria-label={`Reset ${title} (${entry.cssVariable})`}
          disabled={value === entry.defaultValue}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <p className="theme-studio-token-field__default" id={hintId}>
        Default: <code>{entry.defaultValue}</code>
      </p>

      {canUseNumericEditor && numericValue ? (
        <div className="theme-studio-token-field__numeric">
          <NumberInput
            id={inputId}
            aria-label={title}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            value={numericValue.value}
            step={
              entry.inputKind === "number"
                ? 1
                : 10 ** -Math.max(decimalPlaces(String(numericValue.value)), 2)
            }
            fractionDigits={12}
            onChange={(amount) =>
              handleNumericChange(
                amount,
                entry.inputKind === "number" ? "" : numericValue.unit,
              )
            }
          />
          {entry.inputKind === "dimension" ||
          entry.inputKind === "duration" ? (
            <Select
              label="Unit"
              size="sm"
              value={numericValue.unit}
              options={
                entry.inputKind === "duration"
                  ? DURATION_UNITS
                  : DIMENSION_UNITS
              }
              onChange={(unit) => {
                if (unit !== undefined) {
                  handleNumericChange(numericValue.value, unit);
                }
              }}
            />
          ) : null}
        </div>
      ) : (
        <TextInput
          id={inputId}
          value={draft}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => commit(event.currentTarget.value)}
        />
      )}
      {error ? (
        <span className="theme-studio-token-field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
};

export { ThemeTokenField, type ThemeTokenFieldProps };
