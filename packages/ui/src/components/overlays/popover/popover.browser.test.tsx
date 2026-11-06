import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Popover } from "./index";

afterEach(() => {
  cleanup();
});

const renderPopover = () =>
  render(
    <div style={{ padding: 120 }}>
      <Popover
        trigger={<button type="button">Options</button>}
        title="Filters"
        closable
      >
        <a href="#settings">Settings</a>
      </Popover>
      <button type="button">Elsewhere</button>
    </div>,
  );

describe("Popover (browser)", () => {
  it("focuses the first control once the popover is positioned and visible", async () => {
    const user = userEvent.setup();

    renderPopover();
    await user.click(screen.getByRole("button", { name: "Options" }));

    const dialog = await screen.findByRole("dialog", { name: "Filters" });

    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus(),
    );
  });

  it("is placed next to the trigger, not at the page origin", async () => {
    const user = userEvent.setup();

    renderPopover();

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog");

    await waitFor(() => expect(dialog).toBeVisible());

    const triggerRect = trigger.getBoundingClientRect();
    const rect = dialog.getBoundingClientRect();

    expect(rect.top).toBeGreaterThanOrEqual(triggerRect.bottom);
    expect(Math.abs(rect.top - triggerRect.bottom)).toBeLessThan(40);
  });

  it("moves through its controls with Tab and closes when tabbing past the end", async () => {
    const user = userEvent.setup();

    renderPopover();

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close" })).toHaveFocus(),
    );

    await user.tab();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveFocus();

    await user.tab();
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside click", async () => {
    const user = userEvent.setup();

    renderPopover();
    await user.click(screen.getByRole("button", { name: "Options" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
