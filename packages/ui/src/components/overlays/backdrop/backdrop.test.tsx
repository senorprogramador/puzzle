import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRef } from "react";

import { Backdrop } from "./index";

afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
  document.documentElement.removeAttribute("style");
});

describe("Backdrop", () => {
  it("does not mount when closed and registers after opening", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <Backdrop open={false} onClose={onClose} data-testid="backdrop">
        Content
      </Backdrop>,
    );

    expect(screen.queryByTestId("backdrop")).not.toBeInTheDocument();

    rerender(
      <Backdrop open onClose={onClose} data-testid="backdrop">
        Content
      </Backdrop>,
    );

    expect(await screen.findByTestId("backdrop")).toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on a backdrop click but not on a click inside its content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Backdrop onClose={onClose} data-testid="backdrop">
        <button type="button">Content action</button>
      </Backdrop>,
    );

    await user.click(screen.getByRole("button", { name: "Content action" }));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("respects closeOnBackdrop and a prevented click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const { rerender } = render(
      <Backdrop onClose={onClose} onClick={onClick} data-testid="backdrop">
        Content
      </Backdrop>,
    );

    await user.click(screen.getByTestId("backdrop"));
    expect(onClose).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Backdrop
        closeOnBackdrop={false}
        onClose={onClose}
        data-testid="backdrop"
      >
        Content
      </Backdrop>,
    );

    await user.click(screen.getByTestId("backdrop"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("only lets the topmost backdrop handle Escape or backdrop clicks", async () => {
    const user = userEvent.setup();
    const onLowerClose = vi.fn();
    const onUpperClose = vi.fn();
    render(
      <Backdrop onClose={onLowerClose} data-testid="lower">
        <Backdrop onClose={onUpperClose} data-testid="upper">
          Content
        </Backdrop>
      </Backdrop>,
    );

    await user.click(screen.getByTestId("lower"));
    expect(onLowerClose).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onUpperClose).toHaveBeenCalledOnce();
    expect(onLowerClose).not.toHaveBeenCalled();
  });

  it("locks scrolling only while an open modal backdrop is mounted", () => {
    const { rerender, unmount } = render(<Backdrop modal>Content</Backdrop>);

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Backdrop modal open={false}>
        Content
      </Backdrop>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");

    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("supports a polymorphic root and forwards its ref", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Backdrop as="aside" ref={ref} data-testid="backdrop">
        Content
      </Backdrop>,
    );

    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop.tagName).toBe("ASIDE");
    expect(ref.current).toBe(backdrop);
  });

  it("does not close when Escape handling is disabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Backdrop closeOnEscape={false} onClose={onClose}>
        Content
      </Backdrop>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("uses the latest close handler without resetting modal focus", async () => {
    const user = userEvent.setup();
    const previousOnClose = vi.fn();
    const onClose = vi.fn();
    const content = (
      <div data-overlay-content="">
        <button type="button">First action</button>
        <input aria-label="Name" />
      </div>
    );
    const { rerender } = render(
      <Backdrop modal onClose={previousOnClose} data-testid="backdrop">
        {content}
      </Backdrop>,
    );

    await user.click(screen.getByRole("textbox", { name: "Name" }));
    rerender(
      <Backdrop modal onClose={onClose} data-testid="backdrop">
        {content}
      </Backdrop>,
    );

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(previousOnClose).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("backdrop"));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(previousOnClose).not.toHaveBeenCalled();
  });
});
