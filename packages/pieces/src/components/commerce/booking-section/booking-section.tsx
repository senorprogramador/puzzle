"use client";

import {
  useCallback,
  type FormEventHandler,
} from "react";
import { useAsyncAction } from "@puzzle-ui/hooks";
import { Button, LinearProgress } from "@puzzle-ui/ui";

import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import type {
  BookingSectionProps,
  BookingSectionVariant,
  BookingStep,
} from "./booking-section.types";

import "./booking-section.css";

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "Your booking could not be submitted. Please try again.";

const BookingSteps = ({
  steps,
  currentStepId,
  onStepChange,
}: {
  steps: readonly BookingStep[];
  currentStepId?: string;
  onStepChange?: (stepId: string) => void;
}) => {
  if (!steps.length) {
    return null;
  }

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStepId),
  );
  const activeStep = steps[activeIndex];
  const completedCount = steps.filter((step) => step.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="puzzle-booking-section__steps">
      <p role="status" aria-live="polite">
        Step {activeIndex + 1} of {steps.length}
      </p>
      <LinearProgress
        value={progress}
        aria-label="Booking progress"
        aria-valuetext={`${completedCount} of ${steps.length} steps complete`}
      />
      <ol aria-label="Booking steps">
        {steps.map((step) => (
          <li key={step.id} data-completed={step.completed || undefined}>
            {onStepChange ? (
              <button
                type="button"
                disabled={step.disabled}
                aria-current={step.id === activeStep?.id ? "step" : undefined}
                onClick={() => onStepChange(step.id)}
              >
                {step.title}
              </button>
            ) : (
              <span aria-current={step.id === activeStep?.id ? "step" : undefined}>
                {step.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

const BookingSection = ({
  variant = "form",
  bookingDetails,
  calendar,
  availability,
  formSlot,
  priceSummary,
  steps = [],
  currentStepId,
  onStepChange,
  onSubmit,
  submitLabel = "Confirm booking",
  loading = false,
  success,
  error,
  children,
  className,
  ...sectionProps
}: BookingSectionProps) => {
  const submitAction = useCallback(
    (formData: FormData) => onSubmit?.(formData),
    [onSubmit],
  );
  const submission = useAsyncAction(submitAction);
  const isLoading = loading || submission.status === "loading";

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void submission.run(new FormData(event.currentTarget));
  };

  const content = (
    <div className="puzzle-booking-section__layout">
      <BookingSteps
        steps={steps}
        currentStepId={currentStepId}
        onStepChange={onStepChange}
      />
      {bookingDetails ? (
        <div className="puzzle-booking-section__details">{bookingDetails}</div>
      ) : null}
      {calendar ? (
        <div className="puzzle-booking-section__calendar">{calendar}</div>
      ) : null}
      {availability ? (
        <div className="puzzle-booking-section__availability">
          {availability}
        </div>
      ) : null}
      {formSlot ? (
        <div className="puzzle-booking-section__form-fields">{formSlot}</div>
      ) : null}
      {priceSummary ? (
        <div className="puzzle-booking-section__price">{priceSummary}</div>
      ) : null}
      {children}
    </div>
  );

  const statusError = error ?? submission.error;
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  return (
    <MarketingSection
      {...nativeProps}
      className={`puzzle-booking-section ${className ?? ""}`.trim()}
      family="booking"
      variant={variant satisfies BookingSectionVariant}
      aria-busy={isLoading || undefined}
    >
      {onSubmit ? (
        <form
          className="puzzle-booking-section__form"
          onSubmit={handleSubmit}
        >
          {content}
          <div className="puzzle-booking-section__submit">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting booking…" : submitLabel}
            </Button>
          </div>
        </form>
      ) : (
        content
      )}
      {statusError ? (
        <p className="puzzle-booking-section__error" role="alert">
          {error ?? getErrorMessage(statusError)}
        </p>
      ) : null}
      {success || submission.status === "success" ? (
        <p className="puzzle-booking-section__success" role="status" aria-live="polite">
          {success ?? "Your booking request was received."}
        </p>
      ) : null}
    </MarketingSection>
  );
};

export { BookingSection };
