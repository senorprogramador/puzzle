import type { ReactNode } from "react";

export type OnboardingSectionVariant =
  | "steps"
  | "checklist"
  | "progress"
  | "wizard"
  | "cards"
  | "split"
  | "welcome"
  | "centered"
  | "horizontal"
  | "vertical"
  | "compact";

export type OnboardingStep = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  completed?: boolean;
  disabled?: boolean;
  media?: ReactNode;
  action?: ReactNode;
};

export type OnboardingSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  steps: readonly OnboardingStep[];
  currentStep?: string;
  onStepChange?: (stepId: string) => void;
  variant?: OnboardingSectionVariant;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};
