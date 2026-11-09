import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { afterEach, describe, expect, it } from "vitest";

import { userEvent } from "vitest/browser";

import { ResizablePanels } from "./index";

afterEach(() => {
  cleanup();
});

const dispatchPointer = (
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
  clientY: number,
) => {
  target.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      isPrimary: true,
      clientX,
      clientY,
    }),
  );
};

describe("ResizablePanels (browser)", () => {
  it("lays panels out horizontally using their configured sizes", () => {
    render(
      <ResizablePanels
        aria-label="Workspace"
        defaultSizes={[25, 75]}
        style={{ width: 800, height: 300 }}
      >
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const group = screen.getByRole("group", {
      name: "Workspace",
    });

    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");

    const firstRect = first.getBoundingClientRect();
    const secondRect = second.getBoundingClientRect();

    expect(group.getBoundingClientRect().width).toBe(800);

    expect(firstRect.width).toBeGreaterThan(0);
    expect(secondRect.width).toBeGreaterThan(firstRect.width);

    expect(firstRect.top).toBe(secondRect.top);
  });

  it("resizes horizontally with pointer movement", async () => {
    render(
      <ResizablePanels
        defaultSizes={[25, 75]}
        style={{ width: 800, height: 300 }}
      >
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const first = screen.getByTestId("first");

    const handle = screen.getByRole("separator");

    const initialWidth = first.getBoundingClientRect().width;

    const handleRect = handle.getBoundingClientRect();

    const startX = handleRect.left + handleRect.width / 2;
    const startY = handleRect.top + handleRect.height / 2;

    dispatchPointer(handle, "pointerdown", startX, startY);

    dispatchPointer(handle, "pointermove", startX + 80, startY);

    await waitFor(() => {
      expect(first.getBoundingClientRect().width).toBeGreaterThan(initialWidth);
    });

    dispatchPointer(handle, "pointerup", startX + 80, startY);
  });

  it("lays panels out vertically", () => {
    render(
      <ResizablePanels
        orientation="vertical"
        defaultSizes={[35, 65]}
        style={{ width: 480, height: 360 }}
      >
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");

    const firstRect = first.getBoundingClientRect();
    const secondRect = second.getBoundingClientRect();

    expect(firstRect.height).toBeGreaterThan(0);
    expect(secondRect.height).toBeGreaterThan(firstRect.height);

    expect(secondRect.top).toBeGreaterThan(firstRect.top);
  });

  it("supports keyboard resizing and visible focus in the browser", async () => {
    render(
      <ResizablePanels
        orientation="vertical"
        defaultSizes={[30, 70]}
        style={{ width: 480, height: 360 }}
      >
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const first = screen.getByTestId("first");
    const handle = screen.getByRole("separator");

    const initialHeight = first.getBoundingClientRect().height;

    await userEvent.tab();

    expect(document.activeElement).toBe(handle);
    expect(handle.matches(":focus-visible")).toBe(true);

    await userEvent.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(handle).toHaveAttribute("aria-valuenow", "31");

      expect(first.getBoundingClientRect().height).toBeGreaterThan(
        initialHeight,
      );
    });
  });

  it("does not resize non-adjacent panels when dragging a handle", async () => {
    render(
      <ResizablePanels
        defaultSizes={[25, 35, 40]}
        style={{ width: 900, height: 300 }}
      >
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="third" />
      </ResizablePanels>,
    );

    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");
    const third = screen.getByTestId("third");

    const initialThirdWidth = third.getBoundingClientRect().width;

    const handle = screen.getAllByRole("separator")[0]!;

    const rect = handle.getBoundingClientRect();

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    dispatchPointer(handle, "pointerdown", startX, startY);
    dispatchPointer(handle, "pointermove", startX + 60, startY);

    await waitFor(() => {
      expect(first.getBoundingClientRect().width).toBeGreaterThan(0);

      expect(second.getBoundingClientRect().width).toBeGreaterThan(0);
    });

    expect(third.getBoundingClientRect().width).toBeCloseTo(
      initialThirdWidth,
      0,
    );

    dispatchPointer(handle, "pointerup", startX + 60, startY);
  });
});
