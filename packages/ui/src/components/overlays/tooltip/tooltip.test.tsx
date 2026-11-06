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

  it("renders only non-interactive content in the tooltip popup", async () => {
    render(
      <Tooltip trigger={<button type="button">Trigger</button>} defaultOpen>
        Hint
      </Tooltip>,
    );

    const tooltip = await screen.findByRole("tooltip", { hidden: true });
    const popup = tooltip.closest(".puzzle-popout__content") as HTMLElement;

    expect(tooltip).toHaveTextContent("Hint");
    expect(
      popup.querySelector("button, a[href], input, [tabindex]"),
    ).toBeNull();
    expect(
      screen
        .getByRole("button", { name: "Trigger" })
        .getAttribute("aria-describedby"),
    ).toBe(tooltip.id);
  });

  it("stays open while the trigger is focused and closes when focus leaves", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Tooltip trigger={<button type="button">Trigger</button>}>Hint</Tooltip>
        <button type="button">Next</button>
      </>,
    );

    await user.tab();
    await screen.findByRole("tooltip", { hidden: true });

    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    await waitFor(() =>
      expect(
        screen.queryByRole("tooltip", { hidden: true }),
      ).not.toBeInTheDocument(),
    );
  });
});
