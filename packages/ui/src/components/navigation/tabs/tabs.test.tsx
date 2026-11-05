import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs, TabsTab } from "./index";
import type { TabsProps } from "./index";

const renderTabs = (props: Partial<TabsProps> = {}) =>
  render(
    <Tabs {...props}>
      <TabsTab id="overview" tab="Overview">
        Overview content
      </TabsTab>

      <TabsTab id="settings" tab="Settings">
        Settings content
      </TabsTab>

      <TabsTab id="profile" tab="Profile">
        Profile content
      </TabsTab>
    </Tabs>,
  );

describe("Tabs", () => {
  it("renders an accessible tablist with one tab stop", () => {
    renderTabs();

    const tabs = screen.getAllByRole("tab");

    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus and automatically activates tabs with horizontal arrow keys", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    renderTabs({ onActivate });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });

    overview.focus();

    await user.keyboard("{ArrowRight}");

    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute("aria-selected", "true");
    expect(settings).toHaveAttribute("tabindex", "0");

    expect(onActivate).toHaveBeenCalledWith("settings");
  });

  it("moves focus vertically when tabs are positioned on the left", async () => {
    const user = userEvent.setup();

    renderTabs({ tabBarPosition: "left" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );

    overview.focus();

    await user.keyboard("{ArrowDown}");

    expect(settings).toHaveFocus();
    expect(settings).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus vertically when tabs are positioned on the right", async () => {
    const user = userEvent.setup();

    renderTabs({ tabBarPosition: "right" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });

    overview.focus();

    await user.keyboard("{ArrowDown}");

    expect(settings).toHaveFocus();
  });

  it("supports RTL horizontal navigation", async () => {
    const user = userEvent.setup();

    renderTabs({ dir: "rtl" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const profile = screen.getByRole("tab", { name: "Profile" });

    overview.focus();

    await user.keyboard("{ArrowRight}");

    expect(profile).toHaveFocus();
    expect(profile).toHaveAttribute("aria-selected", "true");
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    renderTabs({ initialActiveId: "settings" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const settings = screen.getByRole("tab", { name: "Settings" });
    const profile = screen.getByRole("tab", { name: "Profile" });

    settings.focus();

    await user.keyboard("{Home}");

    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");

    expect(profile).toHaveFocus();
    expect(profile).toHaveAttribute("aria-selected", "true");
  });

  it("wraps focus when reaching the end of the tablist", async () => {
    const user = userEvent.setup();

    renderTabs({ initialActiveId: "profile" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const profile = screen.getByRole("tab", { name: "Profile" });

    profile.focus();

    await user.keyboard("{ArrowRight}");

    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the selected tab as the tab stop when controlled state changes", () => {
    const { rerender } = renderTabs({ activeId: "overview" });

    const overview = screen.getByRole("tab", { name: "Overview" });
    const profile = screen.getByRole("tab", { name: "Profile" });

    expect(overview).toHaveAttribute("tabindex", "0");

    rerender(
      <Tabs activeId="profile">
        <TabsTab id="overview" tab="Overview">
          Overview content
        </TabsTab>

        <TabsTab id="settings" tab="Settings">
          Settings content
        </TabsTab>

        <TabsTab id="profile" tab="Profile">
          Profile content
        </TabsTab>
      </Tabs>,
    );

    expect(overview).toHaveAttribute("tabindex", "-1");
    expect(profile).toHaveAttribute("tabindex", "0");
    expect(profile).toHaveAttribute("aria-selected", "true");
  });

  it("supports clicking tabs", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();

    renderTabs({ onActivate });

    const settings = screen.getByRole("tab", { name: "Settings" });

    await user.click(settings);

    expect(settings).toHaveAttribute("aria-selected", "true");
    expect(settings).toHaveAttribute("tabindex", "0");
    expect(onActivate).toHaveBeenCalledWith("settings");
  });

  it("supports keeping inactive panel content mounted", () => {
    renderTabs({ forceMountContent: true });

    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.getByText("Settings content")).toBeInTheDocument();
    expect(screen.getByText("Profile content")).toBeInTheDocument();
  });
});
