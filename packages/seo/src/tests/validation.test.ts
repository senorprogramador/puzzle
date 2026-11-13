import { describe, expect, it } from "vitest";

import {
  validateSeo,
  validateSeoMetadata,
  validateSeoNode,
} from "../validation";

import { createSchemaRegistry } from "../schema";

import type { SchemaDefinition } from "../schema";

const definitions: SchemaDefinition[] = [
  {
    name: "Thing",
    type: "Thing",
    source: "generated",
    properties: [
      { name: "name", type: "Text" },
      { name: "description", type: "Text" },
    ],
  },
  {
    name: "Article",
    type: "Article",
    source: "generated",
    parentTypes: ["Thing"],
    properties: [
      { name: "headline", type: "Text" },
      { name: "datePublished", type: "Date" },
      { name: "dateModified", type: "Date" },
      { name: "image", type: "ImageObject" },
    ],
  },
  {
    name: "Product",
    type: "Product",
    source: "generated",
    parentTypes: ["Thing"],
    properties: [
      { name: "offers", type: "Offer" },
      { name: "aggregateRating", type: "AggregateRating" },
      { name: "review", type: "Review" },
    ],
  },
  {
    name: "Offer",
    type: "Offer",
    source: "generated",
    properties: [
      { name: "price", type: "Number" },
      { name: "priceCurrency", type: "Text" },
    ],
  },
  {
    name: "BreadcrumbList",
    type: "BreadcrumbList",
    source: "generated",
    properties: [{ name: "itemListElement", type: "ListItem" }],
  },
  {
    name: "ListItem",
    type: "ListItem",
    source: "generated",
    properties: [
      { name: "position", type: "Integer" },
      { name: "name", type: "Text" },
      { name: "item", type: "URL" },
    ],
  },
];

const registry = createSchemaRegistry({
  generated: definitions,
});

describe("validateSeo", () => {
  it("returns a valid report for a valid graph", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@id": "https://example.com/#article",
            "@type": "Article",
            headline: "Example article",
            name: "Example article",
            datePublished: "2026-01-01",
          },
        ],
      },
      {
        registry,
      },
    );

    expect(report.valid).toBe(true);
    expect(report.summary.errors).toBe(0);
  });

  it("validates Schema.org types and properties", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Article",
            headline: "Example",
            unknownProperty: true,
          },
        ],
      },
      {
        registry,
        mode: "strict",
      },
    );

    expect(report.valid).toBe(false);

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "unknown-property",
        source: "schema",
        severity: "error",
      }),
    );
  });

  it("reports semantic Article issues", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Article",
            datePublished: "not-a-date",
            dateModified: "2020-01-01",
          },
        ],
      },
      {
        registry,
      },
    );

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "article-missing-headline",
        }),
        expect.objectContaining({
          code: "invalid-publication-date",
        }),
      ]),
    );
  });

  it("detects invalid Offer prices and currencies", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Offer",
            price: -10,
            priceCurrency: "euro",
          },
        ],
      },
      {
        registry,
      },
    );

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "invalid-offer-price",
        }),
        expect.objectContaining({
          code: "invalid-price-currency",
        }),
      ]),
    );
  });

  it("validates BreadcrumbList positions and entries", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://example.com",
              },
              {
                "@type": "ListItem",
                position: 1,
                name: "Products",
              },
            ],
          },
        ],
      },
      {
        registry,
      },
    );

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "invalid-breadcrumb-position",
      }),
    );
  });

  it("validates metadata and canonical URLs", () => {
    const report = validateSeoMetadata({
      title: "",
      description: "",
      canonical: "javascript:alert(1)",
    });

    expect(report.valid).toBe(false);

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "missing-title",
        }),
        expect.objectContaining({
          code: "missing-description",
        }),
        expect.objectContaining({
          code: "invalid-canonical",
          severity: "error",
        }),
      ]),
    );
  });

  it("detects duplicate hreflang locales", () => {
    const report = validateSeoMetadata({
      alternates: {
        alternates: [
          {
            locale: "en",
            url: "https://example.com/en",
          },
          {
            locale: "en",
            url: "https://example.com/en-2",
          },
        ],
      },
    });

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "duplicate-hreflang",
        severity: "error",
      }),
    );
  });

  it("supports Google Rich Results profiles", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Article",
            headline: "Example",
          },
        ],
      },
      {
        registry,
        profiles: ["article"],
      },
    );

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "rich-results-missing-image",
          source: "rich-results",
        }),
        expect.objectContaining({
          code: "rich-results-missing-datePublished",
          source: "rich-results",
        }),
      ]),
    );
  });

  it("upgrades warnings to errors in strict mode", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Product",
            name: "Example",
          },
        ],
      },
      {
        registry,
        mode: "strict",
        profiles: ["product"],
      },
    );

    expect(report.valid).toBe(false);

    expect(report.issues.some((issue) => issue.severity === "error")).toBe(
      true,
    );
  });

  it("does not execute validators in off mode", () => {
    let executed = false;

    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Product",
          },
        ],
      },
      {
        mode: "off",
        validators: [
          () => {
            executed = true;
            return [];
          },
        ],
      },
    );

    expect(executed).toBe(false);
    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it("supports custom validators", () => {
    const report = validateSeo(
      {
        nodes: [
          {
            "@type": "Product",
            name: "Example",
          },
        ],
      },
      {
        registry,
        validators: [
          ({ graph }) => {
            const node = graph?.["@graph"][0];

            if (node?.name !== "Example") {
              return [];
            }

            return [
              {
                source: "custom",
                code: "custom-product-rule",
                message: "Custom product rule failed.",
                severity: "warning",
                suggestion: "Review the product.",
              },
            ];
          },
        ],
      },
    );

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "custom-product-rule",
        source: "custom",
      }),
    );
  });

  it("captures custom validator exceptions", () => {
    const report = validateSeo(
      {},
      {
        registry,
        validators: [
          () => {
            throw new Error("Custom validation failed.");
          },
        ],
      },
    );

    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: "custom-validator-failed",
        message: "Custom validation failed.",
        severity: "error",
      }),
    );
  });

  it("provides a summary", () => {
    const report = validateSeoMetadata({
      title: "",
      description: "",
    });

    expect(report.summary.total).toBe(report.issues.length);

    expect(report.summary.warnings).toBeGreaterThan(0);
    expect(report.summary.errors).toBe(0);
  });

  it("validates individual nodes", () => {
    const report = validateSeoNode(
      {
        "@type": "Product",
        name: "Example",
      },
      {
        registry,
      },
    );

    expect(report.valid).toBe(true);
  });

  it("still reports issues for invalid individual nodes", () => {
    const report = validateSeoNode(
      {
        name: "Missing type",
      } as unknown as Parameters<typeof validateSeoNode>[0],
      {
        registry,
      },
    );

    expect(report.valid).toBe(false);
    expect(report.summary.errors).toBeGreaterThan(0);
  });
});
