import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

describe("Heading alignment", () => {
  for (const textAlign of ["left", "center", "right", "justify", "start", "end"] as const) {
    it(`supports ${textAlign} alignment without forwarding the prop`, () => {
      render(
        <Heading as="h1" level="headline1" textAlign={textAlign}>
          Title
        </Heading>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveStyle({ textAlign });
      expect(heading).not.toHaveAttribute("textAlign");
      expect(heading).toHaveClass("puzzle-heading", "puzzle-typography-headline1");
    });
  }

  it("preserves styles and lets the explicit alignment prop take precedence", () => {
    render(
      <Heading level="headline2" textAlign="center" style={{ textAlign: "right", fontWeight: 600 }}>
        Title
      </Heading>,
    );
    expect(screen.getByRole("heading")).toHaveStyle({
      textAlign: "center",
      fontWeight: 600,
    });
  });

  it("preserves style alignment when the prop is omitted", () => {
    render(<Heading level="headline2" style={{ textAlign: "end" }}>Title</Heading>);
    expect(screen.getByRole("heading")).toHaveStyle({ textAlign: "end" });
  });

  it("does not set alignment when neither prop nor style supplies it", () => {
    render(<Heading level="headline2">Title</Heading>);
    expect(screen.getByRole("heading").style.textAlign).toBe("");
  });
});
