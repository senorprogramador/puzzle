"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { cn } from "@puzzle-ui/core";

import {
  getNextActiveIndex,
  getPreviousActiveIndex,
  insertTokenCharacters,
  isTokenComplete,
  removeTokenCharacter,
  replaceTokenCharacter,
  sanitizeToken,
} from "./token-input.utils";

import type { TokenInputProps } from "./token-input.types";

import "./token-input.css";

const TokenInput = ({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  mode = "numeric",
  mask = false,
  disabled = false,
  readOnly = false,
  required = false,
  size = "md",
  label,
  id,
  name,
  form,
  inputMode,
  autoComplete = "one-time-code",
  className,
  style,
  ref,
  onFocus,
  onBlur,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rootProps
}: TokenInputProps) => {
  if (!Number.isInteger(length) || length < 1 || length > 32) {
    throw new Error("TokenInput length must be an integer between 1 and 32.");
  }

  const generatedId = useId();

  // The ID belongs to the first native input.
  // This allows FormField's associated label to work.
  const inputId = id ?? `${generatedId}-input`;
  const labelId = `${inputId}-label`;

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() =>
    sanitizeToken(defaultValue, length, mode),
  );

  const currentValue = sanitizeToken(
    isControlled ? value : internalValue,
    length,
    mode,
  );

  const [activeIndex, setActiveIndex] = useState(() =>
    getNextActiveIndex(currentValue, length),
  );

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const completedValueRef = useRef<string | null>(null);

  const resolvedActiveIndex = Math.min(activeIndex, length - 1);

  const isInvalid = ariaInvalid === true || ariaInvalid === "true";

  const setFirstInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRefs.current[0] = node;

      if (typeof ref === "function") {
        return ref(node);
      }

      if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const focusInput = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(index, length - 1));

      setActiveIndex(nextIndex);

      const input = inputRefs.current[nextIndex];

      input?.focus();
      input?.select();
    },
    [length],
  );

  const commitValue = useCallback(
    (nextValue: string) => {
      const normalized = sanitizeToken(nextValue, length, mode);

      if (normalized === currentValue) {
        return;
      }

      const wasComplete = isTokenComplete(currentValue, length);

      const isComplete = isTokenComplete(normalized, length);

      if (!isControlled) {
        setInternalValue(normalized);
      }

      onValueChange?.(normalized);

      if (!wasComplete && isComplete) {
        if (completedValueRef.current !== normalized) {
          onComplete?.(normalized);
        }

        completedValueRef.current = normalized;
      } else if (!isComplete) {
        completedValueRef.current = null;
      }
    },
    [currentValue, isControlled, length, mode, onComplete, onValueChange],
  );

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (disabled || readOnly) {
      return;
    }

    const enteredValue = sanitizeToken(event.currentTarget.value, length, mode);

    const nextValue =
      enteredValue.length > 1
        ? insertTokenCharacters(currentValue, index, enteredValue, length, mode)
        : replaceTokenCharacter(
            currentValue,
            index,
            enteredValue,
            length,
            mode,
          );

    commitValue(nextValue);

    if (enteredValue.length > 0) {
      focusInput(Math.min(index + enteredValue.length, length - 1));
    } else {
      focusInput(index);
    }
  };

  const handlePaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    if (disabled || readOnly) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    const pastedValue = sanitizeToken(
      event.clipboardData.getData("text"),
      length,
      mode,
    );

    if (!pastedValue) {
      return;
    }

    const nextValue = insertTokenCharacters(
      currentValue,
      index,
      pastedValue,
      length,
      mode,
    );

    commitValue(nextValue);

    focusInput(Math.min(index + pastedValue.length, length - 1));
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        focusInput(index - 1);
        break;
      }

      case "ArrowRight": {
        event.preventDefault();
        focusInput(index + 1);
        break;
      }

      case "Home": {
        event.preventDefault();
        focusInput(0);
        break;
      }

      case "End": {
        event.preventDefault();
        focusInput(length - 1);
        break;
      }

      case "Backspace": {
        if (readOnly) {
          return;
        }

        event.preventDefault();

        if (currentValue[index]) {
          commitValue(removeTokenCharacter(currentValue, index));

          focusInput(index);
        } else if (index > 0) {
          const previousIndex = getPreviousActiveIndex(index);

          commitValue(removeTokenCharacter(currentValue, previousIndex));

          focusInput(previousIndex);
        }

        break;
      }

      case "Delete": {
        if (readOnly) {
          return;
        }

        event.preventDefault();

        if (currentValue[index]) {
          commitValue(removeTokenCharacter(currentValue, index));
        }

        focusInput(index);
        break;
      }

      default:
        break;
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    const index = Number(event.currentTarget.dataset.tokenIndex);

    setActiveIndex(index);

    // Selecting the current character makes replacement intuitive.
    event.currentTarget.select();

    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  };

  const resolvedLabelledBy =
    ariaLabelledBy ?? (label != null ? labelId : undefined);

  return (
    <div
      {...rootProps}
      className={cn("puzzle-token-input", className)}
      style={style}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      data-size={size}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={isInvalid || undefined}
    >
      {label != null && (
        <label
          id={labelId}
          htmlFor={inputId}
          className="puzzle-token-input__label"
        >
          {label}
        </label>
      )}

      <div className="puzzle-token-input__slots">
        {Array.from({ length }, (_, index) => {
          const character = currentValue[index] ?? "";

          const slotLabel = ariaLabel
            ? `${ariaLabel}, character ${index + 1} of ${length}`
            : index === 0 && (id != null || label != null)
              ? undefined
              : `Character ${index + 1} of ${length}`;

          return (
            <input
              key={index}
              ref={
                index === 0
                  ? setFirstInputRef
                  : (node) => {
                      inputRefs.current[index] = node;
                    }
              }
              id={index === 0 ? inputId : undefined}
              data-token-index={index}
              className="puzzle-token-input__slot"
              type={mask ? "password" : "text"}
              inputMode={inputMode ?? (mode === "numeric" ? "numeric" : "text")}
              autoComplete={index === 0 ? autoComplete : "off"}
              autoCapitalize="off"
              spellCheck={false}
              maxLength={length}
              value={character}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              tabIndex={index === resolvedActiveIndex ? 0 : -1}
              aria-label={slotLabel}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              onChange={(event) => handleChange(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          );
        })}
      </div>

      {name && (
        <input
          type="hidden"
          name={name}
          form={form}
          value={currentValue}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export { TokenInput };

export type {
  TokenInputProps,
  TokenInputMode,
  TokenInputSize,
} from "./token-input.types";
