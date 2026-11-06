import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { DatePicker } from "./index";

describe("DatePicker (browser)", () => {
  it("opens from the keyboard, skips unavailable days, and returns focus after selection", async () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Appointment"
        locale="en-GB"
        defaultValue={new Date(2025, 2, 14)}
        disabledDates={[new Date(2025, 2, 15)]}
        onChange={onChange}
      />,
    );

    await userEvent.tab();
    const trigger = screen.getByRole("button", { name: "Appointment" });
    expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Friday, 14 March 2025" }),
      ).toHaveFocus();
    });

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sunday, 16 March 2025" }),
      ).toHaveFocus();
    });

    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith(new Date(2025, 2, 16));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("moves focus across month boundaries and restores focus on Escape", async () => {
    render(
      <DatePicker
        label="Appointment"
        locale="en-GB"
        defaultValue={new Date(2025, 0, 31)}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Appointment" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Friday, 31 January 2025" }),
      ).toHaveFocus();
    });

    await userEvent.keyboard("{PageDown}");
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Friday, 28 February 2025" }),
      ).toHaveFocus();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Appointment" })).toHaveFocus();
    });
  });
});
