import { describe, expect, it } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  WEBSITE_TEMPLATE_METADATA,
  WebsiteTemplatePreview,
} from "./website-templates";

const expectedContent = {
  marketing: {
    home: "Make room for your next big idea.",
    about: "Good work deserves a clearer path.",
    contact: "Let’s find your next good step.",
    email: "hello@northstar.example",
    detail: "Features",
  },
  bnb: {
    home: "Come away. Feel at home.",
    about: "A house with a little more heart.",
    contact: "We’d be happy to help you plan.",
    email: "stay@hearthandstay.example",
    detail: "Stay",
  },
  restaurant: {
    home: "Gather around something good.",
    about: "Season-led cooking, without the fuss.",
    contact: "There’s always room at the table.",
    email: "hello@olive-ember.example",
    detail: "Menu",
  },
  blog: {
    home: "Stories for people who make thoughtful things happen.",
    about: "Curiosity is a practice.",
    contact: "Have a story or idea to share?",
    email: "editors@fieldnotes.example",
    detail: "Journal",
  },
  corporate: {
    home: "Make your next move with confidence.",
    about: "Clear thinking. Useful action. Work that lasts.",
    contact: "Start with the challenge in front of you.",
    email: "hello@meridian.example",
    detail: "Services",
  },
} as const;

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
  it("renders a distinct, Pieces-based home frame and navigation for every template", () => {
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
      expect(markup).toContain(
        `theme-studio-template__header--${metadata.id}`,
      );
      expect(markup).toContain('aria-label="Preview pages"');
      expect(markup).toContain(`>${metadata.detailPageLabel}</span>`);
      expect(markup).toContain(expectedContent[metadata.id].home);
      expect(markup).toContain("theme-studio-template__hero");
      expect(markup).not.toContain("<form");
      expect(markup).not.toMatch(/<a[^>]+href="https?:\/\//i);
    }
  });

  it("provides meaningful about and contact pages without real submission flows", () => {
    for (const metadata of WEBSITE_TEMPLATE_METADATA) {
      const aboutMarkup = renderTemplate(metadata.id, "about");
      const contactMarkup = renderTemplate(metadata.id, "contact");

      expect(aboutMarkup).toContain(expectedContent[metadata.id].about);
      expect(contactMarkup).toContain(expectedContent[metadata.id].contact);
      expect(contactMarkup).toContain(expectedContent[metadata.id].email);
      expect(contactMarkup).not.toContain("<form");
      expect(contactMarkup).not.toMatch(/<a[^>]+href="https?:\/\//i);
    }

    expect(renderTemplate("restaurant", "contact")).toContain(
      "This preview does not take reservations.",
    );
  });

  it("keeps the existing five template identities in the metadata", () => {
    expect(WEBSITE_TEMPLATE_METADATA.map(({ id, label }) => [id, label])).toEqual([
      ["marketing", "Marketing"],
      ["bnb", "B&B"],
      ["restaurant", "Restaurant"],
      ["blog", "Blog"],
      ["corporate", "Corporate"],
    ]);
  });
});
