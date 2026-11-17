import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogSection } from "./blog-section";
import { ChangelogSection } from "./changelog-section";
import { ContentSection } from "./content-section";
import { GallerySection } from "./gallery-section";
import { TimelineSection } from "./timeline-section";

describe("content sections server rendering", () => {
  it("renders all five families without browser-only APIs", () => {
    expect(() =>
      renderToStaticMarkup(
        <>
          <BlogSection items={[{ id: "post", title: "A story" }]} />
          <ContentSection title="A section">Editorial copy</ContentSection>
          <GallerySection
            items={[
              {
                id: "image",
                image: { src: "", alt: "A placeholder image" },
              },
            ]}
          />
          <TimelineSection
            items={[{ id: "event", title: "An event", date: "2025-01-03" }]}
          />
          <ChangelogSection
            items={[{ id: "release", version: "1.0.0", date: "2025-01-03" }]}
          />
        </>,
      ),
    ).not.toThrow();
  });
});
