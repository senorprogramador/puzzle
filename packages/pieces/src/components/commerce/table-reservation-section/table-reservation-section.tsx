"use client";

import { useCallback, useEffect, useRef, useState, type FormEventHandler } from "react";
import { cn } from "@puzzle-ui/core";
import { useAsyncAction } from "@puzzle-ui/hooks";
import {
  Button,
  DatePicker,
  FormField,
  NumberInput,
  Select,
  Text,
  TextAreaInput,
  TextInput,
  TimePicker,
} from "@puzzle-ui/ui";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import {
  calendarDateToPickerDate,
  hasTableReservationErrors,
  mergeTableReservationErrors,
  normalizeTableReservationValue,
  pickerDateToCalendarDate,
  validateTableReservation,
} from "./table-reservation.utils";
import type {
  TableReservationErrors,
  TableReservationField,
  TableReservationSectionProps,
  TableReservationValues,
} from "./table-reservation-section.types";
import "./table-reservation-section.css";

const ERROR_FIELD_ORDER: readonly TableReservationField[] = [
  "date",
  "time",
  "partySize",
  "seating",
  "seatingPreference",
  "guestName",
  "email",
  "phone",
  "specialRequests",
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "Your reservation request could not be submitted. Please try again.";

const validateBounds = (min: number, max: number) => {
  if (
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    min < 1 ||
    max < min
  ) {
    throw new RangeError(
      "Table reservation party-size bounds must be positive safe integers, with maxPartySize at least minPartySize.",
    );
  }
};

const focusFirstInvalidField = (
  form: HTMLFormElement | null,
  errors: TableReservationErrors,
) => {
  const firstInvalidField = ERROR_FIELD_ORDER.find(
    (field) => errors[field] !== undefined,
  );
  if (!form || !firstInvalidField) {
    return;
  }

  const field = form.querySelector<HTMLElement>(
    `[data-reservation-field="${firstInvalidField}"]`,
  );
  field
    ?.querySelector<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    ?.focus();
};

const TableReservationSection = ({
  value,
  defaultValue,
  minPartySize = 1,
  maxPartySize = 20,
  locale,
  dateFormat,
  requiredDescription,
  errors,
  error,
  success,
  loading = false,
  disabled = false,
  dateLabel = "Date",
  timeLabel = "Time",
  partySizeLabel = "Party size",
  seatingLabel = "Seating",
  anySeatingLabel = "No preference",
  indoorLabel = "Indoors",
  outdoorLabel = "Outdoors",
  seatingPreferenceLabel = "Seating preference",
  specialRequestsLabel = "Special requests",
  guestNameLabel = "Name",
  emailLabel = "Email",
  phoneLabel = "Phone",
  submitLabel = "Request a table",
  loadingLabel = "Sending request…",
  bookingHref,
  bookingLinkLabel = "Continue to reservations",
  bookingLinkDescription = "Complete your reservation with our booking provider.",
  calendarLabel = "Choose reservation date",
  onChange,
  onSubmit,
  onValidationError,
  children,
  className,
  ...sectionProps
}: TableReservationSectionProps) => {
  validateBounds(minPartySize, maxPartySize);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    normalizeTableReservationValue(defaultValue),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const currentValue = isControlled
    ? value
    : internalValue;

  const submitAction = useCallback(
    (submittedValue: TableReservationValues) => onSubmit?.(submittedValue),
    [onSubmit],
  );
  const submission = useAsyncAction(submitAction);
  const isLoading = loading || submission.status === "loading";
  const isDisabled = disabled || isLoading;

  useEffect(() => {
    if (submission.status === "success") {
      successRef.current?.focus();
    }
  }, [submission.status]);

  const updateValue = (patch: Partial<TableReservationValues>) => {
    const nextValue = { ...currentValue, ...patch };
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    submission.reset();
    onChange?.(nextValue);
  };

  const validationErrors = validateTableReservation(
    currentValue,
    minPartySize,
    maxPartySize,
  );
  const visibleErrors = hasSubmitted
    ? mergeTableReservationErrors(validationErrors, errors ?? {})
    : errors ?? {};

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = mergeTableReservationErrors(
      validateTableReservation(currentValue, minPartySize, maxPartySize),
      errors ?? {},
    );
    if (hasTableReservationErrors(nextErrors)) {
      onValidationError?.(nextErrors);
      focusFirstInvalidField(formRef.current, nextErrors);
      return;
    }

    void submission.run(currentValue);
  };

  const statusError = error ?? (
    submission.error ? getErrorMessage(submission.error) : undefined
  );
  const successMessage =
    success ?? (submission.status === "success" ? "Your reservation request was received." : undefined);
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;
  const seatingOptions = [
    { value: "any", label: anySeatingLabel },
    { value: "indoor", label: indoorLabel },
    { value: "outdoor", label: outdoorLabel },
  ] as const;

  return (
    <MarketingSection
      {...nativeProps}
      className={cn("puzzle-table-reservation-section", className)}
      family="table-reservation"
      variant="form"
      aria-busy={isLoading || undefined}
    >
      {onSubmit ? (
        <form
          className="puzzle-table-reservation-section__form"
          noValidate
          onSubmit={handleSubmit}
          aria-busy={isLoading || undefined}
          ref={formRef}
        >
          <div className="puzzle-table-reservation-section__fields">
            <FormField
              data-reservation-field="date"
              label={dateLabel}
              required
              error={visibleErrors.date}
              disabled={isDisabled}
            >
              <DatePicker
                name="date"
                value={calendarDateToPickerDate(currentValue.date)}
                onChange={(date) =>
                  updateValue({ date: pickerDateToCalendarDate(date) })
                }
                locale={locale}
                dateFormat={dateFormat}
                requiredDescription={requiredDescription}
                required
                disabled={isDisabled}
                fullWidth
                calendarLabel={calendarLabel}
              />
            </FormField>
            <FormField
              data-reservation-field="time"
              label={timeLabel}
              required
              error={visibleErrors.time}
              disabled={isDisabled}
            >
              <TimePicker
                name="time"
                value={currentValue.time}
                onChange={(time) => updateValue({ time })}
                required
                disabled={isDisabled}
                fullWidth
              />
            </FormField>
            <FormField
              data-reservation-field="partySize"
              label={partySizeLabel}
              required
              error={visibleErrors.partySize}
              disabled={isDisabled}
            >
              <NumberInput
                name="partySize"
                value={currentValue.partySize}
                onChange={(partySize) => updateValue({ partySize })}
                min={minPartySize}
                max={maxPartySize}
                step={1}
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              data-reservation-field="seating"
              label={seatingLabel}
              error={visibleErrors.seating}
              disabled={isDisabled}
            >
              <Select
                name="seating"
                options={seatingOptions}
                value={currentValue.seating}
                onChange={(seating) =>
                  updateValue({
                    seating:
                      seating === "indoor" || seating === "outdoor"
                        ? seating
                        : "any",
                  })
                }
                fullWidth
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              data-reservation-field="seatingPreference"
              label={seatingPreferenceLabel}
              error={visibleErrors.seatingPreference}
              disabled={isDisabled}
            >
              <TextInput
                name="seatingPreference"
                value={currentValue.seatingPreference}
                onChange={(event) =>
                  updateValue({ seatingPreference: event.currentTarget.value })
                }
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              data-reservation-field="guestName"
              label={guestNameLabel}
              required
              error={visibleErrors.guestName}
              disabled={isDisabled}
            >
              <TextInput
                name="guestName"
                value={currentValue.guestName}
                onChange={(event) =>
                  updateValue({ guestName: event.currentTarget.value })
                }
                autoComplete="name"
                required
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              data-reservation-field="email"
              label={emailLabel}
              required
              error={visibleErrors.email}
              disabled={isDisabled}
            >
              <TextInput
                name="email"
                type="email"
                value={currentValue.email}
                onChange={(event) =>
                  updateValue({ email: event.currentTarget.value })
                }
                autoComplete="email"
                required
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              data-reservation-field="phone"
              label={phoneLabel}
              error={visibleErrors.phone}
              disabled={isDisabled}
            >
              <TextInput
                name="phone"
                type="phone"
                value={currentValue.phone}
                onChange={(event) =>
                  updateValue({ phone: event.currentTarget.value })
                }
                autoComplete="tel"
                disabled={isDisabled}
              />
            </FormField>
            <FormField
              className="puzzle-table-reservation-section__requests"
              data-reservation-field="specialRequests"
              label={specialRequestsLabel}
              error={visibleErrors.specialRequests}
              disabled={isDisabled}
            >
              <TextAreaInput
                name="specialRequests"
                value={currentValue.specialRequests}
                onChange={(event) =>
                  updateValue({ specialRequests: event.currentTarget.value })
                }
                disabled={isDisabled}
                rows={3}
              />
            </FormField>
          </div>
          <div className="puzzle-table-reservation-section__actions">
            <Button type="submit" disabled={isDisabled}>
              {isLoading ? loadingLabel : submitLabel}
            </Button>
            {bookingHref ? (
              <Button href={bookingHref} variant="secondary" disabled={isDisabled}>
                {bookingLinkLabel}
              </Button>
            ) : null}
          </div>
        </form>
      ) : bookingHref ? (
        <div className="puzzle-table-reservation-section__provider">
          <Text as="p">{bookingLinkDescription}</Text>
          <Button href={bookingHref}>{bookingLinkLabel}</Button>
        </div>
      ) : null}
      {statusError ? (
        <Text
          as="p"
          className="puzzle-table-reservation-section__error"
          role="alert"
        >
          {error ?? getErrorMessage(statusError)}
        </Text>
      ) : null}
      {successMessage ? (
        <p
          ref={successRef}
          className="puzzle-table-reservation-section__success"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {successMessage}
        </p>
      ) : null}
      {children}
    </MarketingSection>
  );
};

export { TableReservationSection };
