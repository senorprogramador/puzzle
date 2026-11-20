import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Theme } from "@puzzle-ui/theme";
import { AccommodationDetailsSection } from "./accommodation-details-section";
import { AccommodationOverviewSection } from "./accommodation-overview-section";
import { AmenityListSection } from "./amenity-list-section";

const viewportWidths = [
  320, 375, 430, 540, 768, 900, 1024, 1280, 1366, 1440, 1920,
];

afterEach(cleanup);

describe("accommodation section responsive layouts", () => {
  it("keeps overview cards fluid and the page free of horizontal overflow", async () => {
    const { container } = render(
      <AccommodationOverviewSection
        items={[
          {
            id: "small",
            name: "Small stay",
            description: "A short description.",
            capacity: 2,
          },
          {
            id: "family",
            name: `${"Family house ".repeat(12)}by the river`,
            description: "A detailed description. ".repeat(20),
            capacity: 6,
            bedrooms: 3,
            beds: 5,
            bathrooms: 2,
          },
          {
            id: "coast",
            name: "Coastal lodge",
            image: {
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'/%3E",
              alt: "Coastal lodge",
            },
            capacity: 8,
          },
        ]}
      />,
    );
    const grid = container.querySelector(
      ".puzzle-accommodation-overview__items",
    )!;

    for (const width of viewportWidths) {
      await page.viewport(width, 900);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      const card = container.querySelector(
        ".puzzle-accommodation-overview__card",
      )!;
      expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    }

    await page.viewport(320, 900);
    expect(
      getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
    await page.viewport(1440, 900);
    expect(
      getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });

  it("adapts list and details layouts across the available viewport matrix", async () => {
    const { container } = render(
      <>
        <AccommodationOverviewSection
          variant="list"
          items={[
            {
              id: "list",
              name: "List stay",
              image: { src: "", alt: "Missing accommodation photo" },
              capacity: 4,
            },
          ]}
        />
        <AccommodationDetailsSection
          accommodation={{ name: "Details stay", capacity: 4 }}
          variant="split"
          media={<div>Media slot</div>}
        />
        <AmenityListSection
          categories={[
            {
              id: "essentials",
              name: "Essentials",
              items: [
                { id: "wifi", label: "Wi-Fi" },
                { id: "heat", label: "Heating" },
              ],
            },
          ]}
        />
      </>,
    );
    const listCard = container.querySelector(
      ".puzzle-accommodation-overview__card",
    )!;
    const detailsLayout = container.querySelector(
      ".puzzle-accommodation-details__layout",
    )!;
    const amenities = container.querySelector(
      ".puzzle-amenity-list__categories",
    )!;

    for (const width of viewportWidths) {
      await page.viewport(width, 900);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      expect(listCard.scrollWidth).toBeLessThanOrEqual(listCard.clientWidth);
    }

    await page.viewport(375, 900);
    expect(
      getComputedStyle(listCard).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
    expect(
      getComputedStyle(detailsLayout).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
    expect(
      getComputedStyle(amenities).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);

    await page.viewport(1024, 900);
    expect(
      getComputedStyle(listCard).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(2);
    expect(
      getComputedStyle(detailsLayout).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(2);
    expect(
      getComputedStyle(amenities).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });

  it("keeps the existing UI carousel responsive without page overflow", async () => {
    const { container } = render(
      <AccommodationOverviewSection
        variant="carousel"
        items={[
          { id: "first", name: "First stay" },
          { id: "second", name: "Second stay" },
          { id: "third", name: "Third stay" },
        ]}
      />,
    );

    for (const width of viewportWidths) {
      await page.viewport(width, 900);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
    }

    expect(
      container.querySelector(".puzzle-carousel__viewport"),
    ).not.toBeNull();
  });

  it("keeps collapsible amenity summaries in the keyboard tab order", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AmenityListSection
        categories={[
          {
            id: "comfort",
            name: "Comfort",
            items: [{ id: "wifi", label: "Wi-Fi" }],
          },
        ]}
        collapsible
      />,
    );
    const details = container.querySelector("details")!;
    const summary = container.querySelector("summary")!;

    await user.tab();
    expect(summary).toHaveFocus();
    expect(details).not.toHaveAttribute("open");
  });

  it.each(["light", "dark"] as const)(
    "renders with the %s theme",
    (theme) => {
      render(
        <Theme theme={theme}>
          <AccommodationOverviewSection
            items={[{ id: theme, name: "Themed stay", capacity: 2 }]}
          />
          <AccommodationDetailsSection
            accommodation={{ name: "Themed detail" }}
          />
          <AmenityListSection
            categories={[
              {
                id: theme,
                name: "Themed category",
                items: [{ id: `${theme}-wifi`, label: "Wi-Fi" }],
              },
            ]}
          />
        </Theme>,
      );

      expect(document.body.textContent).toContain("Themed stay");
      expect(document.body.textContent).toContain("Themed detail");
      expect(document.body.textContent).toContain("Themed category");
    },
  );
});
