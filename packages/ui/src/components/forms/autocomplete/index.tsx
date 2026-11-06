"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { cn, resolveResponsiveValue } from "@puzzle/core";

import { Popout } from "../../overlays/popout";

import {
  filterAutocompleteOptions,
  findEnabledAutocompleteIndex,
  groupAutocompleteOptions,
  normalizeAutocompleteText,
} from "./autocomplete.utils";

import type {
  AutocompleteInputChangeReason,
  AutocompleteMultipleProps,
  AutocompleteOption,
  AutocompleteOptionRenderState,
  AutocompleteProps,
  AutocompleteSingleProps,
  AutocompleteValue,
} from "./autocomplete.types";

import "./autocomplete.css";

const areSelectionsEqual = (
  previous: unknown,
  next: unknown,
  multiple: boolean,
): boolean => {
  if (!multiple) {
    return Object.is(previous, next);
  }

  if (!Array.isArray(previous) || !Array.isArray(next)) {
    return Object.is(previous, next);
  }

  return (
    previous.length === next.length &&
    previous.every((value, index) => Object.is(value, next[index]))
  );
};

const Autocomplete = <T, FreeSolo extends boolean = false>(
  props: AutocompleteProps<T, FreeSolo>,
) => {
  type Value = AutocompleteValue<T, FreeSolo>;

  const {
    options,
    label,
    description,
    error,
    disabled = false,
    required = false,
    readOnly = false,
    freeSolo = false,
    name,
    form,
    serializeValue,
    isOptionEqualToValue,
    filterOptions,
    renderOption,
    value,
    defaultValue,
    onChange,
    inputValue,
    defaultInputValue,
    onInputChange,
    open,
    defaultOpen = false,
    onOpenChange,
    openOnFocus = false,
    autoHighlight = false,
    clearOnBlur: clearOnBlurProp,
    clearOnEscape = false,
    clearable = true,
    clearLabel = "Clear selection",
    removeOptionLabel = "Remove",
    loading = false,
    loadingText = "Loading options...",
    noOptionsText = "No options found",
    requiredMessage = "Please select an option.",
    closeOnSelect: closeOnSelectProp,
    maxSelected,
    filterSelectedOptions,
    maxOptions,
    position = "bottom",
    align = "start",
    offset = 8,
    collisionPadding = 8,
    matchTriggerWidth = true,
    menuMaxHeight = "18rem",
    size = "md",
    fullWidth = false,
    className,
    inputClassName,
    popoverClassName,
    menuClassName,
    optionClassName,
    id,
    ref,
    onFocus,
    onBlur,
    onKeyDown,
    autoComplete = "off",
    placeholder = "Search options",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...inputProps
  } = props;

  const multiple = props.multiple === true;

  // Checking property presence is intentional: value={undefined} is a
  // controlled empty single-select value.
  const controlledValue = Object.prototype.hasOwnProperty.call(props, "value");

  const controlledInputValue = inputValue !== undefined;
  const controlledOpen = open !== undefined;

  const baseId = useId();
  const inputId = id ?? `${baseId}-input`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const listboxId = `${baseId}-listbox`;

  // Internal state is initialized from defaultValue only. Controlled values
  // are always read from props and never copied into internal state.
  const initialValue: Value | readonly Value[] | undefined = multiple
    ? ((defaultValue as readonly Value[] | undefined) ?? [])
    : (defaultValue as Value | undefined);

  const initialSingleValue = (controlledValue ? value : defaultValue) as
    | Value
    | undefined;

  const initialOption =
    initialSingleValue === undefined
      ? undefined
      : options.find((option) =>
          isOptionEqualToValue
            ? isOptionEqualToValue(option, initialSingleValue)
            : Object.is(option.value, initialSingleValue),
        );

  const [internalValue, setInternalValue] = useState<
    Value | readonly Value[] | undefined
  >(initialValue);

  const [internalInputValue, setInternalInputValue] = useState(
    () =>
      defaultInputValue ??
      (multiple
        ? ""
        : (initialOption?.label ??
          (initialSingleValue === undefined
            ? ""
            : String(initialSingleValue)))),
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const previousValueRef = useRef<unknown>(
    controlledValue ? value : initialValue,
  );

  const handleInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const selectedValue = controlledValue ? value : internalValue;

  const selectedValues: readonly Value[] = multiple
    ? ((selectedValue as readonly Value[] | undefined) ?? [])
    : selectedValue === undefined
      ? []
      : [selectedValue as Value];

  const resolvedInputValue = controlledInputValue
    ? (inputValue ?? "")
    : internalInputValue;

  const isOpen = disabled ? false : (open ?? internalOpen);

  const closeOnSelect = closeOnSelectProp ?? !multiple;
  const clearOnBlur = clearOnBlurProp ?? !freeSolo;

  const hasError = error !== undefined && error !== null && error !== false;

  const isAriaInvalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== "false";

  const isInvalid = hasError || isAriaInvalid;
  const errorContent = error === true ? "Invalid value" : error;

  const responsiveSize = resolveResponsiveValue(size, "md");
  const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);

  const isEqual = useCallback(
    (option: AutocompleteOption<T>, selected: Value): boolean =>
      isOptionEqualToValue
        ? isOptionEqualToValue(option, selected)
        : Object.is(option.value, selected),
    [isOptionEqualToValue],
  );

  const getValueLabel = useCallback(
    (selected: Value): string => {
      const option = options.find((candidate) => isEqual(candidate, selected));

      return option?.label ?? String(selected);
    },
    [options, isEqual],
  );

  const isOptionSelected = useCallback(
    (option: AutocompleteOption<T>) =>
      selectedValues.some((selected) => isEqual(option, selected)),
    [selectedValues, isEqual],
  );

  const changeInputValue = useCallback(
    (nextValue: string, reason: AutocompleteInputChangeReason) => {
      if (!controlledInputValue) {
        setInternalInputValue(nextValue);
      }

      onInputChange?.(nextValue, reason);
    },
    [controlledInputValue, onInputChange],
  );

  const changeOpenState = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) {
        return;
      }

      if (!controlledOpen) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlledOpen, disabled, onOpenChange],
  );

  const updateValue = useCallback(
    (nextValue: Value | readonly Value[] | undefined) => {
      previousValueRef.current = nextValue;

      if (!controlledValue) {
        setInternalValue(nextValue);
      }

      if (multiple) {
        const callback = onChange as
          | AutocompleteMultipleProps<T, FreeSolo>["onChange"]
          | undefined;

        callback?.([...(nextValue as readonly Value[])]);
      } else {
        const callback = onChange as
          | AutocompleteSingleProps<T, FreeSolo>["onChange"]
          | undefined;

        callback?.(nextValue as Value | undefined);
      }
    },
    [controlledValue, multiple, onChange],
  );

  // Keep the input text synchronized with externally changed values.
  // The two controlled states remain independent when inputValue is supplied.
  useEffect(() => {
    if (areSelectionsEqual(previousValueRef.current, selectedValue, multiple)) {
      return;
    }

    previousValueRef.current = selectedValue;

    if (controlledInputValue) {
      return;
    }

    const nextInputValue = multiple
      ? ""
      : selectedValues.length > 0
        ? getValueLabel(selectedValues[0])
        : "";

    changeInputValue(nextInputValue, "reset");
  }, [
    selectedValue,
    selectedValues,
    multiple,
    controlledInputValue,
    getValueLabel,
    changeInputValue,
  ]);

  const filteredOptions = useMemo(() => {
    const candidates = filterOptions
      ? filterOptions(options, resolvedInputValue)
      : filterAutocompleteOptions(options, resolvedInputValue);

    const shouldFilterSelected = filterSelectedOptions ?? multiple;

    const visibleOptions = shouldFilterSelected
      ? candidates.filter((option) => !isOptionSelected(option))
      : [...candidates];

    return maxOptions === undefined
      ? visibleOptions
      : visibleOptions.slice(0, Math.max(0, maxOptions));
  }, [
    options,
    resolvedInputValue,
    filterOptions,
    filterSelectedOptions,
    multiple,
    isOptionSelected,
    maxOptions,
  ]);

  // Options that cannot be selected because the selection limit was reached
  // are also excluded from keyboard navigation.
  const navigationOptions = useMemo(
    () =>
      filteredOptions.map((option) => ({
        ...option,
        disabled:
          option.disabled === true ||
          (multiple &&
            maxSelected !== undefined &&
            selectedValues.length >= maxSelected &&
            !isOptionSelected(option)),
      })),
    [
      filteredOptions,
      multiple,
      maxSelected,
      selectedValues.length,
      isOptionSelected,
    ],
  );

  const groupedOptions = useMemo(
    () => groupAutocompleteOptions(filteredOptions),
    [filteredOptions],
  );

  const findEnabledIndex = (
    startIndex: number,
    direction: -1 | 1,
    wrap = true,
  ) =>
    findEnabledAutocompleteIndex(
      navigationOptions,
      startIndex,
      direction,
      wrap,
    );

  const isRequiredSatisfied =
    selectedValues.length > 0 ||
    (freeSolo && resolvedInputValue.trim().length > 0);

  // A custom validity message keeps required fields honest even when the
  // visible text contains a query that has not been selected.
  useEffect(() => {
    inputRef.current?.setCustomValidity(
      required && !disabled && !isRequiredSatisfied ? requiredMessage : "",
    );
  }, [required, disabled, isRequiredSatisfied, requiredMessage]);

  // Recover the active option when results change and keep autoHighlight useful.
  useEffect(() => {
    if (!isOpen) {
      if (activeIndex !== -1) {
        setActiveIndex(-1);
      }

      return;
    }

    if (
      activeIndex >= 0 &&
      (!navigationOptions[activeIndex] ||
        navigationOptions[activeIndex].disabled)
    ) {
      setActiveIndex(-1);
      return;
    }

    if (activeIndex === -1 && autoHighlight) {
      const firstIndex = findEnabledIndex(-1, 1, false);

      if (firstIndex !== -1) {
        setActiveIndex(firstIndex);
      }
    }
  }, [isOpen, activeIndex, navigationOptions, autoHighlight]);

  const activeOptionId =
    activeIndex >= 0 &&
    navigationOptions[activeIndex] &&
    !navigationOptions[activeIndex].disabled
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  // Keep the active option visible during keyboard navigation.
  useEffect(() => {
    if (!isOpen || !activeOptionId) {
      return;
    }

    const option =
      listboxRef.current?.ownerDocument.getElementById(activeOptionId);

    option?.scrollIntoView?.({ block: "nearest" });
  }, [isOpen, activeOptionId]);

  const moveActive = (direction: -1 | 1, amount = 1, wrap = true) => {
    let nextIndex = activeIndex;

    for (let step = 0; step < amount; step++) {
      const startIndex =
        nextIndex === -1
          ? direction === 1
            ? -1
            : navigationOptions.length
          : nextIndex;

      const candidateIndex = findEnabledIndex(startIndex, direction, wrap);

      if (candidateIndex === -1) {
        break;
      }

      nextIndex = candidateIndex;
    }

    if (nextIndex !== -1) {
      setActiveIndex(nextIndex);
    }
  };

  const isAtSelectionLimit = (option: AutocompleteOption<T>) =>
    multiple &&
    maxSelected !== undefined &&
    selectedValues.length >= maxSelected &&
    !isOptionSelected(option);

  const handleOptionSelect = (option: AutocompleteOption<T>) => {
    if (disabled || option.disabled || isAtSelectionLimit(option)) {
      return;
    }

    if (multiple) {
      const nextValues = isOptionSelected(option)
        ? selectedValues.filter((selected) => !isEqual(option, selected))
        : [...selectedValues, option.value as Value];

      updateValue(nextValues);
      changeInputValue("", "select");

      if (closeOnSelect) {
        changeOpenState(false);
      } else {
        setActiveIndex(-1);
        changeOpenState(true);
      }
    } else {
      updateValue(option.value as Value);
      changeInputValue(option.label, "select");
      changeOpenState(false);
    }

    inputRef.current?.focus({ preventScroll: true });
  };

  const handleFreeSoloCommit = () => {
    const nextValue = resolvedInputValue.trim();

    if (!freeSolo || !nextValue || disabled || readOnly) {
      return;
    }

    if (multiple) {
      if (maxSelected !== undefined && selectedValues.length >= maxSelected) {
        return;
      }

      const alreadySelected = selectedValues.some(
        (selected) => selected === nextValue,
      );

      if (!alreadySelected) {
        updateValue([...selectedValues, nextValue as Value]);
      }

      changeInputValue("", "select");

      if (closeOnSelect) {
        changeOpenState(false);
      } else {
        setActiveIndex(-1);
      }
    } else {
      updateValue(nextValue as Value);
      changeInputValue(nextValue, "select");
      changeOpenState(false);
    }
  };

  const handleClear = () => {
    if (disabled || readOnly) {
      return;
    }

    updateValue(multiple ? [] : undefined);
    changeInputValue("", "clear");
    setActiveIndex(-1);

    inputRef.current?.focus({ preventScroll: true });
  };

  const handleRemoveSelected = (selectedIndex: number) => {
    if (!multiple || disabled || readOnly) {
      return;
    }

    const nextValues = selectedValues.filter(
      (_, index) => index !== selectedIndex,
    );

    updateValue(nextValues);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    changeInputValue(event.currentTarget.value, "input");
    setActiveIndex(-1);
    changeOpenState(true);
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);

    if (openOnFocus && !disabled) {
      setActiveIndex(-1);
      changeOpenState(true);
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  };

  const handleControlBlur = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;

    // Moving focus between controls inside the autocomplete
    // should not close the popup.
    if (relatedTarget && event.currentTarget.contains(relatedTarget as Node)) {
      return;
    }

    changeOpenState(false);

    if (clearOnBlur) {
      const nextInputValue = multiple
        ? ""
        : selectedValues.length > 0
          ? getValueLabel(selectedValues[0])
          : "";

      changeInputValue(nextInputValue, "reset");
    }
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || event.nativeEvent.isComposing) {
      return;
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();

        if (!isOpen) {
          setActiveIndex(findEnabledIndex(-1, 1, false));
          changeOpenState(true);
        } else {
          moveActive(1);
        }

        return;
      }

      case "ArrowUp": {
        event.preventDefault();

        if (!isOpen) {
          setActiveIndex(findEnabledIndex(navigationOptions.length, -1, false));
          changeOpenState(true);
        } else {
          moveActive(-1);
        }

        return;
      }

      case "Home": {
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(findEnabledIndex(-1, 1, false));
        }

        return;
      }

      case "End": {
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(findEnabledIndex(navigationOptions.length, -1, false));
        }

        return;
      }

      case "PageDown": {
        if (isOpen) {
          event.preventDefault();
          moveActive(1, 10, false);
        }

        return;
      }

      case "PageUp": {
        if (isOpen) {
          event.preventDefault();
          moveActive(-1, 10, false);
        }

        return;
      }

      case "Enter": {
        if (isOpen && activeIndex >= 0) {
          const option = filteredOptions[activeIndex];

          if (option && !navigationOptions[activeIndex]?.disabled) {
            event.preventDefault();
            handleOptionSelect(option);
            return;
          }
        }

        if (freeSolo && resolvedInputValue.trim()) {
          const normalizedInput = normalizeAutocompleteText(
            resolvedInputValue.trim(),
          );

          const exactMatch = filteredOptions.find(
            (option, index) =>
              !navigationOptions[index]?.disabled &&
              normalizeAutocompleteText(option.label) === normalizedInput,
          );

          event.preventDefault();

          if (exactMatch) {
            handleOptionSelect(exactMatch);
          } else {
            handleFreeSoloCommit();
          }
        }

        return;
      }

      case "Escape": {
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          changeOpenState(false);

          const nextInputValue = multiple
            ? ""
            : selectedValues.length > 0
              ? getValueLabel(selectedValues[0])
              : "";

          changeInputValue(nextInputValue, "reset");
        } else if (
          clearOnEscape &&
          (selectedValues.length > 0 || resolvedInputValue)
        ) {
          event.preventDefault();
          handleClear();
        }

        return;
      }

      case "Tab": {
        changeOpenState(false);
        return;
      }

      case "Backspace": {
        if (
          multiple &&
          !readOnly &&
          resolvedInputValue.length === 0 &&
          selectedValues.length > 0
        ) {
          event.preventDefault();
          handleRemoveSelected(selectedValues.length - 1);
        }

        return;
      }

      default:
        return;
    }
  };

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

  const hasClearableValue =
    selectedValues.length > 0 || resolvedInputValue.length > 0;

  const formValues: readonly Value[] =
    selectedValues.length > 0
      ? selectedValues
      : freeSolo && resolvedInputValue.trim()
        ? [resolvedInputValue.trim() as Value]
        : [];

  const renderOptionElement = (
    option: AutocompleteOption<T>,
    index: number,
  ) => {
    const selected = isOptionSelected(option);
    const active = activeIndex === index;
    const optionDisabled = navigationOptions[index]?.disabled ?? false;

    const state: AutocompleteOptionRenderState = {
      selected,
      active,
      disabled: optionDisabled,
      multiple,
    };

    return (
      <div
        key={option.id ?? index}
        id={`${listboxId}-option-${index}`}
        className={cn("puzzle-autocomplete__option", optionClassName)}
        role="option"
        aria-label={option.label}
        aria-describedby={
          !renderOption && option.description != null
            ? `${listboxId}-description-${index}`
            : undefined
        }
        aria-selected={selected}
        aria-disabled={optionDisabled || undefined}
        aria-posinset={index + 1}
        aria-setsize={filteredOptions.length}
        data-active={active || undefined}
        data-disabled={optionDisabled || undefined}
        onMouseDown={(event) => event.preventDefault()}
        onMouseMove={() => {
          if (!optionDisabled) {
            setActiveIndex(index);
          }
        }}
        onClick={() => handleOptionSelect(option)}
      >
        {renderOption ? (
          renderOption(option, state)
        ) : (
          <span className="puzzle-autocomplete__option-content">
            <span className="puzzle-autocomplete__option-label">
              {option.label}
            </span>

            {option.description != null && (
              <span
                id={`${listboxId}-description-${index}`}
                className="puzzle-autocomplete__option-description"
              >
                {option.description}
              </span>
            )}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn("puzzle-autocomplete", className)}
      data-size-mobile={responsiveSize.mobile}
      data-size-tablet={responsiveSize.tablet}
      data-size-desktop={responsiveSize.desktop}
      data-full-width-mobile={String(responsiveFullWidth.mobile)}
      data-full-width-tablet={String(responsiveFullWidth.tablet)}
      data-full-width-desktop={String(responsiveFullWidth.desktop)}
      data-open={isOpen || undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-multiple={multiple || undefined}
    >
      {label != null && (
        <label
          id={labelId}
          htmlFor={inputId}
          className="puzzle-autocomplete__label"
        >
          {label}

          {required && (
            <span className="puzzle-autocomplete__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <Popout
        trigger={
          <div
            className="puzzle-autocomplete__anchor"
            onClick={(event) => {
              if (disabled) {
                event.preventDefault();
                return;
              }

              if (!isOpen && autoHighlight) {
                setActiveIndex(findEnabledIndex(-1, 1, false));
              }
            }}
          >
            <div
              className="puzzle-autocomplete__control"
              onBlur={handleControlBlur}
              data-disabled={disabled || undefined}
            >
              {multiple &&
                selectedValues.map((selected, index) => {
                  const valueLabel = getValueLabel(selected);

                  return (
                    <span
                      key={`${String(selected)}-${index}`}
                      className="puzzle-autocomplete__tag"
                    >
                      <span className="puzzle-autocomplete__tag-label">
                        {valueLabel}
                      </span>

                      {!disabled && !readOnly && (
                        <button
                          type="button"
                          className="puzzle-autocomplete__tag-remove"
                          aria-label={`${removeOptionLabel} ${valueLabel}`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleRemoveSelected(index)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      )}
                    </span>
                  );
                })}

              <input
                {...inputProps}
                ref={handleInputRef}
                id={inputId}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={activeOptionId}
                aria-label={ariaLabel}
                aria-labelledby={resolvedLabelledBy}
                aria-describedby={resolvedDescribedBy}
                aria-invalid={isInvalid ? true : ariaInvalid}
                aria-required={required || undefined}
                aria-readonly={readOnly || undefined}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={resolvedInputValue}
                disabled={disabled}
                readOnly={readOnly}
                required={required && !multiple && !isRequiredSatisfied}
                className={cn("puzzle-autocomplete__input", inputClassName)}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
              />

              {clearable && hasClearableValue && !disabled && !readOnly && (
                <button
                  type="button"
                  className="puzzle-autocomplete__clear"
                  aria-label={clearLabel}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleClear}
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          </div>
        }
        action="click"
        open={isOpen}
        onOpenChange={changeOpenState}
        position={position}
        align={align}
        offset={offset}
        collisionPadding={collisionPadding}
        matchTriggerWidth={matchTriggerWidth}
        closeOnOutsideClick
        closeOnEscape
        contentClassName={cn("puzzle-autocomplete__popover", popoverClassName)}
      >
        <div
          ref={listboxRef}
          id={listboxId}
          className={cn("puzzle-autocomplete__listbox", menuClassName)}
          role="listbox"
          aria-label={resolvedLabelledBy ? undefined : ariaLabel}
          aria-labelledby={resolvedLabelledBy}
          aria-multiselectable={multiple || undefined}
          style={{ maxHeight: menuMaxHeight }}
        >
          {groupedOptions.map((group, groupIndex) => {
            const renderedOptions = group.options.map(({ option, index }) =>
              renderOptionElement(option, index),
            );

            if (group.label === null) {
              return renderedOptions;
            }

            const groupId = `${listboxId}-group-${groupIndex}`;

            return (
              <div
                key={groupId}
                className="puzzle-autocomplete__group"
                role="group"
                aria-labelledby={groupId}
              >
                <div id={groupId} className="puzzle-autocomplete__group-label">
                  {group.label}
                </div>

                {renderedOptions}
              </div>
            );
          })}
        </div>

        {filteredOptions.length === 0 && (
          <div
            className="puzzle-autocomplete__empty"
            role="status"
            aria-live="polite"
          >
            {loading ? loadingText : noOptionsText}
          </div>
        )}
      </Popout>

      {name &&
        formValues.map((selected, index) => (
          <input
            key={`${String(selected)}-${index}`}
            className="puzzle-autocomplete__native"
            type="hidden"
            name={name}
            form={form}
            value={serializeValue ? serializeValue(selected) : String(selected)}
          />
        ))}

      {description != null && (
        <div id={descriptionId} className="puzzle-autocomplete__description">
          {description}
        </div>
      )}

      {hasError && (
        <div
          id={errorId}
          className="puzzle-autocomplete__error"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorContent}
        </div>
      )}
    </div>
  );
};

export { Autocomplete };

export type {
  AutocompleteSize,
  AutocompleteOption,
  AutocompleteValue,
  AutocompleteInputChangeReason,
  AutocompleteOptionRenderState,
  AutocompleteSingleProps,
  AutocompleteMultipleProps,
  AutocompleteProps,
} from "./autocomplete.types";
