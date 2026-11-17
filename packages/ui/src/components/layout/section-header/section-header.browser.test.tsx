import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Theme } from "@puzzle-ui/theme";
import { Section } from "../section";
import { SectionHeader } from "./index";

describe("SectionHeader browser behavior", () => {
  it("inherits section theme colors and theme spacing", () => {
    render(
      <Theme
        theme="light"
        tokens={{
          colorSchemes: {
            light: {
              primary: "#123456",
              primaryForeground: "#ffffff",
            },
          },
          spacing: { 3: "1.25rem" },
        }}
      >
        <Section theme="primary">
          <SectionHeader
            description="Theme-aware description."
            title="Theme-aware heading"
          />
        </Section>
      </Theme>,
    );

    const heading = screen.getByRole("heading", {
      name: "Theme-aware heading",
    });
    const header = heading.closest("header");

    expect(getComputedStyle(heading).color).toBe("rgb(255, 255, 255)");
    expect(header).not.toBeNull();
    expect(getComputedStyle(header!).gap).toBe("20px");
  });

  it("uses responsive wrapping and alignment for action groups", () => {
    render(
      <SectionHeader
        actions={
          <>
            <button type="button">Primary action</button>
            <button type="button">Secondary action</button>
          </>
        }
        alignment="center"
        title="Responsive actions"
      />,
    );

    const header = screen.getByRole("banner");
    const actions = header.querySelector(".puzzle-section-header__actions");

    expect(getComputedStyle(header).alignItems).toBe("center");
    expect(actions).not.toBeNull();
    expect(getComputedStyle(actions!).flexWrap).toBe("wrap");
    expect(getComputedStyle(actions!).justifyContent).toBe("center");
  });
});
