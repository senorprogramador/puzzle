import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { AnnouncementSection } from "./announcement";

afterEach(() => {
  cleanup();
});

describe("AnnouncementSection browser behavior", () => {
  it("moves focus to the next remaining dismiss control", async () => {
    const user = userEvent.setup();
    render(
      <AnnouncementSection
        variant="multi-message"
        dismissible
        announcements={[
          { id: "first", message: "First update" },
          { id: "second", message: "Second update" },
        ]}
      />,
    );

    await user.tab();
    expect(
      screen.getAllByRole("button", { name: "Dismiss announcement" })[0],
    ).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(screen.queryByText("First update")).toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Dismiss announcement" })[0],
    ).toHaveFocus();
  });

  it("keeps the ticker scrollable, keyboard reachable, and within the viewport", async () => {
    await page.viewport(320, 800);
    const user = userEvent.setup();
    render(
      <AnnouncementSection
        variant="ticker"
        aria-label="Latest updates"
        message={"Shipping update — ".repeat(20)}
      />,
    );

    const ticker = screen.getByRole("group", { name: "Latest updates" });
    const section = ticker.closest(".puzzle-announcement")!;
    expect(ticker).toHaveAttribute("tabindex", "0");
    expect(ticker.scrollWidth).toBeGreaterThan(ticker.clientWidth);
    expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);

    await user.tab();
    expect(ticker).toHaveFocus();
    expect(getComputedStyle(ticker).outlineStyle).toBe("solid");
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  });
});
