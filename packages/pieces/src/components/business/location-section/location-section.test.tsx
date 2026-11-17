import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocationSection } from "./location-section";

const locations = [
  {
    id: "harbor",
    name: "Harbor House",
    address: "18 Quay Street, Amsterdam",
    phone: "+31 20 555 0180",
    email: "hello@harbor.example",
    coordinates: { latitude: 52.376, longitude: 4.9 },
    openingHours: [{ day: "Monday", hours: "09:00–18:00" }],
    directionsHref: "/directions/harbor",
    mapSlot: <div>Map preview supplied by the application.</div>,
  },
  {
    id: "garden",
    name: "Garden House",
    address: "4 Park Lane, Utrecht",
    directionsHref: "/directions/garden",
  },
];

describe("LocationSection", () => {
  it("renders location details, contact links, coordinates, hours, and a map slot", () => {
    render(
      <LocationSection
        title="Find our hotels"
        locations={locations}
        selectedLocationId="harbor"
      />,
    );

    expect(screen.getByRole("heading", { name: "Find our hotels" })).toBeVisible();
    expect(screen.getByRole("link", { name: "+31 20 555 0180" })).toHaveAttribute(
      "href",
      "tel:+31 20 555 0180",
    );
    expect(screen.getByRole("link", { name: "hello@harbor.example" })).toHaveAttribute(
      "href",
      "mailto:hello@harbor.example",
    );
    expect(screen.getByText("52.376, 4.9")).toBeVisible();
    expect(screen.getByText("09:00–18:00")).toBeVisible();
    expect(screen.getByRole("region", { name: "Location map" })).toHaveTextContent(
      "Map preview supplied by the application.",
    );
  });

  it("updates the selected location and calls the application callback", () => {
    const onLocationSelect = vi.fn();
    render(
      <LocationSection
        title="Offices"
        variant="interactive"
        locations={locations}
        defaultSelectedLocationId="harbor"
        onLocationSelect={onLocationSelect}
      />,
    );

    const garden = screen.getByRole("button", { name: /Garden House/ });
    fireEvent.click(garden);
    expect(onLocationSelect).toHaveBeenCalledWith("garden");
    expect(garden).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: "Garden House" })).toBeVisible();
  });

  it("shows a useful empty state when no locations are supplied", () => {
    render(<LocationSection title="Our offices" locations={[]} />);
    expect(screen.getByRole("heading", { name: "No locations available" })).toBeVisible();
  });
});
