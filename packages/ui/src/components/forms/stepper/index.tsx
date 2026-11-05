"use client";

import {
  cn,
  resolveResponsiveValue,
  type ResponsiveValue,
} from "@puzzle/core";
import { useRovingFocus } from "@puzzle/hooks";
import {
  Children,
  isValidElement,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import "./stepper.css";

type StepperOrientation = "horizontal" | "vertical";

type StepperStepProps = {
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

type StepperProps = Omit<ComponentPropsWithoutRef<"ol">, "children"> & {
  /** Active step index. Values are clamped to available steps. Defaults to 0. */
  activeStep?: number;

  /** Active step ID. Enables controlled ID-based selection. */
  activeStepId?: string | number;

  /** Initial active step for uncontrolled usage. Defaults to 0. */
  defaultActiveStep?: number;

  /** Initial active step ID for uncontrolled ID-based selection. */
  defaultActiveStepId?: string | number;

  /** Called when the active step changes. */
  onStepChange?: (step: number) => void;

  /** Called when an ID-based active step changes. */
  onStepIdChange?: (stepId: string | number) => void;

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
  activeStepId,
  defaultActiveStep = 0,
  defaultActiveStepId,
  onStepChange,
  onStepIdChange,
  orientation = "horizontal",
  clickable = false,
  linear = true,
  children,
  className,
  ...rootProps
}: StepperProps) => {
  const [uncontrolledActiveStep, setUncontrolledActiveStep] =
    useState(defaultActiveStep);
  const [uncontrolledActiveStepId, setUncontrolledActiveStepId] =
    useState(defaultActiveStepId);

  const orientations = resolveResponsiveValue(orientation);
  const steps = Children.toArray(children).filter(isStepperStep);
  const isIdSelection =
    activeStepId !== undefined || defaultActiveStepId !== undefined;
  const requestedActiveStepId = activeStepId ?? uncontrolledActiveStepId;

  if (isIdSelection) {
    const stepIds = new Set<string>();

    for (const step of steps) {
      const id = step.props.id;

      if (id === undefined) {
        throw new Error(
          "Stepper ID-based selection requires an id on every step.",
        );
      }

      const key = `${typeof id}:${id}`;

      if (stepIds.has(key)) {
        throw new Error("Stepper step IDs must be unique.");
      }

      stepIds.add(key);
    }
  }

  const requestedActiveStep = activeStep ?? uncontrolledActiveStep;
  const requestedActiveStepIndex = isIdSelection
    ? steps.findIndex((step) => step.props.id === requestedActiveStepId)
    : undefined;

  if (
    isIdSelection &&
    steps.length > 0 &&
    requestedActiveStepIndex === -1
  ) {
    throw new Error("Stepper activeStepId must match an available step ID.");
  }

  const currentActiveStep = isIdSelection
    ? (requestedActiveStepIndex ?? -1)
    : steps.length === 0
      ? -1
      : Number.isFinite(requestedActiveStep)
        ? Math.min(
            steps.length - 1,
            Math.max(0, Math.trunc(requestedActiveStep)),
          )
        : 0;
  const direction = rootProps.dir === "rtl" ? "rtl" : "ltr";

  const focusItems = steps.map((step, index) => {
    const selectable =
      clickable &&
      !step.props.disabled &&
      (!linear || index <= currentActiveStep);

    return {
      id:
        step.props.id === undefined
          ? `index:${index}`
          : `${typeof step.props.id}:${step.props.id}`,
      disabled: !selectable,
    };
  });

  const activeFocusId =
    currentActiveStep >= 0
      ? focusItems[currentActiveStep]?.id
      : undefined;
  const rovingFocus = useRovingFocus<HTMLButtonElement>({
    items: focusItems,
    orientation: "both",
    dir: direction,
    initialActiveId: activeFocusId,
  });

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
        const focusId =
          id === undefined ? `index:${index}` : `${typeof id}:${id}`;

        const handleClick = () => {
          if (!selectable || index === currentActiveStep) {
            return;
          }

          if (isIdSelection) {
            if (activeStepId === undefined) {
              setUncontrolledActiveStepId(id);
            }
          } else if (activeStep === undefined) {
            setUncontrolledActiveStep(index);
          }

          onStepChange?.(index);
          if (isIdSelection && id !== undefined) {
            onStepIdChange?.(id);
          }
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
            key={
              id === undefined ? (step.key ?? index) : `${typeof id}:${id}`
            }
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
                ref={rovingFocus.getItemRef(focusId)}
                tabIndex={rovingFocus.getItemTabIndex(focusId, !selectable)}
                onFocus={() => rovingFocus.onItemFocus(focusId)}
                onKeyDown={(event) =>
                  rovingFocus.onItemKeyDown(event, focusId)
                }
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

export {
  Stepper,
  type StepperProps,
  type StepperStepProps,
  type StepperOrientation,
};
