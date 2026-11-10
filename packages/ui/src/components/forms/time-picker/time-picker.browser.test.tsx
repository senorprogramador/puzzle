import { render, screen, waitFor } from "@testing-library/react";
import type { SubmitEvent } from "react";

import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { TimePicker } from "./index";

describe("TimePicker (browser)", () => {
  it("supports keyboard focus and native time input interaction", async () => {
    render(<TimePicker label="Appointment" defaultValue="09:30" />);

    await userEvent.tab();

    const input = screen.getByLabelText("Appointment");

    expect(input).toHaveFocus();
    expect(input).toHaveValue("09:30");
  });

  it("supports seconds in the native time input", async () => {
    render(
      <TimePicker label="Precise time" defaultValue="09:30:45" showSeconds />,
    );

    const input = screen.getByLabelText("Precise time");

    expect(input).toHaveValue("09:30:45");
    expect(input).toHaveAttribute("step", "1");
  });

  it("integrates with native form validation", async () => {
    const onSubmit = vi.fn((event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <form onSubmit={onSubmit}>
        <TimePicker label="Appointment" name="appointment" required />
        <button type="submit">Submit</button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).not.toHaveBeenCalled();

    const input = screen.getByLabelText(/Appointment/);

    expect(input).toBeInvalid();
  });

  it("submits the selected time through FormData", async () => {
    let submittedTime = "";

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const data = new FormData(event.currentTarget);

          submittedTime = String(data.get("appointment"));
        }}
      >
        <TimePicker
          label="Appointment"
          name="appointment"
          defaultValue="09:30"
          required
        />

        <button type="submit">Submit</button>
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submittedTime).toBe("09:30");
    });
  });
});
