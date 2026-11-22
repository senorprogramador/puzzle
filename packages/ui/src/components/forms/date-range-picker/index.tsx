"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  Fragment,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn, resolveResponsiveValue } from "@puzzle-ui/core";
import {
  Popout,
  usePopoutPositioned,
  type PopoutTriggerProps,
} from "../../overlays/popout";

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
} from "./date-range-picker.utils";
import type {
  DateRange,
  DateRangeDayState,
  DateRangePickerProps,
  DateRangePickerSize,
} from "./date-range-picker.types";

import "./date-range-picker.css";

const EMPTY_DATES: readonly Date[] = [];

const normalizeDate = (date?: Date | null): Date | null =>
  date && isValidDate(date) ? startOfDay(date) : null;

const normalizeRange = (range?: DateRange | null): DateRange => ({
  start: normalizeDate(range?.start),
  end: normalizeDate(range?.end),
});

const toInputDate = (value: string): Date | null => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return isValidDate(date) && toDateKey(date) === value ? date : null;
};

const CalendarFocus = ({
  open,
  onReady,
}: {
  open: boolean;
  onReady: () => void;
}) => {
  const positioned = usePopoutPositioned();

  useEffect(() => {
    if (open && positioned) onReady();
  }, [open, positioned, onReady]);

  return null;
};

const DateRangePicker = ({
  value,
  defaultValue,
  onChange,
  label,
  placeholder = "Select dates",
  startPlaceholder = "Check-in",
  endPlaceholder = "Check-out",
  description,
  error,
  disabled = false,
  required = false,
  requiredDescription = "Required",
  clearable = false,
  clearLabel = "Clear dates",
  startName,
  endName,
  form,
  minDate,
  maxDate,
  disabledDates = EMPTY_DATES,
  shouldDisableDate,
  validateRange,
  onValidationError,
  locale,
  weekStartsOn,
  dateFormat,
  months = 1,
  dayContent,
  size = "md",
  fullWidth = false,
  open,
  defaultOpen = false,
  onOpenChange,
  position = "bottom",
  align = "start",
  offset = 8,
  collisionPadding = 8,
  calendarLabel = "Choose date range",
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
}: DateRangePickerProps) => {
  const baseId = useId();
  const triggerId = id ?? `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const calendarId = `${baseId}-calendar`;
  const gridId = `${baseId}-grid`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarGridRef = useRef<HTMLTableElement | null>(null);

  const controlledValue = value !== undefined;
  const controlledOpen = open !== undefined;
  const [today] = useState(() => startOfDay(new Date()));
  const [internalValue, setInternalValue] = useState(() =>
    normalizeRange(defaultValue),
  );
  const selectedRange = controlledValue ? normalizeRange(value) : internalValue;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;
  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(selectedRange.start ?? today),
  );
  const [activeDate, setActiveDate] = useState(
    () => selectedRange.start ?? today,
  );

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
  const isDateDisabled = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      return (
        !isValidDate(normalized) ||
        (normalizedMinDate !== null && normalized < normalizedMinDate) ||
        (normalizedMaxDate !== null && normalized > normalizedMaxDate) ||
        disabledDateKeys.has(toDateKey(normalized)) ||
        shouldDisableDate?.(normalized) === true
      );
    },
    [disabledDateKeys, normalizedMaxDate, normalizedMinDate, shouldDisableDate],
  );

  const formatDate = useMemo(
    () =>
      new Intl.DateTimeFormat(
        resolvedLocale,
        dateFormat ?? { day: "numeric", month: "short", year: "numeric" },
      ),
    [dateFormat, resolvedLocale],
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
    () => new Intl.DateTimeFormat(resolvedLocale, { month: "long", year: "numeric" }),
    [resolvedLocale],
  );
  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { weekday: "short" }),
    [resolvedLocale],
  );
  const weekdayAccessibleFormatter = useMemo(
    () => new Intl.DateTimeFormat(resolvedLocale, { weekday: "long" }),
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
    [resolvedWeekStartsOn, weekdayAccessibleFormatter, weekdayFormatter],
  );
  const calendarMonths = useMemo(
    () =>
      Array.from({ length: months }, (_, index) => addMonths(viewDate, index)),
    [months, viewDate],
  );
  const calendarDays = useMemo(
    () =>
      calendarMonths.map((month) => ({
        month,
        days: getCalendarDays(month, resolvedWeekStartsOn),
      })),
    [calendarMonths, resolvedWeekStartsOn],
  );

  const hasError = error !== undefined && error !== null && error !== false;
  const validationError =
    selectedRange.start && selectedRange.end && selectedRange.start >= selectedRange.end
      ? "End date must be after start date."
      : validateRange?.(selectedRange);
  const errorContent =
    error === true ? validationError ?? "Invalid date range" : error ?? validationError;
  const isInvalid = hasError || Boolean(validationError) || ariaInvalid === true;
  const selectedStartKey = selectedRange.start ? toDateKey(selectedRange.start) : "";
  const selectedEndKey = selectedRange.end ? toDateKey(selectedRange.end) : "";

  const changeOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!controlledOpen) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange],
  );

  const updateValue = useCallback(
    (nextValue: DateRange) => {
      if (!controlledValue) setInternalValue(nextValue);
      onChange?.({
        start: nextValue.start ? new Date(nextValue.start.getTime()) : null,
        end: nextValue.end ? new Date(nextValue.end.getTime()) : null,
      });
    },
    [controlledValue, onChange],
  );

  const findNearestAvailableDate = useCallback(
    (date: Date) => {
      for (let distance = 0; distance <= 3660; distance += 1) {
        const future = addDays(date, distance);
        if (!isDateDisabled(future)) return future;
        if (distance > 0) {
          const past = addDays(date, -distance);
          if (!isDateDisabled(past)) return past;
        }
      }
      return null;
    },
    [isDateDisabled],
  );

  const openCalendar = useCallback(() => {
    const initial = findNearestAvailableDate(
      selectedRange.start && !isDateDisabled(selectedRange.start)
        ? selectedRange.start
        : today,
    );
    if (initial) {
      setActiveDate(initial);
      setViewDate(startOfMonth(initial));
    }
    changeOpenState(true);
  }, [
    changeOpenState,
    findNearestAvailableDate,
    isDateDisabled,
    selectedRange.start,
    today,
  ]);

  const selectDate = useCallback(
    (date: Date) => {
      const normalized = startOfDay(date);
      if (disabled || isDateDisabled(normalized)) return;

      setActiveDate(normalized);
      setViewDate(startOfMonth(normalized));

      const nextRange =
        !selectedRange.start || selectedRange.end
          ? { start: normalized, end: null }
          : normalized <= selectedRange.start
            ? { start: normalized, end: null }
            : { start: selectedRange.start, end: normalized };

      if (nextRange.end) {
        const rangeError = validateRange?.(nextRange);
        if (nextRange.start >= nextRange.end || rangeError) {
          onValidationError?.(rangeError ?? "End date must be after start date.");
          return;
        }
        updateValue(nextRange);
        changeOpenState(false);
        triggerRef.current?.focus({ preventScroll: true });
        return;
      }

      updateValue(nextRange);
    },
    [
      changeOpenState,
      disabled,
      isDateDisabled,
      onValidationError,
      selectedRange.end,
      selectedRange.start,
      updateValue,
      validateRange,
    ],
  );

  const clearRange = () => {
    if (disabled || required) return;
    updateValue({ start: null, end: null });
    changeOpenState(false);
    triggerRef.current?.focus({ preventScroll: true });
  };

  const changeMonth = (amount: number) => {
    const next = addMonths(viewDate, amount);
    setViewDate(startOfMonth(next));
    setActiveDate(findNearestAvailableDate(activeDate) ?? activeDate);
  };

  const previousMonthDisabled =
    normalizedMinDate !== null &&
    getLastDayOfMonth(addMonths(viewDate, -1)) < normalizedMinDate;
  const nextMonthDisabled =
    normalizedMaxDate !== null &&
    startOfMonth(addMonths(viewDate, months)) > normalizedMaxDate;

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    event.preventDefault();
    isOpen ? changeOpenState(false) : openCalendar();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!isOpen) openCalendar();
    }
  };

  const handleDayKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const direction =
      dir === "rtl" || (dir !== "ltr" &&
        triggerRef.current?.ownerDocument.defaultView?.getComputedStyle(triggerRef.current).direction === "rtl")
        ? -1
        : 1;
    let candidate: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        candidate = addDays(date, -direction);
        break;
      case "ArrowRight":
        candidate = addDays(date, direction);
        break;
      case "ArrowUp":
        candidate = addDays(date, -7);
        break;
      case "ArrowDown":
        candidate = addDays(date, 7);
        break;
      case "Home":
        candidate = addDays(
          date,
          -((date.getDay() - resolvedWeekStartsOn + 7) % 7),
        );
        break;
      case "End":
        candidate = addDays(
          date,
          6 - ((date.getDay() - resolvedWeekStartsOn + 7) % 7),
        );
        break;
      case "PageUp":
        candidate = event.shiftKey ? addYears(date, -1) : addMonths(date, -1);
        break;
      case "PageDown":
        candidate = event.shiftKey ? addYears(date, 1) : addMonths(date, 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDate(date);
        return;
      default:
        return;
    }
    event.preventDefault();
    const next = findNearestAvailableDate(candidate);
    if (next) {
      setActiveDate(next);
      setViewDate(startOfMonth(next));
    }
  };

  const focusActiveDate = useCallback(() => {
    const element = triggerRef.current?.ownerDocument.getElementById(
      `${gridId}-day-${toDateKey(activeDate)}`,
    );
    element?.focus({ preventScroll: true });
  }, [activeDate, gridId]);

  useEffect(() => {
    const next = normalizeRange(value);
    if (next.start) {
      setActiveDate(next.start);
      setViewDate(startOfMonth(next.start));
    }
  }, [selectedStartKey, selectedEndKey]);

  const resolvedLabelledBy = ariaLabelledBy ?? (label != null ? labelId : undefined);
  const resolvedDescribedBy =
    [ariaDescribedBy, description != null ? descriptionId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const displayValue = selectedRange.start
    ? `${formatDate.format(selectedRange.start)}${
        selectedRange.end ? ` – ${formatDate.format(selectedRange.end)}` : ` – ${endPlaceholder}`
      }`
    : placeholder;

  const triggerElement = (
    <button
      ref={triggerRef}
      id={triggerId}
      type="button"
      disabled={disabled}
      dir={dir}
      style={style}
      className={cn("puzzle-date-range-picker__trigger", className)}
      onClick={handleTriggerClick}
      onKeyDown={handleTriggerKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-describedby={resolvedDescribedBy}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={isOpen ? calendarId : undefined}
      aria-invalid={isInvalid || undefined}
    >
      <span className={cn("puzzle-date-range-picker__value", !selectedRange.start && "puzzle-date-range-picker__placeholder")}>
        {selectedRange.start ? displayValue : startPlaceholder || displayValue}
      </span>
      <span className="puzzle-date-range-picker__calendar-icon" aria-hidden="true" />
    </button>
  ) as ReactElement<PopoutTriggerProps>;

  const renderMonth = ({
    month,
    days,
    index,
  }: {
    month: Date;
    days: ReturnType<typeof getCalendarDays>;
    index: number;
  }) => (
    <div className="puzzle-date-range-picker__month">
      <div className="puzzle-date-range-picker__header">
        {index === 0 ? (
          <button
            type="button"
            className="puzzle-date-range-picker__navigation"
            aria-label={`${previousMonthLabel}: ${monthFormatter.format(addMonths(month, -1))}`}
            disabled={disabled || previousMonthDisabled}
            onClick={() => changeMonth(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
        ) : <span aria-hidden="true" />}
        <div className="puzzle-date-range-picker__month-label" aria-live="polite">
          {monthFormatter.format(month)}
        </div>
        {index === months - 1 ? (
          <button
            type="button"
            className="puzzle-date-range-picker__navigation"
            aria-label={`${nextMonthLabel}: ${monthFormatter.format(addMonths(month, 1))}`}
            disabled={disabled || nextMonthDisabled}
            onClick={() => changeMonth(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        ) : <span aria-hidden="true" />}
      </div>
      <table
        ref={index === 0 ? calendarGridRef : undefined}
        id={index === 0 ? gridId : undefined}
        className="puzzle-date-range-picker__grid"
        role="grid"
        aria-label={monthFormatter.format(month)}
        tabIndex={-1}
      >
        <thead>
          <tr role="row">
            {weekdayLabels.map((weekday) => (
              <th key={weekday.long} scope="col" role="columnheader" aria-label={weekday.long}>
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <tr key={weekIndex} role="row">
              {days.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ date, key, outsideMonth }) => {
                const dayDisabled = disabled || isDateDisabled(date);
                const rangeStart = Boolean(selectedRange.start && isSameDay(date, selectedRange.start));
                const rangeEnd = Boolean(selectedRange.end && isSameDay(date, selectedRange.end));
                const inRange = Boolean(
                  selectedRange.start &&
                    selectedRange.end &&
                    date > selectedRange.start &&
                    date < selectedRange.end,
                );
                const state: DateRangeDayState = {
                  disabled: dayDisabled,
                  selected: rangeStart || rangeEnd,
                  inRange,
                  rangeStart,
                  rangeEnd,
                };
                return (
                  <td
                    key={key}
                    role="gridcell"
                    aria-selected={state.selected || inRange || undefined}
                    className="puzzle-date-range-picker__cell"
                    data-outside-month={outsideMonth || undefined}
                  >
                    <button
                      type="button"
                      id={`${gridId}-day-${key}`}
                      className="puzzle-date-range-picker__day"
                      disabled={dayDisabled}
                      tabIndex={isSameDay(date, activeDate) && !dayDisabled ? 0 : -1}
                      aria-label={accessibleDateFormatter.format(date)}
                      aria-current={isSameDay(date, today) ? "date" : undefined}
                      data-selected={state.selected || undefined}
                      data-in-range={inRange || undefined}
                      data-range-start={rangeStart || undefined}
                      data-range-end={rangeEnd || undefined}
                      data-outside-month={outsideMonth || undefined}
                      onFocus={() => {
                        setActiveDate(date);
                        if (!isSameMonth(date, viewDate)) setViewDate(startOfMonth(date));
                      }}
                      onKeyDown={(event) => handleDayKeyDown(event, date)}
                      onClick={() => selectDate(date)}
                    >
                      <span>{dayNumberFormatter.format(date.getDate())}</span>
                      {dayContent ? (
                        <span className="puzzle-date-range-picker__day-content">
                          {dayContent(date, state)}
                        </span>
                      ) : null}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      className={cn("puzzle-date-range-picker", rootClassName)}
      data-open={isOpen ? "true" : "false"}
      data-invalid={isInvalid ? "true" : undefined}
      data-size-mobile={responsiveSize.mobile}
      data-size-tablet={responsiveSize.tablet}
      data-size-desktop={responsiveSize.desktop}
      data-full-width-mobile={String(responsiveFullWidth.mobile)}
      data-full-width-tablet={String(responsiveFullWidth.tablet)}
      data-full-width-desktop={String(responsiveFullWidth.desktop)}
      data-months={months}
      lang={resolvedLocale}
      dir={dir}
    >
      {label != null ? (
        <label id={labelId} htmlFor={triggerId} className="puzzle-date-range-picker__label">
          {label}
          {required ? <span className="puzzle-date-range-picker__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <div className="puzzle-date-range-picker__control">
        <Popout
          trigger={triggerElement}
          open={isOpen}
          onOpenChange={changeOpenState}
          action="click"
          position={position}
          align={align}
          offset={offset}
          collisionPadding={collisionPadding}
          contentClassName={cn("puzzle-date-range-picker__popover", popoverClassName)}
        >
          <div
            id={calendarId}
            className="puzzle-date-range-picker__calendar"
            role="dialog"
            aria-label={calendarLabel}
            lang={resolvedLocale}
            dir={dir}
            style={{ "--puzzle-date-range-picker-months": months } as CSSProperties}
            onKeyDown={(event) => {
              if (event.key === "Tab") {
                changeOpenState(false);
                triggerRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            <CalendarFocus open={isOpen} onReady={focusActiveDate} />
            <div className="puzzle-date-range-picker__months">
              {calendarDays.map((calendarMonth, index) => (
                <Fragment key={toDateKey(calendarMonth.month)}>
                  {renderMonth({ ...calendarMonth, index })}
                </Fragment>
              ))}
            </div>
            <div className="puzzle-date-range-picker__footer">
              <button
                type="button"
                className="puzzle-date-range-picker__today"
                disabled={disabled || isDateDisabled(today)}
                onClick={() => selectDate(today)}
              >
                Today
              </button>
              <span role="status" aria-live="polite">
                {selectedRange.start && !selectedRange.end
                  ? `Choose ${String(endPlaceholder ?? "end date").toLowerCase()}`
                  : ""}
              </span>
            </div>
          </div>
        </Popout>
        {clearable && (selectedRange.start || selectedRange.end) && !required ? (
          <button
            type="button"
            className="puzzle-date-range-picker__clear"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={clearRange}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
      {description != null ? (
        <div id={descriptionId} className="puzzle-date-range-picker__description">
          {description}
        </div>
      ) : null}
      {required && requiredDescription ? (
        <span className="puzzle-date-range-picker__native">{requiredDescription}</span>
      ) : null}
      {errorContent ? (
        <div id={errorId} className="puzzle-date-range-picker__error" role="alert">
          {errorContent}
        </div>
      ) : null}
      {startName || endName || required ? (
        <>
          <input
            className="puzzle-date-range-picker__native"
            type="date"
            name={startName}
            form={form}
            value={selectedStartKey}
            required={required}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateValue({ start: toInputDate(event.currentTarget.value), end: selectedRange.end })
            }
          />
          <input
            className="puzzle-date-range-picker__native"
            type="date"
            name={endName}
            form={form}
            value={selectedEndKey}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateValue({ start: selectedRange.start, end: toInputDate(event.currentTarget.value) })
            }
          />
        </>
      ) : null}
    </div>
  );
};

export {
  DateRangePicker,
  type DateRange,
  type DateRangeDayState,
  type DateRangePickerProps,
  type DateRangePickerSize,
};
