import { useState } from "react";
import { OnboardingSection } from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";

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
