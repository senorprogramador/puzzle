import { render, screen } from "@testing-library/react";
import type { CSSProperties } from "react";
import { describe, expect, it } from "vitest";

import { FooterSection } from "./footer-section";

describe("FooterSection layout (browser)", () => {
  it("uses the theme background across the available width and constrains its content", () => {
    const style: CSSProperties & Record<`--${string}`, string> = {
      width: 1200,
      "--puzzle-container-width": "800px",
      "--puzzle-space-4": "16px",
      "--puzzle-color-background": "#123456",
    };
    const { container } = render(
      <div style={style}>
        <FooterSection
          logo={<span>Brand</span>}
          navigationGroups={[
            { id: "documentation", label: "Documentation", links: [] },
          ]}
        />
      </div>,
    );
    const footer = screen.getByRole("contentinfo");
    const heading = screen.getByRole("heading", {
      name: "Documentation",
      level: 2,
    });
    const content = container.querySelector(
      ".puzzle-footer-section__content",
    )!;
    const footerBounds = footer.getBoundingClientRect();
    const contentBounds = content.getBoundingClientRect();

    expect(footerBounds.width).toBe(1200);
    expect(getComputedStyle(footer).backgroundColor).toBe("rgb(18, 52, 86)");
    expect(contentBounds.width).toBe(800);
    expect(contentBounds.left - footerBounds.left).toBe(200);
    expect(heading).toHaveClass("puzzle-typography-headline3");
    expect(getComputedStyle(heading).whiteSpace).toBe("normal");
    expect(getComputedStyle(heading).overflowWrap).toBe("anywhere");
  });
});
