import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { BookingSection } from "./booking-section";

it("stacks split and sidebar layouts when their container is narrow", async () => {
  await page.viewport(1280, 800);

  const { container } = render(
    <div style={{ width: "360px" }}>
      <BookingSection
        title="Stay details"
        className="booking-sidebar-test"
        variant="sidebar"
        bookingDetails={<p>Two nights</p>}
        priceSummary={<p>€240 total</p>}
      />
      <BookingSection
        title="Guest details"
        className="booking-split-test"
        variant="split"
        formSlot={<p>Guest fields</p>}
        availability={<p>Four rooms are available</p>}
      />
    </div>,
  );

  const frame = container.firstElementChild as HTMLElement;
  const getColumns = (selector: string) => {
    const layout = container.querySelector(
      `${selector} .puzzle-booking-section__layout`,
    );
    return getComputedStyle(layout!).gridTemplateColumns.split(" ");
  };

  expect(getColumns(".booking-sidebar-test")).toHaveLength(1);
  expect(getColumns(".booking-split-test")).toHaveLength(1);

  frame.style.width = "900px";

  expect(getColumns(".booking-sidebar-test")).toHaveLength(2);
  expect(getColumns(".booking-split-test")).toHaveLength(2);
});
