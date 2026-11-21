"use client";

import { useAsyncAction } from "@puzzle-ui/hooks";
import { Button, Card, Heading, LinearProgress, Text } from "@puzzle-ui/ui";
import {
  useCallback,
  type FormEventHandler,
  type ReactNode,
} from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import {
  PaymentMethodSelector,
  type PaymentMethodOption,
} from "../payment-method-selector";
import type {
  CheckoutSectionProps,
  CheckoutSectionVariant,
  CheckoutStep,
} from "./checkout-section.types";
import "./checkout-section.css";

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "Your order could not be submitted. Please try again.";

const validateSteps = (steps: readonly CheckoutStep[]) => {
  const ids = new Set<string>();

  steps.forEach((step) => {
    if (!step.id.trim() || ids.has(step.id)) {
      throw new TypeError("Checkout step IDs must be non-empty and unique.");
    }

    ids.add(step.id);
  });
};

const CheckoutSteps = ({
  steps,
  currentStepId,
  onStepChange,
}: {
  steps: readonly CheckoutStep[];
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
  const completedCount = steps.filter((step) => step.completed).length;
  const activeStep = steps[activeIndex];
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="puzzle-checkout-section__steps">
      <Text as="p" role="status" aria-live="polite">
        Step {activeIndex + 1} of {steps.length}
      </Text>
      <LinearProgress
        value={progress}
        aria-label="Checkout progress"
        aria-valuetext={`${completedCount} of ${steps.length} steps complete`}
      />
      <ol aria-label="Checkout steps">
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

const Slot = ({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) =>
  children ? (
    <section className="puzzle-checkout-section__slot" aria-label={label}>
      {children}
    </section>
  ) : null;

const CheckoutSection = ({
  variant = "form",
  customerDetails,
  billingDetails,
  shippingDetails,
  payment,
  review,
  summary,
  paymentMethods,
  selectedPaymentMethod,
  defaultPaymentMethod,
  paymentMethodName,
  onPaymentMethodChange,
  steps = [],
  currentStepId,
  onStepChange,
  terms,
  actions,
  onSubmit,
  submitLabel = "Place order",
  loading = false,
  success,
  error,
  children,
  className,
  ...sectionProps
}: CheckoutSectionProps) => {
  validateSteps(steps);

  const submitAction = useCallback(
    (formData: FormData) => onSubmit?.(formData),
    [onSubmit],
  );
  const submission = useAsyncAction(submitAction);
  const isLoading = loading || submission.status === "loading";
  const submissionError =
    error ??
    (submission.status === "error"
      ? getErrorMessage(submission.error)
      : undefined);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (onSubmit) {
      void submission.run(new FormData(event.currentTarget));
    }
  };

  return (
    <MarketingSection
      {...(sectionProps as MarketingSectionBaseProps<"section">)}
      className={`puzzle-checkout-section ${className ?? ""}`.trim()}
      family="checkout-section"
      variant={variant satisfies CheckoutSectionVariant}
    >
      <form
        className="puzzle-checkout-section__form"
        aria-label="Checkout"
        onSubmit={handleSubmit}
        aria-busy={isLoading || undefined}
      >
        <CheckoutSteps
          steps={steps}
          currentStepId={currentStepId}
          onStepChange={onStepChange}
        />
        <div className="puzzle-checkout-section__layout">
          <div className="puzzle-checkout-section__main">
            <Slot label="Customer details">{customerDetails}</Slot>
            <Slot label="Billing details">{billingDetails}</Slot>
            <Slot label="Shipping details">{shippingDetails}</Slot>
            <Slot label="Payment">
              {paymentMethods ? (
                <PaymentMethodSelector
                  methods={paymentMethods}
                  value={selectedPaymentMethod}
                  defaultValue={defaultPaymentMethod}
                  name={paymentMethodName}
                  onValueChange={onPaymentMethodChange}
                />
              ) : null}
              {payment}
            </Slot>
            <Slot label="Review">{review}</Slot>
            {terms ? (
              <div className="puzzle-checkout-section__terms">{terms}</div>
            ) : null}
            {submissionError ? (
              <Text
                as="p"
                className="puzzle-checkout-section__error"
                role="alert"
              >
                {submissionError}
              </Text>
            ) : null}
            {success ? (
              <Text as="p" className="puzzle-checkout-section__success" role="status">
                {success}
              </Text>
            ) : null}
            {onSubmit ? (
              <div className="puzzle-checkout-section__submit">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Processing..." : submitLabel}
                </Button>
              </div>
            ) : null}
            {actions ? (
              <div className="puzzle-checkout-section__actions">{actions}</div>
            ) : null}
          </div>
          {summary ? (
            <Card
              as="aside"
              variant="outlined"
              className="puzzle-checkout-section__summary"
            >
              <Heading level="headline3" as="h2">
                Order summary
              </Heading>
              {summary}
            </Card>
          ) : null}
        </div>
        {children}
      </form>
    </MarketingSection>
  );
};

export { CheckoutSection };
