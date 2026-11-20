import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocalGuideSection } from "./local-guide-section";

describe("LocalGuideSection", () => {
  it("presents supplied places, distances, travel times, and optional map content", () => {
    render(
      <LocalGuideSection
        title="Explore nearby"
        places={[
          {
            id: "coast-path",
            title: "Coastal path",
            category: "Outdoors",
            kind: "Walk",
            description: "A quiet route along the shoreline.",
            distance: "1.2 km",
            travelTime: "15 minutes on foot",
            href: "https://example.test/coast-path",
          },
          {
            id: "market",
            title: "Saturday market",
            category: "Food",
            kind: "Market",
            distance: "800 m",
          },
        ]}
        mapSlot={<div>Map supplied by the app</div>}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Coastal path" }),
    ).toHaveAttribute("href", "https://example.test/coast-path");
    expect(screen.getByRole("heading", { name: "Saturday market" })).toBeVisible();
    expect(screen.getByText("1.2 km")).toBeVisible();
    expect(screen.getByText("15 minutes on foot")).toBeVisible();
    expect(
      screen.getByRole("group", { name: "Local guide map" }),
    ).toHaveTextContent("Map supplied by the app");
  });

  it("does not turn entries without a supplied link into fake links", () => {
    render(
      <LocalGuideSection
        title="Nearby"
        places={[{ id: "museum", title: "Small town museum" }]}
        filterable={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Small town museum" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Small town museum" }),
    ).toBeNull();
  });

  it("filters supplied entries by category through ResourceSection", async () => {
    const user = userEvent.setup();
    render(
      <LocalGuideSection
        title="Explore nearby"
        places={[
          { id: "park", title: "Riverside park", category: "Outdoors" },
          { id: "gallery", title: "Town gallery", category: "Culture" },
        ]}
      />,
    );

    const categorySelect = screen.getByRole("combobox", { name: "Category" });
    categorySelect.focus();
    await user.keyboard("o{Enter}");

    expect(screen.getByRole("heading", { name: "Riverside park" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Town gallery" })).toBeNull();
  });
});
