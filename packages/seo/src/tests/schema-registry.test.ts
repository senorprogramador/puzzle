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

  it("normalizes short names in definitions, parents, and extensions", () => {
    const registry = createSchemaRegistry({
      generated: [
        { name: "Thing", type: "Thing", source: "generated" },
        {
          name: "Product",
          type: "Product",
          source: "generated",
          parentTypes: ["Thing"],
        },
      ],
      extensions: [
        {
          type: "Product",
          properties: [{ name: "name", type: "Text" }],
        },
      ],
    });

    expect(registry.get("https://schema.org/Product")?.type).toBe(
      "https://schema.org/Product",
    );
    expect(registry.getProperty("Product", "name")?.type).toBe(
      "https://schema.org/Text",
    );
    expect(registry.isTypeOf("Product", "Thing")).toBe(true);
    expect(registry.getConflicts()).toEqual([]);
  });

  it("preserves custom namespace identifiers", () => {
    const registry = createSchemaRegistry({
      custom: [{ name: "Product", type: "custom:Product", source: "custom" }],
    });

    expect(registry.get("custom:Product")?.type).toBe("custom:Product");
    expect(registry.has("Product")).toBe(false);
    expect(() => registry.get(" ")).toThrow("Schema type cannot be empty");
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

  it("normalizes source according to the input collection", () => {
    const registry = createSchemaRegistry({
      generated: [
        {
          name: "Generated Product",
          type: "GeneratedProduct",
          source: "custom",
        },
      ],
      custom: [
        {
          name: "Custom Product",
          type: "CustomProduct",
          source: "generated",
        },
      ],
    });

    expect(registry.get("GeneratedProduct")?.source).toBe("generated");
    expect(registry.get("CustomProduct")?.source).toBe("custom");

    expect(registry.getCollection().generated[0]?.source).toBe("generated");

    expect(registry.getCollection().custom[0]?.source).toBe("custom");
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

  describe("immutability", () => {
    it("freezes definitions returned by get", () => {
      const registry = createSchemaRegistry({ generated });
      const product = registry.get("Product");

      expect(product).toBeDefined();
      expect(Object.isFrozen(product)).toBe(true);
      expect(Object.isFrozen(product?.parentTypes)).toBe(true);
      expect(Object.isFrozen(product?.properties)).toBe(true);
      expect(Object.isFrozen(product?.properties?.[0])).toBe(true);

      expect(Reflect.set(product!, "name", "Modified")).toBe(false);
      expect(product?.name).toBe("Product");
    });

    it("freezes definitions returned by getAll", () => {
      const registry = createSchemaRegistry({ generated });
      const definitions = registry.getAll();

      expect(Object.isFrozen(definitions[0])).toBe(true);
      expect(Object.isFrozen(definitions)).toBe(false);

      expect(Reflect.set(definitions[0]!, "name", "Modified")).toBe(false);
      expect(registry.get("Thing")?.name).toBe("Thing");
    });

    it("freezes generated and custom collections", () => {
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

      const collection = registry.getCollection();

      expect(Object.isFrozen(collection)).toBe(true);
      expect(Object.isFrozen(collection.generated)).toBe(true);
      expect(Object.isFrozen(collection.custom)).toBe(true);

      expect(Reflect.set(collection.generated[0]!, "name", "Modified")).toBe(
        false,
      );

      expect(registry.get("Thing")?.name).toBe("Thing");
    });

    it("freezes nested property metadata", () => {
      const registry = createSchemaRegistry({
        generated: [
          {
            name: "Product",
            type: "Product",
            source: "generated",
            properties: [
              {
                name: "offers",
                type: ["Offer", "AggregateOffer"],
                expectedTypes: ["Offer", "AggregateOffer"],
                rangeTypes: ["Offer", "AggregateOffer"],
                domainTypes: ["Product"],
              },
            ],
          },
        ],
      });

      const property = registry.getProperty("Product", "offers");

      expect(Object.isFrozen(property)).toBe(true);
      expect(Object.isFrozen(property?.type)).toBe(true);
      expect(Object.isFrozen(property?.expectedTypes)).toBe(true);
      expect(Object.isFrozen(property?.rangeTypes)).toBe(true);
      expect(Object.isFrozen(property?.domainTypes)).toBe(true);

      expect(Reflect.set(property!, "name", "modified")).toBe(false);
      expect(registry.getProperty("Product", "offers")?.name).toBe("offers");
    });

    it("does not freeze the caller's original definitions", () => {
      const input: SchemaDefinition[] = [
        {
          name: "Product",
          type: "Product",
          source: "generated",
          properties: [
            {
              name: "name",
              type: "Text",
            },
          ],
        },
      ];

      createSchemaRegistry({ generated: input });

      expect(Object.isFrozen(input)).toBe(false);
      expect(Object.isFrozen(input[0])).toBe(false);
      expect(Object.isFrozen(input[0]?.properties)).toBe(false);

      input[0]!.name = "Changed outside registry";

      expect(input[0]?.name).toBe("Changed outside registry");
    });

    it("freezes the registry instance and conflict collection", () => {
      const registry = createSchemaRegistry({
        generated: [
          {
            name: "Product",
            type: "Product",
            source: "generated",
            properties: [
              { name: "name", type: "Text" },
              { name: "name", type: "URL" },
            ],
          },
        ],
      });

      expect(Object.isFrozen(registry)).toBe(true);
      expect(Object.isFrozen(registry.getConflicts())).toBe(true);
      expect(Object.isFrozen(registry.getConflicts()[0])).toBe(true);
    });
  });

  describe("duplicate properties", () => {
    it("reports duplicate properties in generated definitions", () => {
      const registry = createSchemaRegistry({
        generated: [
          {
            name: "Product",
            type: "Product",
            source: "generated",
            properties: [
              { name: "name", type: "Text" },
              { name: "name", type: "URL" },
            ],
          },
        ],
      });

      expect(registry.getConflicts()).toContainEqual(
        expect.objectContaining({
          type: "https://schema.org/Product",
          property: "name",
          code: "duplicate-property",
        }),
      );

      // The first property remains authoritative.
      expect(registry.getProperty("Product", "name")?.type).toBe(
        "https://schema.org/Text",
      );
      expect(registry.get("Product")?.properties).toHaveLength(1);
    });

    it("reports duplicate properties in custom definitions", () => {
      const registry = createSchemaRegistry({
        custom: [
          {
            name: "Custom Product",
            type: "https://example.com/Product",
            source: "custom",
            properties: [
              { name: "code", type: "Text" },
              { name: "code", type: "URL" },
            ],
          },
        ],
      });

      expect(registry.getConflicts()).toContainEqual(
        expect.objectContaining({
          type: "https://example.com/Product",
          property: "code",
          code: "duplicate-property",
        }),
      );
      expect(
        registry.getProperty("https://example.com/Product", "code")?.type,
      ).toBe("https://schema.org/Text");
    });

    it("keeps the first inherited property while allowing child overrides", () => {
      const registry = createSchemaRegistry({
        generated: [
          {
            name: "Thing",
            type: "Thing",
            source: "generated",
            properties: [
              { name: "name", type: "Text" },
              { name: "name", type: "URL" },
              { name: "description", type: "Text" },
            ],
          },
          {
            name: "Product",
            type: "Product",
            source: "generated",
            parentTypes: ["Thing"],
            properties: [
              { name: "description", type: "URL" },
              { name: "description", type: "Text" },
            ],
          },
        ],
      });

      expect(registry.getProperties("Product")).toEqual([
        expect.objectContaining({
          name: "name",
          type: "https://schema.org/Text",
        }),
        expect.objectContaining({
          name: "description",
          type: "https://schema.org/URL",
        }),
      ]);
      expect(registry.getProperties("Product", { inherited: false })).toEqual([
        expect.objectContaining({
          name: "description",
          type: "https://schema.org/URL",
        }),
      ]);
    });

    it("reports duplicate properties within a single extension", () => {
      const registry = createSchemaRegistry({
        generated,
        extensions: [
          {
            type: "Product",
            properties: [
              { name: "sku", type: "Text" },
              { name: "sku", type: "URL" },
            ],
          },
        ],
      });

      expect(
        registry
          .getConflicts()
          .filter(
            (conflict) =>
              conflict.code === "duplicate-property" &&
              conflict.property === "sku",
          ),
      ).toHaveLength(1);

      expect(registry.getProperty("Product", "sku")?.type).toBe(
        "https://schema.org/Text",
      );
    });

    it("does not let generated overrides hide duplicate custom properties", () => {
      const registry = createSchemaRegistry({
        generated,
        allowGeneratedOverrides: true,
        custom: [
          {
            name: "Custom Product",
            type: "Product",
            source: "custom",
            properties: [
              { name: "sku", type: "Text" },
              { name: "sku", type: "URL" },
            ],
          },
        ],
      });

      expect(registry.get("Product")?.name).toBe("Custom Product");

      expect(registry.getConflicts()).toContainEqual(
        expect.objectContaining({
          type: "https://schema.org/Product",
          property: "sku",
          code: "duplicate-property",
        }),
      );
    });

    it("does not report duplicates from a generated definition that was overridden", () => {
      const registry = createSchemaRegistry({
        generated: [
          {
            name: "Product",
            type: "Product",
            source: "generated",
            properties: [
              { name: "name", type: "Text" },
              { name: "name", type: "URL" },
            ],
          },
        ],
        allowGeneratedOverrides: true,
        custom: [
          {
            name: "Custom Product",
            type: "Product",
            source: "custom",
            properties: [{ name: "sku", type: "Text" }],
          },
        ],
      });

      expect(registry.get("Product")?.name).toBe("Custom Product");

      expect(
        registry
          .getConflicts()
          .some(
            (conflict) =>
              conflict.code === "duplicate-property" &&
              conflict.property === "name",
          ),
      ).toBe(false);
    });
  });

  describe("generated override behavior", () => {
    it("does not allow duplicate custom definitions when overrides are enabled", () => {
      const registry = createSchemaRegistry({
        allowGeneratedOverrides: true,
        custom: [
          {
            name: "First Custom Product",
            type: "Product",
            source: "custom",
          },
          {
            name: "Second Custom Product",
            type: "Product",
            source: "custom",
          },
        ],
      });

      expect(registry.get("Product")?.name).toBe("First Custom Product");

      expect(registry.getConflicts()).toContainEqual(
        expect.objectContaining({
          type: "https://schema.org/Product",
          code: "duplicate-type",
        }),
      );
    });

    it("does not allow custom definitions to impersonate generated definitions", () => {
      const registry = createSchemaRegistry({
        allowGeneratedOverrides: true,
        custom: [
          {
            name: "First Custom Product",
            type: "Product",
            source: "generated",
          },
          {
            name: "Second Custom Product",
            type: "Product",
            source: "generated",
          },
        ],
      });

      expect(registry.get("Product")?.name).toBe("First Custom Product");
      expect(registry.get("Product")?.source).toBe("custom");

      expect(registry.getCollection().custom).toHaveLength(2);
      expect(
        registry
          .getCollection()
          .custom.every((definition) => definition.source === "custom"),
      ).toBe(true);

      expect(registry.getConflicts()).toContainEqual(
        expect.objectContaining({
          type: "https://schema.org/Product",
          code: "duplicate-type",
          message: "Duplicate custom schema type: https://schema.org/Product",
        }),
      );
    });

    it("still allows a custom definition to override a generated definition", () => {
      const registry = createSchemaRegistry({
        generated,
        allowGeneratedOverrides: true,
        custom: [
          {
            name: "Custom Product",
            type: "Product",
            source: "custom",
            properties: [
              {
                name: "sku",
                type: "Text",
              },
            ],
          },
        ],
      });

      expect(registry.get("Product")?.name).toBe("Custom Product");
      expect(registry.getProperty("Product", "sku")?.type).toBe(
        "https://schema.org/Text",
      );
      expect(registry.getConflicts()).toEqual([]);
    });
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
