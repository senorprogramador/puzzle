import { createElement, Fragment, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import {
  SeoProvider,
  SeoJsonLd,
  Schema,
  useSeo,
  LDOrganization,
  LDPerson,
  LDWebSite,
  LDWebPage,
  LDArticle,
  LDBlogPosting,
  LDBreadcrumbList,
  LDProduct,
  LDOffer,
  LDAggregateRating,
  LDReview,
  LDLocalBusiness,
  LDService,
  LDImageObject,
  LDVideoObject,
  LDEvent,
  LDRecipe,
  LDCourse,
  LDJobPosting,
  LDPlace,
  LDItemList,
  LDSoftwareApplication,
  LDHowTo,
  LDFaqPage,
  LDCollectionPage,
  LDProfilePage,
} from "../react";

import type { SeoGraph, SeoNode } from "../core";

const BASE_URL = "https://example.com";

const config = {
  siteUrl: BASE_URL,
  identity: {
    name: "Puzzle",
    url: BASE_URL,
  },
};

const renderSeo = (...children: ReactNode[]): string =>
  renderToStaticMarkup(
    createElement(
      SeoProvider,
      {
        config,
        children: createElement(Fragment, null, ...children),
      },
    ),
  );

const getGraph = (html: string): SeoGraph => {
  const match = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );

  if (!match?.[1]) {
    throw new Error("JSON-LD script was not rendered.");
  }

  return JSON.parse(match[1]) as SeoGraph;
};

const getType = (node: SeoNode): string => {
  const value = node["@type"];

  const type = Array.isArray(value) ? value[0] : value;

  if (type === undefined) {
    throw new Error("SEO node has no type.");
  }

  return type;
};

describe("Schema Components", () => {
  describe("SeoProvider", () => {
    it("renders exactly one central JSON-LD script", () => {
      const html = renderSeo(
        createElement(LDOrganization, {
          name: "Puzzle",
        }),
        createElement(LDWebSite, {
          name: "Puzzle Website",
          url: BASE_URL,
        }),
        createElement(LDWebPage, {
          name: "Home",
          url: BASE_URL,
        }),
      );

      const scripts = html.match(/<script[^>]*type="application\/ld\+json"/g);

      expect(scripts).toHaveLength(1);
    });

    it("does not render an empty JSON-LD script", () => {
      const html = renderSeo();

      expect(html).not.toContain("application/ld+json");
    });

    it("uses the configured script ID", () => {
      const html = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            scriptId: "custom-schema",
            children: createElement(LDOrganization, {
              name: "Puzzle",
            }),
          },
        ),
      );

      expect(html).toContain('id="custom-schema"');
    });

    it("supports CSP nonces", () => {
      const html = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            nonce: "test-nonce",
            children: createElement(LDOrganization, {
              name: "Puzzle",
            }),
          },
        ),
      );

      expect(html).toContain('nonce="test-nonce"');
    });

    it("creates isolated graphs between providers", () => {
      const first = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            children: createElement(LDOrganization, {
              name: "First",
            }),
          },
        ),
      );

      const second = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            children: createElement(LDOrganization, {
              name: "Second",
            }),
          },
        ),
      );

      expect(getGraph(first)["@graph"]).toHaveLength(1);
      expect(getGraph(second)["@graph"]).toHaveLength(1);

      expect(getGraph(first)["@graph"][0]?.name).toBe("First");

      expect(getGraph(second)["@graph"][0]?.name).toBe("Second");
    });
  });

  describe("Schema registration", () => {
    it("registers Organization nodes", () => {
      const html = renderSeo(
        createElement(LDOrganization, {
          name: "Puzzle",
          url: BASE_URL,
          description: "UI library",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);
      expect(getType(graph["@graph"][0]!)).toBe(
        "https://schema.org/Organization",
      );

      expect(graph["@graph"][0]?.name).toBe("Puzzle");
    });

    it("registers nested nodes as graph references", () => {
      const html = renderSeo(
        createElement(LDWebPage, {
          name: "About",
          author: {
            "@type": "Person",
            name: "John Doe",
          },
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(2);

      const page = graph["@graph"].find(
        (node) => getType(node) === "https://schema.org/WebPage",
      );

      const person = graph["@graph"].find(
        (node) => getType(node) === "https://schema.org/Person",
      );

      expect(page?.author).toEqual({
        "@id": person?.["@id"],
      });

      expect(person?.name).toBe("John Doe");
    });

    it("merges nodes with identical IDs", () => {
      const html = renderSeo(
        createElement(LDOrganization, {
          id: "#organization",
          name: "Puzzle",
        }),
        createElement(LDOrganization, {
          id: "#organization",
          description: "UI library",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);

      expect(graph["@graph"][0]).toMatchObject({
        name: "Puzzle",
        description: "UI library",
      });
    });

    it("allows explicit IDs to override generated IDs", () => {
      const html = renderSeo(
        createElement(LDOrganization, {
          id: "#custom",
          name: "Puzzle",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"][0]?.["@id"]).toBe(`${BASE_URL}/#custom`);
    });

    it("generates deterministic IDs from the configured site URL", () => {
      const first = getGraph(
        renderSeo(
          createElement(LDOrganization, {
            name: "Puzzle",
          }),
        ),
      );

      const second = getGraph(
        renderSeo(
          createElement(LDOrganization, {
            name: "Puzzle",
          }),
        ),
      );

      expect(first["@graph"][0]?.["@id"]).toBe(second["@graph"][0]?.["@id"]);

      expect(first["@graph"][0]?.["@id"]).toContain(BASE_URL);
    });

    it("preserves custom Schema.org properties", () => {
      const html = renderSeo(
        createElement(LDOrganization, {
          name: "Puzzle",
          data: {
            customProperty: "custom-value",
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Version",
              value: "1.0",
            },
          },
        }),
      );

      const graph = getGraph(html);

      const organization = graph["@graph"].find(
        (node) => getType(node) === "https://schema.org/Organization",
      );

      expect(organization?.customProperty).toBe("custom-value");

      expect(organization?.additionalProperty).toEqual({
        "@id": expect.any(String),
      });
    });

    it("supports generic custom schema types", () => {
      const html = renderSeo(
        createElement(Schema, {
          type: "CustomOrganization",
          id: "#custom-organization",
          data: {
            name: "Puzzle",
            customField: "value",
          },
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);

      expect(graph["@graph"][0]).toMatchObject({
        "@type": "https://schema.org/CustomOrganization",
        "@id": `${BASE_URL}/#custom-organization`,
        name: "Puzzle",
        customField: "value",
      });
    });
  });

  describe("SeoJsonLd", () => {
    it("registers a single node", () => {
      const node: SeoNode = {
        "@type": "Organization",
        name: "Puzzle",
      };

      const html = renderSeo(
        createElement(SeoJsonLd, {
          data: node,
          id: "#organization",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);
      expect(graph["@graph"][0]?.["@id"]).toBe(`${BASE_URL}/#organization`);
    });

    it("registers multiple nodes", () => {
      const html = renderSeo(
        createElement(SeoJsonLd, {
          data: [
            {
              "@type": "Organization",
              name: "Puzzle",
            },
            {
              "@type": "WebSite",
              name: "Puzzle Website",
            },
          ],
        }),
      );

      expect(getGraph(html)["@graph"]).toHaveLength(2);
    });

    it("registers an existing graph", () => {
      const existingGraph: SeoGraph = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "Puzzle",
          },
          {
            "@type": "WebSite",
            name: "Puzzle Website",
          },
        ],
      };

      const html = renderSeo(
        createElement(SeoJsonLd, {
          data: existingGraph,
        }),
      );

      expect(getGraph(html)["@graph"]).toHaveLength(2);
    });
  });

  describe("Schema Registry validation", () => {
    it("accepts known Schema.org types", () => {
      expect(() =>
        renderSeo(
          createElement(LDOrganization, {
            name: "Puzzle",
          }),
        ),
      ).not.toThrow();
    });

    it("supports custom schema registries", () => {
      const html = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            validation: false,
            children: createElement(Schema, {
              type: "CustomType",
              data: {
                name: "Puzzle",
              },
            }),
          },
        ),
      );

      expect(html).toContain("application/ld+json");
    });

    it("rejects unknown types in strict validation mode", () => {
      expect(() =>
        renderToStaticMarkup(
          createElement(
            SeoProvider,
            {
              config,
              validation: {
                strict: true,
              },
              children: createElement(Schema, {
                type: "CustomType",
                data: {
                  name: "Puzzle",
                },
              }),
            },
          ),
        ),
      ).toThrow("schema validation failed");
    });

    it("supports disabling schema validation", () => {
      expect(() =>
        renderToStaticMarkup(
          createElement(
            SeoProvider,
            {
              config,
              validation: false,
              children: createElement(Schema, {
                type: "CustomType",
                data: {
                  name: "Puzzle",
                },
              }),
            },
          ),
        ),
      ).not.toThrow();
    });
  });

  describe("Component exports", () => {
    it("exports all planned Schema.org components", () => {
      const components = [
        LDOrganization,
        LDPerson,
        LDWebSite,
        LDWebPage,
        LDArticle,
        LDBlogPosting,
        LDBreadcrumbList,
        LDProduct,
        LDOffer,
        LDAggregateRating,
        LDReview,
        LDLocalBusiness,
        LDService,
        LDImageObject,
        LDVideoObject,
        LDEvent,
        LDRecipe,
        LDCourse,
        LDJobPosting,
        LDPlace,
        LDItemList,
        LDSoftwareApplication,
        LDHowTo,
        LDFaqPage,
        LDCollectionPage,
        LDProfilePage,
      ];

      expect(components).toHaveLength(26);

      for (const component of components) {
        expect(typeof component).toBe("function");
      }
    });
  });

  describe("Context isolation", () => {
    it("throws when a schema component is used without SeoProvider", () => {
      expect(() =>
        renderToStaticMarkup(
          createElement(LDOrganization, {
            name: "Puzzle",
          }),
        ),
      ).toThrow("inside SeoProvider");
    });

    it("exposes the SEO configuration through useSeo", () => {
      const TestComponent = () => {
        const seo = useSeo();

        return createElement("span", null, seo.config.siteUrl);
      };

      const html = renderToStaticMarkup(
        createElement(
          SeoProvider,
          {
            config,
            children: createElement(TestComponent),
          },
        ),
      );

      expect(html).toContain(BASE_URL);
    });
  });
});
