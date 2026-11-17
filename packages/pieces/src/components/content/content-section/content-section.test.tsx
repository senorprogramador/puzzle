import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentSection } from "./content-section";
import type { ContentSectionVariant } from "./content-section.types";

const variants: ContentSectionVariant[] = [
  "single-column",
  "two-column",
  "three-column",
  "split",
  "image-left",
  "image-right",
  "media",
  "editorial",
  "quote",
  "narrow",
  "wide",
  "full-width",
];

afterEach(cleanup);

describe("ContentSection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <ContentSection variant={variant} title="A considered story">
        <p>Made for everyday rituals.</p>
      </ContentSection>,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Made for everyday rituals.")).toBeVisible();
  });

  it("supports columns, a media slot, and an optional semantic sidebar", () => {
    render(
      <ContentSection
        variant="two-column"
        title="Field notes"
        image={{ src: "", alt: "An unpublished editorial image" }}
        columns={["A first column", "A second column"]}
        sidebar={<a href="/archive">Browse the archive</a>}
      />,
    );

    expect(screen.getByText("A first column")).toBeVisible();
    expect(screen.getByText("A second column")).toBeVisible();
    expect(screen.getByRole("complementary", { name: "Related content" })).toBeVisible();
    expect(
      screen.getByRole("img", { name: "An unpublished editorial image image unavailable" }),
    ).toBeVisible();
  });

  it("renders quotations with attribution and permits empty content", () => {
    const { container, rerender } = render(
      <ContentSection variant="quote" attribution="Ari Vale">
        The best spaces leave room to breathe.
      </ContentSection>,
    );

    expect(container.querySelector("blockquote")).toHaveTextContent(
      "The best spaces leave room to breathe.",
    );
    expect(container.querySelector("cite")).toHaveTextContent("Ari Vale");

    rerender(<ContentSection variant="single-column" />);
    expect(container.querySelector(".puzzle-content-section__layout")).toBeVisible();
  });
});
