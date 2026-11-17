import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BookingSection } from "./booking-section";

describe("BookingSection", () => {
  it("submits caller-provided fields and announces success", async () => {
    const onSubmit = vi.fn(async (_formData: FormData) => {});
    render(
      <BookingSection
        title="Reserve a table"
        variant="restaurant"
        calendar={
          <label>
            Date
            <input name="date" type="date" defaultValue="2026-12-02" required />
          </label>
        }
        formSlot={
          <label>
            Guests
            <input name="guests" type="number" defaultValue="4" required />
          </label>
        }
        priceSummary={<p>Estimated total: €160</p>}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Confirm booking" }).closest("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted).toBeInstanceOf(FormData);
    expect(submitted?.get("date")).toBe("2026-12-02");
    expect(submitted?.get("guests")).toBe("4");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Your booking request was received.",
    );
  });

  it("supports multi-step selection, disabled steps, and loading state", () => {
    const onStepChange = vi.fn();
    render(
      <BookingSection
        title="Book a room"
        variant="multi-step"
        currentStepId="dates"
        onStepChange={onStepChange}
        steps={[
          { id: "dates", title: "Choose dates", completed: true },
          { id: "guests", title: "Guest details" },
          { id: "payment", title: "Payment", disabled: true },
        ]}
        loading
        onSubmit={() => {}}
        calendar={<p>Calendar slot</p>}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Booking progress" })).toHaveAttribute(
      "aria-valuenow",
      "33",
    );
    expect(screen.getByRole("button", { name: "Choose dates" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    fireEvent.click(screen.getByRole("button", { name: "Guest details" }));
    expect(onStepChange).toHaveBeenCalledWith("guests");
    expect(screen.getByRole("button", { name: "Submitting booking…" })).toBeDisabled();
    expect(
      screen.getByRole("heading", { name: "Book a room" }).closest("section"),
    ).toHaveAttribute("aria-busy", "true");
  });

  it("surfaces rejected booking submissions", async () => {
    render(
      <BookingSection
        title="Book a stay"
        onSubmit={async () => {
          throw new Error("Dates are no longer available.");
        }}
        formSlot={<input name="email" type="email" defaultValue="guest@example.com" />}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: "Confirm booking" }).closest("form")!);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Dates are no longer available.",
    );
  });
});
