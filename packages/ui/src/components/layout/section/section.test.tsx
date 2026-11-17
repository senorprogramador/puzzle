import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./index";

describe("Section root attributes", () => {
  it("renders the selected semantic element and forwards native and ARIA attributes", () => {
    const { container } = render(
      <Section
        as="article"
        aria-label="Article section"
        data-layout="feature"
        id="feature"
      >
        Feature content
      </Section>,
    );

    const article = container.querySelector("article");

    expect(article).not.toBeNull();
    expect(article).toHaveAttribute("aria-label", "Article section");
    expect(article).toHaveAttribute("data-layout", "feature");
    expect(article).toHaveAttribute("id", "feature");
    expect(article).toHaveTextContent("Feature content");
  });
});
