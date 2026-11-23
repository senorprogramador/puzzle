import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { Tabs } from "./index";

afterEach(() => {
  cleanup();
});

describe("Tabs (browser)", () => {
  it("automatically activates tabs during keyboard navigation", async () => {
    render(
      <Tabs aria-label="Workspace sections">
        <Tabs.Tab id="overview" tab="Overview">
          Overview content
        </Tabs.Tab>
        <Tabs.Tab id="settings" tab="Settings">
          Settings content
        </Tabs.Tab>
      </Tabs>,
    );

    expect(
      screen.getByRole("tablist", { name: "Workspace sections" }),
    ).toBeInTheDocument();

    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });

    await userEvent.tab();

    expect(overview).toHaveFocus();
    expect(overview.matches(":focus-visible")).toBe(true);

    await userEvent.keyboard("{ArrowRight}");

    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Settings content");
  });
});
