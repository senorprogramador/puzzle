import { describe, expect, it } from "bun:test";
import {
  fields,
  toCmsFieldDefinition,
  validateFieldMap,
  validateFieldValue,
  type FieldValue,
  type FieldsCreateInput,
} from "../src/fields";

type Assert<T extends true> = T;
type Equal<TLeft, TRight> =
  (<T>() => T extends TLeft ? 1 : 2) extends
  (<T>() => T extends TRight ? 1 : 2)
    ? true
    : false;
type RequiredKeys<TValue> = {
  [TKey in keyof TValue]-?: object extends Pick<TValue, TKey> ? never : TKey;
}[keyof TValue];

const address = fields.object({
  fields: {
    street: fields.text({ required: true }),
    unit: fields.text(),
  },
});

const schemaFields = {
  title: fields.text({ required: true }),
  status: fields.select({
    required: true,
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
    ] as const,
  }),
  count: fields.number({ required: true, defaultValue: 0 }),
  address,
};
const derived = fields.computed({ compute: () => 1 });

type ExpectedRequiredFields = Assert<
  Equal<RequiredKeys<FieldsCreateInput<typeof schemaFields>>, "title" | "status">
>;
type ExpectedTitleValue = Assert<Equal<FieldValue<typeof schemaFields.title>, string>>;
type ExpectedStatusValue = Assert<
  Equal<FieldValue<typeof schemaFields.status>, "draft" | "published">
>;
type ExpectedObjectRequiredKey = Assert<
  Equal<RequiredKeys<FieldValue<typeof address>>, "street">
>;
type ExpectedObjectStreet = Assert<
  Equal<FieldValue<typeof address>["street"], string>
>;
type ComputedFieldsStayOptional = Assert<
  Equal<RequiredKeys<FieldsCreateInput<{ readonly derived: typeof derived }>>, never>
>;
const pageBlocks = fields.blocks({
  blocks: [
    {
      type: "hero",
      label: "Hero",
      fields: { heading: fields.text({ required: true }) },
    },
  ] as const,
});
const heroBlock: FieldValue<typeof pageBlocks>[number] = {
  type: "hero",
  fields: { heading: "Welcome" },
};
// @ts-expect-error Block values preserve their configured discriminants and required children.
const invalidBlock: FieldValue<typeof pageBlocks>[number] = { type: "unknown", fields: {} };

const validCreateInput: FieldsCreateInput<typeof schemaFields> = {
  title: "First entry",
  status: "draft",
};

// @ts-expect-error Required fields without defaults must be provided on create.
const missingRequiredInput: FieldsCreateInput<typeof schemaFields> = {};

// @ts-expect-error Select values are inferred from the configured options.
const invalidSelectValue: FieldValue<typeof schemaFields.status> = "archived";

const validAddress: FieldValue<typeof address> = { street: "1 Main Street" };
// @ts-expect-error Nested required object fields remain required.
const invalidAddress: FieldValue<typeof address> = {};
const computedCreateInput: FieldsCreateInput<{ readonly derived: typeof derived }> = {};
// @ts-expect-error Computed fields are not writable create inputs.
const requiredComputed = fields.computed({ required: true, compute: () => 1 });

void [
  validCreateInput,
  missingRequiredInput,
  invalidSelectValue,
  validAddress,
  invalidAddress,
  computedCreateInput,
  requiredComputed,
  heroBlock,
  invalidBlock,
];

describe("CMS field definitions", () => {
  it("provides all documented field factory kinds", () => {
    const definitions = [
      fields.text(),
      fields.textarea(),
      fields.number(),
      fields.boolean(),
      fields.date(),
      fields.datetime(),
      fields.email(),
      fields.url(),
      fields.slug(),
      fields.select({ options: [{ label: "One", value: "one" }] as const }),
      fields.multiSelect({ options: [{ label: "One", value: "one" }] as const }),
      fields.media(),
      fields.relationship({ target: "posts" }),
      fields.richText(),
      fields.json(),
      fields.array({ of: fields.text() }),
      fields.object({ fields: { value: fields.text() } }),
      fields.blocks({ blocks: [{ type: "quote", fields: { value: fields.text() } }] }),
      fields.computed({ compute: () => "computed" }),
      fields.custom({
        name: "text",
        is: (value): value is string => typeof value === "string",
      }),
    ];

    expect(definitions.map(({ type }) => type)).toEqual([
      "text",
      "textarea",
      "number",
      "boolean",
      "date",
      "datetime",
      "email",
      "url",
      "slug",
      "select",
      "multiSelect",
      "media",
      "relationship",
      "richText",
      "json",
      "array",
      "object",
      "blocks",
      "computed",
      "custom",
    ]);
  });

  it("preserves field kind and metadata while converting to the CMS schema shape", () => {
    const definition = fields.text({
      required: true,
      localized: true,
      access: { read: false, write: () => true },
      validation: { minLength: 2, maxLength: 20, pattern: "^[A-Z]" },
    });

    expect(definition.type).toBe("text");
    expect(definition.required).toBe(true);
    expect(definition.localized).toBe(true);
    const converted = toCmsFieldDefinition("title", "Title", definition);
    expect(converted).toMatchObject({
      key: "title",
      label: "Title",
      type: "text",
      required: true,
      localized: true,
      access: { read: false },
      validation: { minLength: 2, maxLength: 20, pattern: "^[A-Z]" },
    });
    expect(converted.access).toBe(definition.access);

    expect(
      toCmsFieldDefinition(
        "authors",
        "Authors",
        fields.array({
          of: fields.object({
            fields: { name: fields.text({ required: true }) },
          }),
        }),
      ),
    ).toMatchObject({
      key: "authors",
      type: "array",
      of: {
        key: "item",
        type: "object",
        fields: [{ key: "name", type: "text", required: true }],
      },
    });

    expect(
      toCmsFieldDefinition(
        "content",
        "Content",
        fields.blocks({
          blocks: [{
            type: "hero",
            label: "Hero",
            fields: { heading: fields.text() },
          }] as const,
        }),
      ),
    ).toMatchObject({
      type: "blocks",
      blocks: [{ type: "hero", label: "Hero", fields: [{ key: "heading" }] }],
    });
  });

  it("validates required/defaulted fields, email, URL, and field constraints", async () => {
    const descriptor = {
      title: fields.text({
        required: true,
        validation: { minLength: 3, maxLength: 8, pattern: "^[a-z]+$" },
      }),
      count: fields.number({ validation: { min: 2, max: 5 } }),
      quantity: fields.number({ step: 2 }),
      email: fields.email(),
      website: fields.url({ protocols: ["https"] }),
      summary: fields.text({ validation: { maxLength: 4 } }),
      status: fields.select({
        options: [{ label: "Draft", value: "draft" }] as const,
      }),
      generated: fields.computed({
        compute: () => "computed",
      }),
    };

    const issues = await validateFieldMap(descriptor, {
      title: "A1",
      count: 10,
      quantity: 3,
      email: "not-an-email",
      website: "http://example.test",
      summary: "excess",
      status: "published",
      generated: "forbidden",
    });

    expect(issues.map(({ path, code }) => [path, code])).toEqual([
      ["title", "min-length"],
      ["title", "pattern"],
      ["count", "max"],
      ["quantity", "step"],
      ["email", "email"],
      ["website", "url"],
      ["summary", "max-length"],
      ["status", "option"],
      ["generated", "read-only"],
    ]);

    const defaulted = await validateFieldMap(
      {
        required: fields.text({ required: true }),
        withDefault: fields.text({ required: true, defaultValue: "ready" }),
      },
      {},
    );
    expect(defaulted).toEqual([
      { path: "required", code: "required", message: "This field is required." },
    ]);
  });

  it("recursively validates array items, object fields, and block variants", async () => {
    const descriptor = {
      addresses: fields.array({
        required: true,
        of: address,
      }),
      content: fields.blocks({
        blocks: [
          {
            type: "hero",
            label: "Hero",
            fields: { heading: fields.text({ required: true }) },
          },
        ] as const,
      }),
      metadata: fields.object({
        fields: {
          description: fields.text({ validation: { maxLength: 5 } }),
        },
      }),
    };

    const issues = await validateFieldMap(descriptor, {
      addresses: [{ unit: "4" }],
      content: [
        { type: "hero", fields: { heading: "" } },
        { type: "unknown", fields: {} },
      ],
      metadata: { description: "too long", extra: true },
    });

    expect(issues.map(({ path, code }) => [path, code])).toEqual([
      ["addresses[0].street", "required"],
      ["content[0].fields.heading", "required"],
      ["content[1].type", "unknown-block"],
      ["metadata.description", "max-length"],
      ["metadata.extra", "unknown-field"],
    ]);
  });

  it("runs asynchronous custom validation only for matching serializable values", async () => {
    const percentage = fields.custom({
      name: "percentage",
      is: (value): value is number =>
        typeof value === "number" && Number.isFinite(value),
      validate: async (value) => value < 0 || value > 100
        ? "Must be between 0 and 100."
        : undefined,
    });

    expect(await validateFieldValue(percentage, 120, { path: "price" })).toEqual([
      {
        path: "price",
        code: "custom-validation",
        message: "Must be between 0 and 100.",
      },
    ]);
    expect((await validateFieldValue(percentage, { percent: 5 })).map(({ code }) => code))
      .toEqual(["type"]);
  });

  it("rejects malformed dates, unsupported datetime values, and cyclic JSON", async () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect((await validateFieldValue(fields.date(), "2025-02-29")).map(({ code }) => code))
      .toEqual(["date"]);
    expect((await validateFieldValue(fields.datetime(), "not-a-date")).map(({ code }) => code))
      .toEqual(["datetime"]);
    expect((await validateFieldValue(fields.json(), circular)).map(({ code }) => code))
      .toEqual(["serialization"]);
  });

  it("retains slug sources, relationship targets, and reusable nested definitions", () => {
    const slug = fields.slug({ from: "title", required: true });
    const relation = fields.relationship({
      target: "authors",
      multiple: true,
      sameLocale: true,
    });
    const collectionRelation = fields.relationship({
      collection: "authors",
      multiple: true,
    });
    const itemList = fields.array({ of: address });
    const source: "title" = slug.from;
    const target: "authors" = relation.target;
    const collectionTarget: "authors" = collectionRelation.target;
    const relationshipValue: FieldValue<typeof relation> = ["author-1"];
    const aliasRelationshipValue: FieldValue<typeof collectionRelation> = ["author-2"];
    const listValue: FieldValue<typeof itemList> = [{ street: "1 Main Street" }];

    expect(slug.type).toBe("slug");
    expect(slug.from).toBe("title");
    expect(relation.target).toBe("authors");
    expect(relation.multiple).toBe(true);
    expect(collectionRelation.collection).toBe("authors");
    expect(collectionTarget).toBe("authors");
    expect(
      toCmsFieldDefinition("authorIds", "Authors", relation),
    ).toMatchObject({
      type: "relationship",
      relation: {
        targetTypes: ["authors"],
        multiple: true,
        sameLocale: true,
      },
    });
    expect(source).toBe("title");
    expect(target).toBe("authors");
    expect(relationshipValue).toEqual(["author-1"]);
    expect(aliasRelationshipValue).toEqual(["author-2"]);
    expect(
      toCmsFieldDefinition("authors", "Authors", collectionRelation),
    ).toMatchObject({
      type: "relationship",
      relation: { targetTypes: ["authors"], multiple: true },
    });
    expect(listValue).toEqual([{ street: "1 Main Street" }]);
  });
});
