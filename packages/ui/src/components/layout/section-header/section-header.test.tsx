import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./index";

describe("SectionHeader", () => {
  it("renders only the supplied semantic content slots", () => {
    render(
      <SectionHeader
        actions={<button type="button">Explore features</button>}
        aria-label="Feature introduction"
        description="A concise explanation."
        eyebrow="Product"
        title="Built for focused teams."
        titleAs="h3"
        titleId="feature-heading"
        titleLevel="headline3"
      />,
    );

    expect(screen.getByRole("banner", { name: "Feature introduction" })).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Built for focused teams.",
      }),
    ).toHaveAttribute("id", "feature-heading");
    expect(screen.getByText("A concise explanation.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explore features" })).toBeInTheDocument();
  });

  it("supports zero as visible content and omits the header when all slots are empty", () => {
    const { container, rerender } = render(<SectionHeader title={0} />);

    expect(screen.getByRole("heading")).toHaveTextContent("0");

    rerender(
      <SectionHeader
        actions={[]}
        description={null}
        eyebrow={false}
        title={null}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("forwards header attributes and applies alignment and custom styles", () => {
    render(
      <SectionHeader
        alignment="end"
        className="custom-header"
        data-testid="section-heading"
        id="intro"
        style={{ marginTop: "1rem" }}
        title="Introduction"
      />,
    );

    const header = screen.getByTestId("section-heading");
    expect(header).toHaveAttribute("id", "intro");
    expect(header).toHaveAttribute("data-alignment", "end");
    expect(header).toHaveClass("puzzle-section-header", "custom-header");
    expect(header).toHaveStyle({ marginTop: "1rem" });
  });

  it("renders server-side without browser APIs", () => {
    const markup = renderToStaticMarkup(
      <SectionHeader title="Server-rendered section" />,
    );

    expect(markup).toContain("<header");
    expect(markup).toContain("<h2");
    expect(markup).toContain("Server-rendered section");
  });
});
