import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageCropper } from "./index";

afterEach(cleanup);

const imageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23cde'/%3E%3C/svg%3E";

const dispatchPointer = (
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
  clientY: number,
) => {
  act(() => {
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 7,
        pointerType: "touch",
        button: 0,
        isPrimary: true,
        clientX,
        clientY,
      }),
    );
  });
};

describe("ImageCropper (browser)", () => {
  it("supports touch pointer dragging and stays responsive to its container", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <div style={{ width: "320px" }}>
        <ImageCropper
          src={imageSrc}
          alt="A sample landscape"
          defaultValue={{ x: 0.2, y: 0.2, width: 0.5, height: 0.5 }}
          onChange={onChange}
        />
      </div>,
    );

    const stage = container.querySelector(
      ".puzzle-image-cropper__stage",
    ) as HTMLDivElement;
    const selection = screen.getByRole("group", { name: "Crop selection" });
    await waitFor(() =>
      expect(stage.getBoundingClientRect().height).toBeGreaterThan(0),
    );
    const bounds = stage.getBoundingClientRect();

    dispatchPointer(
      selection,
      "pointerdown",
      bounds.left + bounds.width * 0.4,
      bounds.top + bounds.height * 0.4,
    );
    dispatchPointer(
      selection,
      "pointermove",
      bounds.left + bounds.width * 0.5,
      bounds.top + bounds.height * 0.5,
    );
    dispatchPointer(
      selection,
      "pointerup",
      bounds.left + bounds.width * 0.5,
      bounds.top + bounds.height * 0.5,
    );

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
    );
    expect(onChange.mock.lastCall?.[0].x).toBeGreaterThan(0.2);
    expect(onChange.mock.lastCall?.[0].y).toBeGreaterThan(0.2);

    const outer = container.firstElementChild as HTMLDivElement;
    outer.style.width = "160px";
    expect(stage.getBoundingClientRect().width).toBeLessThan(bounds.width);
    expect(selection.getAttribute("style")).toContain("inset-inline-start");
  });
});
