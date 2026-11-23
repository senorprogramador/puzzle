import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "./index";

describe("Breadcrumbs (browser)", () => {
  it("wraps a long path without horizontal overflow at narrow widths", () => {
    render(
      <div data-testid="viewport" style={{ width: "240px" }}>
        <Breadcrumbs
          aria-label="Project path"
          items={[
            { label: "Home", href: "/" },
            {
              label: "A particularly long project hierarchy label",
              href: "/projects",
            },
            { label: "Current settings page" },
          ]}
        />
      </div>,
    );

    const viewport = screen.getByTestId("viewport");
    const list = screen
      .getByRole("navigation", { name: "Project path" })
      .querySelector("ol")!;

    expect(list.getBoundingClientRect().width).toBeLessThanOrEqual(
      viewport.getBoundingClientRect().width,
    );
    expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    expect(screen.getByText("Current settings page")).toBeInTheDocument();
  });
});
