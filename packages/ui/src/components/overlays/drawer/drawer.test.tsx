import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./index";

afterEach(() => {
  cleanup();
});

describe("Drawer resize bar", () => {
  it("is a focusable separator with value bounds", () => {
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator", { name: "Resize drawer" });

    expect(bar).toHaveAttribute("tabindex", "0");
    expect(bar).toHaveAttribute("aria-orientation", "vertical");
    expect(bar).toHaveAttribute("aria-valuemin", "100");
    expect(bar).toHaveAttribute("aria-valuemax");
  });

  it("resizes with the keyboard within its bounds", () => {
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");

    fireEvent.keyDown(bar, { key: "End" });
    const max = bar.getAttribute("aria-valuemax");
    expect(bar).toHaveAttribute("aria-valuenow", max);

    fireEvent.keyDown(bar, { key: "Home" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("restores body styles after a pointer drag", () => {
    document.body.style.userSelect = "text";
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");

    fireEvent.pointerDown(bar, { pointerId: 1, button: 0, clientX: 100 });
    expect(document.body.style.userSelect).toBe("none");

    fireEvent.pointerUp(bar, { pointerId: 1 });
    expect(document.body.style.userSelect).toBe("text");
    document.body.style.userSelect = "";
  });
});
