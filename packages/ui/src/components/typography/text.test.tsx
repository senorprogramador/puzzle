import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text alignment", () => {
  for (const textAlign of ["left", "center", "right", "justify", "start", "end"] as const) {
    it(`supports ${textAlign} alignment without forwarding the prop`, () => {
      render(<Text as="p" textAlign={textAlign}>Content</Text>);

      const text = screen.getByText("Content");
      expect(text.tagName).toBe("P");
      expect(text).toHaveStyle({ textAlign });
      expect(text).not.toHaveAttribute("textAlign");
    });
  }

  it("preserves styles and lets the explicit alignment prop take precedence", () => {
    render(
      <Text textAlign="center" style={{ textAlign: "right", fontWeight: 600 }}>
        Content
      </Text>,
    );
    expect(screen.getByText("Content")).toHaveStyle({
      textAlign: "center",
      fontWeight: 600,
    });
  });

  it("preserves style alignment when the prop is omitted", () => {
    render(<Text style={{ textAlign: "end" }}>Content</Text>);
    expect(screen.getByText("Content")).toHaveStyle({ textAlign: "end" });
  });

  it("does not set alignment when neither prop nor style supplies it", () => {
    render(<Text>Content</Text>);
    expect(screen.getByText("Content").style.textAlign).toBe("");
  });
});
