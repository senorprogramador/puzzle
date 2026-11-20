import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccommodationOverviewSection } from "./accommodation-overview-section";
import type { AccommodationOverviewItem } from "../accommodation.types";

const accommodations: AccommodationOverviewItem[] = [
  {
    id: "pinecone-cabin",
    name: "Pinecone Cabin",
    description: "A compact woodland stay for two.",
    image: { src: "", alt: "Cabin photograph not supplied" },
    capacity: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    price: { amount: 125, currency: "EUR" },
    priceNote: "per night",
    badges: [{ id: "quiet", content: "Quiet setting" }],
    highlights: [{ id: "fireplace", label: "Wood-burning stove" }],
    href: "/pinecone-cabin",
    featured: true,
  },
  {
    id: "willow-house",
    name: "Willow House",
    description: "A comfortable family home with room to gather.",
    capacity: 6,
    bedrooms: 3,
    beds: 5,
    bathrooms: 2,
  },
  {
    id: "shoreline-lodge",
    name: `${"Shoreline Lodge ".repeat(12)}for extended stays`,
    description: "A coastal home with a longer description. ".repeat(8),
    image: {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'/%3E",
      alt: "Shoreline Lodge beside the sea",
    },
    capacity: 8,
    bedrooms: 4,
    beds: 6,
    bathrooms: 3,
    highlights: [
      { id: "sauna", label: "Private sauna" },
      { id: "shore", label: "Direct beach access" },
    ],
  },
];

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 16),
  );
  vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AccommodationOverviewSection", () => {
  it("renders a minimal section and keeps an empty collection valid", () => {
    const { container } = render(<AccommodationOverviewSection items={[]} />);

    expect(container.querySelector("section.puzzle-accommodation-overview")).not.toBeNull();
    expect(container.querySelector(".puzzle-accommodation-overview__items")).toBeNull();
  });

  it.each(["grid", "list", "carousel"] as const)(
    "renders the %s presentation",
    (variant) => {
      const { container } = render(
        <AccommodationOverviewSection
          variant={variant}
          items={accommodations.slice(0, 2)}
          title="Places to stay"
        />,
      );

      expect(container.querySelector("[data-variant]")).toHaveAttribute(
        "data-variant",
        variant,
      );
      expect(screen.getByRole("heading", { name: "Pinecone Cabin" })).toBeVisible();
      expect(screen.getByRole("heading", { name: "Willow House" })).toBeVisible();
      if (variant === "carousel") {
        expect(
          screen.getByRole("group", { name: "Accommodations" }),
        ).toBeInTheDocument();
      }
    },
  );

  it("renders accommodation metadata, badges, highlights, prices, and missing-image fallback", () => {
    render(
      <AccommodationOverviewSection
        items={accommodations}
        locale="nl-NL"
        title="Places to stay"
      />,
    );

    expect(screen.getByText("Featured")).toBeVisible();
    expect(screen.getByText("Quiet setting")).toBeVisible();
    expect(screen.getByText("Wood-burning stove")).toBeVisible();
    expect(screen.getAllByText("Guests")).toHaveLength(3);
    expect(screen.getByText("0")).toBeVisible();
    expect(screen.getByText("per night")).toBeVisible();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/pinecone-cabin",
    );
    expect(
      screen.getByRole("img", {
        name: "Cabin photograph not supplied unavailable",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: `${"Shoreline Lodge ".repeat(12)}for extended stays`,
      }),
    ).toBeVisible();
  });

  it("renders caller-provided CTA content and invokes its callback", async () => {
    const user = userEvent.setup();
    const onReserve = vi.fn();
    render(
      <AccommodationOverviewSection
        items={[
          {
            id: "reserve",
            name: "Reserve by request",
            action: (
              <button type="button" onClick={onReserve}>
                Ask about this stay
              </button>
            ),
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Ask about this stay" }));
    expect(onReserve).toHaveBeenCalledOnce();
  });

  it("rejects duplicate IDs and invalid accommodation counts", () => {
    expect(() =>
      render(
        <AccommodationOverviewSection
          items={[
            { id: "duplicate", name: "First" },
            { id: "duplicate", name: "Second" },
          ]}
        />,
      ),
    ).toThrow("Accommodation IDs must be non-empty and unique.");
    expect(() =>
      render(
        <AccommodationOverviewSection
          items={[{ id: "invalid", name: "Invalid", beds: -1 }]}
        />,
      ),
    ).toThrow('Accommodation "invalid" beds must be a non-negative safe integer.');
  });

  it("server-renders the static grid composition", () => {
    expect(
      renderToString(
        <AccommodationOverviewSection items={accommodations.slice(0, 1)} />,
      ),
    ).toContain("Pinecone Cabin");
  });
});
