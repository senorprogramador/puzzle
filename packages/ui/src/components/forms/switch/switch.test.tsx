import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "./index";

afterEach(() => {
  cleanup();
});

describe("Switch", () => {
  it("exposes switch semantics with its label as name", () => {
    render(<Switch label="Notifications" />);

    expect(screen.getByRole("switch", { name: "Notifications" })).toBeTruthy();
  });

  it("toggles with click and Space", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch label="Notifications" onChange={onChange} />);

    const control = screen.getByRole("switch");

    await user.click(control);
    expect(control).toBeChecked();

    await user.keyboard(" ");
    expect(control).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("supports a controlled checked value", () => {
    const { rerender } = render(
      <Switch label="Mode" checked={false} onChange={() => {}} />,
    );

    expect(screen.getByRole("switch")).not.toBeChecked();

    rerender(<Switch label="Mode" checked onChange={() => {}} />);

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("starts checked with defaultChecked", () => {
    render(<Switch label="Mode" defaultChecked />);

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("links its description with aria-describedby", () => {
    render(<Switch label="Sync" description="Keeps devices in sync" />);

    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "Keeps devices in sync",
    );
  });

  it("does not toggle while disabled", async () => {
    const user = userEvent.setup();

    render(<Switch label="Locked" disabled />);
    await user.click(screen.getByRole("switch"));

    expect(screen.getByRole("switch")).not.toBeChecked();
  });
});
