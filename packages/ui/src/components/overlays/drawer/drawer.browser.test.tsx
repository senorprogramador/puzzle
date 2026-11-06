import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./index";

afterEach(() => {
  cleanup();
  document.body.removeAttribute("style");
});

const getDrawer = () =>
  document.querySelector<HTMLElement>(".puzzle-drawer") as HTMLElement;

const pointer = (
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
) =>
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      button: 0,
      clientX,
      clientY: 0,
      bubbles: true,
    }),
  );

describe("Drawer (browser)", () => {
  it("keeps the resize bar within the drawer's real bounds", () => {
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");
    const min = Number(bar.getAttribute("aria-valuemin"));
    const max = Number(bar.getAttribute("aria-valuemax"));

    expect(max).toBeGreaterThan(min);
    expect(max).toBeLessThanOrEqual(window.innerWidth);
  });

  it("changes the measured width with the keyboard", async () => {
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");

    bar.focus();
    fireEvent.keyDown(bar, { key: "Home" });
    await waitFor(() => expect(bar).toHaveAttribute("aria-valuenow", "100"));
    const small = getDrawer().getBoundingClientRect().width;

    fireEvent.keyDown(bar, { key: "End" });
    await waitFor(() =>
      expect(getDrawer().getBoundingClientRect().width).toBeGreaterThan(small),
    );

    expect(small).toBeGreaterThanOrEqual(100);
  });

  it("resizes with pointer movement and restores body styles", async () => {
    document.body.style.userSelect = "text";
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");
    const start = getDrawer().getBoundingClientRect().width;

    pointer(bar, "pointerdown", start);
    expect(document.body.style.userSelect).toBe("none");

    pointer(bar, "pointermove", start + 80);
    await waitFor(() =>
      expect(getDrawer().getBoundingClientRect().width).toBeGreaterThan(start),
    );

    pointer(bar, "pointerup", start + 80);
    expect(document.body.style.userSelect).toBe("text");
  });

  it("shows a visible focus indicator on the resize bar", () => {
    render(
      <Drawer open onOpenChange={vi.fn()} position="left">
        Content
      </Drawer>,
    );

    const bar = screen.getByRole("separator");

    bar.focus();

    expect(document.activeElement).toBe(bar);
    expect(bar.matches(":focus-visible")).toBe(true);
  });
});
