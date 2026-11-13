import { describe, expect, it } from "vitest";

import {
  buildSeoGraph,
  createSeoGraphBuilder,
  createSeoNode,
  mergeSeoNodes,
  normalizeSeoId,
  resolveSeoReferences,
  serializeSeoGraph,
  stringifySeoGraph,
  validateSeoGraph,
} from "../core";

import type { SeoNode } from "../core";

const BASE_URL = "https://example.com";

const organization: SeoNode = {
  "@type": "Organization",
  name: "Example",
  url: BASE_URL,
};

const website: SeoNode = {
  "@type": "WebSite",
  name: "Example Website",
  url: BASE_URL,
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
};

describe("SEO Graph Engine", () => {
  describe("createSeoNode", () => {
    it("normalizes short Schema.org types", () => {
      const node = createSeoNode(
        {
          "@type": "Organization",
          name: "Example",
        },
        { baseUrl: BASE_URL },
      );

      expect(node["@type"]).toBe("https://schema.org/Organization");
    });

    it("generates deterministic IDs", () => {
      const first = createSeoNode(organization, {
        baseUrl: BASE_URL,
      });

      const second = createSeoNode(organization, {
        baseUrl: BASE_URL,
      });

      expect(first["@id"]).toBe(second["@id"]);
      expect(first["@id"]).toContain(BASE_URL);
    });

    it("allows explicit IDs to override generated IDs", () => {
      const node = createSeoNode(organization, {
        baseUrl: BASE_URL,
        id: "#custom-organization",
      });

      expect(node["@id"]).toBe(`${BASE_URL}/#custom-organization`);
    });

    it("preserves explicit node IDs", () => {
      const node = createSeoNode({
        ...organization,
        "@id": `${BASE_URL}/#my-organization`,
      });

      expect(node["@id"]).toBe(`${BASE_URL}/#my-organization`);
    });

    it("does not mutate the input", () => {
      const input = {
        "@type": "Organization",
        name: "Example",
      };

      createSeoNode(input, { baseUrl: BASE_URL });

      expect(input).toEqual({
        "@type": "Organization",
        name: "Example",
      });
    });

    it("normalizes HTTP Schema.org identifiers", () => {
      const node = createSeoNode({
        "@type": "http://schema.org/Organization",
      });

      expect(node["@type"]).toBe("https://schema.org/Organization");
    });

    it("rejects missing node types", () => {
      expect(() =>
        createSeoNode({
          "@type": "",
        } as SeoNode),
      ).toThrow("SEO node type cannot be empty.");
    });

    it("rejects invalid node IDs", () => {
      expect(() => normalizeSeoId("relative/path")).toThrow(
        "requires a baseUrl",
      );
    });

    it("normalizes relative IDs", () => {
      expect(normalizeSeoId("/about", BASE_URL)).toBe(`${BASE_URL}/about`);
    });

    it("normalizes fragment IDs", () => {
      expect(normalizeSeoId("#organization", BASE_URL)).toBe(
        `${BASE_URL}/#organization`,
      );
    });

    it("supports nodes without a base URL", () => {
      const node = createSeoNode({
        "@type": "Organization",
        name: "Example",
      });

      expect(node["@id"]).toMatch(/^#organization-example$/);
    });

    it("rejects invalid base URL protocols", () => {
      expect(() =>
        createSeoNode(organization, {
          baseUrl: "javascript:alert(1)",
        }),
      ).toThrow("must use HTTP or HTTPS");
    });
  });

  describe("Graph Builder", () => {
    it("builds a graph from multiple nodes", () => {
      const graph = buildSeoGraph([organization, website], {
        baseUrl: BASE_URL,
      });

      expect(graph["@graph"]).toHaveLength(2);
      expect(graph["@context"]).toBe("https://schema.org");
    });

    it("keeps graph instances isolated", () => {
      const first = createSeoGraphBuilder({
        baseUrl: BASE_URL,
      });

      const second = createSeoGraphBuilder({
        baseUrl: BASE_URL,
      });

      first.add(organization);

      expect(first.build()["@graph"]).toHaveLength(1);
      expect(second.build()["@graph"]).toHaveLength(0);
    });

    it("does not leak state between separate requests", () => {
      const first = buildSeoGraph([organization], {
        baseUrl: BASE_URL,
      });

      const second = buildSeoGraph([website], {
        baseUrl: BASE_URL,
      });

      expect(first["@graph"]).toHaveLength(1);
      expect(second["@graph"]).toHaveLength(1);
    });

    it("produces deterministic node ordering", () => {
      const first = buildSeoGraph([organization, website], {
        baseUrl: BASE_URL,
      });

      const second = buildSeoGraph([website, organization], {
        baseUrl: BASE_URL,
      });

      expect(stringifySeoGraph(first)).toBe(stringifySeoGraph(second));
    });

    it("supports chaining", () => {
      const builder = createSeoGraphBuilder({
        baseUrl: BASE_URL,
      });

      const result = builder.add(organization).add(website).build();

      expect(result["@graph"]).toHaveLength(2);
    });
  });

  describe("Reference resolution", () => {
    it("resolves inline nodes into graph nodes", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: "Home",
            author: {
              "@type": "Person",
              name: "John Doe",
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(graph["@graph"]).toHaveLength(2);

      const page = graph["@graph"].find((node) =>
        String(node["@type"]).endsWith("WebPage"),
      );

      expect(page?.author).toEqual({
        "@id": expect.stringContaining("#person-john-doe"),
      });
    });

    it("resolves forward references", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            mainEntity: {
              "@id": `${BASE_URL}/#organization`,
            },
          },
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            name: "Example",
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(
        validateSeoGraph(graph, {
          baseUrl: BASE_URL,
          strictReferences: true,
        }).valid,
      ).toBe(true);
    });

    it("resolves cross-node references", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#organization`,
            },
          },
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            name: "Example",
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(graph["@graph"]).toHaveLength(2);
    });

    it("supports self-references", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            parentOrganization: {
              "@id": `${BASE_URL}/#organization`,
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(graph["@graph"]).toHaveLength(1);
      expect(
        validateSeoGraph(graph, {
          baseUrl: BASE_URL,
          strictReferences: true,
        }).valid,
      ).toBe(true);
    });

    it("supports cyclic references without recursion", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#a`,
            member: {
              "@id": `${BASE_URL}/#b`,
            },
          },
          {
            "@type": "Person",
            "@id": `${BASE_URL}/#b`,
            worksFor: {
              "@id": `${BASE_URL}/#a`,
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(graph["@graph"]).toHaveLength(2);

      expect(
        validateSeoGraph(graph, {
          baseUrl: BASE_URL,
          strictReferences: true,
        }).valid,
      ).toBe(true);
    });

    it("reports unresolved local references", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#missing`,
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = validateSeoGraph(graph, {
        baseUrl: BASE_URL,
        strictReferences: true,
      });

      expect(result.valid).toBe(false);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "unresolved-reference",
          severity: "error",
        }),
      );
    });

    it("allows external references by default", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            publisher: {
              "@id": "https://publisher.example/organization",
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      expect(
        validateSeoGraph(graph, {
          baseUrl: BASE_URL,
          strictReferences: true,
        }).valid,
      ).toBe(true);
    });

    it("preserves the existing graph context", () => {
      const graph = resolveSeoReferences({
        "@context": {
          schema: "https://schema.org/",
        },
        "@graph": [organization],
      });

      expect(graph["@context"]).toEqual({
        schema: "https://schema.org/",
      });
    });
  });

  describe("Merging and conflicts", () => {
    const first: SeoNode = {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Example",
      url: BASE_URL,
    };

    const second: SeoNode = {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      description: "An example organization",
      logo: `${BASE_URL}/logo.png`,
    };

    it("merges complementary properties", () => {
      const result = mergeSeoNodes(first, second);

      expect(result.node).toMatchObject({
        name: "Example",
        url: BASE_URL,
        description: "An example organization",
        logo: `${BASE_URL}/logo.png`,
      });

      expect(result.issues).toHaveLength(0);
    });

    it("deduplicates nodes with identical IDs", () => {
      const graph = buildSeoGraph([first, second], { baseUrl: BASE_URL });

      expect(graph["@graph"]).toHaveLength(1);
      expect(graph["@graph"][0]).toHaveProperty("description");
    });

    it("merges arrays without duplicates", () => {
      const result = mergeSeoNodes(
        {
          ...first,
          sameAs: ["https://a.example", "https://b.example"],
        },
        {
          ...second,
          sameAs: ["https://b.example", "https://c.example"],
        },
      );

      expect(result.node.sameAs).toEqual([
        "https://a.example",
        "https://b.example",
        "https://c.example",
      ]);
    });

    it("reports conflicting scalar values", () => {
      const result = mergeSeoNodes(first, {
        ...second,
        name: "Another Organization",
      });

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "graph-property-conflict",
          property: "name",
        }),
      );
    });

    it("reports nested conflicts with dotted property paths", () => {
      const result = mergeSeoNodes(
        { ...first, address: { addressLocality: "Alpha" } },
        { ...second, address: { addressLocality: "Beta" } },
      );

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "graph-property-conflict",
          property: "address.addressLocality",
        }),
      );
    });

    it("merges normalized IDs and equivalent Schema.org types", () => {
      const result = mergeSeoNodes(
        {
          "@id": "http://schema.org/Example",
          "@type": "Organization",
        },
        {
          "@id": "https://schema.org/Example",
          "@type": "http://schema.org/Organization",
        },
      );

      expect(result.node).toEqual({
        "@id": "https://schema.org/Example",
        "@type": "https://schema.org/Organization",
      });
      expect(result.issues).toEqual([]);
    });

    it("merges conflicts deterministically", () => {
      const a: SeoNode = {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Alpha",
      };

      const b: SeoNode = {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Beta",
      };

      const firstResult = mergeSeoNodes(a, b);
      const secondResult = mergeSeoNodes(b, a);

      expect(firstResult.node).toEqual(secondResult.node);
    });

    it("supports first conflict strategy", () => {
      const result = mergeSeoNodes(
        first,
        {
          ...second,
          name: "Another",
        },
        {
          conflictStrategy: "first",
        },
      );

      expect(result.node.name).toBe("Example");
    });

    it("supports last conflict strategy", () => {
      const result = mergeSeoNodes(
        first,
        {
          ...second,
          name: "Another",
        },
        {
          conflictStrategy: "last",
        },
      );

      expect(result.node.name).toBe("Another");
    });

    it("supports error conflict strategy", () => {
      const result = mergeSeoNodes(
        first,
        {
          ...second,
          name: "Another",
        },
        {
          conflictStrategy: "error",
        },
      );

      expect(result.issues[0]?.severity).toBe("error");
    });

    it("does not merge nodes with different IDs", () => {
      expect(() =>
        mergeSeoNodes(first, {
          ...second,
          "@id": `${BASE_URL}/#different`,
        }),
      ).toThrow("identical @id");
    });
  });

  describe("Validation", () => {
    it("validates a correct graph", () => {
      const graph = buildSeoGraph([organization, website], {
        baseUrl: BASE_URL,
      });

      expect(validateSeoGraph(graph).valid).toBe(true);
    });

    it("detects duplicate node IDs", () => {
      const graph = {
        "@graph": [
          {
            ...organization,
            "@id": `${BASE_URL}/#same`,
          },
          {
            ...website,
            "@id": `${BASE_URL}/#same`,
          },
        ],
      };

      const result = validateSeoGraph(graph);

      expect(result.valid).toBe(false);

      expect(result.issues[0]?.code).toBe("duplicate-node-id");
    });

    it("detects missing IDs", () => {
      const graph = {
        "@graph": [
          {
            "@type": "Organization",
          },
        ],
      } as unknown as import("../core").SeoGraph;

      const result = validateSeoGraph(graph);

      expect(result.valid).toBe(false);
      expect(result.issues[0]?.code).toBe("missing-node-id");
    });
  });

  describe("Serialization", () => {
    it("serializes valid JSON-LD", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      const result = serializeSeoGraph(graph);

      expect(JSON.parse(result.value)).toMatchObject({
        "@context": "https://schema.org",
        "@graph": expect.any(Array),
      });

      expect(result.errors).toHaveLength(0);
    });

    it("produces deterministic output", () => {
      const first = buildSeoGraph([organization, website], {
        baseUrl: BASE_URL,
      });

      const second = buildSeoGraph([website, organization], {
        baseUrl: BASE_URL,
      });

      expect(stringifySeoGraph(first)).toBe(stringifySeoGraph(second));
    });

    it("escapes HTML-sensitive characters", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: "</script><script>alert(1)</script>",
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = stringifySeoGraph(graph);

      expect(result).not.toContain("</script>");
      expect(result).toContain("\\u003c");
      expect(result).toContain("\\u003e");
    });

    it("preserves Unicode", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "WebPage",
            name: "Café – Málaga – España",
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = serializeSeoGraph(graph, {
        scriptSafe: false,
      });

      expect(result.value).toContain("Café");
      expect(result.value).toContain("Málaga");
      expect(result.value).toContain("España");
    });

    it("supports pretty printing", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      const result = stringifySeoGraph(graph, {
        pretty: true,
      });

      expect(result).toContain("\n");
    });

    it("supports omitting the context", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      const result = serializeSeoGraph(graph, {
        includeContext: false,
      });

      expect(JSON.parse(result.value)).not.toHaveProperty("@context");
    });

    it("does not serialize internal Puzzle properties", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "Organization",
            name: "Example",
            __puzzleInternal: {
              secret: true,
            },
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = stringifySeoGraph(graph);

      expect(result).not.toContain("__puzzleInternal");
      expect(result).not.toContain("secret");
    });

    it("removes undefined and function values", () => {
      const graph = buildSeoGraph(
        [
          {
            "@type": "Organization",
            name: "Example",
            undefinedValue: undefined,
            functionValue: () => true,
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = JSON.parse(stringifySeoGraph(graph));

      expect(result["@graph"][0]).not.toHaveProperty("undefinedValue");

      expect(result["@graph"][0]).not.toHaveProperty("functionValue");
    });

    it("returns validation issues when serializing an invalid graph", () => {
      const graph = {
        "@graph": [
          {
            "@type": "Organization",
          },
        ],
      } as unknown as import("../core").SeoGraph;

      const result = serializeSeoGraph(graph);

      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  it("merges multiple Schema.org types on the same node", () => {
    const result = mergeSeoNodes(
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#business`,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#business`,
      },
    );

    expect(result.node["@type"]).toEqual([
      "https://schema.org/LocalBusiness",
      "https://schema.org/Organization",
    ]);
  });

  it("preserves inline objects with an ID and additional properties", () => {
    const graph = buildSeoGraph(
      [
        {
          "@type": "WebPage",
          author: {
            "@id": `${BASE_URL}/#author`,
            name: "John Doe",
          },
        },
      ],
      { baseUrl: BASE_URL },
    );

    const page = graph["@graph"].find((node) =>
      String(node["@type"]).endsWith("WebPage"),
    );

    expect(page?.author).toEqual({
      "@id": `${BASE_URL}/#author`,
      name: "John Doe",
    });
  });
});
