import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CTASection } from "./cta";
import type { CTAVariant } from "./cta.types";

const variants: CTAVariant[] = [
  "centered",
  "split",
  "banner",
  "card",
  "full-width",
  "image",
  "background",
  "gradient",
  "newsletter",
  "trial",
  "download",
  "contact",
  "app",
  "minimal",
  "editorial",
  "floating",
];

describe("CTASection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <CTASection
        variant={variant}
        title="Start a project"
        description="Build something useful."
        primaryAction={<button type="button">Get started</button>}
        secondaryAction={<a href="/learn">Learn more</a>}
      />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Start a project" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Get started" })).toBeVisible();
  });

  it("does not render an empty body", () => {
    const { container } = render(<CTASection />);
    expect(container.querySelector(".puzzle-cta__body")).toBeNull();
  });
});
