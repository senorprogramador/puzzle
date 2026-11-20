import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Dialog } from "@puzzle-ui/ui";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { TableReservationSection } from "./table-reservation-section";
import type { TableReservationValues } from "./table-reservation-section.types";

afterEach(cleanup);

const reservation: TableReservationValues = {
  date: "2026-06-15",
  time: "19:00",
  partySize: 4,
  seating: "any",
  seatingPreference: "",
  specialRequests: "",
  guestName: "Alex Morgan",
  email: "alex@example.com",
  phone: "",
};

describe("TableReservationSection browser behavior", () => {
  it("keeps form controls within the viewport from narrow mobile through desktop", async () => {
    const { container } = render(
      <TableReservationSection
        title="Reserve a table with a long heading that should wrap naturally"
        defaultValue={reservation}
        onSubmit={() => undefined}
      />,
    );
    const section = container.querySelector<HTMLElement>(
      ".puzzle-table-reservation-section",
    )!;
    const fields = section.querySelector<HTMLElement>(
      ".puzzle-table-reservation-section__fields",
    )!;

    for (const [width, height] of [
      [320, 568],
      [375, 812],
      [430, 932],
      [540, 900],
      [768, 1024],
      [900, 900],
      [1024, 1366],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
    ] as const) {
      await page.viewport(width, height);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      expect(fields.scrollWidth).toBeLessThanOrEqual(fields.clientWidth);
    }

    await page.viewport(375, 812);
    expect(
      getComputedStyle(fields).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);

    await page.viewport(1440, 900);
    expect(
      getComputedStyle(fields).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });

  it("fits inside an existing dialog and keeps keyboard focus available", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        title="Reserve a table"
        description="Choose a date and time."
        footer={<Button>Close</Button>}
      >
        <TableReservationSection
          defaultValue={reservation}
          onSubmit={() => undefined}
        />
      </Dialog>,
    );
    await page.viewport(320, 568);
    const dialog = screen.getByRole("dialog", { name: "Reserve a table" });
    const fields = dialog.querySelector<HTMLElement>(
      ".puzzle-table-reservation-section__fields",
    )!;

    expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
    expect(dialog.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
    expect(dialog.getBoundingClientRect().right).toBeLessThanOrEqual(321);

    const dateButton = screen.getByRole("button", { name: "Date" });
    dateButton.focus();
    expect(dateButton).toHaveFocus();
    await user.keyboard("{Tab}");
    expect(document.activeElement).not.toBe(dateButton);
    expect(fields.scrollWidth).toBeLessThanOrEqual(fields.clientWidth);
  });
});
