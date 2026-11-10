import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { TimePicker } from "./index";

afterEach(() => {
  cleanup();
});

describe("TimePicker", () => {
  it("renders an accessible time input with a label", () => {
    render(<TimePicker label="Appointment time" />);

    const input = screen.getByLabelText("Appointment time");

    expect(input).toHaveAttribute("type", "time");
    expect(input).toHaveAttribute("id");
  });

  it("supports an aria-label without a visible label", () => {
    render(<TimePicker aria-label="Choose appointment time" />);

    expect(screen.getByLabelText("Choose appointment time")).toHaveAttribute(
      "type",
      "time",
    );
  });

  it("supports uncontrolled values", () => {
    render(<TimePicker label="Time" defaultValue="09:30" />);

    expect(screen.getByLabelText("Time")).toHaveValue("09:30");
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker label="Time" value="09:30" onChange={onChange} />);

    const input = screen.getByLabelText("Time");

    await user.clear(input);
    await user.type(input, "1030");

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("09:30");
  });

  it("emits null when the value is cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker label="Time" defaultValue="09:30" onChange={onChange} />,
    );

    await user.clear(screen.getByLabelText("Time"));

    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("supports seconds", () => {
    render(<TimePicker label="Time" defaultValue="09:30" showSeconds />);

    const input = screen.getByLabelText("Time");

    expect(input).toHaveValue("09:30:00");
    expect(input).toHaveAttribute("step", "1");
  });

  it("supports minute steps", () => {
    render(<TimePicker label="Time" minuteStep={15} />);

    expect(screen.getByLabelText("Time")).toHaveAttribute("step", "900");
  });

  it("supports second steps", () => {
    render(<TimePicker label="Time" showSeconds secondStep={5} />);

    expect(screen.getByLabelText("Time")).toHaveAttribute("step", "5");
  });

  it("supports minimum and maximum times", () => {
    render(<TimePicker label="Time" minTime="09:00" maxTime="17:00" />);

    const input = screen.getByLabelText("Time");

    expect(input).toHaveAttribute("min", "09:00");
    expect(input).toHaveAttribute("max", "17:00");
  });

  it("supports required fields", () => {
    render(<TimePicker label="Time" required />);

    expect(screen.getByLabelText(/Time/)).toBeRequired();
  });

  it("supports disabled and read-only states", () => {
    const { rerender } = render(<TimePicker label="Time" disabled />);

    expect(screen.getByLabelText("Time")).toBeDisabled();

    rerender(<TimePicker label="Time" readOnly />);

    expect(screen.getByLabelText("Time")).toHaveAttribute("readonly");
  });

  it("renders descriptions and validation errors", () => {
    render(
      <TimePicker
        label="Time"
        description="Available between 09:00 and 17:00."
        error="Choose an available time."
      />,
    );

    const input = screen.getByLabelText("Time");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Available between 09:00 and 17:00. Choose an available time.",
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose an available time.",
    );
  });

  it("uses a default validation message", () => {
    render(<TimePicker label="Time" error />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid time");
  });

  it("associates the input with a native form", () => {
    render(
      <form aria-label="Appointment">
        <TimePicker label="Time" name="appointment" defaultValue="09:30" />
      </form>,
    );

    const input = screen.getByLabelText("Time");

    expect(input).toHaveAttribute("name", "appointment");
    expect(input).toHaveValue("09:30");
  });

  it("marks an invalid configuration as disabled", () => {
    render(<TimePicker label="Time" minTime="17:00" maxTime="09:00" />);

    expect(screen.getByLabelText("Time")).toBeDisabled();
  });

  it("supports custom IDs and classes", () => {
    const { container } = render(
      <TimePicker
        id="meeting-time"
        label="Meeting"
        className="custom-input"
        rootClassName="custom-root"
      />,
    );

    expect(screen.getByLabelText("Meeting")).toHaveAttribute(
      "id",
      "meeting-time",
    );

    expect(container.firstChild).toHaveClass("custom-root");
    expect(screen.getByLabelText("Meeting")).toHaveClass("custom-input");
  });
});
