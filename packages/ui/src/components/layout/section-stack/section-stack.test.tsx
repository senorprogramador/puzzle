import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Section } from "../section";
import { SectionStack } from "./index";

afterEach(() => {
  cleanup();
});

const Other = (props: Record<string, unknown>) => (
  <div data-testid="other" data-props={Object.keys(props).join(",")} />
);

describe("SectionStack", () => {
  it("only enhances Section children", () => {
    render(
      <SectionStack divideY>
        <Section>One</Section>
        <Other />
        <Section>Two</Section>
      </SectionStack>,
    );

    expect(screen.getByTestId("other").dataset.props).toBe("");
  });

  it("compacts the shared edge between sections with the same theme", () => {
    const { container } = render(
      <SectionStack>
        <Section>One</Section>
        <Section>Two</Section>
      </SectionStack>,
    );

    const [first, second] = Array.from(container.querySelectorAll("section"));

    expect(first).toHaveClass("puzzle-section--compact-bottom");
    expect(first).not.toHaveClass("puzzle-section--compact-top");
    expect(second).toHaveClass("puzzle-section--compact-top");
    expect(second).not.toHaveClass("puzzle-section--compact-bottom");
  });

  it("keeps full spacing between sections with different themes", () => {
    const { container } = render(
      <SectionStack>
        <Section theme="default">One</Section>
        <Section theme="dark">Two</Section>
      </SectionStack>,
    );

    expect(container.querySelector(".puzzle-section--compact-top")).toBeNull();
    expect(
      container.querySelector(".puzzle-section--compact-bottom"),
    ).toBeNull();
  });

  it("does not compact sections that are separated by another component", () => {
    const { container } = render(
      <SectionStack>
        <Section>One</Section>
        <Other />
        <Section>Two</Section>
      </SectionStack>,
    );

    expect(container.querySelector(".puzzle-section--compact-top")).toBeNull();
    expect(
      container.querySelector(".puzzle-section--compact-bottom"),
    ).toBeNull();
  });

  it("adds dividers between sections but not after the last one", () => {
    const { container } = render(
      <SectionStack divideY>
        <Section>One</Section>
        <Section>Two</Section>
        <Section>Three</Section>
      </SectionStack>,
    );

    expect(container.querySelectorAll("hr")).toHaveLength(2);
  });

  it("merges a custom className", () => {
    const { container } = render(
      <SectionStack className="custom">
        <Section>One</Section>
      </SectionStack>,
    );

    expect(container.firstElementChild).toHaveClass(
      "puzzle-section-stack",
      "custom",
    );
  });
});
