"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn, resolveResponsiveValue, type ResponsiveValue } from "@puzzle/core";
import {
  Popout,
  type PopoutAlignment,
  type PopoutPosition,
  type PopoutTriggerProps,
} from "../popout/popout";
import "./select.css";

export type SelectSize = "sm" | "md" | "lg";

export type SelectOption<T = string> = {
  /** Stable identifier, useful when options are reordered. */
  id?: string | number;

  /** The value returned by onChange. */
  value: T;

  /** Plain-text label, also used for typeahead and accessibility. */
  label: string;

  /** Optional supporting text. */
  description?: ReactNode;

  /** Optional group heading. */
  group?: string;

  /** Prevents this option from being selected. */
  disabled?: boolean;
};

export type SelectOptionRenderState = {
  selected: boolean;
  active: boolean;
  multiple: boolean;
};

type SelectBaseProps<T> = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "value" | "disabled" | "form" | "size" | "type" | "onChange"
> & {
  /** Available options. */
  options: readonly SelectOption<T>[];

  /** Optional visible field label. */
  label?: ReactNode;

  /** Text shown when no value is selected. */
  placeholder?: ReactNode;

  /** Supporting text below the control. */
  description?: ReactNode;

  /** Error message. Set to true to use the default message. */
  error?: ReactNode | boolean;

  /** Disables the entire control. */
  disabled?: boolean;

  /** Makes the field required. */
  required?: boolean;

  /** Allows the selected value(s) to be cleared. */
  clearable?: boolean;

  /** Accessible name of the clear button. */
  clearLabel?: string;

  /** Form field name. Adds a visually hidden native select. */
  name?: string;

  /** Form ID for form association. */
  form?: string;

  /** Native autocomplete attribute. */
  autoComplete?: string;

  /** Serializes generic values for native form submission. */
  serializeValue?: (value: T) => string;

  /** Custom comparison for object values. */
  isOptionEqualToValue?: (option: SelectOption<T>, value: T) => boolean;

  /** Custom rendering of the selected value(s). */
  renderValue?: (
    selected: SelectOption<T> | readonly SelectOption<T>[] | null,
  ) => ReactNode;

  /** Custom rendering of an option. */
  renderOption?: (
    option: SelectOption<T>,
    state: SelectOptionRenderState,
  ) => ReactNode;

  /** Responsive control size. */
  size?: ResponsiveValue<SelectSize>;

  /** Responsive full-width layout. */
  fullWidth?: ResponsiveValue<boolean>;

  /** Controls the dropdown visibility. */
  open?: boolean;

  /** Initial dropdown visibility. */
  defaultOpen?: boolean;

  /** Called when the dropdown visibility changes. */
  onOpenChange?: (open: boolean) => void;

  /** Dropdown placement. */
  position?: PopoutPosition;

  /** Dropdown alignment. */
  align?: PopoutAlignment;

  /** Distance between the trigger and dropdown. */
  offset?: number;

  /** Minimum distance from the viewport edges. */
  collisionPadding?: number;

  /** Whether the dropdown closes after selecting an option. */
  closeOnSelect?: boolean;

  /** Maximum number of simultaneously selected options. */
  maxSelected?: number;

  /** Match the dropdown's minimum width to the trigger. */
  matchTriggerWidth?: boolean;

  /** Maximum dropdown height. */
  menuMaxHeight?: CSSProperties["maxHeight"];

  /** Content displayed when there are no options. */
  noOptionsText?: ReactNode;

  /** Additional class on the outer field. */
  rootClassName?: string;

  /** Additional class on the Popout content. */
  popoverClassName?: string;

  /** Additional class on the listbox. */
  menuClassName?: string;
};

export type SelectSingleProps<T = string> = SelectBaseProps<T> & {
  multiple?: false;
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
};

export type SelectMultipleProps<T = string> = SelectBaseProps<T> & {
  multiple: true;
  value?: readonly T[];
  defaultValue?: readonly T[];
  onChange?: (value: T[]) => void;
};

export type SelectProps<T = string> =
  | SelectSingleProps<T>
  | SelectMultipleProps<T>;

const findEnabledIndex = <T,>(
  options: readonly SelectOption<T>[],
  startIndex: number,
  direction: -1 | 1,
  wrap = true,
): number => {
  const length = options.length;

  for (let step = 1; step <= length; step++) {
    let index = startIndex + step * direction;

    if (wrap) {
      index = (index + length) % length;
    } else if (index < 0 || index >= length) {
      break;
    }

    if (!options[index].disabled) {
      return index;
    }
  }

  return -1;
};

type IndexedOption<T> = {
  option: SelectOption<T>;
  index: number;
};

type SelectGroup<T> = {
  label: string | null;
  options: IndexedOption<T>[];
};

const groupOptions = <T,>(
  options: readonly SelectOption<T>[],
): SelectGroup<T>[] => {
  const groups = new Map<string | null, SelectGroup<T>>();

  options.forEach((option, index) => {
    const label = option.group ?? null;

    let group = groups.get(label);

    if (!group) {
      group = {
        label,
        options: [],
      };

      groups.set(label, group);
    }

    group.options.push({ option, index });
  });

  return Array.from(groups.values());
};

const getTabbableElements = (
  trigger: HTMLElement,
  excludedElement: HTMLElement | null,
): HTMLElement[] => {
  const ownerDocument = trigger.ownerDocument;
  const ownerWindow = ownerDocument.defaultView;

  const elements = Array.from(
    ownerDocument.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "iframe",
        "[tabindex]",
        '[contenteditable="true"]',
      ].join(","),
    ),
  );

  return elements.filter((element) => {
    if (
      !element.isConnected ||
      element.tabIndex < 0 ||
      element.matches(":disabled") ||
      element.getClientRects().length === 0 ||
      excludedElement?.contains(element) ||
      element.closest('[aria-hidden="true"]')
    ) {
      return false;
    }

    return ownerWindow?.getComputedStyle(element).visibility !== "hidden";
  });
};

const Select = <T,>(props: SelectProps<T>) => {
  const {
    options,
    label,
    placeholder = "Select an option",
    description,
    error,
    disabled = false,
    required = false,
    clearable = false,
    clearLabel = "Clear selection",
    name,
    form,
    autoComplete,
    serializeValue,
    isOptionEqualToValue,
    renderValue,
    renderOption,
    size = "md",
    fullWidth = false,
    open,
    defaultOpen = false,
    onOpenChange,
    position = "bottom",
    align = "start",
    offset = 8,
    collisionPadding = 8,
    closeOnSelect: closeOnSelectProp,
    maxSelected,
    matchTriggerWidth = true,
    menuMaxHeight = "18rem",
    noOptionsText = "No options",
    rootClassName,
    popoverClassName,
    menuClassName,
    value,
    onChange,
    id,
    className,
    onClick,
    onKeyDown,
    onKeyUp,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...buttonProps
  } = props;

  const multiple = props.multiple === true;
  const controlledValue = value !== undefined;
  const controlledOpen = open !== undefined;

  const baseId = useId();
  const triggerId = id ?? `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const listboxId = `${baseId}-listbox`;
  const valueId = `${baseId}-value`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const typeaheadRef = useRef({
    query: "",
    timestamp: 0,
  });

  const [internalValue, setInternalValue] = useState<T | readonly T[] | null>(
    () =>
      multiple
        ? ((props as SelectMultipleProps<T>).defaultValue ?? [])
        : ((props as SelectSingleProps<T>).defaultValue ?? null),
  );

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [triggerWidth, setTriggerWidth] = useState(0);

  const selectedValue = controlledValue ? value : internalValue;

  const selectedValues: readonly T[] = multiple
    ? ((selectedValue as readonly T[] | null) ?? [])
    : selectedValue == null
      ? []
      : [selectedValue as T];

  const isOpen = open ?? internalOpen;
  const hasSelection = selectedValues.length > 0;
  const hasError = error !== undefined && error !== null && error !== false;

  const errorContent = error === true ? "Invalid value" : error;

  const closeOnSelect = closeOnSelectProp ?? !multiple;

  const responsiveSize = resolveResponsiveValue(size, "md");
  const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);

  const groups = useMemo(() => groupOptions(options), [options]);

  const isEqual = useCallback(
    (option: SelectOption<T>, value: T) =>
      isOptionEqualToValue
        ? isOptionEqualToValue(option, value)
        : Object.is(option.value, value),
    [isOptionEqualToValue],
  );

  const selectedOptions = selectedValues
    .map((value) => options.find((option) => isEqual(option, value)))
    .filter((option): option is SelectOption<T> => option !== undefined);

  const isSelected = (option: SelectOption<T>) =>
    selectedValues.some((value) => isEqual(option, value));

  const initialActiveIndex = useCallback(
    (direction: -1 | 1 = 1) => {
      const selectedIndex = options.findIndex(
        (option) =>
          !option.disabled &&
          selectedValues.some((value) => isEqual(option, value)),
      );

      if (selectedIndex !== -1) {
        return selectedIndex;
      }

      return direction === 1
        ? findEnabledIndex(options, -1, 1, false)
        : findEnabledIndex(options, options.length, -1, false);
    },
    [options, selectedValues, isEqual],
  );

  const changeOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!controlledOpen) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange],
  );

  const updateValue = useCallback(
    (nextValue: T | readonly T[] | null) => {
      if (!controlledValue) {
        setInternalValue(nextValue);
      }

      if (multiple) {
        const callback = onChange as SelectMultipleProps<T>["onChange"];
        callback?.([...(nextValue as readonly T[])]);
      } else {
        const callback = onChange as SelectSingleProps<T>["onChange"];
        callback?.(nextValue as T | null);
      }
    },
    [controlledValue, multiple, onChange],
  );

  const getSerializedValue = useCallback(
    (value: T) => (serializeValue ? serializeValue(value) : String(value)),
    [serializeValue],
  );

  const findTypeaheadMatch = (
    character: string,
    startIndex: number,
  ): number => {
    const now = Date.now();
    const previous = typeaheadRef.current;

    const query =
      now - previous.timestamp > 700 ? character : previous.query + character;

    typeaheadRef.current = {
      query,
      timestamp: now,
    };

    const repeatedCharacter =
      query.length > 1 &&
      Array.from(query).every(
        (item) => item.toLowerCase() === query[0].toLowerCase(),
      );

    const search = repeatedCharacter ? character : query;
    const normalizedSearch = search.toLocaleLowerCase();

    for (let offset = 1; offset <= options.length; offset++) {
      const index = (startIndex + offset + options.length) % options.length;

      const option = options[index];

      if (
        !option.disabled &&
        option.label.toLocaleLowerCase().startsWith(normalizedSearch)
      ) {
        return index;
      }
    }

    return -1;
  };

  const focusTrigger = () => {
    triggerRef.current?.focus({ preventScroll: true });
  };

  const handleOptionSelect = (option: SelectOption<T>) => {
    if (disabled || option.disabled) {
      return;
    }

    const currentlySelected = isSelected(option);

    if (multiple) {
      if (
        !currentlySelected &&
        maxSelected !== undefined &&
        selectedValues.length >= maxSelected
      ) {
        return;
      }

      const nextValues = currentlySelected
        ? selectedValues.filter((value) => !isEqual(option, value))
        : [...selectedValues, option.value];

      updateValue(nextValues);
    } else {
      updateValue(option.value);
    }

    if (closeOnSelect) {
      changeOpenState(false);
      focusTrigger();
    }
  };

  const handleClear = () => {
    if (!hasSelection || disabled) {
      return;
    }

    updateValue(multiple ? [] : null);
    focusTrigger();
  };

  const handleTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node as HTMLButtonElement | null;
  }, []);

  const handleListboxRef = useCallback((node: HTMLDivElement | null) => {
    listboxRef.current = node;

    // Popout mounts the content only when opening.
    // Focus the listbox as soon as it enters the DOM.
    node?.focus({ preventScroll: true });
  }, []);

  const handleTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    // Prevent Popout's default click action. We control its state here
    // so that the trigger correctly toggles the dropdown.
    event.preventDefault();

    if (!isOpen) {
      setActiveIndex(initialActiveIndex());
    }

    changeOpenState(!isOpen);
  };

  const handleTriggerKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      if (!isOpen) {
        setActiveIndex(initialActiveIndex(event.key === "ArrowUp" ? -1 : 1));

        changeOpenState(true);
      }

      return;
    }

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      const index = findTypeaheadMatch(event.key, activeIndex);

      if (index !== -1) {
        event.preventDefault();
        setActiveIndex(index);

        if (!isOpen) {
          changeOpenState(true);
        }
      }
    }
  };

  const handleTriggerKeyUp = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    onKeyUp?.(event);

    // Prevent Space from producing a second click in Firefox.
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  const moveActive = (direction: -1 | 1, amount = 1, wrap = true) => {
    let nextIndex = activeIndex;

    for (let step = 0; step < amount; step++) {
      const startIndex =
        nextIndex === -1 ? (direction === 1 ? -1 : options.length) : nextIndex;

      const next = findEnabledIndex(options, startIndex, direction, wrap);

      if (next === -1) {
        break;
      }

      nextIndex = next;
    }

    if (nextIndex !== -1) {
      setActiveIndex(nextIndex);
    }
  };

  const handleListboxKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        return;

      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        return;

      case "Home":
        event.preventDefault();
        setActiveIndex(findEnabledIndex(options, -1, 1, false));
        return;

      case "End":
        event.preventDefault();
        setActiveIndex(findEnabledIndex(options, options.length, -1, false));
        return;

      case "PageDown":
        event.preventDefault();
        moveActive(1, 10, false);
        return;

      case "PageUp":
        event.preventDefault();
        moveActive(-1, 10, false);
        return;

      case "Enter":
      case " ":
        event.preventDefault();

        if (activeIndex >= 0 && options[activeIndex]) {
          handleOptionSelect(options[activeIndex]);
        }

        return;

      case "Escape":
        event.preventDefault();
        event.stopPropagation();

        changeOpenState(false);
        focusTrigger();
        return;

      case "Tab": {
        const trigger = triggerRef.current;

        if (!trigger) {
          changeOpenState(false);
          return;
        }

        const popup =
          listboxRef.current?.closest<HTMLElement>(".puzzle-popout__content") ??
          null;

        const tabbableElements = getTabbableElements(trigger, popup);

        const triggerIndex = tabbableElements.indexOf(trigger);
        const direction = event.shiftKey ? -1 : 1;
        const nextElement = tabbableElements[triggerIndex + direction];

        changeOpenState(false);

        if (nextElement) {
          event.preventDefault();
          nextElement.focus();
        }

        return;
      }

      default:
        break;
    }

    if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();

      const index = findTypeaheadMatch(event.key, activeIndex);

      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  };

  const handleNativeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const serializedValues = new Set(
      Array.from(event.currentTarget.selectedOptions, (option) => option.value),
    );

    const nextValues = options
      .filter((option) =>
        serializedValues.has(getSerializedValue(option.value)),
      )
      .map((option) => option.value);

    updateValue(multiple ? nextValues : (nextValues[0] ?? null));
  };

  // Initialize or recover the active option when opening.
  useEffect(() => {
    if (
      isOpen &&
      (activeIndex < 0 ||
        !options[activeIndex] ||
        options[activeIndex].disabled)
    ) {
      setActiveIndex(initialActiveIndex());
    }
  }, [isOpen, activeIndex, options, initialActiveIndex]);

  // Keep the active option visible during keyboard navigation.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    const option = listboxRef.current?.ownerDocument.getElementById(
      `${listboxId}-option-${activeIndex}`,
    );

    option?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex, listboxId]);

  // Match the menu's minimum width to the trigger.
  useLayoutEffect(() => {
    if (!isOpen || !matchTriggerWidth) {
      return;
    }

    const trigger = triggerRef.current;
    const ownerWindow = trigger?.ownerDocument.defaultView;

    if (!trigger || !ownerWindow) {
      return;
    }

    const updateWidth = () => {
      setTriggerWidth(trigger.getBoundingClientRect().width);
    };

    updateWidth();

    const ResizeObserverConstructor =
      ownerWindow.ResizeObserver ?? ResizeObserver;

    const observer = new ResizeObserverConstructor(updateWidth);
    observer.observe(trigger);

    ownerWindow.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      ownerWindow.removeEventListener("resize", updateWidth);
    };
  }, [isOpen, matchTriggerWidth]);

  const activeOptionId =
    activeIndex >= 0 && options[activeIndex] && !options[activeIndex].disabled
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  const resolvedLabelledBy =
    ariaLabelledBy ??
    [label != null ? labelId : undefined, valueId].filter(Boolean).join(" ");

  const resolvedDescribedBy =
    [
      ariaDescribedBy,
      description != null ? descriptionId : undefined,
      hasError ? errorId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const displayValue = hasSelection
    ? renderValue
      ? renderValue(multiple ? selectedOptions : (selectedOptions[0] ?? null))
      : multiple
        ? selectedOptions.length
          ? selectedOptions.map((option) => option.label).join(", ")
          : selectedValues.map(String).join(", ")
        : (selectedOptions[0]?.label ?? String(selectedValues[0]))
    : placeholder;

  const listboxStyle: CSSProperties = {
    minWidth: matchTriggerWidth && triggerWidth > 0 ? triggerWidth : undefined,
    maxHeight: menuMaxHeight,
  };

  const triggerElement = (
    <button
      {...buttonProps}
      ref={handleTriggerRef}
      id={triggerId}
      type="button"
      disabled={disabled}
      className={cn("puzzle-select__trigger", className)}
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      onKeyUp={handleTriggerKeyUp}
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-describedby={resolvedDescribedBy}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={isOpen ? listboxId : undefined}
      aria-required={required || undefined}
      aria-invalid={hasError || undefined}
    >
      <span
        id={valueId}
        className={cn(
          "puzzle-select__value",
          !hasSelection && "puzzle-select__placeholder",
        )}
      >
        {displayValue}
      </span>

      <span className="puzzle-select__icon" aria-hidden="true" />
    </button>
  ) as ReactElement<PopoutTriggerProps>;

  const renderOptionElement = ({ option, index }: IndexedOption<T>) => {
    const selected = isSelected(option);
    const active = activeIndex === index;

    const content = renderOption ? (
      renderOption(option, {
        selected,
        active,
        multiple,
      })
    ) : option.description != null ? (
      <span className="puzzle-select__option-content">
        <span className="puzzle-select__option-label">{option.label}</span>

        <span
          id={`${listboxId}-description-${index}`}
          className="puzzle-select__option-description"
        >
          {option.description}
        </span>
      </span>
    ) : (
      option.label
    );

    return (
      <div
        key={option.id ?? index}
        id={`${listboxId}-option-${index}`}
        className="puzzle-select__option"
        role="option"
        aria-label={option.label}
        aria-selected={selected}
        aria-disabled={option.disabled || undefined}
        aria-describedby={
          !renderOption && option.description != null
            ? `${listboxId}-description-${index}`
            : undefined
        }
        data-index={index}
        data-active={active ? "true" : undefined}
        onPointerDown={(event) => event.preventDefault()}
        onPointerMove={(event) => {
          if (event.pointerType !== "touch" && !option.disabled) {
            setActiveIndex(index);
          }
        }}
        onClick={() => handleOptionSelect(option)}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      className={cn("puzzle-select", rootClassName)}
      data-open={isOpen ? "true" : "false"}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={hasError ? "true" : undefined}
      data-multiple={multiple ? "true" : undefined}
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
          htmlFor={triggerId}
          className="puzzle-select__label"
        >
          {label}

          {required && (
            <span className="puzzle-select__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="puzzle-select__control">
        <Popout
          trigger={triggerElement}
          open={isOpen}
          onOpenChange={changeOpenState}
          action="click"
          position={position}
          align={align}
          offset={offset}
          collisionPadding={collisionPadding}
          contentClassName={cn("puzzle-select__popover", popoverClassName)}
        >
          <div
            ref={handleListboxRef}
            id={listboxId}
            className={cn("puzzle-select__listbox", menuClassName)}
            role="listbox"
            tabIndex={0}
            aria-label={label != null ? undefined : ariaLabel}
            aria-labelledby={label != null ? labelId : undefined}
            aria-multiselectable={multiple || undefined}
            aria-activedescendant={activeOptionId}
            onKeyDown={handleListboxKeyDown}
            style={listboxStyle}
          >
            {options.length === 0 ? (
              <div className="puzzle-select__empty" role="presentation">
                {noOptionsText}
              </div>
            ) : (
              groups.map((group, groupIndex) =>
                group.label != null ? (
                  <div
                    key={group.label}
                    className="puzzle-select__group"
                    role="group"
                    aria-label={group.label}
                  >
                    <div
                      className="puzzle-select__group-label"
                      aria-hidden="true"
                    >
                      {group.label}
                    </div>

                    {group.options.map(renderOptionElement)}
                  </div>
                ) : (
                  group.options.map(renderOptionElement)
                ),
              )
            )}
          </div>
        </Popout>

        {clearable && hasSelection && (
          <button
            type="button"
            className="puzzle-select__clear"
            disabled={disabled}
            aria-label={clearLabel}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClear();
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {description != null && (
        <div id={descriptionId} className="puzzle-select__description">
          {description}
        </div>
      )}

      {hasError && (
        <div id={errorId} className="puzzle-select__error" role="alert">
          {errorContent}
        </div>
      )}

      {name != null && (
        <select
          className="puzzle-select__native"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          form={form}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          multiple={multiple}
          value={
            multiple
              ? selectedValues.map(getSerializedValue)
              : selectedValues.length
                ? getSerializedValue(selectedValues[0])
                : ""
          }
          onChange={handleNativeChange}
          onInvalid={(event) => {
            event.preventDefault();
            focusTrigger();
          }}
        >
          {!multiple && <option value=""> </option>}

          {groups.map((group, groupIndex) =>
            group.label != null ? (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(({ option, index }) => (
                  <option
                    key={option.id ?? index}
                    value={getSerializedValue(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              group.options.map(({ option, index }) => (
                <option
                  key={option.id ?? index}
                  value={getSerializedValue(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            ),
          )}
        </select>
      )}
    </div>
  );
};

export { Select };
