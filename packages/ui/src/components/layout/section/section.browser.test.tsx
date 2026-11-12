import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CSSProperties } from "react";
import { Section } from "./index";
import { SectionStack } from "../section-stack";
import { Theme } from "@puzzle-ui/theme";

describe("Section scoped colors (browser)", () => {
  for (const rootTheme of ["light", "dark"] as const) {
    it(`follows local colors independently of a ${rootTheme} root and enclosing section`, () => {
      const renderSection = (theme: "light" | "dark") => (
        <Theme theme={rootTheme}>
          <Section theme="primary">
            <Theme
              scope="local"
              theme={theme}
              tokens={{
                colorSchemes: {
                  light: { background: "#ffffff", text: "#123456", border: "#aabbcc" },
                  dark: { background: "#112233", text: "#eeeeee", border: "#445566" },
                },
              }}
            >
              <Section theme="default" divider>Scoped content</Section>
              <Section>Implicit default</Section>
            </Theme>
          </Section>
        </Theme>
      );
      const { rerender } = render(renderSection("light"));

      for (const theme of ["light", "dark", "light"] as const) {
        rerender(renderSection(theme));
        const section = screen.getByText("Scoped content");
        const implicit = screen.getByText("Implicit default");
        const style = getComputedStyle(section);

        expect(style.backgroundColor).toBe(
          theme === "light" ? "rgb(255, 255, 255)" : "rgb(17, 34, 51)",
        );
        expect(style.color).toBe(
          theme === "light" ? "rgb(18, 52, 86)" : "rgb(238, 238, 238)",
        );
        expect(getComputedStyle(implicit).backgroundColor).toBe(style.backgroundColor);
        expect(getComputedStyle(implicit).color).toBe(style.color);
        expect(getComputedStyle(section.querySelector("hr")!).borderTopColor).toBe(
          theme === "light" ? "rgb(170, 187, 204)" : "rgb(68, 85, 102)",
        );
      }
    });
  }
});

describe("Section width (browser)", () => {
  for (const width of [320, 1200]) {
    it(`constrains default sections and leaves fullWidth sections unconstrained in a ${width}px parent`, () => {
      const style: CSSProperties & Record<`--${string}`, string> = {
        width,
        "--puzzle-container-width": "800px",
        "--puzzle-container-gutter": "16px",
      };
      render(
        <div style={style}>
          <Section className="default-section">Default</Section>
          <Section fullWidth className="full-section">Full width</Section>
        </div>,
      );

      const section = screen.getByText("Default");
      const full = screen.getByText("Full width");
      const bounds = section.getBoundingClientRect();
      const fullBounds = full.getBoundingClientRect();

      expect(section).toHaveClass("puzzle-section", "puzzle-container", "puzzle-container--container");
      expect(bounds.width).toBe(Math.min(width, 800));
      expect(bounds.left - fullBounds.left).toBe((width - Math.min(width, 800)) / 2);
      expect(getComputedStyle(section).paddingLeft).toBe("16px");
      expect(full).not.toHaveClass("puzzle-container");
      expect(full).not.toHaveClass("puzzle-container--container");
      expect(fullBounds.width).toBe(width);
      expect(getComputedStyle(full).paddingLeft).toBe("0px");
    });
  }

  for (const theme of ["light", "dark", "primary", "secondary", "accent"] as const) {
    it(`fills the background and constrains ${theme} content without changing spacing`, () => {
      const style: CSSProperties & Record<`--${string}`, string> = {
        width: 1200,
        "--puzzle-container-width": "800px",
        "--puzzle-container-gutter": "16px",
        "--puzzle-space-4": "12px",
        "--puzzle-color-surface": "#123456",
        "--puzzle-color-surface-sunken": "#123456",
        "--puzzle-color-primary": "#123456",
        "--puzzle-color-secondary": "#123456",
        "--puzzle-color-accent": "#123456",
      };
      const { container } = render(
        <div style={style}>
          <SectionStack divideY>
            <Section theme={theme}>
              <span>First</span>
              <span>Second</span>
            </Section>
            <Section theme={theme} fullWidth noPadding>Full themed</Section>
          </SectionStack>
        </div>,
      );
      const section = container.querySelector(".puzzle-section")!;
      const content = screen.getByText("First").parentElement!;
      const full = screen.getByText("Full themed");
      const bounds = section.getBoundingClientRect();
      const contentBounds = content.getBoundingClientRect();

      expect(section).not.toHaveClass("puzzle-container");
      expect(bounds.width).toBe(1200);
      expect(getComputedStyle(section).backgroundColor).toBe("rgb(18, 52, 86)");
      expect(content).toHaveClass("puzzle-section__content", "puzzle-container");
      expect(contentBounds.width).toBe(800);
      expect(contentBounds.left - bounds.left).toBe(200);
      expect(getComputedStyle(content).paddingLeft).toBe("16px");
      expect(getComputedStyle(content).gap).toBe("12px");
      expect(content.querySelector(".puzzle-section--divider")).not.toBeNull();
      expect(getComputedStyle(section).paddingTop).toBe("16px");
      expect(getComputedStyle(section).paddingBottom).toBe("8px");
      expect(full.getBoundingClientRect().width).toBe(1200);
      expect(full.querySelector(".puzzle-container")).toBeNull();
      expect(getComputedStyle(full).paddingTop).toBe("0px");
      expect(getComputedStyle(full).paddingBottom).toBe("0px");
    });
  }
});
