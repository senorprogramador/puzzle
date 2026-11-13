import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertValidSchemaSource } from "../../scripts/schemaorg/source-validation.mjs";
import { createSchemaDefinitions } from "../../scripts/generate-schemaorg.mjs";

const validSource = {
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
  ],
};

describe("Schema.org source validation", () => {
  it("accepts a valid JSON-LD source", () => {
    assert.doesNotThrow(() => assertValidSchemaSource(validSource));
  });

  it("rejects a non-object source", () => {
    assert.throws(() => assertValidSchemaSource(null), /must be a JSON object/);

    assert.throws(
      () => assertValidSchemaSource("invalid"),
      /must be a JSON object/,
    );
  });

  it("rejects a missing context", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@graph": validSource["@graph"],
        }),
      /valid @context/,
    );
  });

  it("rejects an invalid context", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": 123,
          "@graph": validSource["@graph"],
        }),
      /valid @context/,
    );
  });

  it("rejects a missing graph", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
        }),
      /valid @graph array/,
    );
  });

  it("rejects an empty graph", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [],
        }),
      /empty @graph/,
    );
  });

  it("rejects non-object graph entries", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [null],
        }),
      /invalid graph node/,
    );
  });

  it("rejects graph entries without an id", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [
            {
              "@type": "rdfs:Class",
            },
          ],
        }),
      /no valid @id/,
    );
  });

  it("rejects graph entries without a type", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [
            {
              "@id": "schema:Thing",
            },
          ],
        }),
      /no valid @type/,
    );
  });

  it("rejects duplicate ids", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [
            {
              "@id": "schema:Thing",
              "@type": "rdfs:Class",
            },
            {
              "@id": "schema:Thing",
              "@type": "rdfs:Class",
            },
          ],
        }),
      /duplicate @id/,
    );
  });

  it("rejects empty ids", () => {
    assert.throws(
      () =>
        assertValidSchemaSource({
          "@context": validSource["@context"],
          "@graph": [
            {
              "@id": " ",
              "@type": "rdfs:Class",
            },
          ],
        }),
      /no valid @id/,
    );
  });
});

describe("Schema.org JSON-LD context aliases", () => {
  it("resolves aliases for prefixes, types and properties", () => {
    const source = {
      "@context": {
        s: "https://schema.org/",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",

        schemaThing: {
          "@id": "s:Thing",
        },

        parent: {
          "@id": "rdfs:subClassOf",
        },

        domain: {
          "@id": "s:domainIncludes",
        },

        range: {
          "@id": "s:rangeIncludes",
        },
      },
      "@graph": [
        {
          "@id": "s:Thing",
          "@type": "rdfs:Class",
        },
        {
          "@id": "s:Product",
          "@type": "rdfs:Class",
          parent: {
            "@id": "schemaThing",
          },
        },
        {
          "@id": "s:Text",
          "@type": "rdfs:Class",
        },
        {
          "@id": "s:name",
          "@type": "rdf:Property",
          domain: {
            "@id": "s:Product",
          },
          range: {
            "@id": "s:Text",
          },
        },
      ],
    };

    const { definitions } = createSchemaDefinitions(source);

    const product = definitions.find(
      (definition) => definition.name === "Product",
    );

    assert.ok(product);

    assert.deepEqual(product.parentTypes, ["https://schema.org/Thing"]);

    assert.deepEqual(product.properties, [
      {
        name: "name",
        type: "https://schema.org/Text",
        expectedTypes: ["https://schema.org/Text"],
        rangeTypes: ["https://schema.org/Text"],
        domainTypes: ["https://schema.org/Product"],
      },
    ]);
  });

  it("resolves aliases in an array of JSON-LD contexts", () => {
    const source = {
      "@context": [
        {
          s: "https://schema.org/",
        },
        {
          rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        },
      ],
      "@graph": [
        {
          "@id": "s:Thing",
          "@type": "rdfs:Class",
        },
      ],
    };

    const { definitions } = createSchemaDefinitions(source);

    assert.equal(definitions.length, 1);
    assert.equal(definitions[0]?.type, "https://schema.org/Thing");
  });
});
