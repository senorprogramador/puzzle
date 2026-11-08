import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Theme } from "@puzzle-ui/theme";
import { CollapsableSidebar, type CollapsableSidebarExpansion } from "./index";

afterEach(cleanup);

const items = [
  { id: "home", icon: <span>H</span>, label: "Home", href: "#home" },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "projects",
        icon: <span>P</span>,
        label: "Projects with a long descriptive navigation label",
        href: "#projects",
      },
    ],
  },
];

describe("CollapsableSidebar (browser)", () => {
  for (const width of [1280, 375]) {
    for (const expand of [
      "inline",
      "over",
    ] satisfies CollapsableSidebarExpansion[]) {
      it(`expands vertical navigation in ${expand} mode at ${width}px`, async () => {
        await page.viewport(width, 800);
        render(
          <Theme>
            <div style={{ display: "flex" }}>
              <CollapsableSidebar items={items} expand={expand} />
              <main>Adjacent content</main>
            </div>
          </Theme>,
        );

        const navigation = screen.getByRole("navigation");
        const sidebar = navigation.parentElement!;
        const toggle = screen.getByRole("button", { name: "Expand sidebar" });
        const collapsedWidth = sidebar.getBoundingClientRect().width;
        const expectedCollapsedWidth =
          parseFloat(
            getComputedStyle(sidebar).getPropertyValue(
              "--puzzle-sidebar-collapsed-width",
            ),
          ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const adjacentLeft = screen
          .getByRole("main")
          .getBoundingClientRect().left;
        expect(collapsedWidth).toBeCloseTo(expectedCollapsedWidth, 0);
        expect(toggle).toBeVisible();
        expect(navigation).toBeVisible();
        expect(screen.getAllByRole("navigation")).toHaveLength(1);

        fireEvent.click(toggle);
        await expect
          .poll(() => navigation.getBoundingClientRect().width)
          .toBeCloseTo(expand === "inline" ? 319 : 320, 0);
        expect(toggle).toHaveAttribute("aria-expanded", "true");
        expect(toggle).toHaveAttribute("aria-controls", navigation.id);

        const home = screen.getByRole("link", { name: "Home" });
        const projects = screen.getByRole("link", { name: /Projects with/ });
        expect(projects.getBoundingClientRect().top).toBeGreaterThan(
          home.getBoundingClientRect().bottom,
        );
        expect(projects.scrollWidth).toBeLessThanOrEqual(projects.clientWidth);
        expect(navigation.scrollWidth).toBeLessThanOrEqual(
          navigation.clientWidth,
        );
        expect(navigation.getBoundingClientRect().top).toBeGreaterThanOrEqual(
          toggle.getBoundingClientRect().bottom,
        );

        if (expand === "over") {
          expect(sidebar.getBoundingClientRect().width).toBeCloseTo(
            collapsedWidth,
            0,
          );
          expect(
            screen.getByRole("main").getBoundingClientRect().left,
          ).toBeCloseTo(adjacentLeft, 0);
        } else {
          expect(sidebar.getBoundingClientRect().width).toBeCloseTo(320, 0);
        }

        fireEvent.click(toggle);
        await expect
          .poll(() => navigation.getBoundingClientRect().width)
          .toBeLessThanOrEqual(expectedCollapsedWidth);
        expect(toggle).toHaveAttribute("aria-expanded", "false");
      });
    }
  }

  it("preserves controlled expansion", () => {
    const { rerender } = render(<CollapsableSidebar items={items} collapsed />);
    const toggle = screen.getByRole("button", { name: "Expand sidebar" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    rerender(<CollapsableSidebar items={items} collapsed={false} />);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
