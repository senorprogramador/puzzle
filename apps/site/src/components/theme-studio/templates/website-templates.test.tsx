import { describe, expect, it } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  WEBSITE_TEMPLATE_METADATA,
  WebsiteTemplatePreview,
} from "./website-templates";

const renderTemplate = (
  template: (typeof WEBSITE_TEMPLATE_METADATA)[number]["id"],
  page: "home" | "about" | "contact" = "home",
) =>
  renderToStaticMarkup(
    createElement(WebsiteTemplatePreview, {
      template,
      page,
      onPageChange: () => {},
    }),
  );

describe("Theme Studio website templates", () => {
  it("provides metadata and a unique public template for each supported type", () => {
    expect(WEBSITE_TEMPLATE_METADATA.map(({ id }) => id)).toEqual([
      "marketing",
      "bnb",
      "restaurant",
      "blog",
      "corporate",
    ]);

    for (const metadata of WEBSITE_TEMPLATE_METADATA) {
      const markup = renderTemplate(metadata.id);
      expect(markup).toContain(`data-template="${metadata.id}"`);
      expect(markup).toContain('aria-label="Preview pages"');
      expect(markup).toContain(metadata.detailPageLabel);
    }
  });

  it("renders distinct about and contact content without remote form submission", () => {
    const aboutMarkup = renderTemplate("marketing", "about");
    const contactMarkup = renderTemplate("restaurant", "contact");

    expect(aboutMarkup).toContain("Good work deserves a clearer path.");
    expect(contactMarkup).toContain("This preview does not take reservations.");
    expect(contactMarkup).toContain("hello@olive-ember.example");
    expect(contactMarkup).not.toContain("<form");
  });
});
