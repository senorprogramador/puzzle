import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageHotspotEditor } from "./index";

afterEach(cleanup);

const imageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23cde'/%3E%3C/svg%3E";

const dispatchPointer = (
  target: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  pointerId: number,
  clientX: number,
  clientY: number,
) => {
  act(() => {
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId,
        pointerType: "touch",
        button: 0,
        isPrimary: true,
        clientX,
        clientY,
      }),
    );
  });
};

describe("ImageHotspotEditor (browser)", () => {
  it("draws touch-operated areas, drags hotspots, and scales with its container", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <div style={{ width: "320px" }}>
        <ImageHotspotEditor
          src={imageSrc}
          alt="A sample landscape"
          onChange={onChange}
        />
      </div>,
    );

    const stage = screen.getByRole("group", {
      name: "Image hotspot editor image canvas",
    }) as HTMLDivElement;
    await waitFor(() =>
      expect(stage.getBoundingClientRect().height).toBeGreaterThan(0),
    );
    const bounds = stage.getBoundingClientRect();

    fireEvent.click(screen.getByRole("button", { name: "Draw hotspot area" }));
    dispatchPointer(
      stage,
      "pointerdown",
      9,
      bounds.left + bounds.width * 0.2,
      bounds.top + bounds.height * 0.2,
    );
    dispatchPointer(
      stage,
      "pointermove",
      9,
      bounds.left + bounds.width * 0.7,
      bounds.top + bounds.height * 0.6,
    );
    dispatchPointer(
      stage,
      "pointerup",
      9,
      bounds.left + bounds.width * 0.7,
      bounds.top + bounds.height * 0.6,
    );

    const area = onChange.mock.lastCall?.[0].hotspots[0];
    expect(area).toEqual(
      expect.objectContaining({
        x: expect.closeTo(0.2, 2),
        y: expect.closeTo(0.2, 2),
        width: expect.closeTo(0.5, 2),
        height: expect.closeTo(0.4, 2),
      }),
    );

    const marker = screen.getByRole("button", { name: "Hotspot 1" });
    const markerBounds = marker.getBoundingClientRect();
    dispatchPointer(
      marker,
      "pointerdown",
      10,
      markerBounds.left + markerBounds.width / 2,
      markerBounds.top + markerBounds.height / 2,
    );
    dispatchPointer(
      marker,
      "pointermove",
      10,
      markerBounds.left + markerBounds.width / 2 + 20,
      markerBounds.top + markerBounds.height / 2 + 10,
    );
    dispatchPointer(
      marker,
      "pointerup",
      10,
      markerBounds.left + markerBounds.width / 2 + 20,
      markerBounds.top + markerBounds.height / 2 + 10,
    );

    expect(onChange.mock.lastCall?.[0].hotspots[0].x).toBeGreaterThan(
      area.x,
    );

    const outer = container.firstElementChild as HTMLDivElement;
    outer.style.width = "160px";
    expect(stage.getBoundingClientRect().width).toBeLessThan(bounds.width);
    expect(
      screen.getByRole("button", { name: "Hotspot 1" }).getAttribute("style"),
    ).toContain("inset-inline-start");
  });
});
