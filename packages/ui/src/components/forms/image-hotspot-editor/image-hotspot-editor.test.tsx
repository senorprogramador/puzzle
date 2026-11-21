import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageHotspotEditor } from "./index";

afterEach(cleanup);

describe("ImageHotspotEditor", () => {
  it("adds a focal point by keyboard and exposes exact normalized coordinates", () => {
    const onChange = vi.fn();

    render(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        onChange={onChange}
      />,
    );

    const canvas = screen.getByRole("group", {
      name: "Image hotspot editor image canvas",
    });
    canvas.focus();
    fireEvent.keyDown(canvas, { key: "Enter" });

    expect(onChange).toHaveBeenLastCalledWith({
      focalPoint: { x: 0.5, y: 0.5 },
      hotspots: [],
    });
    expect(
      screen.getByRole("button", {
        name: "Focal point at 0.50, 0.50",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Focal point x" })).toHaveValue(
      0.5,
    );
  });

  it("adds a point hotspot from the keyboard, selects it, edits its label and removes it", () => {
    const onChange = vi.fn();

    render(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add hotspot point" }));
    fireEvent.keyDown(
      screen.getByRole("group", {
        name: "Image hotspot editor image canvas",
      }),
      { key: " " },
    );

    const hotspot = onChange.mock.lastCall?.[0].hotspots[0];
    expect(hotspot).toEqual({
      id: expect.stringContaining("-hotspot-1"),
      label: "Hotspot 1",
      x: 0.5,
      y: 0.5,
      width: 0,
      height: 0,
    });
    expect(JSON.parse(JSON.stringify(hotspot))).toEqual(hotspot);

    fireEvent.change(screen.getByRole("textbox", { name: "Hotspot label" }), {
      target: { value: "Product detail" },
    });
    expect(onChange.mock.lastCall?.[0].hotspots[0].label).toBe("Product detail");

    fireEvent.click(
      screen.getByRole("button", { name: "Delete selected hotspot" }),
    );
    expect(onChange.mock.lastCall?.[0].hotspots).toEqual([]);
  });

  it("supports controlled values without changing them internally", () => {
    const value = {
      focalPoint: { x: 0, y: 1 },
      hotspots: [
        {
          id: "cta",
          x: 0.25,
          y: 0.5,
          width: 0.5,
          height: 0.25,
          label: "Call to action",
          data: { href: "/learn", priority: 2 },
        },
      ],
    };
    const onChange = vi.fn();

    render(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        value={value}
        onChange={onChange}
      />,
    );

    const marker = screen.getByRole("button", { name: "Call to action" });
    expect(marker).toHaveStyle({
      insetInlineStart: "25%",
      insetBlockStart: "50%",
      width: "50%",
      height: "25%",
    });

    fireEvent.keyDown(marker, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        hotspots: [
          expect.objectContaining({
            id: "cta",
            x: 0.26,
            data: { href: "/learn", priority: 2 },
          }),
        ],
      }),
    );
    expect(marker).toHaveStyle({ insetInlineStart: "25%" });
  });

  it("supports exact position fields and clamps hotspot boundaries", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        defaultValue={{
          hotspots: [
            {
              id: "area",
              x: 0.4,
              y: 0.3,
              width: 0.4,
              height: 0.5,
              data: { type: "link" },
            },
          ],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Hotspot x" }), {
      target: { value: "0.9" },
    });

    expect(onChange.mock.lastCall?.[0].hotspots[0]).toEqual({
      id: "area",
      x: 0.9,
      y: 0.3,
      width: 0.1,
      height: 0.5,
      data: { type: "link" },
    });

    rerender(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        value={{
          hotspots: [
            {
              id: "edge",
              x: 0.9,
              y: 0.9,
              width: 0.8,
              height: 0.8,
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Hotspot 1 at 0.90, 0.90" }),
    ).toHaveStyle({
      width: "10%",
      height: "10%",
    });
  });

  it("preserves focus and exact point bounds at image edges", () => {
    render(
      <ImageHotspotEditor
        src="/image.jpg"
        alt="A product"
        defaultValue={{
          focalPoint: { x: 1, y: 0 },
          hotspots: [{ id: "point", x: 0, y: 1, width: 0, height: 0 }],
        }}
      />,
    );

    const point = screen.getByRole("button", {
      name: "Hotspot 1 at 0.00, 1.00",
    });
    expect(point).toHaveAttribute("data-kind", "point");
    fireEvent.keyDown(point, { key: "ArrowDown" });
    expect(point).toHaveAttribute("aria-pressed", "true");
    expect(point).toHaveStyle({ insetBlockStart: "100%" });
    expect(
      within(screen.getByRole("group", { name: "Image hotspot editor" })).getByText(
        "Hotspots",
      ),
    ).toBeInTheDocument();
  });

  it("disables editing controls", () => {
    render(
      <ImageHotspotEditor src="/image.jpg" alt="A product" disabled />,
    );

    expect(
      screen.getByRole("button", { name: "Set focal point" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("group", {
        name: "Image hotspot editor image canvas",
      }),
    ).toHaveAttribute("tabindex", "-1");
  });
});
