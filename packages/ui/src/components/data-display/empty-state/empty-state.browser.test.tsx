import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { Theme } from "@puzzle-ui/theme";

import {
  EmptyState,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateContent,
} from "./index";

afterEach(cleanup);

describe("EmptyState (browser)", () => {
  it("renders a centered layout at desktop and mobile widths", async () => {
    for (const width of [1280, 375]) {
      await page.viewport(width, 800);

      render(
        <Theme>
          <EmptyState data-testid="empty">
            <EmptyStateMedia variant="icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
              </svg>
            </EmptyStateMedia>
            <EmptyStateTitle>No projects</EmptyStateTitle>
            <EmptyStateDescription>
              Create your first project.
            </EmptyStateDescription>
          </EmptyState>
        </Theme>,
      );

      const empty = screen.getByTestId("empty");
      const style = getComputedStyle(empty);

      expect(style.display).toBe("flex");
      expect(style.flexDirection).toBe("column");
      expect(style.alignItems).toBe("center");

      expect(empty.getBoundingClientRect().width).toBeGreaterThan(0);

      cleanup();
    }
  });

  it("keeps actions keyboard accessible", async () => {
    await page.viewport(1280, 800);

    render(
      <Theme>
        <EmptyState>
          <EmptyStateTitle>No projects</EmptyStateTitle>
          <EmptyStateContent>
            <button type="button">Create project</button>
            <a href="/projects">View projects</a>
          </EmptyStateContent>
        </EmptyState>
      </Theme>,
    );

    const button = screen.getByRole("button", {
      name: "Create project",
    });
    const link = screen.getByRole("link", {
      name: "View projects",
    });

    button.focus();

    expect(document.activeElement).toBe(button);

    await userEvent.keyboard("{Tab}");

    expect(document.activeElement).toBe(link);
  });

  it("does not overflow its container on narrow screens", async () => {
    await page.viewport(320, 700);

    render(
      <Theme>
        <div style={{ width: "100%" }}>
          <EmptyState variant="outlined">
            <EmptyStateTitle>No results found</EmptyStateTitle>
            <EmptyStateDescription>
              Try adjusting your search criteria.
            </EmptyStateDescription>
            <EmptyStateContent>
              <button type="button">Clear filters</button>
            </EmptyStateContent>
          </EmptyState>
        </div>
      </Theme>,
    );

    const empty =
      screen.getByText("No results found").parentElement!.parentElement!;

    expect(empty.scrollWidth).toBeLessThanOrEqual(empty.clientWidth);
  });
});
