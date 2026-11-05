import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "./number-input";

afterEach(() => {
  cleanup();
});

describe("NumberInput", () => {
  it("exposes spinbutton semantics", () => {
    render(<NumberInput aria-label="Qty" initialValue={5} min={0} max={10} />);
    const input = screen.getByRole("spinbutton", { name: "Qty" });

    expect(input.getAttribute("aria-valuenow")).toBe("5");
    expect(input.getAttribute("aria-valuemin")).toBe("0");
    expect(input.getAttribute("aria-valuemax")).toBe("10");
  });

  it("omits aria-valuemin and aria-valuemax when unbounded", () => {
    render(<NumberInput aria-label="Qty" />);
    const input = screen.getByRole("spinbutton");

    expect(input.hasAttribute("aria-valuemin")).toBe(false);
    expect(input.hasAttribute("aria-valuemax")).toBe(false);
  });

  it("steps with arrow keys and pages with PageUp/PageDown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <NumberInput aria-label="Qty" initialValue={5} onChange={onChange} />,
    );
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenLastCalledWith(6);

    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(4);

    await user.keyboard("{PageUp}");
    expect(onChange).toHaveBeenLastCalledWith(14);

    await user.keyboard("{PageDown}");
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("jumps to min and max with Home and End", async () => {
    const user = userEvent.setup();

    render(<NumberInput aria-label="Qty" initialValue={5} min={0} max={10} />);
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.keyboard("{End}");
    expect(input.getAttribute("aria-valuenow")).toBe("10");

    await user.keyboard("{Home}");
    expect(input.getAttribute("aria-valuenow")).toBe("0");
  });

  it("does not exceed bounds with the keyboard", async () => {
    const user = userEvent.setup();

    render(<NumberInput aria-label="Qty" initialValue={10} max={10} />);
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.keyboard("{ArrowUp}");

    expect(input.getAttribute("aria-valuenow")).toBe("10");
  });

  it("ignores keys while read-only and still calls a custom onKeyDown", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(
      <NumberInput
        aria-label="Qty"
        initialValue={5}
        readOnly
        onKeyDown={onKeyDown}
      />,
    );
    const input = screen.getByRole("spinbutton");

    await user.click(input);
    await user.keyboard("{ArrowUp}");

    expect(onKeyDown).toHaveBeenCalled();
    expect(input.getAttribute("aria-valuenow")).toBe("5");
  });

  it("allows negative numbers when min is negative or unset", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<NumberInput aria-label="Qty" min={-10} />);

    expect(screen.getByRole("spinbutton").getAttribute("pattern")).toBe(
      "-?[0-9]*",
    );

    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "-5");
    expect(screen.getByRole("spinbutton").getAttribute("aria-valuenow")).toBe(
      "-5",
    );

    rerender(<NumberInput aria-label="Qty" min={0} fractionDigits={2} />);
    expect(screen.getByRole("spinbutton").getAttribute("pattern")).toBe(
      "[0-9]*[.,]?[0-9]*",
    );
  });

  it("marks non-numeric drafts as invalid until blur restores the value", async () => {
    const user = userEvent.setup();

    render(<NumberInput aria-label="Qty" initialValue={5} min={0} max={10} />);
    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "abc");
    expect(input.getAttribute("aria-invalid")).toBe("true");

    await user.tab();
    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect((input as HTMLInputElement).value).toBe("5");
  });

  it("supports configurable stepper labels and keeps them out of the tab order", () => {
    render(
      <NumberInput
        aria-label="Qty"
        decrementLabel="Minder"
        incrementLabel="Meer"
      />,
    );

    expect(screen.getByRole("button", { name: "Minder" }).tabIndex).toBe(-1);
    expect(screen.getByRole("button", { name: "Meer" }).tabIndex).toBe(-1);
  });
});
