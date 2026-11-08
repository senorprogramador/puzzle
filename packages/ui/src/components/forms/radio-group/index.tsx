"use client";

import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@puzzle-ui/core";
import { useRovingFocus, type UseRovingFocusReturn } from "@puzzle-ui/hooks";

import type {
  RadioGroupOrientation,
  RadioGroupProps,
  RadioGroupSize,
  RadioProps,
} from "./radio-group.types";

import { mergeDescribedBy, resolveRadioGroupError } from "./radio-group.utils";

import "./radio-group.css";

type RadioGroupContextValue = {
  value: string | undefined;
  name: string | undefined;
  form: string | undefined;
  disabled: boolean;
  required: boolean;
  requiredValue: string | undefined;
  orientation: RadioGroupOrientation;
  size: RadioGroupSize;
  invalid: boolean;
  describedBy: string | undefined;
  keyboardNavigationRef: { current: boolean };
  rovingFocus: UseRovingFocusReturn<HTMLInputElement>;
  selectValue: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("Radio must be rendered inside a RadioGroup.");
  }

  return context;
};

const Radio = ({
  value,
  label,
  children,
  description,
  disabled = false,
  className,
  style,
  id,
  ref,
  onChange,
  onFocus,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: RadioProps) => {
  const context = useRadioGroupContext();

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const descriptionId =
    description != null ? `${inputId}-description` : undefined;

  const radioLabel = label ?? children;
  const labelId = radioLabel != null ? `${inputId}-label` : undefined;

  const isDisabled = context.disabled || disabled;
  const isSelected = context.value === value;

  const isRequired =
    Boolean(context.name) &&
    context.required &&
    context.requiredValue === value;

  const describedBy = mergeDescribedBy(
    context.describedBy,
    ariaDescribedBy,
    descriptionId,
  );

  const rovingRef = context.rovingFocus.getItemRef(value);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      rovingRef(node);

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, rovingRef],
  );

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    context.rovingFocus.onItemFocus(value);

    if (context.keyboardNavigationRef.current) {
      context.keyboardNavigationRef.current = false;
      context.selectValue(value);
    }

    onFocus?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || isDisabled) {
      return;
    }

    const isHorizontalArrow =
      event.key === "ArrowLeft" || event.key === "ArrowRight";

    const isVerticalArrow =
      event.key === "ArrowUp" || event.key === "ArrowDown";

    const isArrowKey = isHorizontalArrow || isVerticalArrow;

    const isSupportedArrow =
      context.orientation === "horizontal"
        ? isHorizontalArrow
        : isVerticalArrow;

    // Prevent the browser's native radio navigation from
    // moving focus in the wrong orientation.
    if (isArrowKey && !isSupportedArrow) {
      event.preventDefault();
      return;
    }

    const activeElement = event.currentTarget.ownerDocument.activeElement;

    context.keyboardNavigationRef.current = true;

    context.rovingFocus.onItemKeyDown(event, value);

    // The focus event normally consumes this flag. If focus
    // did not change (e.g. one-item group), clear it here.
    if (event.currentTarget.ownerDocument.activeElement === activeElement) {
      context.keyboardNavigationRef.current = false;
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);

    if (!event.defaultPrevented) {
      context.selectValue(value);
    }
  };

  return (
    <label
      className={cn(
        "puzzle-radio",
        `puzzle-radio--${context.size}`,
        isSelected && "puzzle-radio--checked",
        isDisabled && "puzzle-radio--disabled",
        className,
      )}
      style={style}
      data-state={isSelected ? "checked" : "unchecked"}
      data-disabled={isDisabled ? "true" : undefined}
    >
      <input
        {...inputProps}
        ref={setInputRef}
        id={inputId}
        className="puzzle-radio__input"
        type="radio"
        name={context.name}
        form={context.form}
        value={value}
        checked={isSelected}
        disabled={isDisabled}
        required={isRequired}
        tabIndex={context.rovingFocus.getItemTabIndex(value, isDisabled)}
        // The wrapping label also contains the description; name the radio by
        // its label text only and expose the description via aria-describedby.
        aria-labelledby={
          inputProps["aria-labelledby"] ??
          (inputProps["aria-label"] ? undefined : labelId)
        }
        aria-describedby={describedBy}
        aria-invalid={context.invalid ? true : ariaInvalid}
        data-state={isSelected ? "checked" : "unchecked"}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      <span className="puzzle-radio__control" aria-hidden="true" />

      {(radioLabel != null || description != null) && (
        <span className="puzzle-radio__content">
          {radioLabel != null && (
            <span id={labelId} className="puzzle-radio__label">
              {radioLabel}
            </span>
          )}

          {description != null && (
            <span id={descriptionId} className="puzzle-radio__description">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

type RadioElement = ReactElement<RadioProps, typeof Radio>;

const isRadioElement = (child: ReactNode): child is RadioElement =>
  isValidElement<RadioProps>(child) && child.type === Radio;

const getRadioElements = (children: ReactNode): RadioElement[] =>
  Children.toArray(children).flatMap((child): RadioElement[] => {
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    ) {
      return getRadioElements(child.props.children);
    }

    return isRadioElement(child) ? [child] : [];
  });

const RadioGroupRoot = ({
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  label,
  description,
  error,
  invalid,
  required = false,
  disabled = false,
  orientation = "vertical",
  size = "md",
  dir = "ltr",
  loop = true,
  children,
  id,
  className,
  style,
  role,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-labelledby": ariaLabelledBy,
  ...rootProps
}: RadioGroupProps): ReactElement => {
  const generatedId = useId();
  const groupId = id ?? generatedId;

  const descriptionId =
    description != null ? `${groupId}-description` : undefined;

  const errorState = resolveRadioGroupError(error, invalid);

  const errorId = errorState.hasError ? `${groupId}-error` : undefined;

  const describedBy = mergeDescribedBy(ariaDescribedBy, descriptionId, errorId);

  const groupName = name?.trim() || undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(() => defaultValue);

  const isControlled = value !== undefined;

  const selectedValue = isControlled ? (value ?? undefined) : uncontrolledValue;

  const radioElements = getRadioElements(children);

  const seenValues = new Set<string>();

  for (const radio of radioElements) {
    const radioValue = radio.props.value;

    if (seenValues.has(radioValue)) {
      throw new Error("RadioGroup radio values must be unique.");
    }

    seenValues.add(radioValue);
  }

  const firstEnabledValue = radioElements.find(
    (radio) => !disabled && !radio.props.disabled,
  )?.props.value;

  const selectedFocusValue =
    radioElements.find(
      (radio) =>
        radio.props.value === selectedValue &&
        !disabled &&
        !radio.props.disabled,
    )?.props.value ?? firstEnabledValue;

  const focusItems = radioElements.map((radio) => ({
    id: radio.props.value,
    disabled: disabled || radio.props.disabled,
  }));

  const rovingFocus = useRovingFocus<HTMLInputElement>({
    items: focusItems,
    orientation,
    dir,
    loop,
    initialActiveId: selectedFocusValue,
  });

  useEffect(() => {
    if (selectedFocusValue !== undefined) {
      rovingFocus.onItemFocus(selectedFocusValue);
    }
  }, [selectedFocusValue, rovingFocus.onItemFocus]);

  const keyboardNavigationRef = useRef(false);

  const selectValue = useCallback(
    (nextValue: string) => {
      if (selectedValue === nextValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange, selectedValue],
  );

  const contextValue: RadioGroupContextValue = {
    value: selectedValue,
    name: groupName,
    form,
    disabled,
    required,
    requiredValue: firstEnabledValue,
    orientation,
    size,
    invalid: errorState.isInvalid,
    describedBy,
    keyboardNavigationRef,
    rovingFocus,
    selectValue,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <fieldset
        {...rootProps}
        id={groupId}
        form={form}
        disabled={disabled}
        className={cn("puzzle-radio-group", className)}
        style={style}
        role={role ?? "radiogroup"}
        dir={dir}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        aria-invalid={errorState.isInvalid ? true : ariaInvalid}
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={errorState.isInvalid ? "true" : undefined}
        data-size={size}
      >
        {label != null && (
          <legend
            id={`${groupId}-label`}
            className="puzzle-radio-group__legend"
          >
            {label}

            {required && (
              <span className="puzzle-radio-group__required" aria-hidden="true">
                *
              </span>
            )}
          </legend>
        )}

        <div
          className="puzzle-radio-group__options"
          data-orientation={orientation}
        >
          {children}
        </div>

        {description != null && (
          <div id={descriptionId} className="puzzle-radio-group__description">
            {description}
          </div>
        )}

        {errorState.hasError && (
          <div
            id={errorId}
            className="puzzle-radio-group__error"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorState.errorContent}
          </div>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

const RadioGroup = RadioGroupRoot;

export {
  RadioGroup,
  Radio,
  type RadioGroupProps,
  type RadioProps,
  type RadioGroupOrientation,
  type RadioGroupSize,
};
