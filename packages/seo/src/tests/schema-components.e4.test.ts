import { createElement, Fragment, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import {
  SeoProvider,
  Schema,
  SchemaGraph,
  SchemaReference,
  SchemaScript,
  LDOrganization,
  LDPostalAddress,
  LDContactPoint,
  LDSearchAction,
} from "../react";

import type {
  SchemaComponentProps,
  SchemaComponentType,
  SchemaValue,
} from "../react";
import { SchemaReference as PublicSchemaReference } from "../index";

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
    createElement(SeoProvider, {
      config,
      children: createElement(Fragment, null, ...children),
    }),
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

// ---------------------------------------------------------------------------
// Compile-time checks
// ---------------------------------------------------------------------------

const validSearchActionProps: SchemaComponentProps<"SearchAction"> = {
  query: "required name",
  target: {
    "@type": "EntryPoint",
    urlTemplate: "https://example.com/search?q={search_term_string}",
  },
};

const validOrganizationProps: SchemaComponentProps<"Organization"> = {
  name: "Puzzle",
  url: BASE_URL,
};

const nestedSchemaValue: SchemaValue = {
  nested: [{ value: "Example", published: new Date("2026-01-01") }],
};

const referenceData: PublicSchemaReference = { id: "#organization" };

// @ts-expect-error non-Schema.org definitions are not component types.
const invalidComponentType: SchemaComponentType = "105590001";

const invalidOrganizationProps: SchemaComponentProps<"Organization"> = {
  // @ts-expect-error query is not a property of Organization.
  query: "invalid",
};

void validSearchActionProps;
void validOrganizationProps;
void invalidOrganizationProps;
void nestedSchemaValue;
void referenceData;
void invalidComponentType;

describe("Schema Components — E4 completion", () => {
  describe("Additional Schema.org components", () => {
    it("registers PostalAddress", () => {
      const html = renderSeo(
        createElement(LDPostalAddress, {
          streetAddress: "Main Street 1",
          addressLocality: "Madrid",
          postalCode: "28001",
          addressCountry: "ES",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);
      expect(getType(graph["@graph"][0]!)).toBe(
        "https://schema.org/PostalAddress",
      );

      expect(graph["@graph"][0]).toMatchObject({
        streetAddress: "Main Street 1",
        addressLocality: "Madrid",
        postalCode: "28001",
        addressCountry: "ES",
      });
    });

    it("registers ContactPoint", () => {
      const html = renderSeo(
        createElement(LDContactPoint, {
          telephone: "+34 600 000 000",
          contactType: "customer support",
          email: "support@example.com",
        }),
      );

      const graph = getGraph(html);

      expect(getType(graph["@graph"][0]!)).toBe(
        "https://schema.org/ContactPoint",
      );

      expect(graph["@graph"][0]).toMatchObject({
        telephone: "+34 600 000 000",
        contactType: "customer support",
        email: "support@example.com",
      });
    });

    it("registers SearchAction", () => {
      const html = renderSeo(
        createElement(LDSearchAction, {
          query: "required name",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://example.com/search?q={search_term_string}",
          },
        }),
      );

      const graph = getGraph(html);

      const action = graph["@graph"].find(
        (node) => getType(node) === "https://schema.org/SearchAction",
      );
      const target = graph["@graph"].find(
        (node) => getType(node) === "https://schema.org/EntryPoint",
      );

      expect(action?.query).toBe("required name");
      expect(target).toBeDefined();
      expect(action?.target).toEqual({ "@id": target?.["@id"] });
    });
  });

  describe("SchemaGraph", () => {
    it("registers multiple nodes in the provider graph", () => {
      const nodes: SeoNode[] = [
        {
          "@type": "Organization",
          "@id": "#organization",
          name: "Puzzle",
        },
        {
          "@type": "WebSite",
          "@id": "#website",
          name: "Puzzle Website",
        },
      ];

      const html = renderSeo(
        createElement(SchemaGraph, {
          nodes,
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(2);

      expect(
        graph["@graph"].some(
          (node) => getType(node) === "https://schema.org/Organization",
        ),
      ).toBe(true);

      expect(
        graph["@graph"].some(
          (node) => getType(node) === "https://schema.org/WebSite",
        ),
      ).toBe(true);
    });

    it("accepts an existing complete graph", () => {
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
        createElement(SchemaGraph, {
          graph: existingGraph,
        }),
      );

      expect(getGraph(html)["@graph"]).toHaveLength(2);
    });

    it("merges graph nodes with nodes registered by other components", () => {
      const html = renderSeo(
        createElement(SchemaGraph, {
          nodes: [
            {
              "@type": "Organization",
              "@id": "#organization",
              name: "Puzzle",
            },
          ],
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
  });

  describe("SchemaReference", () => {
    it("registers a reference using the supplied ID and type", () => {
      const html = renderSeo(
        createElement(SchemaReference, {
          id: "#organization",
          type: "Organization",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);

      expect(graph["@graph"][0]).toMatchObject({
        "@id": `${BASE_URL}/#organization`,
        "@type": "https://schema.org/Organization",
      });
    });

    it("defaults the reference type to Thing", () => {
      const html = renderSeo(
        createElement(SchemaReference, {
          id: "#entity",
        }),
      );

      const graph = getGraph(html);

      expect(getType(graph["@graph"][0]!)).toBe("https://schema.org/Thing");
    });

    it("merges a reference with the complete node sharing its ID", () => {
      const html = renderSeo(
        createElement(SchemaReference, {
          id: "#organization",
          type: "Organization",
        }),
        createElement(LDOrganization, {
          id: "#organization",
          name: "Puzzle",
          description: "UI library",
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);

      expect(graph["@graph"][0]).toMatchObject({
        "@id": `${BASE_URL}/#organization`,
        name: "Puzzle",
        description: "UI library",
      });
    });
  });

  describe("SchemaScript", () => {
    it("registers a single node through the central renderer", () => {
      const html = renderSeo(
        createElement(SchemaScript, {
          data: {
            "@type": "Organization",
            name: "Puzzle",
          },
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);
      expect(graph["@graph"][0]?.name).toBe("Puzzle");

      expect(
        html.match(/<script[^>]*type="application\/ld\+json"/g),
      ).toHaveLength(1);
    });

    it("registers multiple nodes through the central renderer", () => {
      const html = renderSeo(
        createElement(SchemaScript, {
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

    it("does not render a second script when used with other components", () => {
      const html = renderSeo(
        createElement(SchemaScript, {
          data: {
            "@type": "Organization",
            name: "Puzzle",
          },
        }),
        createElement(LDOrganization, {
          id: "#organization",
          name: "Puzzle",
        }),
      );

      expect(
        html.match(/<script[^>]*type="application\/ld\+json"/g),
      ).toHaveLength(1);
    });
  });

  describe("Generic Schema", () => {
    it("continues to support custom Schema.org types", () => {
      const html = renderSeo(
        createElement(Schema, {
          type: "CustomOrganization",
          id: "#custom-organization",
          data: {
            name: "Puzzle",
            customField: "custom-value",
          },
        }),
      );

      const graph = getGraph(html);

      expect(graph["@graph"]).toHaveLength(1);

      expect(graph["@graph"][0]).toMatchObject({
        "@type": "https://schema.org/CustomOrganization",
        "@id": `${BASE_URL}/#custom-organization`,
        name: "Puzzle",
        customField: "custom-value",
      });
    });
  });

  describe("Public API", () => {
    it("exports all new components", () => {
      expect(typeof SchemaGraph).toBe("function");
      expect(typeof SchemaReference).toBe("function");
      expect(PublicSchemaReference).toBe(SchemaReference);
      expect(typeof SchemaScript).toBe("function");
      expect(typeof LDPostalAddress).toBe("function");
      expect(typeof LDContactPoint).toBe("function");
      expect(typeof LDSearchAction).toBe("function");
    });
  });
});
