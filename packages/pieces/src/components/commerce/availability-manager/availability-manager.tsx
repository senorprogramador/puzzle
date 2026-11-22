"use client";

import {
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { MarketingSection } from "../../marketing/shared";
import type {
  AvailabilityDayStatus,
} from "../availability-calendar";
import type {
  AvailabilityManagerBulkEdit,
  AvailabilityManagerCell,
  AvailabilityManagerDay,
  AvailabilityManagerProps,
  AvailabilityManagerSelection,
  AvailabilityManagerResource,
} from "./availability-manager.types";
import {
  addCalendarDays,
  addCalendarMonths,
  cellKey,
  cellsForRange,
  createDayMaps,
  datesInMonth,
  normalizeCell,
  startOfDay,
  startOfMonth,
  toDateKey,
  uniqueCells,
} from "./availability-manager.utils";

import "./availability-manager.css";

const DEFAULT_STATUS: AvailabilityDayStatus = "unavailable";

const resourceLabel = (resource: AvailabilityManagerResource): ReactNode =>
  resource.label ?? resource.name ?? resource.id;

const sameCell = (left: AvailabilityManagerCell, right: AvailabilityManagerCell) =>
  left.resourceId === right.resourceId && toDateKey(left.date) === toDateKey(right.date);

const formatPrice = (
  price: AvailabilityManagerDay["price"],
  locale: string,
): string | null => {
  if (!price) return null;
  if (!Number.isFinite(price.amount)) return null;
  const currency = price.currency.trim().toUpperCase();
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 0;
    return formatter.format(price.amount / 10 ** fractionDigits);
  } catch {
    return `${price.amount} ${price.currency}`;
  }
};

const formatMonth = (month: Date, locale: string, months: number): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });
  if (months === 1) return formatter.format(month);
  return `${formatter.format(month)} – ${formatter.format(
    addCalendarMonths(month, months - 1),
  )}`;
};

const AvailabilityManager = ({
  resources,
  value,
  defaultValue,
  selection,
  onChange,
  onSelectionChange,
  initialMonth = new Date(),
  month,
  onMonthChange,
  months = 1,
  selectionMode = "multiple",
  locale,
  weekStartsOn,
  loading = false,
  error,
  disabled = false,
  emptyState = "No availability has been supplied.",
  bulkActions,
  bulkEdit,
  onCellClick,
  onBulkEdit,
  slots,
  calendarLabel = "Availability",
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  className,
  ...sectionProps
}: AvailabilityManagerProps) => {
  const resolvedLocale =
    locale ?? Intl.DateTimeFormat().resolvedOptions().locale;
  const dayMaps = useMemo(() => createDayMaps(resources), [resources]);
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(initialMonth),
  );
  const currentMonth = startOfMonth(month ?? internalMonth);
  const [internalSelection, setInternalSelection] =
    useState<AvailabilityManagerSelection>(() => ({
      cells: uniqueCells(defaultValue?.cells),
      anchor: defaultValue?.anchor ? normalizeCell(defaultValue.anchor) : null,
      range: defaultValue?.range
        ? {
            start: startOfDay(defaultValue.range.start),
            end: startOfDay(defaultValue.range.end),
          }
        : null,
    }));
  const isControlled = value !== undefined || selection !== undefined;
  const selectedValue = value !== undefined ? value : selection;
  const selected = isControlled
    ? selectedValue ?? { cells: [] }
    : internalSelection;
  const selectedCells = useMemo(() => uniqueCells(selected?.cells), [selected?.cells]);
  const selectedKeys = useMemo(
    () => new Set(selectedCells.map(cellKey)),
    [selectedCells],
  );
  const monthsToRender = useMemo(
    () =>
      Array.from({ length: months }, (_, index) =>
        addCalendarMonths(currentMonth, index),
      ),
    [currentMonth, months],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "long",
        day: "numeric",
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
  const dayNumberFormatter = useMemo(
    () => new Intl.NumberFormat(resolvedLocale, { maximumFractionDigits: 0 }),
    [resolvedLocale],
  );

  const updateSelection = (next: AvailabilityManagerSelection) => {
    const normalized: AvailabilityManagerSelection = {
      cells: uniqueCells(next.cells),
      anchor: next.anchor ? normalizeCell(next.anchor) : null,
      range: next.range
        ? {
            start: startOfDay(next.range.start),
            end: startOfDay(next.range.end),
          }
        : null,
    };
    if (!isControlled) {
      setInternalSelection(normalized);
    }
    onChange?.(normalized);
    onSelectionChange?.(normalized);
  };

  const changeMonth = (amount: number) => {
    const next = addCalendarMonths(currentMonth, amount);
    if (month === undefined) setInternalMonth(next);
    onMonthChange?.(new Date(next.getTime()));
  };

  const clearSelection = () => updateSelection({ cells: [], anchor: null, range: null });
  const applyBulkEdit = (edit: AvailabilityManagerBulkEdit) => {
    onBulkEdit?.(selectedCells, edit);
  };

  const handleCellClick = (
    event: MouseEvent<HTMLButtonElement>,
    resource: AvailabilityManagerResource,
    day: AvailabilityManagerDay | undefined,
    date: Date,
  ) => {
    if (disabled || day?.disabled || !day) return;
    const cell = { resourceId: resource.id, date: startOfDay(date) };
    onCellClick?.(cell, day);
    const anchor = selected?.anchor ? normalizeCell(selected.anchor) : null;
    let cells: AvailabilityManagerCell[];
    let range: AvailabilityManagerSelection["range"] = null;
    let nextAnchor: AvailabilityManagerCell | null = cell;

    if (
      selectionMode === "range" &&
      anchor &&
      anchor.resourceId === cell.resourceId &&
      (event.shiftKey || !sameCell(anchor, cell))
    ) {
      cells = cellsForRange(
        cell.resourceId,
        anchor.date,
        cell.date,
      );
      range = {
        start: anchor.date <= cell.date ? anchor.date : cell.date,
        end: anchor.date <= cell.date ? cell.date : anchor.date,
        resourceId: cell.resourceId,
      };
      nextAnchor = null;
    } else if (selectionMode === "single") {
      cells = [cell];
      nextAnchor = null;
    } else if (selectionMode === "range") {
      cells = [cell];
    } else {
      const current = new Map(selectedCells.map((item) => [cellKey(item), item]));
      const key = cellKey(cell);
      if (current.has(key)) current.delete(key);
      else current.set(key, cell);
      cells = [...current.values()];
      nextAnchor = cell;
    }

    updateSelection({ cells, anchor: nextAnchor, range });
  };

  const renderResourceLabel = (resource: AvailabilityManagerResource) =>
    slots?.resourceLabel?.(resource) ?? (
      <>
        <span className="puzzle-availability-manager__resource-label">
          {resourceLabel(resource)}
        </span>
        {resource.description ? (
          <span className="puzzle-availability-manager__resource-description">
            {resource.description}
          </span>
        ) : null}
      </>
    );

  const renderDay = (
    resource: AvailabilityManagerResource,
    day: AvailabilityManagerDay | undefined,
    date: Date,
  ) => {
    const cell = { resourceId: resource.id, date };
    const selectedCell = selectedKeys.has(cellKey(cell));
    const range = selected?.range;
    const inRange =
      range !== null &&
      range !== undefined &&
      (range.resourceId === undefined || range.resourceId === resource.id) &&
      date >= startOfDay(range.start) &&
      date <= startOfDay(range.end);
    const isDisabled = disabled || !day || day.disabled === true;
    const status = day?.status ?? DEFAULT_STATUS;
    const price = formatPrice(day?.price, resolvedLocale);
    const custom = slots?.day?.({
      day,
      date,
      resource,
      selected: selectedCell,
      inRange,
      disabled: isDisabled,
    });
    const content =
      custom ??
      day?.indicator ??
      day?.label ??
      price ??
      (day?.status === "available" ? "Available" : day?.status ?? "—");

    return (
      <button
        type="button"
        className="puzzle-availability-manager__cell"
        data-selected={selectedCell || undefined}
        data-in-range={inRange || undefined}
        data-status={status}
        disabled={isDisabled}
        aria-label={`${resourceLabel(resource)}, ${dateFormatter.format(date)}${
          price ? `, ${price}` : `, ${status}`
        }`}
        aria-pressed={selectedCell}
        onClick={(event) => handleCellClick(event, resource, day, date)}
      >
        <span className="puzzle-availability-manager__cell-date">
          {dayNumberFormatter.format(date.getDate())}
        </span>
        <span className="puzzle-availability-manager__cell-detail">{content}</span>
      </button>
    );
  };

  const renderMonth = (monthDate: Date) => {
    const dates = datesInMonth(monthDate);
    const monthLabel = new Intl.DateTimeFormat(resolvedLocale, {
      month: "long",
      year: "numeric",
    }).format(monthDate);
    return (
      <div className="puzzle-availability-manager__month" key={toDateKey(monthDate)}>
        <div className="puzzle-availability-manager__table-wrap">
          <table
            className="puzzle-availability-manager__table"
            role="grid"
            aria-label={`${calendarLabel}: ${monthLabel}`}
          >
            <thead>
              <tr role="row">
                <th
                  className="puzzle-availability-manager__resource-heading"
                  scope="col"
                >
                  Resource
                </th>
                {dates.map((date) => (
                  <th scope="col" key={toDateKey(date)}>
                    <span className="puzzle-availability-manager__weekday">
                      {weekdayFormatter.format(date)}
                    </span>
                    <time
                      className="puzzle-availability-manager__date"
                      dateTime={toDateKey(date)}
                    >
                      {dayNumberFormatter.format(date.getDate())}
                    </time>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => {
                const resourceDays = dayMaps.get(resource.id);
                return (
                  <tr role="row" key={resource.id}>
                    <th scope="row" className="puzzle-availability-manager__resource">
                      {renderResourceLabel(resource)}
                    </th>
                    {dates.map((date) => {
                      const day = resourceDays?.get(toDateKey(date));
                      return (
                        <td role="gridcell" key={toDateKey(date)}>
                          {renderDay(resource, day, date)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const selectionForBulkActions: AvailabilityManagerSelection = {
    cells: selectedCells,
    anchor: selected?.anchor ?? null,
    range: selected?.range ?? null,
  };
  const renderedBulkActions =
    selectedCells.length > 0
      ? bulkActions ??
        bulkEdit ??
        slots?.bulkActions?.({
          selection: selectionForBulkActions,
          cells: selectedCells,
          clearSelection,
          applyBulkEdit,
        }) ??
        slots?.bulkEdit?.({
          selection: selectionForBulkActions,
          cells: selectedCells,
          clearSelection,
          applyBulkEdit,
        })
      : null;

  return (
    <MarketingSection
      {...sectionProps}
      className={cn("puzzle-availability-manager", className)}
      family="availability-manager"
      variant={months > 1 ? "multi-month" : "month"}
    >
      <div className="puzzle-availability-manager__content">
        <div className="puzzle-availability-manager__toolbar">
          <div className="puzzle-availability-manager__toolbar-main">
            <button
              type="button"
              className="puzzle-availability-manager__navigation"
              aria-label={previousMonthLabel}
              disabled={disabled || loading}
              onClick={() => changeMonth(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <h2 aria-live="polite">{formatMonth(currentMonth, resolvedLocale, months)}</h2>
            <button
              type="button"
              className="puzzle-availability-manager__navigation"
              aria-label={nextMonthLabel}
              disabled={disabled || loading}
              onClick={() => changeMonth(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
          {slots?.toolbar ? (
            <div className="puzzle-availability-manager__toolbar-actions">
              {slots.toolbar({
                month: currentMonth,
                months,
                selectedCells,
              })}
            </div>
          ) : null}
        </div>
        {loading ? (
          <div className="puzzle-availability-manager__status" role="status">
            Loading availability…
          </div>
        ) : null}
        {error ? (
          <div className="puzzle-availability-manager__error" role="alert">
            {error}
          </div>
        ) : null}
        {!loading && !error && resources.length === 0 ? (
          <div className="puzzle-availability-manager__status" role="status">
            {slots?.emptyState ?? emptyState}
          </div>
        ) : null}
        {!loading && !error && resources.length > 0 ? (
          <div
            className="puzzle-availability-manager__months"
            aria-label={calendarLabel}
          >
            {monthsToRender.map(renderMonth)}
          </div>
        ) : null}
        {renderedBulkActions ? (
          <div className="puzzle-availability-manager__bulk-actions">
            <span className="puzzle-availability-manager__selection-count" aria-live="polite">
              {selectedCells.length} day{selectedCells.length === 1 ? "" : "s"} selected
            </span>
            <div>{renderedBulkActions}</div>
          </div>
        ) : null}
      </div>
    </MarketingSection>
  );
};

export { AvailabilityManager, formatPrice };
