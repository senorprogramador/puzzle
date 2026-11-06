import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DatePicker } from "./index";

const createDate = (year: number, month: number, day: number): Date =>
  new Date(year, month - 1, day);

// Popout uses element measurements for positioning.
// jsdom has no actual layout, so provide stable measurements.
beforeEach(() => {
  const rect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 160,
    bottom: 40,
    width: 160,
    height: 40,
    toJSON: () => ({}),
  } as DOMRect;

  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(rect);

  vi.spyOn(Element.prototype, "getClientRects").mockReturnValue([
    rect,
  ] as unknown as DOMRectList);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DatePicker", () => {
  it("renders an accessible trigger with a label", () => {
    render(
      <DatePicker label="Birth date" placeholder="Choose your birth date" />,
    );

    const trigger = screen.getByRole("button", {
      name: "Birth date",
    });

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-labelledby");
    expect(trigger).not.toHaveAttribute("aria-controls");

    expect(trigger).toHaveTextContent("Choose your birth date");
  });

  it("supports an aria-label without a visible label", () => {
    render(<DatePicker aria-label="Choose appointment date" />);

    expect(
      screen.getByRole("button", {
        name: "Choose appointment date",
      }),
    ).toBeInTheDocument();
  });

  it("opens the calendar when the trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 15)}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: "Date",
    });

    await user.click(trigger);

    expect(
      await screen.findByRole("dialog", {
        name: "Choose date",
      }),
    ).toBeInTheDocument();

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Saturday, 15 March 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("selects a date and closes the calendar", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 15)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await user.click(
      await screen.findByRole("button", {
        name: "Sunday, 16 March 2025",
      }),
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(createDate(2025, 3, 16));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent(
      "16 March 2025",
    );
  });

  it("supports controlled values", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        value={createDate(2025, 3, 15)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await user.click(
      await screen.findByRole("button", {
        name: "Sunday, 16 March 2025",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(createDate(2025, 3, 16));

    // The parent has not updated the controlled value.
    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent(
      "15 March 2025",
    );
  });

  it("disables dates outside minDate and maxDate", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 15)}
        minDate={createDate(2025, 3, 10)}
        maxDate={createDate(2025, 3, 20)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    const beforeMin = await screen.findByRole("button", {
      name: "Sunday, 9 March 2025",
    });

    const afterMax = screen.getByRole("button", {
      name: "Friday, 21 March 2025",
    });

    expect(beforeMin).toBeDisabled();
    expect(afterMax).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Monday, 10 March 2025",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Thursday, 20 March 2025",
      }),
    ).toBeEnabled();
  });

  it("supports explicitly disabled dates", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 15)}
        minDate={createDate(2025, 3, 1)}
        maxDate={createDate(2025, 3, 31)}
        disabledDates={[createDate(2025, 3, 15), createDate(2025, 3, 16)]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    expect(
      await screen.findByRole("button", {
        name: "Saturday, 15 March 2025",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Sunday, 16 March 2025",
      }),
    ).toBeDisabled();
  });

  it("supports shouldDisableDate", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 14)}
        shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    expect(
      await screen.findByRole("button", {
        name: "Saturday, 15 March 2025",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Friday, 14 March 2025",
      }),
    ).toBeEnabled();
  });

  it("skips disabled dates with ArrowRight", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 14)}
        disabledDates={[createDate(2025, 3, 15)]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 14 March 2025",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{ArrowRight}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sunday, 16 March 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("navigates seven days with ArrowDown", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 14)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 14 March 2025",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 21 March 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("supports Home and End navigation", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        weekStartsOn={1}
        defaultValue={createDate(2025, 3, 12)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Wednesday, 12 March 2025",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{Home}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Monday, 10 March 2025",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{End}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Sunday, 16 March 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("supports PageDown and clamps dates at month boundaries", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 1, 31)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 31 January 2025",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{PageDown}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 28 February 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("supports yearly navigation with Shift + PageDown", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2024, 2, 29)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Thursday, 29 February 2024",
        }),
      ).toHaveFocus();
    });

    await user.keyboard("{Shift>}{PageDown}{/Shift}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Friday, 28 February 2025",
        }),
      ).toHaveFocus();
    });
  });

  it("closes on Escape and restores trigger focus", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Date" defaultValue={createDate(2025, 3, 15)} />);

    const trigger = screen.getByRole("button", {
      name: "Date",
    });

    await user.click(trigger);

    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      expect(trigger).toHaveFocus();
    });
  });

  it("clears the selected date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        label="Date"
        locale="en-GB"
        defaultValue={createDate(2025, 3, 15)}
        clearable
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Clear date",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(null);

    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent(
      "Select date",
    );
  });

  it("does not allow clearing a required date", () => {
    render(
      <DatePicker
        label="Date"
        defaultValue={createDate(2025, 3, 15)}
        clearable
        required
      />,
    );

    expect(
      screen.queryByRole("button", {
        name: "Clear date",
      }),
    ).not.toBeInTheDocument();
  });

  it("uses the requested locale for month and weekday names", async () => {
    const user = userEvent.setup();

    render(
      <DatePicker
        label="Datum"
        locale="nl-NL"
        defaultValue={createDate(2025, 3, 15)}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Datum" }));

    const dialog = await screen.findByRole("dialog");
    const grid = within(dialog).getByRole("grid");

    expect(within(dialog).getByText("maart 2025")).toBeInTheDocument();

    const headers = within(grid).getAllByRole("columnheader");

    expect(headers[0]).toHaveAttribute("aria-label", "maandag");

    expect(headers[6]).toHaveAttribute("aria-label", "zondag");

    expect(screen.getByRole("button", { name: "Datum" })).toHaveTextContent(
      "15 maart 2025",
    );
  });

  it("supports native form submission values", () => {
    const { container } = render(
      <form>
        <DatePicker
          label="Appointment"
          name="appointment"
          defaultValue={createDate(2025, 3, 15)}
        />
      </form>,
    );

    const input = container.querySelector(
      'input[type="date"][name="appointment"]',
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("2025-03-15");
  });

  it("supports native minimum and maximum date attributes", () => {
    const { container } = render(
      <form>
        <DatePicker
          label="Appointment"
          name="appointment"
          minDate={createDate(2025, 3, 10)}
          maxDate={createDate(2025, 3, 20)}
        />
      </form>,
    );

    const input = container.querySelector('input[type="date"]');

    expect(input).toHaveAttribute("min", "2025-03-10");
    expect(input).toHaveAttribute("max", "2025-03-20");
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();

    render(<DatePicker label="Date" disabled />);

    const trigger = screen.getByRole("button", {
      name: "Date",
    });

    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
