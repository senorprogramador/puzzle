import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./index";

const renderDialog = (
  props: Partial<React.ComponentProps<typeof Dialog>> = {},
) => {
  const onOpenChange = vi.fn();

  const result = render(
    <>
      <button type="button">Open dialog</button>
      <Dialog
        open
        onOpenChange={onOpenChange}
        title="Test dialog"
        description="Dialog description"
        {...props}
      >
        <button type="button">First action</button>
        <button type="button">Last action</button>
      </Dialog>
    </>,
  );

  return { ...result, onOpenChange };
};

afterEach(() => {
  cleanup();
});

describe("Dialog", () => {
  it("renders an accessible modal dialog", async () => {
    renderDialog();

    const dialog = await screen.findByRole("dialog", {
      name: "Test dialog",
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");

    expect(screen.getByText("Dialog description")).toBeInTheDocument();
  });

  it("does not render its content when closed", () => {
    renderDialog({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("requests closing when the close button is activated", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await user.click(
      await screen.findByRole("button", { name: "Close dialog" }),
    );

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("requests closing when Escape is pressed", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close when Escape handling is disabled", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog({
      closeOnEscape: false,
    });

    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("does not close when the backdrop is clicked from inside the dialog", async () => {
    const user = userEvent.setup();
    const { onOpenChange } = renderDialog();

    await user.click(await screen.findByText("Dialog description"));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("does not render a close button when closeButton is false", async () => {
    renderDialog({ closeButton: false });

    await screen.findByRole("dialog");

    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });

  it("supports an externally supplied description relationship", async () => {
    render(
      <>
        <p id="external-description">External description</p>
        <Dialog
          open
          onOpenChange={vi.fn()}
          title="Test dialog"
          aria-describedby="external-description"
        >
          Content
        </Dialog>
      </>,
    );

    const dialog = await screen.findByRole("dialog");

    expect(dialog.getAttribute("aria-describedby")).toContain(
      "external-description",
    );
  });

  it("calls onClose when the dialog is closed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderDialog({ onClose });

    await user.click(
      await screen.findByRole("button", { name: "Close dialog" }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close the dialog when closeOnBackdrop is false", async () => {
    const { onOpenChange } = renderDialog({
      closeOnBackdrop: false,
    });

    await screen.findByRole("dialog");

    const backdrop = document.querySelector(".puzzle-backdrop");

    expect(backdrop).not.toBeNull();

    if (!backdrop) {
      return;
    }

    act(() => {
      backdrop.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        }),
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
