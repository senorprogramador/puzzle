import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup } from "./index";
import type { ToggleGroupSingleProps } from "./toggle-group.types";

const renderSingleGroup = (props: Partial<ToggleGroupSingleProps> = {}) =>
  render(
    <ToggleGroup aria-label="Text formatting" {...props}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup>,
  );

describe("ToggleGroup", () => {
  it("renders an accessible group and exposes the selected item", () => {
    renderSingleGroup({ defaultValue: "italic" });

    expect(
      screen.getByRole("group", { name: "Text formatting" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("selects an item in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderSingleGroup({
      defaultValue: "bold",
      onValueChange,
    });

    await user.click(screen.getByRole("button", { name: "Italic" }));

    expect(onValueChange).toHaveBeenCalledWith("italic");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("deselects the selected item in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderSingleGroup({
      defaultValue: "bold",
      onValueChange,
    });

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("does not update its selection when controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderSingleGroup({
      value: "bold",
      onValueChange,
    });

    await user.click(screen.getByRole("button", { name: "Italic" }));

    expect(onValueChange).toHaveBeenCalledWith("italic");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        defaultValue={["bold"]}
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Italic" }));

    expect(onValueChange).toHaveBeenCalledWith(["bold", "italic"]);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("allows deselection in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        defaultValue={["bold", "italic"]}
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).toHaveBeenCalledWith(["italic"]);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("does not deselect the final value when required", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderSingleGroup({
      defaultValue: "bold",
      required: true,
      onValueChange,
    });

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("does not deselect the final value in required multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        defaultValue={["bold"]}
        required
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("disables the group and all its items", () => {
    renderSingleGroup({ disabled: true });

    expect(screen.getByRole("group")).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Italic" })).toBeDisabled();
  });

  it("supports individually disabled items", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="disabled" disabled>
          Disabled
        </ToggleGroup.Item>
        <ToggleGroup.Item value="last">Last</ToggleGroup.Item>
      </ToggleGroup>,
    );

    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Disabled" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uses one tab stop for the group", () => {
    renderSingleGroup({ defaultValue: "italic" });

    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("button", { name: "Underline" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("moves focus with horizontal arrow keys", async () => {
    const user = userEvent.setup();

    renderSingleGroup({ defaultValue: "bold" });

    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    bold.focus();
    await user.keyboard("{ArrowRight}");

    expect(italic).toHaveFocus();
    expect(italic).toHaveAttribute("tabindex", "0");
  });

  it("wraps focus when loop is enabled", async () => {
    const user = userEvent.setup();

    renderSingleGroup({ defaultValue: "underline", loop: true });

    const underline = screen.getByRole("button", { name: "Underline" });
    const bold = screen.getByRole("button", { name: "Bold" });

    underline.focus();
    await user.keyboard("{ArrowRight}");

    expect(bold).toHaveFocus();
  });

  it("does not wrap focus when loop is disabled", async () => {
    const user = userEvent.setup();

    renderSingleGroup({ defaultValue: "underline", loop: false });

    const underline = screen.getByRole("button", { name: "Underline" });

    underline.focus();
    await user.keyboard("{ArrowRight}");

    expect(underline).toHaveFocus();
  });

  it("skips disabled items during keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup defaultValue="first">
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="disabled" disabled>
          Disabled
        </ToggleGroup.Item>
        <ToggleGroup.Item value="last">Last</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });

    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(last).toHaveFocus();
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    renderSingleGroup({ defaultValue: "italic" });

    const bold = screen.getByRole("button", { name: "Bold" });
    const underline = screen.getByRole("button", { name: "Underline" });

    screen.getByRole("button", { name: "Italic" }).focus();

    await user.keyboard("{Home}");
    expect(bold).toHaveFocus();

    await user.keyboard("{End}");
    expect(underline).toHaveFocus();
  });

  it("uses vertical arrow keys for vertical groups", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup orientation="vertical" defaultValue="first">
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="second">Second</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    first.focus();
    await user.keyboard("{ArrowDown}");

    expect(second).toHaveFocus();
  });

  it("reverses horizontal arrow navigation in RTL", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup dir="rtl" defaultValue="first">
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="second">Second</ToggleGroup.Item>
        <ToggleGroup.Item value="third">Third</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const third = screen.getByRole("button", { name: "Third" });

    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(third).toHaveFocus();
  });

  it("supports items inside React Fragments", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup defaultValue="first">
        <>
          <ToggleGroup.Item value="first">First</ToggleGroup.Item>
          <ToggleGroup.Item value="second">Second</ToggleGroup.Item>
        </>
      </ToggleGroup>,
    );

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });

    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(second).toHaveFocus();
  });

  it("composes the item's own click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroup.Item value="bold" onClick={onClick}>
          Bold
        </ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("bold");
  });

  it("allows an item's click handler to prevent selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroup.Item
          value="bold"
          onClick={(event) => event.preventDefault()}
        >
          Bold
        </ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("applies attached and full-width layout attributes", () => {
    render(
      <ToggleGroup attached fullWidth>
        <ToggleGroup.Item value="first">First</ToggleGroup.Item>
        <ToggleGroup.Item value="second">Second</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const group = screen.getByRole("group");

    expect(group).toHaveAttribute("data-attached", "true");
    expect(group).toHaveAttribute("data-full-width", "true");
  });
});
