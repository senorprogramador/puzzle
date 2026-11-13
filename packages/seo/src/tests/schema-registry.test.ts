import { describe, expect, it } from "vitest";

import { createSchemaRegistry } from "../schema/registry";
import { createDefaultSchemaRegistry } from "../schema/create-registry";
import type { SchemaDefinition } from "../schema/types";

const generated: SchemaDefinition[] = [
  {
    name: "Thing",
    type: "https://schema.org/Thing",
    source: "generated",
    properties: [
      {
        name: "name",
        type: "https://schema.org/Text",
      },
    ],
  },
  {
    name: "Product",
    type: "https://schema.org/Product",
    source: "generated",
    parentTypes: ["https://schema.org/Thing"],
    properties: [
      {
        name: "offers",
        type: "https://schema.org/Offer",
      },
    ],
  },
  {
    name: "Offer",
    type: "https://schema.org/Offer",
    source: "generated",
  },
];

describe("Schema Registry", () => {
  it("registers generated definitions", () => {
    const registry = createSchemaRegistry({ generated });

    expect(registry.has("Product")).toBe(true);
    expect(registry.get("Product")?.name).toBe("Product");
  });

  it("normalizes HTTP Schema.org URLs", () => {
    const registry = createSchemaRegistry({ generated });

    expect(registry.get("http://schema.org/Product")?.name).toBe("Product");
  });

  it("returns inherited properties", () => {
    const registry = createSchemaRegistry({ generated });

    const properties = registry.getProperties("Product");

    expect(properties.map((property) => property.name)).toEqual([
      "name",
      "offers",
    ]);
  });

  it("supports disabling inherited properties", () => {
    const registry = createSchemaRegistry({ generated });

    expect(
      registry
        .getProperties("Product", {
          inherited: false,
        })
        .map((property) => property.name),
    ).toEqual(["offers"]);
  });

  it("resolves ancestors", () => {
    const registry = createSchemaRegistry({ generated });

    expect(registry.getAncestors("Product").map((item) => item.name)).toContain(
      "Thing",
    );
  });

  it("supports recursive type checks", () => {
    const registry = createSchemaRegistry({ generated });

    expect(registry.isTypeOf("Product", "Thing")).toBe(true);
    expect(registry.isTypeOf("Product", "Offer")).toBe(false);
  });

  it("returns undefined for unknown definitions", () => {
    const registry = createSchemaRegistry({ generated });

    expect(registry.get("Unknown")).toBeUndefined();
    expect(registry.getProperty("Unknown", "name")).toBeUndefined();
  });

  it("registers custom definitions", () => {
    const registry = createSchemaRegistry({
      generated,
      custom: [
        {
          name: "Custom Product",
          type: "https://example.com/CustomProduct",
          namespace: "https://example.com/",
          source: "custom",
          parentTypes: ["https://schema.org/Product"],
          properties: [
            {
              name: "internalCode",
              type: "https://schema.org/Text",
            },
          ],
        },
      ],
    });

    expect(registry.has("https://example.com/CustomProduct")).toBe(true);

    expect(
      registry.isTypeOf("https://example.com/CustomProduct", "Thing"),
    ).toBe(true);
  });

  it("reports duplicate generated/custom types", () => {
    const registry = createSchemaRegistry({
      generated,
      custom: [
        {
          name: "Custom Product",
          type: "https://schema.org/Product",
          source: "custom",
        },
      ],
    });

    expect(registry.getConflicts()).toHaveLength(1);
    expect(registry.getConflicts()[0]?.code).toBe("duplicate-type");
  });

  it("does not silently overwrite existing properties", () => {
    const registry = createSchemaRegistry({
      generated,
      extensions: [
        {
          type: "https://schema.org/Product",
          properties: [
            {
              name: "offers",
              type: "https://schema.org/Text",
            },
          ],
        },
      ],
    });

    expect(registry.getConflicts()).toHaveLength(1);

    expect(registry.getProperty("Product", "offers")?.type).toBe(
      "https://schema.org/Offer",
    );
  });

  it("reports extensions for unknown types", () => {
    const registry = createSchemaRegistry({
      generated,
      extensions: [
        {
          type: "https://schema.org/Unknown",
          properties: [],
        },
      ],
    });

    expect(registry.getConflicts()[0]?.code).toBe("unknown-parent");
  });

  it("keeps generated and custom collections separate", () => {
    const registry = createSchemaRegistry({
      generated,
      custom: [
        {
          name: "Custom",
          type: "https://example.com/Custom",
          source: "custom",
        },
      ],
    });

    expect(registry.getCollection().generated).toHaveLength(3);
    expect(registry.getCollection().custom).toHaveLength(1);
  });

  it("allows explicit generated overrides", () => {
    const registry = createSchemaRegistry({
      generated,
      allowGeneratedOverrides: true,
      custom: [
        {
          name: "Custom Product",
          type: "https://schema.org/Product",
          source: "custom",
        },
      ],
    });

    expect(registry.get("Product")?.name).toBe("Custom Product");
    expect(registry.getConflicts()).toHaveLength(0);
  });
});

describe("Default Schema Registry", () => {
  it("includes generated Schema.org definitions", () => {
    const registry = createDefaultSchemaRegistry();

    expect(registry.has("Thing")).toBe(true);
    expect(registry.has("Product")).toBe(true);
    expect(registry.has("Organization")).toBe(true);
  });
});
