import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Tooltip } from "./index";

afterEach(() => {
  cleanup();
});

const renderTooltip = () =>
  render(
    <div style={{ padding: 120 }}>
      <Tooltip trigger={<button type="button">Trigger</button>}>Help</Tooltip>
    </div>,
  );

const findTooltip = () => screen.findByRole("tooltip");

describe("Tooltip (browser)", () => {
  it("opens on keyboard focus and is visible once positioned", async () => {
    const user = userEvent.setup();

    renderTooltip();
    await user.tab();

    const tooltip = await findTooltip();

    await waitFor(() => expect(tooltip).toBeVisible());
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      tooltip.id,
    );
  });

  it("opens on hover and closes when the pointer leaves", async () => {
    const user = userEvent.setup();

    renderTooltip();
    await user.hover(screen.getByRole("button"));
    await findTooltip();

    await user.unhover(screen.getByRole("button"));
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("is placed next to the trigger, not at the page origin", async () => {
    const user = userEvent.setup();

    renderTooltip();
    await user.tab();

    const tooltip = await findTooltip();
    const trigger = screen.getByRole("button").getBoundingClientRect();

    await waitFor(() => expect(tooltip).toBeVisible());

    const rect = tooltip.getBoundingClientRect();

    expect(Math.abs(rect.left - trigger.left)).toBeLessThan(200);
    expect(Math.abs(rect.top - trigger.top)).toBeLessThan(200);
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();

    renderTooltip();
    await user.tab();
    await findTooltip();
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });
});
