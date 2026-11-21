import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useCallback, useState } from "react";
import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent as browserUserEvent } from "vitest/browser";

import { ColorPicker } from "./index";

afterEach(() => {
  cleanup();
});

describe("ColorPicker (browser)", () => {
  it("keeps the trigger ref attached throughout a Playwright color drag", async () => {
    const ref = vi.fn();
    const onChange = vi.fn();
    render(<ColorPicker ref={ref} label="Color" defaultValue="#ff0000" onChange={onChange} />);
    await browserUserEvent.click(screen.getByRole("button", { name: "Color" }));
    const area = await screen.findByRole("group", { name: "Color saturation and brightness" });
    ref.mockClear();
    await browserUserEvent.pointer([
      { target: area, coords: { x: 10, y: 10 }, keys: "[MouseLeft>]" },
      ...Array.from({ length: 20 }, (_, index) => ({
        target: area,
        coords: { x: 10 + index * 3, y: 10 + index * 3 },
      })),
      { target: area, coords: { x: 70, y: 70 }, keys: "[/MouseLeft]" },
    ]);
    expect(onChange.mock.calls.length).toBeGreaterThan(10);
    expect(ref).not.toHaveBeenCalled();
  });

  it("supports dragging when the trigger ref updates its parent", async () => {
    const PickerWithRefState = () => {
      const [attachments, setAttachments] = useState(0);
      const trackTrigger = useCallback((trigger: HTMLButtonElement | null) => {
        if (trigger) setAttachments((count) => count + 1);
      }, []);
      return (
        <>
          <span>Trigger attachments: {attachments}</span>
          <ColorPicker ref={trackTrigger} label="Color" defaultValue="#ff0000" />
        </>
      );
    };
    render(<PickerWithRefState />);
    expect(screen.getByText("Trigger attachments: 1")).toBeInTheDocument();
    await browserUserEvent.click(screen.getByRole("button", { name: "Color" }));
    const area = await screen.findByRole("group", { name: "Color saturation and brightness" });
    await browserUserEvent.pointer([
      { target: area, coords: { x: 10, y: 10 }, keys: "[MouseLeft>]" },
      { target: area, coords: { x: 70, y: 70 } },
      { target: area, coords: { x: 70, y: 70 }, keys: "[/MouseLeft]" },
    ]);
    expect(screen.getByText("Trigger attachments: 1")).toBeInTheDocument();
  });

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

  it("moves keyboard focus between the trigger and the open picker", async () => {
    const user = userEvent.setup();
    render(<ColorPicker label="Color" />);
    const trigger = screen.getByRole("button", { name: "Color" });
    await user.click(trigger);
    const area = await screen.findByRole("group", { name: "Color saturation and brightness" });
    await waitFor(() => expect(area).toBeVisible());
    trigger.focus();
    await browserUserEvent.keyboard("{Tab}");
    expect(area).toHaveFocus();
    await browserUserEvent.keyboard("{Shift>}{Tab}{/Shift}");
    expect(trigger).toHaveFocus();
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
