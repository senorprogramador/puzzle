import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GuestReviewsSection } from "./guest-reviews-section";

describe("GuestReviewsSection", () => {
  it("renders review metadata, rating, and score distribution", () => {
    render(
      <GuestReviewsSection
        title="Guest reviews"
        reviews={[
          {
            id: "review-one",
            quote: "The garden and breakfast were wonderful.",
            author: "Morgan",
            rating: 5,
            date: "2026-05-04",
            dateLabel: "4 May 2026",
            source: "Guestbook",
          },
        ]}
        summary={{
          score: 4.8,
          totalReviews: 24,
          distribution: [
            { score: 5, count: 18 },
            { score: 4, count: 6 },
          ],
        }}
      />,
    );

    expect(screen.getByText("Morgan")).toBeVisible();
    expect(screen.getByText("Guestbook")).toBeVisible();
    expect(screen.getByText("4 May 2026")).toHaveAttribute(
      "dateTime",
      "2026-05-04",
    );
    expect(screen.getByText("4.8 out of 5")).toBeVisible();
    expect(screen.getByText("24 reviews")).toBeVisible();
    expect(
      screen.getByRole("meter", {
        name: "5 out of 5 stars: 18 reviews",
      }),
    ).toHaveAttribute("value", "18");
  });

  it("supports empty reviews, custom labels, and caller content", () => {
    const { container } = render(
      <GuestReviewsSection
        reviews={[]}
        summary={{ score: 4, maxScore: 5, totalReviews: 1 }}
        labels={{
          overallRating: "Guest score",
          reviewCount: (count) => `${count} guest note`,
        }}
      >
        <p>More review details</p>
      </GuestReviewsSection>,
    );

    expect(container.querySelector(".puzzle-testimonials__list")).toBeNull();
    expect(screen.getByText("Guest score")).toBeVisible();
    expect(screen.getByText("1 guest note")).toBeVisible();
    expect(screen.getByText("More review details")).toBeVisible();
  });

  it("reuses the labeled keyboard-operable testimonial carousel", () => {
    render(
      <GuestReviewsSection
        variant="carousel"
        reviews={[
          { id: "one", quote: "First review.", author: "Ari" },
          { id: "two", quote: "Second review.", author: "Bo" },
        ]}
      />,
    );

    const navigation = screen.getByRole("group", {
      name: "Guest reviews. Use the left and right arrow keys to navigate.",
    });
    expect(navigation).toHaveAttribute("tabindex", "0");
    expect(
      screen.getByRole("button", { name: "Next testimonial" }),
    ).toBeVisible();
    expect(fireEvent.keyDown(navigation, { key: "ArrowRight" })).toBe(false);
  });
});
