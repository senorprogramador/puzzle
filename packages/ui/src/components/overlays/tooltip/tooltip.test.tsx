import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./index";

afterEach(() => {
  cleanup();
});

describe("Tooltip", () => {
  it("opens on keyboard focus and closes on blur", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button type="button">Trigger</button>}>Help</Tooltip>,
    );

    await user.tab();
    expect(
      await screen.findByRole("tooltip", { hidden: true }),
    ).toHaveTextContent("Help");

    await user.tab();
    await waitFor(() =>
      expect(
        screen.queryByRole("tooltip", { hidden: true }),
      ).not.toBeInTheDocument(),
    );
  });

  it("links the trigger to the tooltip with aria-describedby", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={
          <button type="button" aria-describedby="existing">
            Trigger
          </button>
        }
      >
        Help
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Trigger" });
    expect(trigger.getAttribute("aria-describedby")).toBe("existing");

    await user.tab();
    const tooltip = await screen.findByRole("tooltip", { hidden: true });

    expect(tooltip.id).not.toBe("");
    expect(trigger.getAttribute("aria-describedby")).toBe(
      `existing ${tooltip.id}`,
    );
  });

  it("keeps the trigger's own focus handlers and reports open changes", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Tooltip
        onOpenChange={onOpenChange}
        trigger={
          <button type="button" onFocus={onFocus}>
            Trigger
          </button>
        }
      >
        Help
      </Tooltip>,
    );

    await user.tab();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button type="button">Trigger</button>}>Help</Tooltip>,
    );

    await user.tab();
    await screen.findByRole("tooltip", { hidden: true });
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(
        screen.queryByRole("tooltip", { hidden: true }),
      ).not.toBeInTheDocument(),
    );
  });
});
