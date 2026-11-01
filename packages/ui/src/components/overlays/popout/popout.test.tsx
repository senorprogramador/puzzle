import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Popout } from "./index";

afterEach(() => {
  cleanup();
});

const renderPopout = (
  props: Partial<React.ComponentProps<typeof Popout>> = {},
) => {
  const onOpenChange = vi.fn();

  const result = render(
    <>
      <button type="button">Outside</button>

      <Popout
        trigger={<button type="button">Trigger</button>}
        onOpenChange={onOpenChange}
        {...props}
      >
        <div data-testid="popout-content">Popout content</div>
      </Popout>
    </>,
  );

  return { ...result, onOpenChange };
};

describe("Popout", () => {
  it("opens when its trigger is clicked", async () => {
    const user = userEvent.setup();

    renderPopout();

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(await screen.findByTestId("popout-content")).toBeInTheDocument();
  });

  it("does not open on click when action is hover", async () => {
    const user = userEvent.setup();

    renderPopout({ action: "hover" });

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.queryByTestId("popout-content")).not.toBeInTheDocument();
  });

  it("opens on pointer enter when action is hover", async () => {
    renderPopout({ action: "hover" });

    const trigger = screen.getByRole("button", { name: "Trigger" });

    trigger.dispatchEvent(
      new PointerEvent("pointerenter", {
        bubbles: true,
        pointerType: "mouse",
      }),
    );

    expect(await screen.findByTestId("popout-content")).toBeInTheDocument();
  });

  it("opens on pointer down when action is down", async () => {
    renderPopout({ action: "down" });

    const trigger = screen.getByRole("button", { name: "Trigger" });

    trigger.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerType: "mouse",
        button: 0,
        isPrimary: true,
      }),
    );

    expect(await screen.findByTestId("popout-content")).toBeInTheDocument();
  });

  it("requests closing when Escape is pressed", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderPopout();

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    await screen.findByTestId("popout-content");

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not request closing when Escape handling is disabled", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderPopout({
      closeOnEscape: false,
    });

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    await screen.findByTestId("popout-content");

    await user.keyboard("{Escape}");

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("requests closing when clicking outside", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderPopout();

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    await screen.findByTestId("popout-content");

    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when clicking inside the popout", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderPopout();

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    await user.click(await screen.findByTestId("popout-content"));

    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popout
        trigger={<button type="button">Trigger</button>}
        open={false}
        onOpenChange={onOpenChange}
      >
        Controlled content
      </Popout>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText("Controlled content")).not.toBeInTheDocument();
  });

  it("supports defaultOpen", async () => {
    renderPopout({ defaultOpen: true });

    expect(await screen.findByTestId("popout-content")).toBeInTheDocument();
  });

  it("does not open when the trigger prevents the click event", async () => {
    const user = userEvent.setup();

    renderPopout({
      trigger: (
        <button type="button" onClick={(event) => event.preventDefault()}>
          Trigger
        </button>
      ),
    });

    await user.click(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.queryByTestId("popout-content")).not.toBeInTheDocument();
  });
});
