import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { DateRangePicker } from "./index";

describe("DateRangePicker (browser)", () => {
  it("supports keyboard range selection and focus restoration", async () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Stay dates"
        locale="en-GB"
        defaultValue={{ start: new Date(2025, 2, 14), end: null }}
        onChange={onChange}
      />,
    );

    await userEvent.tab();
    const trigger = screen.getByRole("button", { name: "Stay dates" });
    expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Friday, 14 March 2025" })).toHaveFocus();
    });
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Stay dates" })).toHaveFocus();
    });
    expect(onChange).toHaveBeenLastCalledWith({
      start: new Date(2025, 2, 14),
      end: new Date(2025, 2, 15),
    });
  });
});
