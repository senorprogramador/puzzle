"use client";

import {
  useCallback,
  useMemo,
  useState,
  type FormEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@puzzle-ui/core";
import { useAsyncAction } from "@puzzle-ui/hooks";
import { validateContentIds } from "../../content/shared";
import {
  Button,
  Checkbox,
  DatePicker,
  FormField,
  NumberInput,
  Select,
  Stack,
} from "@puzzle-ui/ui";
import { MarketingSection } from "../../marketing/shared";
import type {
  AvailabilityAccommodationOption,
  AvailabilityChildAgeOption,
  AvailabilitySearchErrors,
  AvailabilitySearchInitialValue,
  AvailabilitySearchSectionProps,
  AvailabilitySearchValues,
} from "./availability-search-section.types";

import "./availability-search-section.css";

const DEFAULT_VALUE: AvailabilitySearchValues = {
  checkIn: null,
  checkOut: null,
  guests: { adults: 2, children: 0 },
  accommodationId: null,
  flexibleDates: false,
};

const normalizeValue = (
  value?: AvailabilitySearchInitialValue,
): AvailabilitySearchValues => ({
  ...DEFAULT_VALUE,
  ...value,
  guests: { ...DEFAULT_VALUE.guests, ...value?.guests },
});

const isValidDate = (date: Date | null): date is Date =>
  date instanceof Date && Number.isFinite(date.getTime());

const getCalendarDay = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const hasError = (value: ReactNode) =>
  value !== null && value !== undefined && value !== false && value !== "";

const validateBounds = (name: string, min: number, max: number) => {
  if (
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    min < 0 ||
    max < min
  ) {
    throw new RangeError(`${name} bounds must be non-negative safe integers.`);
  }
};

const validateOptions = (
  accommodations: readonly AvailabilityAccommodationOption[],
  childAgeOptions: readonly AvailabilityChildAgeOption[],
) => {
  validateContentIds(accommodations, "Availability accommodations");
  const ageValues = new Set<number>();

  for (const option of childAgeOptions) {
    if (
      !Number.isSafeInteger(option.value) ||
      option.value < 0 ||
      ageValues.has(option.value) ||
      !option.label.trim()
    ) {
      throw new TypeError(
        "Child age options must have unique non-negative integer values and non-empty labels.",
      );
    }

    ageValues.add(option.value);
  }
};

const validateSearchValues = ({
  value,
  accommodations,
  accommodationRequired,
  childAgeOptions,
  minAdults,
  maxAdults,
  minChildren,
  maxChildren,
}: {
  value: AvailabilitySearchValues;
  accommodations: readonly AvailabilityAccommodationOption[];
  accommodationRequired: boolean;
  childAgeOptions: readonly AvailabilityChildAgeOption[];
  minAdults: number;
  maxAdults: number;
  minChildren: number;
  maxChildren: number;
}): AvailabilitySearchErrors => {
  const errors: AvailabilitySearchErrors = {};

  if (!isValidDate(value.checkIn)) {
    errors.checkIn = "Select a valid check-in date.";
  }

  if (!isValidDate(value.checkOut)) {
    errors.checkOut = "Select a valid check-out date.";
  } else if (
    isValidDate(value.checkIn) &&
    getCalendarDay(value.checkOut) <= getCalendarDay(value.checkIn)
  ) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  const adults = value.guests?.adults;
  if (
    !Number.isSafeInteger(adults) ||
    adults < minAdults ||
    adults > maxAdults
  ) {
    errors.adults = `Enter between ${minAdults} and ${maxAdults} adults.`;
  }

  const children = value.guests?.children;
  if (
    !Number.isSafeInteger(children) ||
    children < minChildren ||
    children > maxChildren
  ) {
    errors.children = `Enter between ${minChildren} and ${maxChildren} children.`;
  }

  const selectedAges = value.guests?.childAges ?? [];
  if (
    childAgeOptions.length > 0 &&
    selectedAges.some(
      (age) =>
        age !== null &&
        (!Number.isSafeInteger(age) ||
          !childAgeOptions.some((option) => option.value === age)),
    )
  ) {
    errors.childAges = "Choose an age from the available options.";
  }

  if (accommodationRequired) {
    const accommodation = accommodations.find(
      (option) => option.id === value.accommodationId,
    );
    errors.accommodationId = accommodation
      ? undefined
      : accommodations.length
        ? "Select an accommodation."
        : "No accommodations are available.";
  }

  return errors;
};

const getErrorMessage = (reason: unknown) =>
  reason instanceof Error
    ? reason.message
    : typeof reason === "string"
      ? reason
      : "Availability could not be checked. Please try again.";

const AvailabilitySearchSection = ({
  variant = "compact",
  value,
  defaultValue,
  accommodations = [],
  childAgeOptions = [],
  accommodationRequired = false,
  minAdults = 1,
  maxAdults = 20,
  minChildren = 0,
  maxChildren = 20,
  locale,
  dateFormat,
  requiredDescription,
  errors,
  error,
  loading = false,
  disabled = false,
  submitLabel = "Search availability",
  loadingLabel = "Searching...",
  onChange,
  onSubmit,
  onValidationError,
  className,
  ...sectionProps
}: AvailabilitySearchSectionProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    normalizeValue(defaultValue),
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const currentValue = isControlled ? value : internalValue;

  validateBounds("Adult", minAdults, maxAdults);
  validateBounds("Child", minChildren, maxChildren);
  validateOptions(accommodations, childAgeOptions);

  const validationErrors = useMemo(
    () =>
      validateSearchValues({
        value: currentValue,
        accommodations,
        accommodationRequired,
        childAgeOptions,
        minAdults,
        maxAdults,
        minChildren,
        maxChildren,
      }),
    [
      currentValue,
      accommodations,
      accommodationRequired,
      childAgeOptions,
      minAdults,
      maxAdults,
      minChildren,
      maxChildren,
    ],
  );

  const visibleErrors = {
    ...(hasSubmitted ? validationErrors : {}),
    ...errors,
  };

  const updateValue = useCallback(
    (patch: Partial<AvailabilitySearchValues>) => {
      const nextValue: AvailabilitySearchValues = {
        ...currentValue,
        ...patch,
        guests: patch.guests
          ? { ...currentValue.guests, ...patch.guests }
          : currentValue.guests,
      };

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [currentValue, isControlled, onChange],
  );

  const updateGuestCount = (
    patch: Partial<AvailabilitySearchValues["guests"]>,
  ) => {
    const guests = { ...currentValue.guests, ...patch };
    if (patch.children !== undefined) {
      const ages = currentValue.guests.childAges ?? [];
      guests.childAges = Array.from(
        { length: Math.max(0, patch.children) },
        (_, index) => ages[index] ?? null,
      );
    }

    updateValue({ guests });
  };

  const submitAction = useCallback(
    (submittedValue: AvailabilitySearchValues) => onSubmit(submittedValue),
    [onSubmit],
  );
  const submission = useAsyncAction(submitAction);
  const isLoading = loading || submission.status === "loading";
  const isDisabled = disabled || isLoading;
  const optionValues = accommodations.map((option) => ({
    id: option.id,
    value: option.id,
    label: option.name,
    description: option.description,
    disabled: option.disabled,
  }));
  const ageOptions = childAgeOptions.map((option) => ({
    id: option.value,
    value: String(option.value),
    label: option.label,
  }));

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = { ...validationErrors, ...errors };
    if (Object.values(nextErrors).some(hasError)) {
      onValidationError?.(nextErrors);
      return;
    }

    void submission.run(currentValue);
  };

  const statusError = error ?? (
    submission.error ? getErrorMessage(submission.error) : undefined
  );

  return (
    <MarketingSection
      {...sectionProps}
      className={cn("puzzle-availability-search", className)}
      family="availability-search"
      variant={variant}
      aria-busy={isLoading || undefined}
    >
      <form
        className="puzzle-availability-search__form"
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isLoading || undefined}
      >
        <div className="puzzle-availability-search__fields">
          <FormField
            label="Check-in"
            required
            error={visibleErrors.checkIn}
            disabled={isDisabled}
          >
            <DatePicker
              name="checkIn"
              value={currentValue.checkIn}
              onChange={(checkIn) => updateValue({ checkIn })}
              locale={locale}
              dateFormat={dateFormat}
              requiredDescription={requiredDescription}
              required
              disabled={isDisabled}
              fullWidth
              calendarLabel="Choose check-in date"
            />
          </FormField>
          <FormField
            label="Check-out"
            required
            error={visibleErrors.checkOut}
            disabled={isDisabled}
          >
            <DatePicker
              name="checkOut"
              value={currentValue.checkOut}
              onChange={(checkOut) => updateValue({ checkOut })}
              locale={locale}
              dateFormat={dateFormat}
              requiredDescription={requiredDescription}
              required
              disabled={isDisabled}
              fullWidth
              calendarLabel="Choose check-out date"
            />
          </FormField>

          <fieldset
            className="puzzle-availability-search__guests"
            disabled={isDisabled}
          >
            <legend>Guests</legend>
            <div className="puzzle-availability-search__guest-fields">
              <FormField
                label="Adults"
                required
                error={visibleErrors.adults}
                disabled={isDisabled}
              >
                <NumberInput
                  name="adults"
                  value={currentValue.guests.adults}
                  onChange={(adults) => updateGuestCount({ adults })}
                  min={minAdults}
                  max={maxAdults}
                  step={1}
                  disabled={isDisabled}
                />
              </FormField>
              <FormField
                label="Children"
                error={visibleErrors.children}
                disabled={isDisabled}
              >
                <NumberInput
                  name="children"
                  value={currentValue.guests.children}
                  onChange={(children) => updateGuestCount({ children })}
                  min={minChildren}
                  max={maxChildren}
                  step={1}
                  disabled={isDisabled}
                />
              </FormField>
            </div>
            {childAgeOptions.length && currentValue.guests.children > 0 ? (
              <div className="puzzle-availability-search__child-ages">
                {Array.from(
                  { length: currentValue.guests.children },
                  (_, index) => (
                    <FormField
                      key={index}
                      label={`Child ${index + 1} age`}
                      error={visibleErrors.childAges}
                      disabled={isDisabled}
                    >
                      <Select
                        name={`childAges.${index}`}
                        options={ageOptions}
                        value={
                          currentValue.guests.childAges?.[index] == null
                            ? undefined
                            : String(currentValue.guests.childAges[index])
                        }
                        onChange={(age) => {
                          const childAges = [
                            ...(currentValue.guests.childAges ?? []),
                          ];
                          childAges[index] =
                            age === undefined ? null : Number(age);
                          updateGuestCount({ childAges });
                        }}
                        placeholder="Choose age"
                        disabled={isDisabled}
                        fullWidth
                      />
                    </FormField>
                  ),
                )}
              </div>
            ) : null}
          </fieldset>

          {accommodations.length > 0 || accommodationRequired ? (
            <FormField
              label="Accommodation"
              required={accommodationRequired}
              error={visibleErrors.accommodationId}
              disabled={isDisabled}
            >
              <Select
                name="accommodationId"
                options={optionValues}
                value={currentValue.accommodationId ?? undefined}
                onChange={(accommodationId) =>
                  updateValue({ accommodationId: accommodationId ?? null })
                }
                placeholder={
                  accommodations.length
                    ? "Choose an accommodation"
                    : "No accommodations available"
                }
                noOptionsText="No accommodations available"
                disabled={isDisabled || accommodations.length === 0}
                required={accommodationRequired}
                fullWidth
              />
            </FormField>
          ) : null}

          <Stack
            className="puzzle-availability-search__options"
            direction="row"
            gap="0"
            wrap="nowrap"
            alignV="center"
          >
            <Checkbox
              name="flexibleDates"
              label="My dates are flexible"
              checked={currentValue.flexibleDates}
              onChange={(event) =>
                updateValue({ flexibleDates: event.currentTarget.checked })
              }
              disabled={isDisabled}
            />
          </Stack>
        </div>

        {statusError ? (
          <p className="puzzle-availability-search__error" role="alert">
            {statusError}
          </p>
        ) : null}

        <Stack
          className="puzzle-availability-search__submit"
          direction="row"
          gap="0"
          wrap="nowrap"
          alignH="end"
        >
          <Button type="submit" disabled={isDisabled}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </Stack>
      </form>
    </MarketingSection>
  );
};

export { AvailabilitySearchSection };
