import { describe, expect, it } from "vitest";

import {
  assertSeoTest,
  createSeoTestFixture,
  formatSeoDiagnostics,
  inspectSeoGraph,
  runSeoTest,
} from "../testing";

import { buildSeoGraph } from "../core";

import type { SeoGraph } from "../core";

const BASE_URL = "https://example.com";

const config = {
  siteUrl: BASE_URL,
  defaultLocale: "en",
  supportedLocales: ["en", "nl"],
};

const organization = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Example",
  url: BASE_URL,
};

describe("E10 Developer Experience", () => {
  describe("inspectSeoGraph", () => {
    it("inspects graph nodes and their types", () => {
      const graph = buildSeoGraph(
        [
          organization,
          {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            name: "Example Website",
          },
        ],
        { baseUrl: BASE_URL },
      );

      const result = inspectSeoGraph(graph, {
        baseUrl: BASE_URL,
      });

      expect(result.nodeCount).toBe(2);

      expect(result.typeCounts).toEqual({
        Organization: 1,
        WebSite: 1,
      });

      expect(result.nodes).toHaveLength(2);
      expect(result.valid).toBe(true);
      expect(result.unresolvedReferences).toEqual([]);
    });

    it("collects references from nested properties", () => {
      const graph: SeoGraph = {
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#organization`,
            },
            author: [
              {
                "@id": `${BASE_URL}/#author`,
              },
            ],
          },
        ],
      };

      const result = inspectSeoGraph(graph, {
        baseUrl: BASE_URL,
      });

      expect(result.references).toEqual([
        `${BASE_URL}/#author`,
        `${BASE_URL}/#organization`,
      ]);

      expect(result.unresolvedReferences).toEqual([
        `${BASE_URL}/#author`,
        `${BASE_URL}/#organization`,
      ]);

      expect(result.valid).toBe(false);
    });

    it("does not mutate the original graph", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      const before = JSON.stringify(graph);

      inspectSeoGraph(graph, {
        baseUrl: BASE_URL,
      });

      expect(JSON.stringify(graph)).toBe(before);
    });

    it("counts multiple types on one node", () => {
      const graph: SeoGraph = {
        "@graph": [
          {
            "@type": ["Organization", "LocalBusiness"],
            "@id": `${BASE_URL}/#business`,
          },
        ],
      };

      const result = inspectSeoGraph(graph);

      expect(result.typeCounts).toEqual({
        LocalBusiness: 1,
        Organization: 1,
      });
    });

    it("excludes internal Puzzle properties from inspection", () => {
      const graph: SeoGraph = {
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            name: "Example",
            __puzzleInternal: true,
          },
        ],
      };

      const result = inspectSeoGraph(graph);

      expect(result.nodes[0]?.properties).not.toContain("__puzzleInternal");
    });
  });

  describe("createSeoTestFixture", () => {
    it("creates a fixture from nodes", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [organization],
      });

      expect(fixture.graph?.["@graph"]).toHaveLength(1);
      expect(fixture.graph?.["@graph"][0]?.["@id"]).toBe(
        `${BASE_URL}/#organization`,
      );
    });

    it("accepts an existing graph", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      const fixture = createSeoTestFixture({
        config,
        graph,
      });

      expect(fixture.graph).toBe(graph);
    });

    it("rejects simultaneous nodes and graph", () => {
      const graph = buildSeoGraph([organization], { baseUrl: BASE_URL });

      expect(() =>
        createSeoTestFixture({
          config,
          nodes: [organization],
          graph,
        }),
      ).toThrow(/either graph or nodes/i);
    });

    it("rejects missing siteUrl", () => {
      expect(() =>
        createSeoTestFixture({
          config: {
            siteUrl: "",
          },
          nodes: [],
        }),
      ).toThrow(/siteUrl/i);
    });
  });

  describe("runSeoTest", () => {
    it("passes a valid fixture", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [organization],
      });

      const result = runSeoTest(fixture);

      expect(result.passed).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("returns a structured validation report", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "Article",
            name: "Example article",
          },
        ],
      });

      const result = runSeoTest(fixture);

      expect(result.report).toBeDefined();
      expect(result.report.summary).toHaveProperty("total");
      expect(result.report.issues).toBeInstanceOf(Array);
    });

    it("reports unresolved local references in strict mode", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#missing`,
            },
          },
        ],
      });

      const result = runSeoTest(fixture, {
        strict: true,
      });

      expect(result.passed).toBe(false);
      expect(result.report.issues).toContainEqual(
        expect.objectContaining({
          code: "unresolved-reference",
          severity: "error",
        }),
      );
    });

    it("can disable schema validation", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "Organization",
            name: "Example",
            unknownProperty: true,
          },
        ],
      });

      const result = runSeoTest(fixture, {
        validateSchema: false,
      });

      expect(
        result.report.issues.some((issue) => issue.source === "schema"),
      ).toBe(false);
    });

    it("can disable reference validation", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#missing`,
            },
          },
        ],
      });

      const result = runSeoTest(fixture, {
        validateReferences: false,
      });

      expect(
        result.report.issues.some(
          (issue) => issue.code === "unresolved-reference",
        ),
      ).toBe(false);
    });

    it("can disable metadata validation", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [organization],
        metadata: {
          title: "",
        },
      });

      const result = runSeoTest(fixture, {
        validateMetadata: false,
      });

      expect(
        result.report.issues.some((issue) => issue.source === "metadata"),
      ).toBe(false);
    });

    it("keeps warnings separate from errors in warn mode", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "Article",
            "@id": `${BASE_URL}/#article`,
          },
        ],
      });

      const result = runSeoTest(fixture);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.errors).toEqual([]);
      expect(result.passed).toBe(true);
    });
  });

  describe("assertSeoTest", () => {
    it("returns the successful result", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [organization],
      });

      expect(() => assertSeoTest(fixture)).not.toThrow();
    });

    it("throws readable diagnostics for failed tests", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "WebPage",
            "@id": `${BASE_URL}/#page`,
            publisher: {
              "@id": `${BASE_URL}/#missing`,
            },
          },
        ],
      });

      expect(() =>
        assertSeoTest(fixture, {
          strict: true,
        }),
      ).toThrow(/SEO validation: FAILED/);
    });
  });

  describe("formatSeoDiagnostics", () => {
    it("formats validation reports", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "Article",
            "@id": `${BASE_URL}/#article`,
          },
        ],
      });

      const result = runSeoTest(fixture);

      const formatted = formatSeoDiagnostics(result.report);

      expect(formatted).toContain("SEO validation:");
      expect(formatted).toContain("Mode: warn");
      expect(formatted).toContain("Issues:");
    });

    it("can omit suggestions and paths", () => {
      const fixture = createSeoTestFixture({
        config,
        nodes: [
          {
            "@type": "Article",
            "@id": `${BASE_URL}/#article`,
          },
        ],
      });

      const result = runSeoTest(fixture);

      const formatted = formatSeoDiagnostics(result.report, {
        includeSuggestions: false,
        includePaths: false,
        includeSummary: false,
      });

      expect(formatted).not.toContain("Suggestion:");
      expect(formatted).not.toContain("Path:");
      expect(formatted).not.toContain("SEO validation:");
    });
  });
});
