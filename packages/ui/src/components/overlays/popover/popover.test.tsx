import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Popover } from "./index";

// jsdom has no layout; give elements a box so Popout positions and reveals
// the content like a browser would.
beforeEach(() => {
  const rect = new DOMRect(0, 0, 100, 40);

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const getDialog = () => screen.queryByRole("dialog", { hidden: true });

const waitForClosed = () =>
  waitFor(() => expect(getDialog()).not.toBeInTheDocument());

describe("Popover", () => {
  it("exposes dialog semantics on the trigger and content", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button type="button">Options</button>} title="Filters">
        Content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);

    const dialog = await screen.findByRole("dialog", {
      name: "Filters",
      hidden: true,
    });

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", dialog.id);
  });

  it("uses aria-label when there is no visible title", async () => {
    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Quick actions"
        defaultOpen
      >
        Content
      </Popover>,
    );

    expect(
      await screen.findByRole("dialog", {
        name: "Quick actions",
        hidden: true,
      }),
    ).toBeInTheDocument();
  });

  it("toggles on trigger click and reports open changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
        onOpenChange={onOpenChange}
      >
        Content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    expect(
      await screen.findByRole("dialog", { hidden: true }),
    ).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(trigger);
    await waitForClosed();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("moves focus into the popover when opened", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
      >
        <a href="#settings">Settings</a>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Options" }));

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Settings", hidden: true }),
      ).toHaveFocus(),
    );
  });

  it("does not steal focus when open on first render", async () => {
    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
        defaultOpen
      >
        <a href="#settings">Settings</a>
      </Popover>,
    );

    await screen.findByRole("dialog", { hidden: true });
    expect(document.body).toHaveFocus();
  });

  it("closes from the close button and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        title="Filters"
        closable
        closeLabel="Close filters"
      >
        Content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    const close = await screen.findByRole("button", {
      name: "Close filters",
      hidden: true,
    });

    await waitFor(() => expect(close).toHaveFocus());
    await user.click(close);

    await waitForClosed();
    expect(trigger).toHaveFocus();
  });

  it("keeps the popover open while tabbing from the trigger to the close button", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
        closable
        defaultOpen
      >
        Content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });
    trigger.focus();

    await user.tab();

    const close = screen.getByRole("button", { name: "Close", hidden: true });
    expect(close).toHaveFocus();
    expect(getDialog()).toBeInTheDocument();

    await user.keyboard("{Enter}");
    await waitForClosed();
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
      >
        <button type="button">Apply</button>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Apply", hidden: true }),
      ).toHaveFocus(),
    );

    await user.keyboard("{Escape}");
    await waitForClosed();
    expect(trigger).toHaveFocus();
  });

  it("returns to the trigger with Shift+Tab and closes when tabbing past the end", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button type="button">Options</button>}
        aria-label="Options"
      >
        <button type="button">Apply</button>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Options" });

    await user.click(trigger);
    const apply = screen.getByRole("button", { name: "Apply", hidden: true });
    await waitFor(() => expect(apply).toHaveFocus());

    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();
    expect(getDialog()).toBeInTheDocument();

    await user.tab();
    expect(apply).toHaveFocus();

    await user.tab();
    await waitForClosed();
    expect(trigger).toHaveFocus();
  });

  it("closes when focus moves to an element outside the popover", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Popover
          trigger={<button type="button">Options</button>}
          aria-label="Options"
        >
          <button type="button">Apply</button>
        </Popover>
        <button type="button">Elsewhere</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Options" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Apply", hidden: true }),
      ).toHaveFocus(),
    );

    screen.getByRole("button", { name: "Elsewhere" }).focus();
    await waitForClosed();
  });
});
