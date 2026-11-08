import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DropdownMenu } from "./index";

describe("DropdownMenu browser behavior", () => {
  it("moves real browser focus through menu items and restores it on Escape", async () => {
    const user = userEvent.setup();

    render(
      <>
        <DropdownMenu>
          <DropdownMenu.Trigger>Open actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>First action</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Unavailable action</DropdownMenu.Item>
            <DropdownMenu.Item>Last action</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <button type="button">Outside control</button>
      </>,
    );

    const trigger = screen.getByRole("button", { name: "Open actions" });
    await user.click(trigger);

    const menu = await screen.findByRole("menu");
    const first = screen.getByRole("menuitem", { name: "First action" });
    const last = screen.getByRole("menuitem", { name: "Last action" });

    await waitFor(() => expect(first).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    expect(last).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    expect(menu).not.toBeInTheDocument();
  });

  it("moves Tab focus outside the portaled menu before it unmounts", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before menu</button>
        <DropdownMenu>
          <DropdownMenu.Trigger>Open actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>First action</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <button type="button">After menu</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open actions" }));
    await screen.findByRole("menu");
    await user.keyboard("{Tab}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "After menu" })).toHaveFocus();
    });
  });

  it("moves Shift+Tab focus to the control before the trigger", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before menu</button>
        <DropdownMenu>
          <DropdownMenu.Trigger>Open actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>First action</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <button type="button">After menu</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open actions" }));
    await screen.findByRole("menu");
    await user.keyboard("{Shift>}{Tab}{/Shift}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Before menu" })).toHaveFocus();
    });
  });

  it("closes on an outside pointer interaction without stealing outside focus", async () => {
    const user = userEvent.setup();

    render(
      <>
        <DropdownMenu>
          <DropdownMenu.Trigger>Open actions</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>First action</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <button type="button">Outside control</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open actions" }));
    await screen.findByRole("menu");

    const outside = screen.getByRole("button", { name: "Outside control" });
    await user.click(outside);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(outside).toHaveFocus();
    });
  });
});
