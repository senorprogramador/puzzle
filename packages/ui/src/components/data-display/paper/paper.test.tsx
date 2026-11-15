import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Paper } from "./index";

describe("Paper", () => {
  it("renders a div with the default elevation and children", () => {
    render(<Paper>Content</Paper>);

    expect(screen.getByText("Content")).toHaveClass(
      "puzzle-paper",
      "elevation-1",
    );
    expect(screen.getByText("Content").tagName).toBe("DIV");
  });

  it("supports a custom element, elevation, class, and native props", () => {
    render(
      <Paper
        as="section"
        elevation={4}
        className="custom"
        aria-label="Summary"
      >
        Content
      </Paper>,
    );

    const paper = screen.getByRole("region", { name: "Summary" });
    expect(paper.tagName).toBe("SECTION");
    expect(paper).toHaveClass("puzzle-paper", "elevation-4", "custom");
  });
});
