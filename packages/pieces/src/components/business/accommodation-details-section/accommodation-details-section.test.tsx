import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AccommodationDetailsSection } from "./accommodation-details-section";

afterEach(cleanup);

describe("AccommodationDetailsSection", () => {
  it("renders a minimal accommodation header without optional content", () => {
    const { container } = render(
      <AccommodationDetailsSection
        accommodation={{ name: "Pinecone Cabin" }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Pinecone Cabin" })).toBeVisible();
    expect(
      container.querySelector(".puzzle-accommodation-details__layout"),
    ).toBeNull();
  });

  it.each(["split", "stacked"] as const)(
    "renders the %s variant and all structured detail content",
    (variant) => {
      const { container } = render(
        <AccommodationDetailsSection
          variant={variant}
          accommodation={{
            name: "Willow House",
            description: "A home for a family by the river.",
            capacity: 6,
            bedrooms: 3,
            beds: 5,
            bathrooms: 2,
            sleepingArrangements: [
              {
                id: "main",
                name: "Main bedroom",
                description: "One king bed",
              },
            ],
            highlights: [
              {
                id: "garden",
                label: "Private garden",
                description: "Room to play and eat outdoors.",
              },
            ],
          }}
          media={<div>Gallery slot</div>}
          facilities={<div>Amenity list slot</div>}
          title="A quieter family stay"
        >
          <div>Custom details slot</div>
        </AccommodationDetailsSection>,
      );

      expect(container.querySelector("[data-variant]")).toHaveAttribute(
        "data-variant",
        variant,
      );
      expect(
        screen.getByRole("heading", { name: "A quieter family stay" }),
      ).toBeVisible();
      expect(screen.getByText("A home for a family by the river.")).toBeVisible();
      expect(screen.getByText("6")).toBeVisible();
      expect(screen.getByText("Main bedroom")).toBeVisible();
      expect(screen.getByText("One king bed")).toBeVisible();
      expect(screen.getByText("Private garden")).toBeVisible();
      expect(screen.getByText("Gallery slot")).toBeVisible();
      expect(screen.getByText("Amenity list slot")).toBeVisible();
      expect(screen.getByText("Custom details slot")).toBeVisible();
    },
  );

  it("renders optional actions and invokes their callback", async () => {
    const user = userEvent.setup();
    const onContact = vi.fn();
    render(
      <AccommodationDetailsSection
        accommodation={{ name: "Willow House" }}
        actions={
          <button type="button" onClick={onContact}>
            Contact host
          </button>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Contact host" }));
    expect(onContact).toHaveBeenCalledOnce();
  });

  it("rejects invalid counts and duplicate sleeping arrangement IDs", () => {
    expect(() =>
      render(
        <AccommodationDetailsSection
          accommodation={{ name: "Invalid stay", capacity: Number.NaN }}
        />,
      ),
    ).toThrow("Accommodation capacity must be a non-negative safe integer.");
    expect(() =>
      render(
        <AccommodationDetailsSection
          accommodation={{
            name: "Invalid stay",
            sleepingArrangements: [
              { id: "room", name: "Room", description: "One queen bed" },
              { id: "room", name: "Room", description: "One twin bed" },
            ],
          }}
        />,
      ),
    ).toThrow(
      "Accommodation sleeping arrangement IDs must be non-empty and unique.",
    );
  });

  it("server-renders the accommodation summary and slots", () => {
    expect(
      renderToString(
        <AccommodationDetailsSection
          accommodation={{
            name: "Shoreline Lodge",
            capacity: 8,
            bedrooms: 4,
          }}
          media={<div>Photo gallery</div>}
        />,
      ),
    ).toContain("Photo gallery");
  });
});
