import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent as browserUserEvent } from "vitest/browser";

import { ColorPicker } from "./index";

afterEach(() => {
  cleanup();
});

describe("ColorPicker (browser)", () => {
  it("supports keyboard interaction with the color area", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker label="Color" defaultValue="#ff0000" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    const area = await screen.findByRole("group", {
      name: "Color saturation and brightness",
    });

    area.focus();

    expect(area).toHaveFocus();

    await browserUserEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenCalled();
  });

  it("supports native keyboard interaction with hue", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker label="Color" defaultValue="#ff0000" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    const hue = await screen.findByRole("slider", { name: "Hue" });

    hue.focus();

    await browserUserEvent.keyboard("{ArrowRight}");

    expect(onChange).toHaveBeenCalled();
  });

  it("supports native keyboard interaction with opacity", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker label="Color" defaultValue="#ff0000" onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Color" }));

    const opacity = await screen.findByRole("slider", {
      name: "Opacity",
    });

    opacity.focus();

    await browserUserEvent.keyboard("{ArrowLeft}");

    expect(onChange).toHaveBeenCalled();
  });

  it("closes with Escape and restores trigger focus", async () => {
    const user = userEvent.setup();

    render(<ColorPicker label="Color" />);

    const trigger = screen.getByRole("button", { name: "Color" });

    await user.click(trigger);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await browserUserEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("supports keyboard focus on the trigger", async () => {
    render(<ColorPicker label="Color" />);

    await browserUserEvent.tab();

    expect(screen.getByRole("button", { name: "Color" })).toHaveFocus();
  });

  it("does not focus a disabled picker", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>
        <ColorPicker label="Disabled color" disabled />
        <button type="button">After</button>
      </>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "Before" })).toHaveFocus();

    await user.tab();

    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });
});
