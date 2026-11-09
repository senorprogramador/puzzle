import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./index";

const createRect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect => ({
  x: left,
  y: top,
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
  toJSON: () => ({}),
});

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      return this.classList.contains("puzzle-popout__content")
        ? createRect(0, 0, 120, 80)
        : createRect(100, 100, 100, 32);
    },
  );
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement): DOMRectList {
      const rects = [this.getBoundingClientRect()];
      return Object.assign(rects, {
        item: (index: number) => rects[index] ?? null,
      });
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ColorPicker", () => {
  it("renders a labeled trigger", () => {
    render(<ColorPicker label="Brand color" />);

    expect(
      screen.getByRole("button", { name: "Brand color" }),
    ).toBeInTheDocument();
  });

  it("opens the color panel", async () => {
    const user = userEvent.setup();

    render(<ColorPicker label="Brand color" />);

    await user.click(screen.getByRole("button", { name: "Brand color" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("supports defaultValue", () => {
    render(<ColorPicker label="Color" defaultValue="#ff0000" />);

    expect(screen.getByRole("button", { name: "Color" })).toHaveTextContent(
      "#ff0000",
    );
  });

  it("supports controlled value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Color"
        value="#ff0000"
        onChange={onChange}
        colors={["#00ff00"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    await user.click(await screen.findByRole("button", { name: "#00ff00" }));

    expect(onChange).toHaveBeenCalledWith("#00ff00");

    // Controlled value remains unchanged until parent updates it.
    expect(screen.getByRole("button", { name: "Color" })).toHaveTextContent(
      "#ff0000",
    );
  });

  it("preserves CSS variable swatch values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Color"
        onChange={onChange}
        colors={["var(--brand-primary)"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    await user.click(
      await screen.findByRole("button", {
        name: "var(--brand-primary)",
      }),
    );

    expect(onChange).toHaveBeenCalledWith("var(--brand-primary)");
  });

  it("clears to undefined", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker label="Color" defaultValue="#ff0000" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    await user.click(
      await screen.findByRole("button", { name: "Clear color" }),
    );

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("supports explicit controlled undefined", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Color"
        value={undefined}
        onChange={onChange}
        colors={["#ff0000"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    await user.click(await screen.findByRole("button", { name: "#ff0000" }));

    expect(onChange).toHaveBeenCalledWith("#ff0000");

    // Parent still controls undefined.
    expect(screen.getByRole("button", { name: "Color" })).toHaveTextContent(
      "Select color",
    );
  });

  it("applies valid color input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ColorPicker label="Color" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Color" }));

    const input = await screen.findByRole("textbox", {
      name: "Color value",
    });

    await user.type(input, "#00ff00");

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onChange).toHaveBeenCalledWith("#00ff00");
  });

  it("rejects invalid color input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ColorPicker label="Color" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Color" }));

    const input = await screen.findByRole("textbox", {
      name: "Color value",
    });

    await user.type(input, "invalid-color");

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();

    render(<ColorPicker label="Color" disabled />);

    const trigger = screen.getByRole("button", { name: "Color" });

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
