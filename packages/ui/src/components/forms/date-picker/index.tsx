"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InvalidEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";

import { cn, resolveResponsiveValue } from "@puzzle/core";

import { Popout, type PopoutTriggerProps } from "../../overlays/popout";

import {
  addDays,
  addMonths,
  addYears,
  getCalendarDays,
  getLastDayOfMonth,
  getLocaleWeekStartsOn,
  getWeekdayDates,
  isSameDay,
  isSameMonth,
  isValidDate,
  startOfDay,
  startOfMonth,
  toDateKey,
  type Weekday,
} from "./date-picker.utils";

import type { DatePickerProps, DatePickerSize } from "./date-picker.types";

import "./date-picker.css";

const EMPTY_DATES: readonly Date[] = [] as const;

const normalizeDate = (date?: Date | null): Date | null =>
  date && isValidDate(date) ? startOfDay(date) : null;

const findDateFromInput = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  return isValidDate(date) && toDateKey(date) === value ? date : null;
};

const DatePicker = ({
  value,
  defaultValue,
  onChange,
  label,
  placeholder = "Select date",
  description,
  error,
  disabled = false,
  required = false,
  clearable = false,
  clearLabel = "Clear date",
  name,
  form,
  minDate,
  maxDate,
  disabledDates = EMPTY_DATES,
  shouldDisableDate,
  locale,
  weekStartsOn,
  dateFormat,
  size = "md",
  fullWidth = false,
  open,
  defaultOpen = false,
  onOpenChange,
  position = "bottom",
  align = "start",
  offset = 8,
  collisionPadding = 8,
  calendarLabel = "Choose date",
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  rootClassName,
  popoverClassName,
  id,
  className,
  style,
  onClick,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  dir,
  ...buttonProps
}: DatePickerProps) => {
  const baseId = useId();

  const triggerId = id ?? `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const calendarId = `${baseId}-calendar`;
  const gridId = `${baseId}-grid`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarGridRef = useRef<HTMLTableElement | null>(null);
  const nativeInputRef = useRef<HTMLInputElement | null>(null);

  const isControlledValue = value !== undefined;
  const isControlledOpen = open !== undefined;

  const initialValue = normalizeDate(
    value !== undefined ? value : defaultValue,
  );
  const [today] = useState(() => startOfDay(new Date()));

  const [internalValue, setInternalValue] = useState<Date | null>(() =>
    normalizeDate(defaultValue),
  );

  const selectedDate = isControlledValue ? normalizeDate(value) : internalValue;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(initialValue ?? today),
  );

  const [activeDate, setActiveDate] = useState(() => initialValue ?? today);

  const resolvedLocale =
    locale ?? Intl.DateTimeFormat().resolvedOptions().locale;

  const resolvedWeekStartsOn: Weekday =
    weekStartsOn ?? getLocaleWeekStartsOn(resolvedLocale);

  const responsiveSize = resolveResponsiveValue(size, "md");
  const responsiveFullWidth = resolveResponsiveValue(fullWidth, false);

  const normalizedMinDate = useMemo(() => normalizeDate(minDate), [minDate]);

  const normalizedMaxDate = useMemo(() => normalizeDate(maxDate), [maxDate]);

  const disabledDateKeys = useMemo(
    () =>
      new Set(
        disabledDates
          .filter(isValidDate)
          .map((date) => toDateKey(startOfDay(date))),
      ),
    [disabledDates],
  );

  const selectedKey = selectedDate ? toDateKey(selectedDate) : "";

  const minDateKey = normalizedMinDate
    ? toDateKey(normalizedMinDate)
    : undefined;

  const maxDateKey = normalizedMaxDate
    ? toDateKey(normalizedMaxDate)
    : undefined;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        resolvedLocale,
        dateFormat ?? {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      ),
    [resolvedLocale, dateFormat],
  );

  const accessibleDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [resolvedLocale],
  );

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        month: "long",
        year: "numeric",
      }),
    [resolvedLocale],
  );

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "short",
      }),
    [resolvedLocale],
  );

  const weekdayAccessibleFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "long",
      }),
    [resolvedLocale],
  );

  const dayNumberFormatter = useMemo(
    () => new Intl.NumberFormat(resolvedLocale),
    [resolvedLocale],
  );

  const weekdayLabels = useMemo(
    () =>
      getWeekdayDates(resolvedWeekStartsOn).map((date) => ({
        short: weekdayFormatter.format(date),
        long: weekdayAccessibleFormatter.format(date),
      })),
    [resolvedWeekStartsOn, weekdayFormatter, weekdayAccessibleFormatter],
  );

  const calendarDays = useMemo(
    () => getCalendarDays(viewDate, resolvedWeekStartsOn),
    [viewDate, resolvedWeekStartsOn],
  );

  const hasError = error !== undefined && error !== null && error !== false;

  const isAriaInvalid =
    ariaInvalid !== undefined &&
    ariaInvalid !== false &&
    ariaInvalid !== "false";

  const isInvalid = hasError || isAriaInvalid;

  const resolvedAriaInvalid = isInvalid ? true : ariaInvalid;

  const errorContent = error === true ? "Invalid date" : error;

  const displayedValue = selectedDate
    ? dateFormatter.format(selectedDate)
    : placeholder;

  const monthLabel = monthFormatter.format(viewDate);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      const normalized = startOfDay(date);

      if (
        !isValidDate(normalized) ||
        (normalizedMinDate &&
          normalizedMaxDate &&
          normalizedMinDate > normalizedMaxDate)
      ) {
        return true;
      }

      if (normalizedMinDate && normalized < normalizedMinDate) {
        return true;
      }

      if (normalizedMaxDate && normalized > normalizedMaxDate) {
        return true;
      }

      if (disabledDateKeys.has(toDateKey(normalized))) {
        return true;
      }

      return shouldDisableDate?.(normalized) === true;
    },
    [normalizedMinDate, normalizedMaxDate, disabledDateKeys, shouldDisableDate],
  );

  /**
   * Search in one direction for the next selectable date.
   * The search stops immediately when it reaches a hard date boundary.
   */
  const findAvailableDate = useCallback(
    (date: Date, direction: -1 | 1, maxDistance = 3660): Date | null => {
      if (
        normalizedMinDate &&
        normalizedMaxDate &&
        normalizedMinDate > normalizedMaxDate
      ) {
        return null;
      }

      const base = startOfDay(date);

      for (let offset = 0; offset <= maxDistance; offset++) {
        const candidate = addDays(base, offset * direction);

        if (normalizedMinDate && candidate < normalizedMinDate) {
          if (direction === -1) {
            return null;
          }

          continue;
        }

        if (normalizedMaxDate && candidate > normalizedMaxDate) {
          if (direction === 1) {
            return null;
          }

          continue;
        }

        if (!isDateDisabled(candidate)) {
          return candidate;
        }
      }

      return null;
    },
    [normalizedMinDate, normalizedMaxDate, isDateDisabled],
  );

  /**
   * Find the closest selectable date around a starting point.
   * Prefer the future when both dates are equally distant.
   */
  const findNearestAvailableDate = useCallback(
    (date: Date): Date | null => {
      if (
        normalizedMinDate &&
        normalizedMaxDate &&
        normalizedMinDate > normalizedMaxDate
      ) {
        return null;
      }

      let base = startOfDay(date);

      if (normalizedMinDate && base < normalizedMinDate) {
        base = normalizedMinDate;
      }

      if (normalizedMaxDate && base > normalizedMaxDate) {
        base = normalizedMaxDate;
      }

      for (let distance = 0; distance <= 3660; distance++) {
        const future = addDays(base, distance);

        if (
          (!normalizedMaxDate || future <= normalizedMaxDate) &&
          !isDateDisabled(future)
        ) {
          return future;
        }

        if (distance > 0) {
          const past = addDays(base, -distance);

          if (
            (!normalizedMinDate || past >= normalizedMinDate) &&
            !isDateDisabled(past)
          ) {
            return past;
          }
        }
      }

      return null;
    },
    [normalizedMinDate, normalizedMaxDate, isDateDisabled],
  );

  const changeOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlledOpen) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlledOpen, onOpenChange],
  );

  const openCalendar = useCallback(() => {
    const initialDate =
      selectedDate && !isDateDisabled(selectedDate)
        ? selectedDate
        : findNearestAvailableDate(today);

    if (initialDate) {
      setActiveDate(initialDate);
      setViewDate(startOfMonth(initialDate));
    }

    changeOpenState(true);
  }, [
    selectedDate,
    today,
    isDateDisabled,
    findNearestAvailableDate,
    changeOpenState,
  ]);

  const updateValue = useCallback(
    (nextDate: Date | null) => {
      const normalized = normalizeDate(nextDate);

      if (normalized && isDateDisabled(normalized)) {
        return;
      }

      if (!isControlledValue) {
        setInternalValue(normalized);
      }

      onChange?.(normalized ? new Date(normalized.getTime()) : null);
    },
    [isControlledValue, isDateDisabled, onChange],
  );

  const selectDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);

      if (disabled || isDateDisabled(normalized)) {
        return;
      }

      setActiveDate(normalized);
      setViewDate(startOfMonth(normalized));

      updateValue(normalized);
      changeOpenState(false);

      triggerRef.current?.focus({ preventScroll: true });
    },
    [disabled, isDateDisabled, updateValue, changeOpenState],
  );

  const clearDate = useCallback(() => {
    if (disabled || required || !selectedDate) {
      return;
    }

    updateValue(null);
    changeOpenState(false);

    triggerRef.current?.focus({ preventScroll: true });
  }, [disabled, required, selectedDate, updateValue, changeOpenState]);

  const changeMonth = useCallback(
    (amount: number) => {
      const nextMonth = addMonths(viewDate, amount);
      const candidate = addMonths(activeDate, amount);
      const availableDate = findNearestAvailableDate(candidate);

      setViewDate(startOfMonth(availableDate ?? nextMonth));

      if (availableDate) {
        setActiveDate(availableDate);
      }
    },
    [viewDate, activeDate, findNearestAvailableDate],
  );

  const isPreviousMonthDisabled =
    normalizedMinDate !== null &&
    normalizedMinDate !== undefined &&
    getLastDayOfMonth(addMonths(viewDate, -1)) < normalizedMinDate;

  const isNextMonthDisabled =
    normalizedMaxDate !== null &&
    normalizedMaxDate !== undefined &&
    startOfMonth(addMonths(viewDate, 1)) > normalizedMaxDate;

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    // Popout delegates the click to the trigger.
    // Prevent its own handler because this component controls the state.
    event.preventDefault();

    if (isOpen) {
      changeOpenState(false);
    } else {
      openCalendar();
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
        openCalendar();
      }

      return;
    }
  };

  const handleDayKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    if (event.defaultPrevented) {
      return;
    }

    const computedDirection =
      triggerRef.current?.ownerDocument.defaultView?.getComputedStyle(
        triggerRef.current,
      ).direction;

    const direction: -1 | 1 =
      dir === "rtl" || (dir !== "ltr" && computedDirection === "rtl") ? -1 : 1;

    let candidate: Date | null = null;
    let searchDirection: -1 | 1 = 1;
    let searchDistance = 3660;

    switch (event.key) {
      case "ArrowLeft":
        candidate = addDays(date, -direction);
        searchDirection = -direction as -1 | 1;
        break;

      case "ArrowRight":
        candidate = addDays(date, direction);
        searchDirection = direction;
        break;

      case "ArrowUp":
        candidate = addDays(date, -7);
        searchDirection = -1;
        break;

      case "ArrowDown":
        candidate = addDays(date, 7);
        searchDirection = 1;
        break;

      case "Home": {
        const offset = (date.getDay() - resolvedWeekStartsOn + 7) % 7;

        candidate = addDays(date, -offset);
        searchDirection = 1;
        searchDistance = 6;
        break;
      }

      case "End": {
        const offset = (date.getDay() - resolvedWeekStartsOn + 7) % 7;

        candidate = addDays(date, 6 - offset);
        searchDirection = -1;
        searchDistance = 6;
        break;
      }

      case "PageUp": {
        candidate = event.shiftKey ? addYears(date, -1) : addMonths(date, -1);

        searchDirection = -1;
        break;
      }

      case "PageDown": {
        candidate = event.shiftKey ? addYears(date, 1) : addMonths(date, 1);

        searchDirection = 1;
        break;
      }

      case "Enter":
      case " ": {
        event.preventDefault();
        selectDate(date);
        return;
      }

      default:
        return;
    }

    if (!candidate) {
      return;
    }

    const nextDate = findAvailableDate(
      candidate,
      searchDirection,
      searchDistance,
    );

    event.preventDefault();

    if (!nextDate) {
      return;
    }

    setActiveDate(nextDate);
    setViewDate(startOfMonth(nextDate));
  };

  const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue(findDateFromInput(event.currentTarget.value));
  };

  const handleNativeInvalid = (event: InvalidEvent<HTMLInputElement>) => {
    event.preventDefault();
    triggerRef.current?.focus({ preventScroll: true });
  };

  // Keep the calendar synchronized with controlled value changes.
  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    setActiveDate(selectedDate);
    setViewDate(startOfMonth(selectedDate));
  }, [selectedKey]);

  // Apply custom disabled-date validation to the native form input.
  useEffect(() => {
    const input = nativeInputRef.current;

    if (!input) {
      return;
    }

    const invalidSelection =
      selectedDate !== null && isDateDisabled(selectedDate);

    input.setCustomValidity(
      invalidSelection ? "Please select an available date." : "",
    );
  }, [selectedKey, isDateDisabled, selectedDate]);

  // Move focus into the calendar when it opens or the active day changes.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const ownerDocument = triggerRef.current?.ownerDocument;
    const ownerWindow = ownerDocument?.defaultView;

    if (!ownerDocument || !ownerWindow) {
      return;
    }

    let focusDate = activeDate;

    if (isDateDisabled(focusDate)) {
      const nearestDate = findNearestAvailableDate(focusDate);

      if (nearestDate) {
        focusDate = nearestDate;
        setActiveDate(nearestDate);
        setViewDate(startOfMonth(nearestDate));
      } else {
        calendarGridRef.current?.focus({
          preventScroll: true,
        });

        return;
      }
    }

    const focusActiveDate = () => {
      const dayButton = ownerDocument.getElementById(
        `${gridId}-day-${toDateKey(focusDate)}`,
      );

      dayButton?.focus({ preventScroll: true });
    };

    // Popout mounts its portal after its first effect.
    // requestAnimationFrame also covers an initially open calendar.
    if (typeof ownerWindow.requestAnimationFrame === "function") {
      const frame = ownerWindow.requestAnimationFrame(focusActiveDate);

      return () => {
        ownerWindow.cancelAnimationFrame(frame);
      };
    }

    focusActiveDate();
  }, [isOpen, activeDate, gridId, isDateDisabled, findNearestAvailableDate]);

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

  const triggerElement = (
    <button
      {...buttonProps}
      ref={triggerRef}
      id={triggerId}
      type="button"
      disabled={disabled}
      dir={dir}
      style={style}
      className={cn("puzzle-date-picker__trigger", className)}
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-describedby={resolvedDescribedBy}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? calendarId : undefined}
      aria-required={required || undefined}
      aria-invalid={resolvedAriaInvalid}
    >
      <span
        className={cn(
          "puzzle-date-picker__value",
          !selectedDate && "puzzle-date-picker__placeholder",
        )}
      >
        {displayedValue}
      </span>

      <span className="puzzle-date-picker__calendar-icon" aria-hidden="true" />
    </button>
  ) as ReactElement<PopoutTriggerProps>;

  const calendarHasEnabledDate = calendarDays.some(
    ({ date }) => !isDateDisabled(date),
  );

  return (
    <div
      className={cn("puzzle-date-picker", rootClassName)}
      data-open={isOpen ? "true" : "false"}
      data-disabled={disabled ? "true" : undefined}
      data-invalid={isInvalid ? "true" : undefined}
      data-size-mobile={responsiveSize.mobile}
      data-size-tablet={responsiveSize.tablet}
      data-size-desktop={responsiveSize.desktop}
      data-full-width-mobile={String(responsiveFullWidth.mobile)}
      data-full-width-tablet={String(responsiveFullWidth.tablet)}
      data-full-width-desktop={String(responsiveFullWidth.desktop)}
      lang={resolvedLocale}
      dir={dir}
    >
      {label != null && (
        <label
          id={labelId}
          htmlFor={triggerId}
          className="puzzle-date-picker__label"
        >
          {label}

          {required && (
            <span className="puzzle-date-picker__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="puzzle-date-picker__control">
        <Popout
          trigger={triggerElement}
          open={isOpen}
          onOpenChange={changeOpenState}
          action="click"
          position={position}
          align={align}
          offset={offset}
          collisionPadding={collisionPadding}
          contentClassName={cn("puzzle-date-picker__popover", popoverClassName)}
        >
          <div
            id={calendarId}
            className="puzzle-date-picker__calendar"
            role="dialog"
            aria-label={calendarLabel}
            lang={resolvedLocale}
            dir={dir}
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                changeOpenState(false);
                triggerRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <div className="puzzle-date-picker__header">
              <button
                type="button"
                className="puzzle-date-picker__navigation"
                aria-label={`${previousMonthLabel}: ${monthFormatter.format(
                  addMonths(viewDate, -1),
                )}`}
                disabled={disabled || isPreviousMonthDisabled}
                onClick={() => changeMonth(-1)}
              >
                <span aria-hidden="true">‹</span>
              </button>

              <div
                id={`${calendarId}-month`}
                className="puzzle-date-picker__month"
                aria-live="polite"
                aria-atomic="true"
              >
                {monthLabel}
              </div>

              <button
                type="button"
                className="puzzle-date-picker__navigation"
                aria-label={`${nextMonthLabel}: ${monthFormatter.format(
                  addMonths(viewDate, 1),
                )}`}
                disabled={disabled || isNextMonthDisabled}
                onClick={() => changeMonth(1)}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>

            <table
              ref={calendarGridRef}
              id={gridId}
              className="puzzle-date-picker__grid"
              role="grid"
              aria-labelledby={`${calendarId}-month`}
              tabIndex={calendarHasEnabledDate ? -1 : 0}
            >
              <thead>
                <tr role="row">
                  {weekdayLabels.map((weekday, index) => (
                    <th
                      key={index}
                      scope="col"
                      role="columnheader"
                      aria-label={weekday.long}
                    >
                      {weekday.short}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 6 }, (_, weekIndex) => (
                  <tr key={weekIndex} role="row">
                    {calendarDays
                      .slice(weekIndex * 7, weekIndex * 7 + 7)
                      .map(({ date, key, outsideMonth }) => {
                        const selected =
                          selectedDate !== null &&
                          isSameDay(date, selectedDate);

                        const isToday = isSameDay(date, today);
                        const isActive = isSameDay(date, activeDate);

                        const dayDisabled = disabled || isDateDisabled(date);

                        return (
                          <td
                            key={key}
                            role="gridcell"
                            aria-selected={selected || undefined}
                            className="puzzle-date-picker__cell"
                            data-outside-month={outsideMonth || undefined}
                          >
                            <button
                              type="button"
                              id={`${gridId}-day-${key}`}
                              className="puzzle-date-picker__day"
                              disabled={dayDisabled}
                              tabIndex={isActive && !dayDisabled ? 0 : -1}
                              aria-label={accessibleDateFormatter.format(date)}
                              aria-current={isToday ? "date" : undefined}
                              data-selected={selected || undefined}
                              data-today={isToday || undefined}
                              data-outside-month={outsideMonth || undefined}
                              data-active={isActive || undefined}
                              onFocus={() => {
                                setActiveDate(date);

                                if (!isSameMonth(date, viewDate)) {
                                  setViewDate(startOfMonth(date));
                                }
                              }}
                              onKeyDown={(event) =>
                                handleDayKeyDown(event, date)
                              }
                              onClick={() => selectDate(date)}
                            >
                              {dayNumberFormatter.format(date.getDate())}
                            </button>
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>

            {!calendarHasEnabledDate && (
              <div className="puzzle-date-picker__empty" role="status">
                No available dates
              </div>
            )}

            <div className="puzzle-date-picker__footer">
              <button
                type="button"
                className="puzzle-date-picker__today"
                disabled={disabled || isDateDisabled(today)}
                onClick={() => selectDate(today)}
              >
                Today
              </button>
            </div>
          </div>
        </Popout>

        {clearable && selectedDate && !required && (
          <button
            type="button"
            className="puzzle-date-picker__clear"
            disabled={disabled}
            aria-label={clearLabel}
            onClick={clearDate}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>

      {description != null && (
        <div id={descriptionId} className="puzzle-date-picker__description">
          {description}
        </div>
      )}

      {hasError && (
        <div id={errorId} className="puzzle-date-picker__error" role="alert">
          {errorContent}
        </div>
      )}

      {(name !== null || required) && (
        <input
          ref={nativeInputRef}
          className="puzzle-date-picker__native"
          type="date"
          name={name ?? undefined}
          form={form}
          value={selectedKey}
          min={minDateKey}
          max={maxDateKey}
          disabled={disabled}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleNativeChange}
          onInvalid={handleNativeInvalid}
        />
      )}
    </div>
  );
};

export { DatePicker, type DatePickerProps, type DatePickerSize };
