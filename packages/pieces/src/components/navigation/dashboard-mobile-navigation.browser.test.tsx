import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { page } from "vitest/browser";

import { DashboardMobileNavigation } from "./dashboard-mobile-navigation";

it("supports keyboard disclosure and closes on link selection", async () => {
  const onNavigate = vi.fn();
  const { container } = render(
    <DashboardMobileNavigation
      items={[{ id: "overview", label: "Overview", href: "/workspace" }]}
      onNavigate={onNavigate}
    />,
  );
  const disclosure = container.querySelector("details")!;
  const trigger = container.querySelector("summary")!;

  await userEvent.tab();
  expect(trigger).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(disclosure).toHaveAttribute("open");
  await userEvent.keyboard(" ");
  expect(disclosure).not.toHaveAttribute("open");
  await userEvent.keyboard(" ");
  expect(disclosure).toHaveAttribute("open");

  await userEvent.click(screen.getByRole("link", { name: "Overview" }));

  expect(disclosure).not.toHaveAttribute("open");
  expect(onNavigate).toHaveBeenCalledWith("/workspace");
});

it("is displayed only at its mobile breakpoint", async () => {
  const { container } = render(
    <DashboardMobileNavigation
      items={[{ id: "overview", label: "Overview", href: "/workspace" }]}
    />,
  );
  const disclosure = container.querySelector("details")!;

  await page.viewport(375, 800);
  expect(getComputedStyle(disclosure).display).toBe("block");

  await page.viewport(800, 900);
  expect(getComputedStyle(disclosure).display).toBe("none");
});
