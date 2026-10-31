"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
} from "react";

import { cn } from "@puzzle/core";
import { Icon } from "@puzzle/icons";

import "./input.css";

type NumberInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "step" | "min" | "max"
> & {
  value?: number;
  initialValue?: number;

  onChange?: (value: number) => void;

  min?: number;
  max?: number;
  step?: number;

  fractionDigits?: number;

  longPressDelay?: number;
  repeatInterval?: number;
};

type Direction = -1 | 1;

const clamp = (value: number, min?: number, max?: number) =>
  Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));

const getPrecision = (value: number) => {
  const valueString = String(value);

  if (valueString.includes("e-")) {
    return Number(valueString.split("e-")[1]) || 0;
  }

  return valueString.split(".")[1]?.length ?? 0;
};

const NumberInput = ({
  value,
  initialValue = 0,
  onChange,

  min,
  max,
  step = 1,

  fractionDigits = getPrecision(step),

  longPressDelay = 450,
  repeatInterval = 120,

  disabled,
  readOnly,
  className,

  onBlur,
  onFocus,

  ...inputProps
}: NumberInputProps) => {
  const isControlled = value !== undefined;

  const digits = Math.min(12, Math.max(0, Math.trunc(fractionDigits)));

  const factor = 10 ** digits;

  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;

  const [internalValue, setInternalValue] = useState(() =>
    clamp(Number.isFinite(initialValue) ? initialValue : 0, min, max),
  );

  const currentValue = clamp(isControlled ? value : internalValue, min, max);

  const [draft, setDraft] = useState(() =>
    String(Number(currentValue.toFixed(digits))),
  );

  const currentValueRef = useRef(currentValue);
  const focusedRef = useRef(false);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const holdStartedAtRef = useRef(0);
  const holdDirectionRef = useRef<Direction>(1);

  currentValueRef.current = currentValue;

  useEffect(() => {
    if (!focusedRef.current) {
      setDraft(String(Number(currentValue.toFixed(digits))));
    }
  }, [currentValue, digits]);

  const commit = useCallback(
    (nextValue: number) => {
      const rounded = Math.round(clamp(nextValue, min, max) * factor) / factor;

      if (!Number.isFinite(rounded) || rounded === currentValueRef.current) {
        return;
      }

      currentValueRef.current = rounded;

      if (!isControlled) {
        setInternalValue(rounded);
      }

      setDraft(String(rounded));

      onChange?.(rounded);
    },
    [factor, isControlled, max, min, onChange],
  );

  const changeBy = useCallback(
    (direction: Direction) => {
      const next =
        Math.round((currentValueRef.current + direction * safeStep) * factor) /
        factor;

      commit(next);
    },
    [commit, factor, safeStep],
  );

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }

    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
    }

    holdTimerRef.current = null;
    repeatTimerRef.current = null;
  }, []);

  const scheduleRepeat = useCallback(() => {
    const elapsed = Date.now() - holdStartedAtRef.current;

    const interval = Math.max(
      45,
      repeatInterval - Math.floor(elapsed / 1800) * 20,
    );

    repeatTimerRef.current = setTimeout(() => {
      changeBy(holdDirectionRef.current);
      scheduleRepeat();
    }, interval);
  }, [changeBy, repeatInterval]);

  const startHold =
    (direction: Direction) => (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled || readOnly || event.button !== 0) {
        return;
      }

      event.preventDefault();

      stopHold();

      holdDirectionRef.current = direction;
      holdStartedAtRef.current = Date.now();

      changeBy(direction);

      holdTimerRef.current = setTimeout(scheduleRepeat, longPressDelay);
    };

  const handleStepperKeyDown =
    (direction: Direction) =>
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== " " && event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      changeBy(direction);
    };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = event.target.value;

    setDraft(nextDraft);

    if (
      nextDraft.trim() === "" ||
      nextDraft === "-" ||
      nextDraft === "." ||
      nextDraft === "-."
    ) {
      return;
    }

    const parsed = Number(nextDraft.replace(",", "."));

    if (Number.isFinite(parsed)) {
      commit(parsed);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    focusedRef.current = false;

    const parsed = Number(draft.replace(",", "."));

    const nextValue =
      draft.trim() !== "" && Number.isFinite(parsed)
        ? clamp(Math.round(parsed * factor) / factor, min, max)
        : currentValueRef.current;

    commit(nextValue);

    setDraft(String(Number(nextValue.toFixed(digits))));

    onBlur?.(event);
  };

  useEffect(() => stopHold, [stopHold]);

  const atMinimum = min !== undefined && currentValue <= min;

  const atMaximum = max !== undefined && currentValue >= max;

  const stepperDisabled = disabled || readOnly;

  return (
    <div
      className={cn("puzzle-input", "puzzle-input--number", className)}
      data-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="puzzle-input__stepper"
        aria-label="Decrease value"
        disabled={stepperDisabled || atMinimum}
        onPointerDown={startHold(-1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onKeyDown={handleStepperKeyDown(-1)}
      >
        <Icon name="lucide:minus" />
      </button>

      <input
        {...inputProps}
        type="text"
        inputMode={digits > 0 ? "decimal" : "numeric"}
        pattern={digits > 0 ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
        disabled={disabled}
        readOnly={readOnly}
        value={draft}
        className="puzzle-input__control"
        onFocus={(event) => {
          focusedRef.current = true;
          onFocus?.(event);
        }}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />

      <button
        type="button"
        className="puzzle-input__stepper"
        aria-label="Increase value"
        disabled={stepperDisabled || atMaximum}
        onPointerDown={startHold(1)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onKeyDown={handleStepperKeyDown(1)}
      >
        <Icon name="lucide:plus" />
      </button>
    </div>
  );
};

export { NumberInput, type NumberInputProps };
