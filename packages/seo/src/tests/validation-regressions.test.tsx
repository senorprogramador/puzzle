import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { validateSeo } from "../validation";

import { createSchemaRegistry } from "../schema";

import type { SchemaDefinition } from "../schema";

import { SeoProvider } from "../react";

const definitions: SchemaDefinition[] = [
  {
    name: "Thing",
    type: "Thing",
    source: "generated",
  },
  {
    name: "Article",
    type: "Article",
    source: "generated",
    parentTypes: ["Thing"],
  },
  {
    name: "BlogPosting",
    type: "BlogPosting",
    source: "generated",
    parentTypes: ["Article"],
  },
  {
    name: "LocalBusiness",
    type: "LocalBusiness",
    source: "generated",
    parentTypes: ["Thing"],
  },
  {
    name: "Restaurant",
    type: "Restaurant",
    source: "generated",
    parentTypes: ["LocalBusiness"],
  },
];

const registry = createSchemaRegistry({
  generated: definitions,
});

describe("SEO validation regressions", () => {
  describe("Rich Results type inheritance", () => {
    it("matches BlogPosting against the Article profile", () => {
      const report = validateSeo(
        {
          nodes: [
            {
              "@type": "BlogPosting",
              headline: "Example blog post",
            },
          ],
        },
        {
          registry,
          profiles: ["article"],
        },
      );

      expect(report.issues).toContainEqual(
        expect.objectContaining({
          source: "rich-results",
          code: "rich-results-recommended-image",
        }),
      );
    });

    it("matches Restaurant against the LocalBusiness profile", () => {
      const report = validateSeo(
        {
          nodes: [
            {
              "@type": "Restaurant",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Málaga",
              },
            },
          ],
        },
        {
          registry,
          profiles: ["local-business"],
        },
      );

      expect(report.issues).toContainEqual(
        expect.objectContaining({
          source: "rich-results",
          code: "rich-results-missing-name",
        }),
      );
    });

    it("matches absolute Schema.org type URLs through inheritance", () => {
      const report = validateSeo(
        {
          nodes: [
            {
              "@type": "https://schema.org/BlogPosting",
              headline: "Example blog post",
            },
          ],
        },
        {
          registry,
          profiles: ["article"],
        },
      );

      expect(report.issues).toContainEqual(
        expect.objectContaining({
          source: "rich-results",
          code: "rich-results-recommended-image",
        }),
      );
    });
  });

  describe("Provider metadata-only validation", () => {
    const config = {
      siteUrl: "https://example.com",
      identity: {
        name: "Example",
        url: "https://example.com",
      },
    };

    it("enforces strict metadata validation without Schema.org nodes", () => {
      expect(() =>
        renderToStaticMarkup(
          createElement(SeoProvider, {
            config,
            metadata: {
              canonical: "javascript:alert(1)",
            },
            validation: {
              mode: "strict",
            },
            children: null,
          }),
        ),
      ).toThrow("Puzzle SEO validation failed");
    });

    it("does not render an empty JSON-LD script when the graph is empty", () => {
      const html = renderToStaticMarkup(
        createElement(SeoProvider, {
          config,
          metadata: {
            title: "Example page",
            description:
              "A sufficiently descriptive page description for this test.",
          },
          validation: {
            mode: "warn",
          },
          children: null,
        }),
      );

      expect(html).not.toContain('type="application/ld+json"');
    });
  });
});
