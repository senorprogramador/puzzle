"use client";

import { cn, resolveResponsiveValue, type ResponsiveValue } from "@puzzle/core";
import {
  Children,
  isValidElement,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import "./stepper.css";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperStepProps = {
  /** Stable identifier, useful when steps are reordered. */
  id?: string | number;

  /** Visible label of the step. */
  label: ReactNode;

  /** Optional supporting text below the label. */
  description?: ReactNode;

  /** Custom indicator content. */
  icon?: ReactNode;

  /** Overrides the automatically calculated completed state. */
  completed?: boolean;

  /** Displays the step as an error. */
  error?: boolean;

  /** Prevents navigation to this step. */
  disabled?: boolean;

  /** Optional content displayed below the label. */
  optional?: ReactNode;

  /** Class applied to the step item. */
  className?: string;
};

export type StepperProps = Omit<ComponentPropsWithoutRef<"ol">, "children"> & {
  /** Active step index. Enables controlled usage. Defaults to 0. */
  activeStep?: number;

  /** Initial active step for uncontrolled usage. Defaults to 0. */
  defaultActiveStep?: number;

  /** Called when the active step changes. */
  onStepChange?: (step: number) => void;

  /** Layout direction, optionally responsive. */
  orientation?: ResponsiveValue<StepperOrientation>;

  /** Allows users to select steps. Defaults to false. */
  clickable?: boolean;

  /** Prevents selecting steps ahead of the active step. Defaults to true. */
  linear?: boolean;

  children: ReactNode;
};

const StepperStep = (_props: StepperStepProps) => null;

type StepperStepElement = ReactElement<StepperStepProps, typeof StepperStep>;

const isStepperStep = (child: ReactNode): child is StepperStepElement =>
  isValidElement<StepperStepProps>(child) && child.type === StepperStep;

const StepperRoot = ({
  activeStep,
  defaultActiveStep = 0,
  onStepChange,
  orientation = "horizontal",
  clickable = false,
  linear = true,
  children,
  className,
  ...rootProps
}: StepperProps) => {
  const isControlled = activeStep !== undefined;

  const [uncontrolledActiveStep, setUncontrolledActiveStep] =
    useState(defaultActiveStep);

  const requestedActiveStep = isControlled
    ? activeStep
    : uncontrolledActiveStep;

  const currentActiveStep = Number.isFinite(requestedActiveStep)
    ? Math.max(-1, Math.trunc(requestedActiveStep))
    : 0;

  const orientations = resolveResponsiveValue(orientation);
  const steps = Children.toArray(children).filter(isStepperStep);

  return (
    <ol
      {...rootProps}
      className={cn("puzzle-stepper", className)}
      data-orientation-mobile={orientations.mobile}
      data-orientation-tablet={orientations.tablet}
      data-orientation-desktop={orientations.desktop}
    >
      {steps.map((step, index) => {
        const {
          id,
          label,
          description,
          icon,
          completed: completedProp,
          error,
          disabled = false,
          optional,
          className: stepClassName,
        } = step.props;

        const completed = completedProp ?? index < currentActiveStep;

        const state = error
          ? "error"
          : completed
            ? "completed"
            : index === currentActiveStep
              ? "active"
              : "upcoming";

        const selectable = !disabled && (!linear || index <= currentActiveStep);

        const handleClick = () => {
          if (!selectable || index === currentActiveStep) {
            return;
          }

          if (!isControlled) {
            setUncontrolledActiveStep(index);
          }

          onStepChange?.(index);
        };

        const content = (
          <>
            <span
              className="puzzle-stepper__indicator"
              data-has-icon={icon != null ? "true" : "false"}
              aria-hidden="true"
            >
              {icon ??
                (state === "completed" || state === "error" ? null : index + 1)}
            </span>

            <span className="puzzle-stepper__label">
              <span className="puzzle-stepper__label-text">{label}</span>

              {description != null && (
                <span className="puzzle-stepper__description">
                  {description}
                </span>
              )}

              {optional != null && (
                <span className="puzzle-stepper__optional">{optional}</span>
              )}
            </span>
          </>
        );

        return (
          <li
            key={id ?? step.key ?? index}
            className={cn("puzzle-stepper__item", stepClassName)}
            data-state={state}
            data-disabled={
              disabled || (clickable && !selectable) ? "true" : undefined
            }
            aria-current={index === currentActiveStep ? "step" : undefined}
          >
            {clickable ? (
              <button
                type="button"
                className="puzzle-stepper__step"
                disabled={!selectable}
                onClick={handleClick}
              >
                {content}
              </button>
            ) : (
              <div className="puzzle-stepper__step">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
});

export { Stepper };
