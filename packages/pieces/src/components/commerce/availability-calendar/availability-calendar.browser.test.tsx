import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { AvailabilityCalendar } from "./index";

describe("AvailabilityCalendar (browser)", () => {
  it("selects a supplied available stay range", async () => {
    const onChange = vi.fn();
    render(
      <AvailabilityCalendar
        availability={Array.from({ length: 8 }, (_, index) => ({
          date: new Date(2025, 2, 14 + index),
          status: "available" as const,
        }))}
        defaultValue={{ start: new Date(2025, 2, 14), end: null }}
        onChange={onChange}
        locale="en-GB"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Choose check-in and check-out" }));
    await userEvent.click(screen.getByRole("button", { name: "Tuesday, 18 March 2025" }));
    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith({
        start: new Date(2025, 2, 14),
        end: new Date(2025, 2, 18),
      });
    });
  });
});
