import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlogSection } from "./blog-section";
import type { BlogArticle, BlogSectionVariant } from "./blog-section.types";

const variants: BlogSectionVariant[] = [
  "grid",
  "featured",
  "list",
  "masonry",
  "carousel",
  "editorial",
  "magazine",
  "split",
  "compact",
  "categories",
  "latest",
  "horizontal",
  "cards",
];

const articles: BlogArticle[] = [
  {
    id: "studio",
    title: "A quieter way to work",
    excerpt: "Small rituals can create space for deeper focus.",
    image: {
      src: "",
      alt: "A quiet studio with a desk beside a large window",
    },
    author: { name: "Mara Chen" },
    date: "2025-05-12",
    category: "Studio notes",
    readingTime: 6,
    href: "/journal/quieter-work",
    featured: true,
  },
  {
    id: "materials",
    title: "Materials that age with care",
    excerpt: "A field guide to durable, honest materials.",
    date: "2025-04-04",
    category: "Field guides",
  },
  {
    id: "light",
    title: "Finding the good light",
    date: "2025-03-19",
    category: "Studio notes",
  },
];

afterEach(cleanup);

describe("BlogSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <BlogSection variant={variant} items={articles} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("A quieter way to work")).toBeVisible();
  });

  it("presents article metadata and groups category previews", () => {
    const { container } = render(
      <BlogSection variant="categories" items={articles} title="Journal" />,
    );

    expect(screen.getByText("May 12, 2025")).toBeVisible();
    expect(screen.getByText("6 min read")).toBeVisible();
    expect(screen.getByText("Mara Chen")).toBeVisible();
    expect(
      container.querySelectorAll(".puzzle-blog-section__category-group > h3"),
    ).toHaveLength(2);
  });

  it("handles empty, single, and large collections plus missing images and long titles", () => {
    const { container, rerender } = render(
      <BlogSection items={[]} title="Journal" />,
    );
    expect(container.querySelector(".puzzle-blog-section__items")).toBeNull();

    const longTitle = `${"Thoughtful design ".repeat(20)}for everyday life`;
    rerender(
      <BlogSection
        variant="featured"
        items={[
          {
            id: "single",
            title: longTitle,
            image: { src: "", alt: "A photograph not yet supplied" },
          },
        ]}
      />,
    );
    expect(screen.getByText(longTitle)).toBeVisible();
    expect(
      screen.getByRole("img", { name: "A photograph not yet supplied image unavailable" }),
    ).toBeVisible();

    const manyArticles = Array.from({ length: 60 }, (_, index) => ({
      id: `article-${index}`,
      title: `Article ${index}`,
    }));
    rerender(<BlogSection variant="grid" items={manyArticles} />);
    expect(
      container.querySelectorAll(".puzzle-blog-section__items > li"),
    ).toHaveLength(60);
  });

  it("uses the explicitly supplied featured article without duplicating it", () => {
    const { container } = render(
      <BlogSection
        variant="featured"
        items={articles}
        featuredArticle={{ id: "lead", title: "The lead story" }}
      />,
    );

    expect(screen.getByText("The lead story")).toBeVisible();
    expect(
      container.querySelectorAll(".puzzle-blog-section__article"),
    ).toHaveLength(4);
  });
});
