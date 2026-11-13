import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createSchemaDefinitions } from "../../scripts/generate-schemaorg.mjs";
import { createSchemaRegistry } from "../../dist/schema/index.js";

const fixture = {
  "@context": {
    schema: "https://schema.org/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  },
  "@graph": [
    {
      "@id": "schema:Thing",
      "@type": "rdfs:Class",
    },
    {
      "@id": "schema:Parent",
      "@type": "rdfs:Class",
      "rdfs:subClassOf": {
        "@id": "schema:Thing",
      },
    },
    {
      "@id": "schema:Child",
      "@type": "rdfs:Class",
      "rdfs:subClassOf": {
        "@id": "schema:Parent",
      },
    },
    {
      "@id": "schema:MissingParentChild",
      "@type": "rdfs:Class",
      "rdfs:subClassOf": {
        "@id": "schema:MissingParent",
      },
    },
    {
      "@id": "schema:Enumeration",
      "@type": "rdfs:Class",
    },
    {
      "@id": "schema:DayOfWeek",
      "@type": "rdfs:Class",
      "rdfs:subClassOf": {
        "@id": "schema:Enumeration",
      },
    },
    {
      "@id": "schema:Monday",
      "@type": "schema:DayOfWeek",
      "rdfs:comment": "The first day of the week.",
    },
    {
      "@id": "schema:Tuesday",
      "@type": "schema:DayOfWeek",
    },
    {
      "@id": "schema:Text",
      "@type": "rdfs:Class",
    },
    {
      "@id": "schema:name",
      "@type": "rdf:Property",
      "schema:domainIncludes": {
        "@id": "schema:Child",
      },
      "schema:rangeIncludes": {
        "@id": "schema:Text",
      },
    },
  ],
};

describe("Schema.org generator", () => {
  it("generates class definitions with complete parent URIs", () => {
    const { definitions } = createSchemaDefinitions(fixture);

    const child = definitions.find((definition) => definition.name === "Child");

    assert.ok(child);

    assert.deepEqual(child.parentTypes, ["https://schema.org/Parent"]);
  });

  it("generates property domain and range metadata", () => {
    const { definitions } = createSchemaDefinitions(fixture);

    const child = definitions.find((definition) => definition.name === "Child");

    assert.ok(child);

    const nameProperty = child.properties?.find(
      (property) => property.name === "name",
    );

    assert.ok(nameProperty);

    assert.equal(nameProperty.type, "https://schema.org/Text");

    assert.deepEqual(nameProperty.domainTypes, ["https://schema.org/Child"]);

    assert.deepEqual(nameProperty.rangeTypes, ["https://schema.org/Text"]);

    assert.deepEqual(nameProperty.expectedTypes, ["https://schema.org/Text"]);
  });

  it("generates enumeration values separately from properties", () => {
    const { definitions } = createSchemaDefinitions(fixture);

    const dayOfWeek = definitions.find(
      (definition) => definition.name === "DayOfWeek",
    );

    assert.ok(dayOfWeek);

    assert.deepEqual(dayOfWeek.enumerationValues, [
      {
        name: "Monday",
        type: "https://schema.org/Monday",
        description: "The first day of the week.",
      },
      {
        name: "Tuesday",
        type: "https://schema.org/Tuesday",
      },
    ]);
  });

  it("does not generate enumeration values for ordinary classes", () => {
    const { definitions } = createSchemaDefinitions(fixture);

    const child = definitions.find((definition) => definition.name === "Child");

    assert.ok(child);
    assert.equal(child.enumerationValues, undefined);
  });

  it("reports unresolved Schema.org parent types", () => {
    const { diagnostics } = createSchemaDefinitions(fixture);

    assert.deepEqual(diagnostics.unknownParentTypes, [
      "https://schema.org/MissingParent",
    ]);
  });
});

describe("Schema Registry enumeration metadata", () => {
  it("preserves and normalizes enumeration values", () => {
    const registry = createSchemaRegistry({
      generated: [
        {
          name: "DayOfWeek",
          type: "https://schema.org/DayOfWeek",
          source: "generated",
          enumerationValues: [
            {
              name: "Monday",
              type: "http://schema.org/Monday",
            },
          ],
        },
      ],
    });

    assert.deepEqual(registry.get("DayOfWeek")?.enumerationValues, [
      {
        name: "Monday",
        type: "https://schema.org/Monday",
      },
    ]);
  });

  it("reports unresolved parent definitions", () => {
    const registry = createSchemaRegistry({
      generated: [
        {
          name: "Child",
          type: "https://schema.org/Child",
          source: "generated",
          parentTypes: ["https://schema.org/MissingParent"],
        },
      ],
    });

    assert.equal(
      registry
        .getConflicts()
        .some(
          (conflict) =>
            conflict.code === "unknown-parent" &&
            conflict.type === "https://schema.org/Child",
        ),
      true,
    );
  });
});
