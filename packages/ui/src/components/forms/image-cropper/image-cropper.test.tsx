import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImageCropper } from "./index";

afterEach(cleanup);

const initialCrop = {
  x: 0.25,
  y: 0.1,
  width: 0.5,
  height: 0.8,
};

describe("ImageCropper", () => {
  it("renders a named crop selection and normalized crop values", () => {
    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        value={initialCrop}
        aria-label="Product image"
      />,
    );

    expect(
      screen.getByRole("group", { name: "Image cropper" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A landscape" })).toHaveAttribute(
      "src",
      "/image.jpg",
    );
    expect(screen.getByRole("group", { name: "Crop selection" })).toHaveStyle({
      insetInlineStart: "25%",
      insetBlockStart: "10%",
      width: "50%",
      height: "80%",
    });
    expect(JSON.parse(JSON.stringify(initialCrop))).toEqual(initialCrop);
  });

  it("moves an uncontrolled crop with keyboard arrows", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        defaultValue={initialCrop}
        onChange={onChange}
      />,
    );

    const selection = screen.getByRole("group", { name: "Crop selection" });
    fireEvent.keyDown(selection, { key: "ArrowRight" });

    expect(selection).toHaveStyle({ insetInlineStart: "26%" });
    expect(onChange).toHaveBeenLastCalledWith({
      ...initialCrop,
      x: 0.26,
    });

    fireEvent.keyDown(selection, { key: "ArrowRight", shiftKey: true });

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ width: 0.51 }),
    );
  });

  it("keeps a controlled crop unchanged while reporting edits", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        value={initialCrop}
        onChange={onChange}
      />,
    );

    const selection = screen.getByRole("group", { name: "Crop selection" });
    fireEvent.keyDown(selection, { key: "ArrowDown" });

    expect(onChange).toHaveBeenCalledWith({
      ...initialCrop,
      y: 0.11,
    });
    expect(selection).toHaveStyle({ insetBlockStart: "10%" });
  });

  it("changes aspect ratio, zoom, and reset through accessible controls", () => {
    const onChange = vi.fn();
    const onAspectRatioChange = vi.fn();

    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        defaultValue={initialCrop}
        onChange={onChange}
        onAspectRatioChange={onAspectRatioChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "16:9" }));

    expect(onAspectRatioChange).toHaveBeenCalledWith(16 / 9);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number),
      }),
    );

    fireEvent.change(screen.getByRole("slider", { name: "Zoom crop" }), {
      target: { value: "2" },
    });
    expect(onChange.mock.lastCall?.[0].width).toBeLessThan(1);

    fireEvent.click(screen.getByRole("button", { name: "Reset crop" }));
    expect(onChange.mock.lastCall?.[0]).toEqual({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
  });

  it("zooms a free crop without changing its aspect ratio", () => {
    const onChange = vi.fn();

    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        aspectRatio="free"
        defaultValue={{ x: 0.1, y: 0.3, width: 0.8, height: 0.2 }}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByRole("slider", { name: "Zoom crop" }), {
      target: { value: "2" },
    });

    expect(onChange).toHaveBeenLastCalledWith({
      x: 0.3,
      y: 0.35,
      width: 0.4,
      height: 0.1,
    });
  });

  it("normalizes invalid crop input to the image boundary", () => {
    render(
      <ImageCropper
        src="/image.jpg"
        alt="A landscape"
        value={{ x: 1.4, y: -2, width: 0.5, height: Number.NaN }}
      />,
    );

    expect(screen.getByRole("group", { name: "Crop selection" })).toHaveStyle({
      insetInlineStart: "100%",
      insetBlockStart: "0%",
      width: "0%",
      height: "0%",
    });
  });

  it("disables controls when requested", () => {
    render(
      <ImageCropper src="/image.jpg" alt="A landscape" disabled />,
    );

    expect(screen.getByRole("button", { name: "Reset crop" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "Zoom crop" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "Crop selection" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});
