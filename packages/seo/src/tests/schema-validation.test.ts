import { describe, expect, it } from "vitest";

import { createSchemaRegistry } from "../schema/registry";
import { validateSchemaNode } from "../schema/validate";
import type { SchemaDefinition } from "../schema/types";

const definitions: SchemaDefinition[] = [
  {
    name: "Thing",
    type: "Thing",
    source: "generated",
    properties: [
      {
        name: "name",
        type: "Text",
        required: true,
      },
      {
        name: "description",
        type: "Text",
      },
    ],
  },
  {
    name: "Product",
    type: "Product",
    source: "generated",
    parentTypes: ["Thing"],
    properties: [
      {
        name: "sku",
        type: "Text",
        required: true,
      },
      {
        name: "offers",
        type: "Offer",
      },
      {
        name: "price",
        type: "Number",
      },
      {
        name: "available",
        type: "Boolean",
      },
      {
        name: "singleValue",
        type: "Text",
        multiple: false,
      },
    ],
  },
  {
    name: "Offer",
    type: "Offer",
    source: "generated",
    properties: [
      {
        name: "price",
        type: "Number",
      },
    ],
  },
];

const registry = createSchemaRegistry({
  generated: definitions,
});

describe("validateSchemaNode", () => {
  it("accepts a valid node", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        name: "Puzzle",
        sku: "PUZZLE-001",
        price: 49.95,
        available: true,
      },
      registry,
    );

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("accepts inherited properties", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        name: "Puzzle",
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });

  it("reports a missing @type", () => {
    const result = validateSchemaNode(
      {
        name: "Puzzle",
      },
      registry,
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "missing-type",
        severity: "error",
      }),
    );
  });

  it("reports an unknown type as a warning by default", () => {
    const result = validateSchemaNode(
      {
        "@type": "UnknownType",
      },
      registry,
    );

    expect(result.valid).toBe(true);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "unknown-type",
        severity: "warning",
      }),
    );
  });

  it("reports an unknown type as an error in strict mode", () => {
    const result = validateSchemaNode(
      {
        "@type": "UnknownType",
      },
      registry,
      {
        strict: true,
      },
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "unknown-type",
        severity: "error",
      }),
    );
  });

  it("allows unknown properties by default", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        customField: "value",
      },
      registry,
    );

    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("rejects unknown properties in strict mode", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        customField: "value",
      },
      registry,
      {
        strict: true,
      },
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "unknown-property",
        property: "customField",
        severity: "error",
      }),
    );
  });

  it("allows unknown properties when explicitly configured in strict mode", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        customField: "value",
      },
      registry,
      {
        strict: true,
        allowUnknownProperties: true,
      },
    );

    expect(result.valid).toBe(true);
  });

  it("rejects unknown properties when explicitly disabled", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        customField: "value",
      },
      registry,
      {
        allowUnknownProperties: false,
      },
    );

    expect(result.valid).toBe(false);
  });

  it("does not validate required properties by default", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });

  it("validates required properties when enabled", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
      },
      registry,
      {
        validateRequiredProperties: true,
      },
    );

    expect(result.valid).toBe(false);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "missing-required-property",
          property: "name",
        }),
        expect.objectContaining({
          code: "missing-required-property",
          property: "sku",
        }),
      ]),
    );
  });

  it("accepts valid primitive values", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        name: "Puzzle",
        price: 19.99,
        available: false,
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });

  it("rejects invalid primitive values", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        name: 123,
        price: "19.99",
        available: "yes",
      },
      registry,
    );

    expect(result.valid).toBe(false);

    expect(
      result.issues.filter((issue) => issue.code === "invalid-property-value"),
    ).toHaveLength(3);
  });

  it("validates nested Schema.org node types", () => {
    const valid = validateSchemaNode(
      {
        "@type": "Product",
        offers: {
          "@type": "Offer",
          price: 19.99,
        },
      },
      registry,
    );

    const invalid = validateSchemaNode(
      {
        "@type": "Product",
        offers: {
          "@type": "Thing",
        },
      },
      registry,
    );

    expect(valid.valid).toBe(true);
    expect(invalid.valid).toBe(false);
  });

  it("accepts references without a concrete @type", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        offers: {
          "@id": "https://example.com/offer/1",
        },
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });

  it("validates array values", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        name: ["Puzzle", "Puzzle UI"],
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });

  it("rejects multiple values for a non-multiple property", () => {
    const result = validateSchemaNode(
      {
        "@type": "Product",
        singleValue: ["first", "second"],
      },
      registry,
    );

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        code: "property-not-multiple",
        property: "singleValue",
      }),
    );
  });

  it("does not mutate the supplied node", () => {
    const node = {
      "@type": "Product",
      name: "Puzzle",
      sku: "PUZZLE-001",
    };

    const original = structuredClone(node);

    validateSchemaNode(node, registry);

    expect(node).toEqual(original);
  });

  it("supports multiple registered types", () => {
    const result = validateSchemaNode(
      {
        "@type": ["Product", "Thing"],
        name: "Puzzle",
        sku: "PUZZLE-001",
      },
      registry,
    );

    expect(result.valid).toBe(true);
  });
});
