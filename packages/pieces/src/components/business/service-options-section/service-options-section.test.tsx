import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceOptionsSection } from "./service-options-section";

describe("ServiceOptionsSection", () => {
  it("presents inclusion, supplied price, category, feature, and action", () => {
    render(
      <ServiceOptionsSection
        title="Make your stay special"
        variant="categorized"
        featuredServiceId="breakfast"
        services={[
          {
            id: "breakfast",
            title: "Breakfast basket",
            description: "Local bread, fruit, and preserves.",
            category: "Food",
            inclusion: "optional",
            price: <span>€18 per stay</span>,
            featured: true,
            action: <a href="/contact">Ask about breakfast</a>,
          },
          {
            id: "parking",
            title: "On-site parking",
            category: "Practical",
            inclusion: "included",
          },
        ]}
      />,
    );

    expect(screen.getByText("Optional")).toBeVisible();
    expect(screen.getByText("Included")).toBeVisible();
    expect(screen.getByText("€18 per stay")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Ask about breakfast" }),
    ).toHaveAttribute("href", "/contact");
    expect(screen.getByText("Food")).toBeVisible();
    expect(screen.getByText("Practical")).toBeVisible();
  });

  it("renders an empty service list without adding business behavior", () => {
    const { container } = render(
      <ServiceOptionsSection title="Optional services" services={[]} />,
    );

    expect(
      container.querySelectorAll(".puzzle-business-service"),
    ).toHaveLength(0);
  });
});
