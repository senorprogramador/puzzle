import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TableReservationSection } from "./table-reservation-section";
import type { TableReservationValues } from "./table-reservation-section.types";

afterEach(cleanup);

const reservation: TableReservationValues = {
  date: "2026-06-15",
  time: "19:00",
  partySize: 4,
  seating: "indoor",
  seatingPreference: "Window if available",
  specialRequests: "A high chair",
  guestName: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 555 0100",
};

describe("TableReservationSection", () => {
  it("renders labeled reservation fields and preserves local calendar values", () => {
    render(
      <TableReservationSection
        title="Reserve a table"
        defaultValue={reservation}
        locale="en-US"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent(
      "June 15, 2026",
    );
    expect(screen.getByLabelText("Time", { exact: false })).toHaveValue("19:00");
    expect(screen.getByRole("spinbutton", { name: "Party size" })).toHaveValue(
      "4",
    );
    expect(screen.getByRole("combobox", { name: "Seating" })).toHaveTextContent(
      "Indoors",
    );
    expect(screen.getByLabelText("Name", { exact: false })).toHaveValue(
      "Alex Morgan",
    );
    expect(screen.getByLabelText("Email", { exact: false })).toHaveValue(
      "alex@example.com",
    );
    expect(screen.getByLabelText("Phone")).toHaveValue("+1 555 0100");
    expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText("Special requests")).toHaveValue("A high chair");
  });

  it("forwards a localized required description to the date picker", () => {
    render(
      <TableReservationSection
        defaultValue={reservation}
        requiredDescription="Verplicht"
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Date" }),
    ).toHaveAccessibleDescription("Verplicht");
  });

  it("reports invalid dates, times, party sizes, and required contact data before submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onValidationError = vi.fn();
    render(
      <TableReservationSection
        defaultValue={{
          date: "2026-02-30",
          time: "29:95",
          partySize: 0,
          guestName: "",
          email: "not-an-email",
        }}
        minPartySize={2}
        maxPartySize={8}
        onSubmit={onSubmit}
        onValidationError={onValidationError}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Request a table" }));

    expect(await screen.findByText("Choose a valid reservation date.")).toBeInTheDocument();
    expect(screen.getByText("Choose a valid reservation time.")).toBeInTheDocument();
    expect(screen.getByText("Choose a party size from 2 to 8.")).toBeInTheDocument();
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(
      expect.objectContaining({
        date: expect.any(String),
        time: expect.any(String),
        partySize: expect.any(String),
        guestName: expect.any(String),
        email: expect.any(String),
      }),
    );
    expect(screen.getByRole("button", { name: "Date" })).toHaveFocus();
  });

  it("supports controlled input updates without mutating controlled values", () => {
    const onChange = vi.fn();
    render(
      <TableReservationSection
        value={reservation}
        onChange={onChange}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Time", { exact: false }), {
      target: { value: "20:15" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...reservation,
      time: "20:15",
    });
    expect(screen.getByLabelText("Time", { exact: false })).toHaveValue("19:00");
  });

  it("submits valid caller data and focuses the success announcement", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    render(
      <TableReservationSection
        defaultValue={reservation}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Request a table" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(reservation);
      expect(screen.getByRole("status")).toHaveFocus();
    });
  });

  it("renders asynchronous errors, externally controlled states, and a provider link", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {
      throw new Error("Provider unavailable.");
    });
    const { rerender } = render(
      <TableReservationSection
        defaultValue={reservation}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Request a table" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Provider unavailable.",
    );

    rerender(
      <TableReservationSection
        defaultValue={reservation}
        onSubmit={vi.fn()}
        loading
      />,
    );
    expect(screen.getByRole("button", { name: "Sending request…" })).toBeDisabled();
    expect(screen.getByLabelText("Name", { exact: false })).toBeDisabled();

    rerender(
      <TableReservationSection
        bookingHref="https://reservations.example.test/restaurant"
        bookingLinkLabel="Book with provider"
      />,
    );
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Book with provider" }),
    ).toHaveAttribute(
      "href",
      "https://reservations.example.test/restaurant",
    );
  });

  it("renders custom validation feedback and server-renders safely", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <TableReservationSection
        defaultValue={reservation}
        errors={{ guestName: "Please confirm the reservation name." }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Request a table" }));
    expect(
      await screen.findByText("Please confirm the reservation name."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    const markup = renderToStaticMarkup(
      <TableReservationSection defaultValue={reservation} onSubmit={vi.fn()} />,
    );
    expect(markup).toContain("Request a table");
    expect(markup).toContain("June 15, 2026");
  });
});
