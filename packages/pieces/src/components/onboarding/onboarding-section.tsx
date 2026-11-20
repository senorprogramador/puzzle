import { useId, useRef, type KeyboardEvent } from "react";
import { LinearProgress, Heading, Text } from "@puzzle-ui/ui";

import "./onboarding-section.css";

import type {
  OnboardingSectionProps,
  OnboardingSectionVariant,
  OnboardingStep,
} from "./onboarding-section.types";

const getActiveStep = (
  steps: readonly OnboardingStep[],
  currentStep?: string,
) =>
  steps.find((step) => step.id === currentStep) ??
  steps.find((step) => !step.completed && !step.disabled);

export const OnboardingSection = ({
  title,
  description,
  steps,
  currentStep,
  onStepChange,
  variant = "steps",
  actions,
  children,
  className,
}: OnboardingSectionProps) => {
  const titleId = useId();
  const stepButtons = useRef(new Map<string, HTMLButtonElement>());
  const activeStep = getActiveStep(steps, currentStep);
  const completedCount = steps.filter((step) => step.completed).length;
  const progress = steps.length
    ? Math.round((completedCount / steps.length) * 100)
    : 0;
  const firstEnabledStep = steps.find((step) => !step.disabled);
  const rovingStepId =
    activeStep && !activeStep.disabled ? activeStep.id : firstEnabledStep?.id;

  const handleStepKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    stepId: string,
  ) => {
    const enabledSteps = steps.filter((step) => !step.disabled);
    if (!enabledSteps.length) {
      return;
    }

    const currentIndex = enabledSteps.findIndex((step) => step.id === stepId);
    let nextIndex: number | undefined;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = enabledSteps.length - 1;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % enabledSteps.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + enabledSteps.length) % enabledSteps.length;
    }

    if (nextIndex === undefined) {
      return;
    }

    const nextStep = enabledSteps[nextIndex];
    if (!nextStep) {
      return;
    }

    event.preventDefault();
    stepButtons.current.get(nextStep.id)?.focus();
    onStepChange?.(nextStep.id);
  };

  return (
    <section
      className={["puzzle-onboarding-section", className]
        .filter(Boolean)
        .join(" ")}
      data-variant={variant satisfies OnboardingSectionVariant}
      data-complete={steps.length > 0 && completedCount === steps.length}
      aria-labelledby={titleId}
    >
      <header className="puzzle-onboarding-section__header">
        <div>
          <Heading level="headline2" as="h2" id={titleId} className="puzzle-onboarding-section__title">
            {title}
          </Heading>
          {description ? (
            <Text as="p" className="puzzle-onboarding-section__description">
              {description}
            </Text>
          ) : null}
        </div>
        {actions ? (
          <div className="puzzle-onboarding-section__actions">{actions}</div>
        ) : null}
      </header>

      {steps.length ? (
        <>
          <div className="puzzle-onboarding-section__progress">
            <Text as="p" role="status" aria-live="polite">
              {completedCount === steps.length
                ? "All onboarding steps complete."
                : `${completedCount} of ${steps.length} steps complete`}
            </Text>
            <LinearProgress
              value={progress}
              aria-label="Onboarding progress"
              aria-valuetext={`${completedCount} of ${steps.length} steps complete`}
            />
          </div>
          <ol
            className="puzzle-onboarding-section__steps"
            aria-label="Onboarding steps"
          >
            {steps.map((step, index) => {
              const isCurrent = step.id === activeStep?.id;
              const content = (
                <>
                  <span className="puzzle-onboarding-section__step-marker">
                    {index + 1}
                  </span>
                  <span className="puzzle-onboarding-section__step-copy">
                    <span className="puzzle-onboarding-section__step-title">
                      {step.title}
                    </span>
                    {step.description ? (
                      <span className="puzzle-onboarding-section__step-description">
                        {step.description}
                      </span>
                    ) : null}
                  </span>
                  {step.completed ? (
                    <span className="puzzle-onboarding-section__step-status">
                      Completed
                    </span>
                  ) : null}
                </>
              );

              return (
                <li
                  key={step.id}
                  className="puzzle-onboarding-section__step"
                  data-current={isCurrent || undefined}
                  data-completed={step.completed || undefined}
                  data-disabled={step.disabled || undefined}
                >
                  {onStepChange ? (
                    <button
                      ref={(node) => {
                        if (node) {
                          stepButtons.current.set(step.id, node);
                        } else {
                          stepButtons.current.delete(step.id);
                        }
                      }}
                      type="button"
                      className="puzzle-onboarding-section__step-button"
                      disabled={step.disabled}
                      aria-current={isCurrent ? "step" : undefined}
                      tabIndex={step.id === rovingStepId ? 0 : -1}
                      onClick={() => onStepChange(step.id)}
                      onKeyDown={(event) => handleStepKeyDown(event, step.id)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div
                      className="puzzle-onboarding-section__step-button"
                      aria-current={isCurrent ? "step" : undefined}
                      aria-disabled={step.disabled || undefined}
                    >
                      {content}
                    </div>
                  )}
                  {step.action ? (
                    <span className="puzzle-onboarding-section__step-action">
                      {step.action}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          {variant === "wizard" && activeStep ? (
            <div className="puzzle-onboarding-section__current-step">
              {activeStep.media ? (
                <div className="puzzle-onboarding-section__media">
                  {activeStep.media}
                </div>
              ) : null}
              <Heading level="headline3" as="h3">{activeStep.title}</Heading>
              {activeStep.description ? <Text as="p">{activeStep.description}</Text> : null}
            </div>
          ) : null}
        </>
      ) : (
        <Text as="p" className="puzzle-onboarding-section__empty">No onboarding steps.</Text>
      )}

      {children ? (
        <div className="puzzle-onboarding-section__content">{children}</div>
      ) : null}
    </section>
  );
};
