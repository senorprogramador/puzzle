import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ContextMenu } from "./index";

describe("ContextMenu browser behavior", () => {
  it("focuses the first enabled item after pointer activation", async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item disabled>Disabled action</ContextMenu.Item>
          <ContextMenu.Item>First action</ContextMenu.Item>
          <ContextMenu.Item>Second action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    await user.pointer({
      target: screen.getByText("Right-click area"),
      keys: "[MouseRight]",
    });

    const first = await screen.findByRole("menuitem", {
      name: "First action",
    });

    await waitFor(() => expect(first).toHaveFocus());

    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("menuitem", { name: "Second action" }),
    ).toHaveFocus();
  });

  it("opens with Shift+F10 and restores focus on Escape", async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>First action</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    const trigger = screen.getByText("Right-click area");

    trigger.focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");

    await screen.findByRole("menu");

    const item = screen.getByRole("menuitem", { name: "First action" });

    await waitFor(() => expect(item).toHaveFocus());

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("opens a submenu with ArrowRight and closes it with ArrowLeft", async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>More options</ContextMenu.SubTrigger>
            <ContextMenu.SubContent aria-label="More options">
              <ContextMenu.Item>Sub action</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    await user.pointer({
      target: screen.getByText("Right-click area"),
      keys: "[MouseRight]",
    });

    const subTrigger = await screen.findByRole("menuitem", {
      name: "More options",
    });

    await waitFor(() => expect(subTrigger).toHaveFocus());
    await user.keyboard("{ArrowRight}");

    const subMenu = await screen.findByRole("menu", {
      name: "More options",
    });

    const subItem = screen.getByRole("menuitem", { name: "Sub action" });

    await waitFor(() => expect(subItem).toHaveFocus());

    await user.keyboard("{ArrowLeft}");

    await waitFor(() => {
      expect(subMenu).not.toBeInTheDocument();
      expect(subTrigger).toHaveFocus();
    });
  });

  it("closes on outside interaction without stealing focus", async () => {
    const user = userEvent.setup();

    render(
      <>
        <ContextMenu>
          <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item>First action</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>

        <button type="button">Outside control</button>
      </>,
    );

    await user.pointer({
      target: screen.getByText("Right-click area"),
      keys: "[MouseRight]",
    });

    await screen.findByRole("menu");

    const outside = screen.getByRole("button", {
      name: "Outside control",
    });

    await user.click(outside);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(outside).toHaveFocus();
    });
  });
});
