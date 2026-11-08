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

import { cn } from "@puzzle-ui/core";
import { Icon } from "@puzzle-ui/icons";

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

  /** Amount applied by PageUp and PageDown. Defaults to ten times `step`. */
  largeStep?: number;

  fractionDigits?: number;

  longPressDelay?: number;
  repeatInterval?: number;

  /** Accessible label of the decrement button. */
  decrementLabel?: string;

  /** Accessible label of the increment button. */
  incrementLabel?: string;
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
  largeStep,

  fractionDigits = getPrecision(step),

  longPressDelay = 450,
  repeatInterval = 120,

  decrementLabel = "Decrease value",
  incrementLabel = "Increase value",

  disabled,
  readOnly,
  className,

  onBlur,
  onFocus,
  onKeyDown,

  ...inputProps
}: NumberInputProps) => {
  const isControlled = value !== undefined;

  const digits = Math.min(12, Math.max(0, Math.trunc(fractionDigits)));

  const factor = 10 ** digits;

  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;

  const safeLargeStep =
    largeStep !== undefined && Number.isFinite(largeStep) && largeStep > 0
      ? largeStep
      : safeStep * 10;

  const allowsNegative = min === undefined || min < 0;

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
    (direction: Direction, amount = safeStep) => {
      const next =
        Math.round((currentValueRef.current + direction * amount) * factor) /
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

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || readOnly) {
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        changeBy(1);
        break;
      case "ArrowDown":
        changeBy(-1);
        break;
      case "PageUp":
        changeBy(1, safeLargeStep);
        break;
      case "PageDown":
        changeBy(-1, safeLargeStep);
        break;
      case "Home":
        if (min === undefined) return;
        commit(min);
        break;
      case "End":
        if (max === undefined) return;
        commit(max);
        break;
      default:
        return;
    }

    event.preventDefault();
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

  const trimmedDraft = draft.trim();
  const draftIsIncomplete =
    trimmedDraft === "" ||
    trimmedDraft === "-" ||
    trimmedDraft === "." ||
    trimmedDraft === "-.";
  const draftValue = Number(trimmedDraft.replace(",", "."));

  const draftIsInvalid =
    !draftIsIncomplete &&
    (!Number.isFinite(draftValue) ||
      (min !== undefined && draftValue < min) ||
      (max !== undefined && draftValue > max));

  const stepperDisabled = disabled || readOnly;

  return (
    <div
      className={cn("puzzle-input", "puzzle-input--number", className)}
      data-disabled={disabled || undefined}
    >
      <button
        type="button"
        className="puzzle-input__stepper"
        aria-label={decrementLabel}
        tabIndex={-1}
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
        role="spinbutton"
        aria-valuenow={currentValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-invalid={draftIsInvalid || inputProps["aria-invalid"]}
        inputMode={allowsNegative ? "text" : digits > 0 ? "decimal" : "numeric"}
        pattern={`${allowsNegative ? "-?" : ""}[0-9]*${digits > 0 ? "[.,]?[0-9]*" : ""}`}
        disabled={disabled}
        readOnly={readOnly}
        value={draft}
        className="puzzle-input__control"
        onFocus={(event) => {
          focusedRef.current = true;
          onFocus?.(event);
        }}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleBlur}
      />

      <button
        type="button"
        className="puzzle-input__stepper"
        aria-label={incrementLabel}
        tabIndex={-1}
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
