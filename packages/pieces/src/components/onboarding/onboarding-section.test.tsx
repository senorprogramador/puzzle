import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OnboardingSection } from "./onboarding-section";

const steps = [
  {
    id: "workspace",
    title: "Create a workspace",
    description: "Choose a name for your team.",
    completed: true,
  },
  {
    id: "invite",
    title: "Invite your team",
    description: "Bring your collaborators in.",
  },
  {
    id: "connect",
    title: "Connect a project",
    description: "Start with one shared goal.",
    disabled: true,
  },
];

describe("OnboardingSection", () => {
  it("announces progress and completion and identifies the current step", () => {
    const { rerender } = render(
      <OnboardingSection
        title="Get started"
        description="A few quick steps."
        steps={steps}
        currentStep="invite"
      />,
    );

    expect(screen.getByRole("region", { name: "Get started" })).toHaveAttribute(
      "data-complete",
      "false",
    );
    expect(screen.getByRole("progressbar", { name: "Onboarding progress" })).toHaveAttribute(
      "aria-valuenow",
      "33",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 of 3 steps complete",
    );
    expect(screen.getByText("Invite your team").closest("li")).toHaveAttribute(
      "data-current",
      "true",
    );

    rerender(
      <OnboardingSection
        title="Get started"
        steps={steps.map((step) => ({ ...step, completed: true }))}
      />,
    );
    expect(screen.getByRole("region", { name: "Get started" })).toHaveAttribute(
      "data-complete",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "All onboarding steps complete.",
    );
    expect(
      screen.queryByText("Create a workspace")?.closest('[aria-current="step"]'),
    ).toBeNull();
  });

  it("supports roving keyboard focus and skips disabled steps", () => {
    const onStepChange = vi.fn();
    render(
      <OnboardingSection
        title="Setup"
        steps={steps}
        currentStep="workspace"
        onStepChange={onStepChange}
      />,
    );

    const currentStep = screen.getByRole("button", {
      name: /Create a workspace/,
    });
    const nextStep = screen.getByRole("button", { name: /Invite your team/ });

    expect(currentStep).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: /Connect a project/ })).toBeDisabled();
    fireEvent.keyDown(currentStep, { key: "ArrowDown" });
    expect(nextStep).toHaveFocus();
    expect(onStepChange).toHaveBeenCalledWith("invite");
  });

  it("keeps per-step action controls outside the step-selection button", () => {
    render(
      <OnboardingSection
        title="Review setup"
        steps={[
          {
            id: "review",
            title: "Review your workspace",
            action: <button type="button">Open details</button>,
          },
        ]}
        onStepChange={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Open details" }).closest(
        ".puzzle-onboarding-section__step-button",
      ),
    ).toBeNull();
  });

  it("renders a useful empty state and supports a wizard step", () => {
    const { rerender } = render(
      <OnboardingSection title="Empty setup" steps={[]} />,
    );
    expect(screen.getByText("No onboarding steps.")).toBeVisible();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    rerender(
      <OnboardingSection
        title="Guided setup"
        variant="wizard"
        steps={[
          {
            id: "invite",
            title: "Invite your team",
            description: "Bring your collaborators in.",
            media: <span>Workspace illustration</span>,
          },
        ]}
        currentStep="invite"
      />,
    );
    expect(screen.getByText("Workspace illustration")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Invite your team", level: 3 })).toBeVisible();
  });
});
