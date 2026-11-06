import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Radio, RadioGroup } from "./index";
import type { RadioGroupProps } from "./radio-group.types";

const renderRadioGroup = (props: Partial<RadioGroupProps> = {}) =>
  render(
    <RadioGroup label="Delivery method" name="delivery" {...props}>
      <Radio value="standard" label="Standard" />

      <Radio
        value="express"
        label="Express"
        description="Delivered within two business days."
      />

      <Radio value="overnight" label="Overnight" />
    </RadioGroup>,
  );

describe("RadioGroup", () => {
  it("renders an accessible group with its legend", () => {
    renderRadioGroup();

    expect(
      screen.getByRole("radiogroup", {
        name: "Delivery method",
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("uses aria-label when no visible group label exists", () => {
    render(
      <RadioGroup aria-label="Choose a delivery method">
        <Radio value="standard" label="Standard" />
      </RadioGroup>,
    );

    expect(
      screen.getByRole("radiogroup", {
        name: "Choose a delivery method",
      }),
    ).toBeInTheDocument();
  });

  it("renders vertically by default", () => {
    renderRadioGroup();

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("supports horizontal orientation", () => {
    renderRadioGroup({ orientation: "horizontal" });

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );

    expect(
      document.querySelector(".puzzle-radio-group__options"),
    ).toHaveAttribute("data-orientation", "horizontal");
  });

  it("uses medium size by default", () => {
    renderRadioGroup();

    expect(
      screen.getByRole("radio", { name: "Standard" }).closest("label"),
    ).toHaveClass("puzzle-radio--md");
  });

  it("applies defaultValue", () => {
    renderRadioGroup({ defaultValue: "express" });

    expect(screen.getByRole("radio", { name: "Express" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "Standard" })).not.toBeChecked();
  });

  it("does not select an option by default", () => {
    renderRadioGroup();

    expect(
      screen
        .getAllByRole("radio")
        .every((radio) => !(radio as HTMLInputElement).checked),
    ).toBe(true);
  });

  it("allows selecting exactly one option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderRadioGroup({
      defaultValue: "standard",
      onValueChange,
    });

    await user.click(screen.getByRole("radio", { name: "Express" }));

    expect(screen.getByRole("radio", { name: "Express" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "Standard" })).not.toBeChecked();

    expect(onValueChange).toHaveBeenCalledWith("express");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderRadioGroup({
      value: "standard",
      onValueChange,
    });

    await user.click(screen.getByRole("radio", { name: "Express" }));

    expect(onValueChange).toHaveBeenCalledWith("express");

    expect(screen.getByRole("radio", { name: "Standard" })).toBeChecked();

    expect(screen.getByRole("radio", { name: "Express" })).not.toBeChecked();
  });

  it("does not emit duplicate callbacks for the selected value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderRadioGroup({
      defaultValue: "standard",
      onValueChange,
    });

    await user.click(screen.getByRole("radio", { name: "Standard" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards name to native radio inputs", () => {
    renderRadioGroup({ name: "delivery-method" });

    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toHaveAttribute("name", "delivery-method");
    });
  });

  it("supports required validation", () => {
    renderRadioGroup({ required: true });

    const radios = screen.getAllByRole("radio");

    expect(radios[0]).toBeRequired();
    expect(radios[1]).not.toBeRequired();
    expect(radios[2]).not.toBeRequired();

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("places required on the first enabled radio", () => {
    render(
      <RadioGroup label="Payment" name="payment" required>
        <Radio value="card" label="Card" disabled />
        <Radio value="cash" label="Cash" />
        <Radio value="transfer" label="Transfer" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Card" })).not.toBeRequired();

    expect(screen.getByRole("radio", { name: "Cash" })).toBeRequired();

    expect(screen.getByRole("radio", { name: "Transfer" })).not.toBeRequired();
  });

  it("disables the entire group", () => {
    renderRadioGroup({ disabled: true });

    expect(screen.getByRole("radiogroup")).toBeDisabled();

    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("supports individually disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        label="Payment"
        defaultValue="card"
        onValueChange={onValueChange}
      >
        <Radio value="card" label="Card" />
        <Radio value="cash" label="Cash" disabled />
        <Radio value="transfer" label="Transfer" />
      </RadioGroup>,
    );

    const cash = screen.getByRole("radio", { name: "Cash" });

    expect(cash).toBeDisabled();

    await user.click(cash);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("links group descriptions and errors", () => {
    renderRadioGroup({
      description: "Choose how quickly your order should arrive.",
      error: "Please select a delivery method.",
    });

    const group = screen.getByRole("radiogroup");

    const description = screen.getByText(
      "Choose how quickly your order should arrive.",
    );

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Please select a delivery method.");

    expect(group).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(description.id),
    );

    expect(group).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(error.id),
    );

    expect(group).toHaveAttribute("aria-invalid", "true");

    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toHaveAttribute("aria-describedby");
    });
  });

  it("supports invalid without an error message", () => {
    renderRadioGroup({ invalid: true });

    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("supports individual radio descriptions", () => {
    renderRadioGroup();

    expect(
      screen.getByRole("radio", { name: "Express" }),
    ).toHaveAccessibleDescription("Delivered within two business days.");
  });

  it("uses selected radio as the only tab stop", () => {
    renderRadioGroup({ defaultValue: "express" });

    expect(screen.getByRole("radio", { name: "Standard" })).toHaveAttribute(
      "tabindex",
      "-1",
    );

    expect(screen.getByRole("radio", { name: "Express" })).toHaveAttribute(
      "tabindex",
      "0",
    );

    expect(screen.getByRole("radio", { name: "Overnight" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("uses first enabled radio as tab stop without a selection", () => {
    render(
      <RadioGroup label="Payment">
        <Radio value="card" label="Card" disabled />
        <Radio value="cash" label="Cash" />
        <Radio value="transfer" label="Transfer" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radio", { name: "Card" })).toHaveAttribute(
      "tabindex",
      "-1",
    );

    expect(screen.getByRole("radio", { name: "Cash" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("selects and focuses next radio with ArrowRight", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderRadioGroup({
      defaultValue: "standard",
      orientation: "horizontal",
      onValueChange,
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    const express = screen.getByRole("radio", {
      name: "Express",
    });

    standard.focus();

    await user.keyboard("{ArrowRight}");

    expect(express).toHaveFocus();
    expect(express).toBeChecked();

    expect(onValueChange).toHaveBeenCalledWith("express");
  });

  it("selects and focuses previous radio with ArrowLeft", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "express",
      orientation: "horizontal",
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    const express = screen.getByRole("radio", {
      name: "Express",
    });

    express.focus();

    await user.keyboard("{ArrowLeft}");

    expect(standard).toHaveFocus();
    expect(standard).toBeChecked();
  });

  it("uses vertical arrow keys for vertical groups", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "standard",
      orientation: "vertical",
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    const express = screen.getByRole("radio", {
      name: "Express",
    });

    standard.focus();

    await user.keyboard("{ArrowDown}");

    expect(express).toHaveFocus();
    expect(express).toBeChecked();
  });

  it("ignores vertical arrows in horizontal groups", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "standard",
      orientation: "horizontal",
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    standard.focus();

    await user.keyboard("{ArrowDown}");

    expect(standard).toHaveFocus();
    expect(standard).toBeChecked();
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    renderRadioGroup({ defaultValue: "express" });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    const overnight = screen.getByRole("radio", {
      name: "Overnight",
    });

    screen.getByRole("radio", { name: "Express" }).focus();

    await user.keyboard("{Home}");

    expect(standard).toHaveFocus();
    expect(standard).toBeChecked();

    await user.keyboard("{End}");

    expect(overnight).toHaveFocus();
    expect(overnight).toBeChecked();
  });

  it("skips disabled items during keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup label="Payment" defaultValue="card">
        <Radio value="card" label="Card" />
        <Radio value="cash" label="Cash" disabled />
        <Radio value="transfer" label="Transfer" />
      </RadioGroup>,
    );

    const card = screen.getByRole("radio", { name: "Card" });
    const transfer = screen.getByRole("radio", {
      name: "Transfer",
    });

    card.focus();

    await user.keyboard("{ArrowDown}");

    expect(transfer).toHaveFocus();
    expect(transfer).toBeChecked();
  });

  it("wraps focus when loop is enabled", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "overnight",
      loop: true,
    });

    const overnight = screen.getByRole("radio", {
      name: "Overnight",
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    overnight.focus();

    await user.keyboard("{ArrowDown}");

    expect(standard).toHaveFocus();
    expect(standard).toBeChecked();
  });

  it("does not wrap when loop is disabled", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "overnight",
      loop: false,
    });

    const overnight = screen.getByRole("radio", {
      name: "Overnight",
    });

    overnight.focus();

    await user.keyboard("{ArrowDown}");

    expect(overnight).toHaveFocus();
    expect(overnight).toBeChecked();
  });

  it("reverses horizontal navigation in RTL", async () => {
    const user = userEvent.setup();

    renderRadioGroup({
      defaultValue: "standard",
      orientation: "horizontal",
      dir: "rtl",
    });

    const standard = screen.getByRole("radio", {
      name: "Standard",
    });

    const overnight = screen.getByRole("radio", {
      name: "Overnight",
    });

    standard.focus();

    await user.keyboard("{ArrowRight}");

    expect(overnight).toHaveFocus();
    expect(overnight).toBeChecked();
  });

  it("supports options inside React Fragments", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup label="Payment" defaultValue="card">
        <>
          <Radio value="card" label="Card" />
          <Radio value="cash" label="Cash" />
        </>
      </RadioGroup>,
    );

    const card = screen.getByRole("radio", { name: "Card" });
    const cash = screen.getByRole("radio", { name: "Cash" });

    card.focus();

    await user.keyboard("{ArrowDown}");

    expect(cash).toHaveFocus();
    expect(cash).toBeChecked();
  });

  it("throws when Radio is used outside RadioGroup", () => {
    expect(() => render(<Radio value="one" label="One" />)).toThrow(
      "Radio must be rendered inside a RadioGroup.",
    );
  });

  it("rejects duplicate radio values", () => {
    expect(() =>
      render(
        <RadioGroup label="Payment">
          <Radio value="same" label="First" />
          <Radio value="same" label="Second" />
        </RadioGroup>,
      ),
    ).toThrow("RadioGroup radio values must be unique.");
  });

  it("forwards a ref to the native input", () => {
    let node: HTMLInputElement | null = null;

    render(
      <RadioGroup label="Payment">
        <Radio
          value="card"
          label="Card"
          ref={(value) => {
            node = value;
          }}
        />
      </RadioGroup>,
    );

    expect(node).toBe(screen.getByRole("radio", { name: "Card" }));
  });
});
