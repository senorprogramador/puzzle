import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorksSection } from "./how-it-works";
import type {
  HowItWorksItem,
  HowItWorksVariant,
} from "./how-it-works.types";

const variants: HowItWorksVariant[] = [
  "steps",
  "numbered",
  "timeline",
  "cards",
  "alternating",
  "horizontal",
  "vertical",
  "connected",
  "image-steps",
  "video-steps",
  "process",
  "split",
  "carousel",
  "editorial",
];
const numberedVariants: HowItWorksVariant[] = [
  "numbered",
  "timeline",
  "connected",
  "process",
];
const steps: HowItWorksItem[] = [
  {
    id: "create",
    title: "Create an account",
    description: "Set up your workspace.",
    media: <img src="/setup.jpg" alt="Workspace setup" />,
  },
];

describe("HowItWorksSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <HowItWorksSection variant={variant} steps={steps} />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Create an account")).toBeVisible();
  });

  it.each(variants)(
    "shows numbers only when the %s variant calls for them",
    (variant) => {
      const { container } = render(
        <HowItWorksSection variant={variant} steps={steps} />,
      );

      expect(
        container.querySelectorAll(".puzzle-how-it-works__number"),
      ).toHaveLength(numberedVariants.includes(variant) ? 1 : 0);
    },
  );

  it("omits an empty step list", () => {
    const { container } = render(<HowItWorksSection steps={[]} />);
    expect(container.querySelector(".puzzle-how-it-works__list")).toBeNull();
  });
});
