import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "./index";

const date = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

beforeEach(() => {
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 240,
    bottom: 40,
    width: 240,
    height: 40,
    toJSON: () => ({}),
  } as DOMRect;
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([rect] as unknown as DOMRectList);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DateRangePicker", () => {
  it("selects a complete range and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Stay dates"
        locale="en-GB"
        defaultValue={{ start: date(2025, 3, 14), end: null }}
        onChange={onChange}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Stay dates" });
    await user.click(trigger);
    await user.click(await screen.findByRole("button", { name: "Tuesday, 18 March 2025" }));

    expect(onChange).toHaveBeenLastCalledWith({
      start: date(2025, 3, 14),
      end: date(2025, 3, 18),
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it("does not accept an invalid range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onValidationError = vi.fn();
    render(
      <DateRangePicker
        label="Stay dates"
        locale="en-GB"
        defaultValue={{ start: date(2025, 3, 14), end: null }}
        onChange={onChange}
        onValidationError={onValidationError}
        validateRange={(range) =>
          range.start && range.end && range.end.getDate() - range.start.getDate() < 2
            ? "Stay at least two nights."
            : undefined
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Stay dates" }));
    await user.click(await screen.findByRole("button", { name: "Saturday, 15 March 2025" }));
    await user.click(screen.getByRole("button", { name: "Sunday, 16 March 2025" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onValidationError).toHaveBeenCalledWith("Stay at least two nights.");
  });

  it("renders a selected range and disabled dates", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Stay dates"
        locale="en-GB"
        defaultValue={{ start: date(2025, 3, 15), end: date(2025, 3, 18) }}
        disabledDates={[date(2025, 3, 17)]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Stay dates" }));
    expect(screen.getByRole("button", { name: "Monday, 17 March 2025" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Saturday, 15 March 2025" })).toHaveAttribute(
      "data-range-start",
      "true",
    );
    expect(screen.getByRole("button", { name: "Tuesday, 18 March 2025" })).toHaveAttribute(
      "data-range-end",
      "true",
    );
  });
});
