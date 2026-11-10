"use client";

import { useId, useMemo, type ChangeEvent } from "react";

import { cn, resolveResponsiveValue } from "@puzzle-ui/core";

import { normalizeTime, parseTime } from "./time-picker.utils";

import type { TimePickerProps } from "./time-picker.types";

import "./time-picker.css";

const TimePicker = ({
  value,
  defaultValue,
  onChange,
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  form,
  minTime,
  maxTime,
  minuteStep = 1,
  showSeconds = false,
  secondStep = 1,
  size = "md",
  fullWidth = false,
  rootClassName,
  className,
  id,
  style,
  onBlur,
  onFocus,
  onInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: TimePickerProps) => {
  const baseId = useId();

  const inputId = id ?? `${baseId}-input`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  const isControlled = value !== undefined;

  const selectedValue = normalizeTime(
    isControlled ? value : defaultValue,
    showSeconds,
  );

  const responsiveSize = resolveResponsiveValue(size, "md");
  const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);

  const hasError = error !== undefined && error !== null && error !== false;

  const isAriaInvalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== "false";

  const isInvalid = hasError || isAriaInvalid;

  const resolvedAriaInvalid = isInvalid ? true : ariaInvalid;

  const errorContent = error === true ? "Invalid time" : error;

  const resolvedLabelledBy =
    ariaLabelledBy ?? (label != null ? labelId : undefined);

  const resolvedDescribedBy =
    [
      ariaDescribedBy,
      description != null ? descriptionId : undefined,
      hasError ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const isConfigurationInvalid = useMemo(() => {
    const min = parseTime(minTime);
    const max = parseTime(maxTime);

    return (
      (minTime != null && min === null) ||
      (maxTime != null && max === null) ||
      (min !== null && max !== null && min > max) ||
      !Number.isInteger(minuteStep) ||
      minuteStep < 1 ||
      minuteStep > 60 ||
      !Number.isInteger(secondStep) ||
      secondStep < 1 ||
      secondStep > 60
    );
  }, [minTime, maxTime, minuteStep, secondStep]);

  const step = showSeconds ? secondStep : minuteStep * 60;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = normalizeTime(event.currentTarget.value, showSeconds);

    onChange?.(nextValue);
  };

  const inputValue = selectedValue ?? "";

  return (
    <div
      className={cn("puzzle-time-picker", rootClassName)}
      data-disabled={disabled ? "true" : undefined}
      data-readonly={readOnly ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-size-mobile={responsiveSize.mobile}
      data-size-tablet={responsiveSize.tablet}
      data-size-desktop={responsiveSize.desktop}
      data-full-width-mobile={String(responsiveFullWidth.mobile)}
      data-full-width-tablet={String(responsiveFullWidth.tablet)}
      data-full-width-desktop={String(responsiveFullWidth.desktop)}
    >
      {label != null && (
        <label
          id={labelId}
          className="puzzle-time-picker__label"
          htmlFor={inputId}
        >
          {label}
          {required && (
            <span className="puzzle-time-picker__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        {...inputProps}
        id={inputId}
        type="time"
        name={name}
        form={form}
        value={isControlled ? inputValue : undefined}
        defaultValue={!isControlled ? inputValue : undefined}
        disabled={disabled || isConfigurationInvalid}
        readOnly={readOnly}
        required={required}
        min={minTime}
        max={maxTime}
        step={step}
        style={style}
        className={cn("puzzle-time-picker__input", className)}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onInvalid={onInvalid}
        aria-label={ariaLabel}
        aria-labelledby={resolvedLabelledBy}
        aria-describedby={resolvedDescribedBy}
        aria-invalid={resolvedAriaInvalid}
        aria-required={required || undefined}
      />

      {description != null && (
        <div id={descriptionId} className="puzzle-time-picker__description">
          {description}
        </div>
      )}

      {hasError && (
        <div id={errorId} className="puzzle-time-picker__error" role="alert">
          {errorContent}
        </div>
      )}
    </div>
  );
};

export { TimePicker };
export type { TimePickerProps, TimePickerSize } from "./time-picker.types";
