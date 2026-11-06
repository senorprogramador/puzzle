"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@puzzle/core";

import "./slider.css";

type SliderSize = "sm" | "md" | "lg";

type SliderMark = {
  /** Numeric position of the mark. */
  value: number;

  /** Optional visible label below the mark. */
  label?: ReactNode;
};

type SliderProps = Omit<
  ComponentPropsWithRef<"input">,
  | "type"
  | "value"
  | "defaultValue"
  | "onChange"
  | "min"
  | "max"
  | "step"
  | "size"
  | "className"
> & {
  /** Controlled numeric value. */
  value?: number;

  /** Initial value for uncontrolled usage. Defaults to the range midpoint. */
  defaultValue?: number;

  /** Called whenever the selected value changes. */
  onChange?: (value: number) => void;

  /** Minimum selectable value. Defaults to 0. */
  min?: number;

  /** Maximum selectable value. Defaults to 100. */
  max?: number;

  /** Allowed increment. Use "any" to disable step rounding. */
  step?: number | "any";

  /** Visual size of the slider. */
  size?: SliderSize;

  /** Optional marks displayed below the track. */
  marks?: readonly SliderMark[];

  /** Displays the current value above the slider. */
  showValue?: boolean;

  /**
   * Formats the visible value and supplies aria-valuetext.
   * An explicitly supplied aria-valuetext takes precedence.
   */
  formatValue?: (value: number) => string;

  /** Class applied to the outer slider element. */
  className?: string;
};

const getPrecision = (value: number) => {
  const [coefficient, exponent = "0"] = String(value).toLowerCase().split("e");

  const decimals = coefficient.split(".")[1]?.length ?? 0;

  return Math.min(12, Math.max(0, decimals - Number(exponent)));
};

const normalizeSliderValue = (
  value: number,
  min: number,
  max: number,
  step: number | "any",
) => {
  if (max <= min) {
    return min;
  }

  const boundedValue = Math.min(max, Math.max(min, value));

  if (step === "any") {
    return boundedValue;
  }

  const precision = Math.max(getPrecision(min), getPrecision(step));
  const factor = 10 ** precision;

  const steppedValue = min + Math.round((boundedValue - min) / step) * step;

  return Math.min(
    max,
    Math.max(min, Math.round(steppedValue * factor) / factor),
  );
};

const Slider = ({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = "md",
  marks,
  showValue = false,
  formatValue,
  className,
  id,
  ref,
  disabled = false,
  style,
  "aria-invalid": ariaInvalid,
  "aria-valuetext": ariaValueText,
  ...inputProps
}: SliderProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const resolvedMin = Number.isFinite(min) ? min : 0;

  const requestedMax = Number.isFinite(max) ? max : 100;
  const resolvedMax = Math.max(resolvedMin, requestedMax);

  const resolvedStep =
    step === "any" ? "any" : Number.isFinite(step) && step > 0 ? step : 1;

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() =>
    normalizeSliderValue(
      defaultValue ?? (resolvedMin + resolvedMax) / 2,
      resolvedMin,
      resolvedMax,
      resolvedStep,
    ),
  );

  const currentValue = normalizeSliderValue(
    isControlled ? value : internalValue,
    resolvedMin,
    resolvedMax,
    resolvedStep,
  );

  const progress =
    resolvedMax > resolvedMin
      ? ((currentValue - resolvedMin) / (resolvedMax - resolvedMin)) * 100
      : 0;

  const formattedValue = formatValue?.(currentValue);

  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  const resolvedMarks = (marks ?? [])
    .filter(
      (mark) =>
        Number.isFinite(mark.value) &&
        mark.value >= resolvedMin &&
        mark.value <= resolvedMax,
    )
    .slice()
    .sort((a, b) => a.value - b.value);

  const hasMarkLabels = resolvedMarks.some((mark) => mark.label != null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = normalizeSliderValue(
      event.currentTarget.valueAsNumber,
      resolvedMin,
      resolvedMax,
      resolvedStep,
    );

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <div
      className={cn("puzzle-slider", className)}
      data-size={size}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
    >
      {showValue && (
        <output htmlFor={inputId} className="puzzle-slider__value">
          {formattedValue ?? currentValue}
        </output>
      )}

      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        className="puzzle-slider__input"
        type="range"
        min={resolvedMin}
        max={resolvedMax}
        step={resolvedStep}
        value={currentValue}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-valuetext={ariaValueText ?? formattedValue}
        style={
          {
            ...style,
            "--puzzle-slider-progress": `${progress}%`,
          } as CSSProperties
        }
        onChange={handleChange}
      />

      {resolvedMarks.length > 0 && (
        <div
          className="puzzle-slider__marks"
          data-has-labels={hasMarkLabels || undefined}
        >
          {resolvedMarks.map((mark, index) => {
            const position =
              resolvedMax > resolvedMin
                ? ((mark.value - resolvedMin) / (resolvedMax - resolvedMin)) *
                  100
                : 0;

            return (
              <span
                key={`${mark.value}-${index}`}
                className="puzzle-slider__mark"
                data-edge={
                  index === 0
                    ? "start"
                    : index === resolvedMarks.length - 1
                      ? "end"
                      : undefined
                }
                style={{
                  insetInlineStart: `${position}%`,
                }}
              >
                <span className="puzzle-slider__mark-tick" aria-hidden="true" />

                {mark.label != null && (
                  <span className="puzzle-slider__mark-label">
                    {mark.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Slider, type SliderProps, type SliderMark, type SliderSize };
