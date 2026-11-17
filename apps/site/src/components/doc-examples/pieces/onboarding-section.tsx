import { useState } from "react";
import {
  OnboardingSection,
  type OnboardingSectionVariant,
  type OnboardingStep,
} from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const onboardingVariants: SectionVariantPreview<OnboardingSectionVariant>[] = [
  { variant: "steps", useCase: "Present a straightforward sequence." },
  { variant: "checklist", useCase: "Show completion state beside each task." },
  { variant: "progress", useCase: "Emphasize overall completion." },
  { variant: "wizard", useCase: "Focus the current step and its content." },
  { variant: "cards", useCase: "Give each step a distinct surface." },
  { variant: "split", useCase: "Pair the step list with current-step details." },
  { variant: "welcome", useCase: "Introduce first-run setup." },
  { variant: "centered", useCase: "Center a short guided flow." },
  { variant: "horizontal", useCase: "Scroll through a compact horizontal step rail." },
  { variant: "vertical", useCase: "Keep longer step descriptions in a vertical list." },
  { variant: "compact", useCase: "Use a denser setup checklist." },
];

const previewSteps: OnboardingStep[] = [
  {
    id: "workspace",
    title: "Set up your workspace",
    description: "Choose a name and a home for the work.",
    completed: true,
  },
  {
    id: "invite",
    title: "Invite your team",
    description: "Bring the right people into the project.",
  },
  {
    id: "plan",
    title: "Create a first plan",
    description: "Turn a goal into a few practical steps.",
  },
];

export const OnboardingSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="OnboardingSection"
    variants={onboardingVariants}
    buildCode={(variant) =>
      `<OnboardingSection variant="${variant}" steps={steps} currentStep="invite" />`
    }
    renderVariant={(variant) => (
      <OnboardingSection
        title="Get Northstar ready"
        description="Three small steps to get your team moving."
        variant={variant}
        steps={previewSteps}
        currentStep="invite"
      />
    )}
  />
);

const initialSteps = [
  {
    id: "workspace",
    title: "Set up your workspace",
    description: "Choose a name and a home for your team's work.",
  },
  {
    id: "invite",
    title: "Invite your teammates",
    description: "Bring the people who will shape the project with you.",
  },
  {
    id: "plan",
    title: "Create your first plan",
    description: "Turn a shared goal into a few practical next steps.",
  },
  {
    id: "connect",
    title: "Connect a data source",
    description: "Available after your first plan is ready.",
    disabled: true,
  },
];

export const OnboardingInteractiveExample = () => {
  const [currentStep, setCurrentStep] = useState("workspace");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const steps = initialSteps.map((step) => ({
    ...step,
    completed: completedIds.includes(step.id),
  }));
  const activeIndex = steps.findIndex((step) => step.id === currentStep);
  const activeStep = steps[activeIndex];

  const completeCurrentStep = () => {
    if (!activeStep) {
      return;
    }

    setCompletedIds((current) =>
      current.includes(activeStep.id) ? current : [...current, activeStep.id],
    );
    const nextStep = steps
      .slice(activeIndex + 1)
      .find((step) => !step.disabled);
    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  };

  return (
    <OnboardingSection
      title="Make Northstar yours"
      description="Your progress is local to this example; your application owns persistence."
      variant="wizard"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      actions={
        <Button
          onClick={completeCurrentStep}
          disabled={!activeStep || completedIds.includes(activeStep.id)}
        >
          Mark current step complete
        </Button>
      }
    >
      <p>Choose the next small step that will help your team get moving.</p>
    </OnboardingSection>
  );
};
