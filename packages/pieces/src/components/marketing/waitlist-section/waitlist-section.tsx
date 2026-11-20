"use client";

import {
  useCallback,
  useId,
  useState,
  type FormEventHandler,
} from "react";
import { useAsyncAction } from "@puzzle-ui/hooks";
import { Button, LinearProgress, TextInput, Text } from "@puzzle-ui/ui";

import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../shared";
import type {
  WaitlistSectionProps,
  WaitlistSectionVariant,
} from "./waitlist-section.types";

import "./waitlist-section.css";

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "Your request could not be completed. Please try again.";

const WaitlistSection = ({
  variant = "centered",
  signup,
  onSubmit,
  submitLabel = "Join the waitlist",
  emailLabel = "Email address",
  emailPlaceholder = "you@example.com",
  loading = false,
  success,
  error,
  countdown,
  progress,
  socialProof,
  referralInfo,
  children,
  className,
  ...sectionProps
}: WaitlistSectionProps) => {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const submitAction = useCallback(
    (value: string) => onSubmit?.(value),
    [onSubmit],
  );
  const submission = useAsyncAction(submitAction);
  const isLoading = loading || submission.status === "loading";
  const normalizedProgress = progress
    ? (() => {
        const max = progress.max ?? 100;
        if (
          !Number.isFinite(progress.value) ||
          !Number.isFinite(max) ||
          max <= 0 ||
          progress.value < 0 ||
          progress.value > max
        ) {
          throw new RangeError("Waitlist progress requires a non-negative value and positive maximum.");
        }

        return (progress.value / max) * 100;
      })()
    : undefined;
  const nativeProps = sectionProps as MarketingSectionBaseProps<"section">;

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void submission.run(email.trim());
  };

  const statusError = error ?? submission.error;

  return (
    <MarketingSection
      {...nativeProps}
      className={`puzzle-waitlist-section ${className ?? ""}`.trim()}
      family="waitlist"
      variant={variant satisfies WaitlistSectionVariant}
      aria-busy={isLoading || undefined}
    >
      <div className="puzzle-waitlist-section__layout">
        {countdown ? (
          <div
            className="puzzle-waitlist-section__countdown"
            role="group"
            aria-label="Launch countdown"
          >
            <dl>
              <div>
                <dt>Days</dt>
                <dd>{countdown.days}</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{countdown.hours}</dd>
              </div>
              <div>
                <dt>Minutes</dt>
                <dd>{countdown.minutes}</dd>
              </div>
              {countdown.seconds !== undefined ? (
                <div>
                  <dt>Seconds</dt>
                  <dd>{countdown.seconds}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}
        {progress && normalizedProgress !== undefined ? (
          <div className="puzzle-waitlist-section__progress">
            {progress.label ? <Text as="p">{progress.label}</Text> : null}
            <LinearProgress
              value={normalizedProgress}
              aria-label={
                typeof progress.label === "string"
                  ? progress.label
                  : "Waitlist progress"
              }
              aria-valuetext={`${progress.value} of ${progress.max ?? 100}`}
            />
          </div>
        ) : null}
        {socialProof ? (
          <div className="puzzle-waitlist-section__social-proof">
            {socialProof}
          </div>
        ) : null}
        {referralInfo ? (
          <div className="puzzle-waitlist-section__referral">
            {referralInfo}
          </div>
        ) : null}

        {signup ? (
          <div className="puzzle-waitlist-section__signup">{signup}</div>
        ) : onSubmit ? (
          <form
            className="puzzle-waitlist-section__form"
            onSubmit={handleSubmit}
          >
            <label htmlFor={emailId}>{emailLabel}</label>
            <TextInput
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={emailPlaceholder}
              value={email}
              required
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                if (submission.status !== "loading") {
                  submission.reset();
                }
              }}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Joining…" : submitLabel}
            </Button>
          </form>
        ) : null}
        {children}
      </div>
      {statusError ? (
        <Text as="p" className="puzzle-waitlist-section__error" role="alert">
          {error ?? getErrorMessage(statusError)}
        </Text>
      ) : null}
      {success || submission.status === "success" ? (
        <Text as="p" className="puzzle-waitlist-section__success" role="status" aria-live="polite">
          {success ?? "You are on the list. We will be in touch."}
        </Text>
      ) : null}
    </MarketingSection>
  );
};

export { WaitlistSection };
