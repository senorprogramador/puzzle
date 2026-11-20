import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AvailabilitySearchSection } from "./availability-search-section";
import type { AvailabilitySearchValues } from "./availability-search-section.types";

afterEach(cleanup);

const validValue: AvailabilitySearchValues = {
  checkIn: new Date(2026, 8, 10),
  checkOut: new Date(2026, 8, 14),
  guests: { adults: 2, children: 1, childAges: [null] },
  accommodationId: "cabin",
  flexibleDates: false,
};

const accommodations = [
  { id: "cabin", name: "Woodland cabin" },
  { id: "house", name: "Family house" },
];

const childAgeOptions = [
  { value: 0, label: "Under 1" },
  { value: 5, label: "5 years" },
  { value: 12, label: "12 years" },
];

describe("AvailabilitySearchSection", () => {
  it("renders required search controls and optional accommodation fields", () => {
    render(
      <AvailabilitySearchSection
        accommodations={accommodations}
        childAgeOptions={childAgeOptions}
        defaultValue={validValue}
        locale="en-US"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Check-in" })).toHaveTextContent(
      "September 10, 2026",
    );
    expect(screen.getByRole("button", { name: "Check-out" })).toHaveTextContent(
      "September 14, 2026",
    );
    expect(screen.getByRole("spinbutton", { name: "Adults" })).toHaveValue("2");
    expect(screen.getByRole("spinbutton", { name: "Children" })).toHaveValue("1");
    expect(screen.getByRole("combobox", { name: "Accommodation" })).toHaveTextContent(
      "Woodland cabin",
    );
    expect(screen.getByRole("combobox", { name: "Child 1 age" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "My dates are flexible" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["same-day departure", new Date(2026, 8, 10)],
    ["departure before arrival", new Date(2026, 8, 9)],
  ])("rejects %s dates before calling the external action", async (_, checkOut) => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{ ...validValue, checkOut }}
        accommodations={accommodations}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(await screen.findByText("Check-out must be after check-in.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("reports missing dates and guest counts outside configured bounds", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onValidationError = vi.fn();
    render(
      <AvailabilitySearchSection
        defaultValue={{ guests: { adults: 0, children: 3 } }}
        minAdults={1}
        maxAdults={4}
        minChildren={0}
        maxChildren={2}
        onValidationError={onValidationError}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(await screen.findByText("Select a valid check-in date.")).toBeInTheDocument();
    expect(screen.getByText("Select a valid check-out date.")).toBeInTheDocument();
    expect(screen.getByText("Enter between 1 and 4 adults.")).toBeInTheDocument();
    expect(screen.getByText("Enter between 0 and 2 children.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onValidationError).toHaveBeenCalledWith(
      expect.objectContaining({
        checkIn: expect.any(String),
        checkOut: expect.any(String),
        adults: expect.any(String),
        children: expect.any(String),
      }),
    );
  });

  it("accepts controlled date selection and guest changes through onChange", () => {
    const onChange = vi.fn();
    const { container } = render(
      <AvailabilitySearchSection
        value={validValue}
        onChange={onChange}
        childAgeOptions={childAgeOptions}
        locale="en-US"
        onSubmit={vi.fn()}
      />,
    );

    const checkInInput = container.querySelector<HTMLInputElement>(
      'input[name="checkIn"]',
    )!;
    fireEvent.change(checkInInput, { target: { value: "2026-09-11" } });

    expect(onChange).toHaveBeenLastCalledWith({
      ...validValue,
      checkIn: new Date(2026, 8, 11),
    });

    fireEvent.change(screen.getByRole("spinbutton", { name: "Children" }), {
      target: { value: "2" },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      ...validValue,
      guests: { adults: 2, children: 2, childAges: [null, null] },
    });
  });

  it("keeps uncontrolled guest counts and child ages synchronized", () => {
    render(
      <AvailabilitySearchSection
        defaultValue={{ guests: { adults: 2, children: 1 } }}
        childAgeOptions={childAgeOptions}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Children" }), {
      target: { value: "2" },
    });

    expect(
      screen.getByRole("combobox", { name: "Child 2 age" }),
    ).toBeInTheDocument();
  });

  it("requires a selected accommodation only when requested", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{ ...validValue, accommodationId: null }}
        accommodations={accommodations}
        accommodationRequired
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(await screen.findByText("Select an accommodation.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("reports when a required accommodation has no available options", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{ ...validValue, accommodationId: null }}
        accommodationRequired
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(
      await screen.findByText("No accommodations are available."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("passes valid values to the external submit callback", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={validValue}
        accommodations={accommodations}
        accommodationRequired
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(validValue));
  });

  it("integrates external validation errors and disabled/loading states", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { rerender } = render(
      <AvailabilitySearchSection
        value={validValue}
        errors={{ checkIn: "Select a date approved by your host." }}
        disabled
        onSubmit={onSubmit}
      />,
    );

    expect(
      screen.getByText("Select a date approved by your host."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search availability" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Search availability" }));
    expect(onSubmit).not.toHaveBeenCalled();

    rerender(
      <AvailabilitySearchSection
        value={validValue}
        loading
        onSubmit={onSubmit}
      />,
    );
    expect(screen.getByRole("button", { name: "Searching..." })).toBeDisabled();
  });

  it("forwards a localized required description to both date pickers", () => {
    render(
      <AvailabilitySearchSection
        value={validValue}
        requiredDescription="Verplicht"
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Check-in" }),
    ).toHaveAccessibleDescription("Verplicht");
    expect(
      screen.getByRole("button", { name: "Check-out" }),
    ).toHaveAccessibleDescription("Verplicht");
  });

  it("announces external action errors without swallowing the failure", async () => {
    const user = userEvent.setup();
    render(
      <AvailabilitySearchSection
        value={validValue}
        onSubmit={async () => {
          throw new Error("Availability service is offline.");
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Availability service is offline.",
    );
  });

  it("rejects child ages that are not in the supplied options", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{
          ...validValue,
          guests: { ...validValue.guests, childAges: [99] },
        }}
        childAgeOptions={childAgeOptions}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(
      await screen.findByText("Choose an age from the available options."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects guest counts above and below configured bounds", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onValidationError = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{
          ...validValue,
          guests: { adults: 21, children: -1, childAges: [] },
        }}
        minAdults={1}
        maxAdults={20}
        minChildren={0}
        maxChildren={5}
        onSubmit={onSubmit}
        onValidationError={onValidationError}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(await screen.findByText("Enter between 1 and 20 adults.")).toBeInTheDocument();
    expect(screen.getByText("Enter between 0 and 5 children.")).toBeInTheDocument();
    expect(onValidationError).toHaveBeenCalledWith(
      expect.objectContaining({
        adults: "Enter between 1 and 20 adults.",
        children: "Enter between 0 and 5 children.",
      }),
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects fractional guest counts and child ages", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <AvailabilitySearchSection
        value={{
          ...validValue,
          guests: { adults: 1.5, children: 1, childAges: [2.5] },
        }}
        childAgeOptions={childAgeOptions}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Search availability" }));

    expect(await screen.findByText("Enter between 1 and 20 adults.")).toBeInTheDocument();
    expect(
      screen.getByText("Choose an age from the available options."),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects invalid guest bounds and duplicate option IDs", () => {
    expect(() =>
      render(
        <AvailabilitySearchSection
          minAdults={2}
          maxAdults={1}
          onSubmit={vi.fn()}
        />,
      ),
    ).toThrow(RangeError);

    expect(() =>
      render(
        <AvailabilitySearchSection
          accommodations={[
            { id: "cabin", name: "Cabin" },
            { id: "cabin", name: "Second cabin" },
          ]}
          onSubmit={vi.fn()}
        />,
      ),
    ).toThrow(TypeError);

    expect(() =>
      render(
        <AvailabilitySearchSection
          childAgeOptions={[{ value: -1, label: "Invalid age" }]}
          onSubmit={vi.fn()}
        />,
      ),
    ).toThrow(TypeError);
  });

  it("supports server rendering without browser-only setup", () => {
    const markup = renderToStaticMarkup(
      <AvailabilitySearchSection
        value={validValue}
        accommodations={accommodations}
        onSubmit={vi.fn()}
      />,
    );

    expect(markup).toContain("<form");
    expect(markup).toContain("Woodland cabin");
  });
});
