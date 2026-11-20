import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "./testimonials";
import type {
  TestimonialItem,
  TestimonialsVariant,
} from "./testimonials.types";

const variants: TestimonialsVariant[] = [
  "grid",
  "cards",
  "carousel",
  "featured",
  "quote",
  "masonry",
  "split",
  "video",
  "avatar-grid",
  "wall",
  "minimal",
  "editorial",
  "rating",
  "dark",
];
const items: TestimonialItem[] = [
  {
    id: "riley",
    quote: "A thoughtful and reliable tool.",
    author: "Riley Chen",
    role: "Designer",
    organization: "Acme",
    avatar: <img src="/riley.jpg" alt="" />,
    companyLogo: <span>Acme</span>,
    rating: 5,
    featured: true,
  },
];

describe("TestimonialsSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <TestimonialsSection variant={variant} items={items} />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("A thoughtful and reliable tool.")).toBeVisible();
    expect(screen.getByText("Riley Chen")).toBeVisible();
  });

  it("omits the testimonial list when empty", () => {
    const { container } = render(<TestimonialsSection items={[]} />);
    expect(container.querySelector(".puzzle-testimonials__list")).toBeNull();
  });

  it("renders caller-provided metadata in the author footer", () => {
    render(
      <TestimonialsSection
        items={[
          {
            id: "guest",
            quote: "A peaceful stay.",
            author: "Jordan Lee",
            metadata: <time dateTime="2026-03-08">8 March 2026</time>,
          },
        ]}
      />,
    );

    expect(screen.getByText("8 March 2026")).toHaveAttribute(
      "dateTime",
      "2026-03-08",
    );
  });
});
