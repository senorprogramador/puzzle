import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FAQSection } from "./faq";
import type { FAQItem, FAQVariant } from "./faq.types";

const variants: FAQVariant[] = [
  "accordion",
  "two-column",
  "grid",
  "cards",
  "split",
  "grouped",
  "categorized",
  "searchable",
  "minimal",
  "bordered",
  "numbered",
  "featured",
];
const items: FAQItem[] = [
  {
    id: "shipping",
    question: "When will my order ship?",
    answer: "Orders ship within two days.",
    category: "Orders",
    searchText: "shipping delivery",
    featured: true,
  },
];

describe("FAQSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <FAQSection variant={variant} items={items} />,
    );
    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(
      screen.getByRole("button", {
        name:
          variant === "numbered"
            ? "1. When will my order ship?"
            : variant === "featured"
              ? "Featured When will my order ship?"
              : "When will my order ship?",
      }),
    ).toBeVisible();
  });

  it("renders the empty state for an empty collection", () => {
    render(<FAQSection items={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No questions are available.");
  });
});
