import { describe, expect, it } from "vitest";
import * as z from "zod/v4";

import { normalizeZodObjectSchema } from "./index";

const findProperty = (
  schema: ReturnType<typeof normalizeZodObjectSchema>,
  name: string,
) => {
  const property = schema.properties.find(
    (candidate) => candidate.name === name,
  );
  if (property === undefined)
    throw new Error(`Missing normalized field "${name}".`);
  return property;
};

describe("normalizeZodObjectSchema", () => {
  it("normalizes nested objects and arrays with immutable, segment-based paths", () => {
    const schema = normalizeZodObjectSchema(
      z.object({
        profile: z.object({
          email: z.email(),
          website: z.url(),
        }),
        tags: z.array(z.string()),
        rows: z.array(z.object({ active: z.boolean() })),
      }),
    );

    const profile = findProperty(schema, "profile");
    const tags = findProperty(schema, "tags");
    const rows = findProperty(schema, "rows");

    expect(profile.type).toBe("object");
    if (profile.type !== "object") throw new Error("Expected an object field.");
    expect(profile.properties[0]?.path).toEqual(["profile", "email"]);
    expect(profile.properties[0]?.type).toBe("email");
    expect(profile.properties[1]?.type).toBe("url");

    expect(tags.type).toBe("array");
    if (tags.type !== "array") throw new Error("Expected an array field.");
    expect(tags.element.type).toBe("string");
    expect(tags.element.path).toEqual(["tags", 0]);

    expect(rows.type).toBe("array");
    if (rows.type !== "array") throw new Error("Expected an array field.");
    expect(rows.element.type).toBe("object");
    if (rows.element.type !== "object") {
      throw new Error("Expected an object array element.");
    }
    expect(rows.element.properties[0]?.path).toEqual(["rows", 0, "active"]);
    expect(Object.isFrozen(schema)).toBe(true);
    expect(Object.isFrozen(tags.path)).toBe(true);
    expect(Object.isFrozen(tags.element.path)).toBe(true);
  });

  it("tracks optional, nullable, defaulted, and read-only wrappers", () => {
    const schema = normalizeZodObjectSchema(
      z.object({
        optional: z.string().optional(),
        nullable: z.number().nullable(),
        defaulted: z.string().default("default"),
        prefaulted: z.boolean().prefault(true),
        wrapped: z.string().nullable().optional().default("value").readonly(),
      }),
    );

    expect(findProperty(schema, "optional").optional).toBe(true);
    expect(findProperty(schema, "nullable").nullable).toBe(true);
    expect(findProperty(schema, "defaulted")).toMatchObject({
      optional: true,
      defaulted: true,
    });
    expect(findProperty(schema, "prefaulted")).toMatchObject({
      optional: true,
      defaulted: true,
    });
    expect(findProperty(schema, "wrapped")).toMatchObject({
      optional: true,
      nullable: true,
      defaulted: true,
      readOnly: true,
    });
  });

  it("copies safe metadata and public scalar constraints", () => {
    const schema = normalizeZodObjectSchema(
      z.object({
        displayName: z
          .string()
          .min(2)
          .max(24)
          .meta({
            label: "Display name",
            description: "Shown to other users.",
            placeholder: "Ada",
            examples: ["Ada", "Grace"],
            unsafeValue: () => "not copied",
          }),
        locked: z.string().meta({ readOnly: true }),
        age: z.number().min(0).max(130).int(),
        since: z.date().min(new Date("2020-01-01T00:00:00.000Z")),
      }),
    );

    const displayName = findProperty(schema, "displayName");
    expect(displayName).toMatchObject({
      type: "string",
      label: "Display name",
      description: "Shown to other users.",
      constraints: { minLength: 2, maxLength: 24 },
    });
    expect(displayName.metadata).toMatchObject({
      placeholder: "Ada",
      examples: ["Ada", "Grace"],
    });
    expect(Object.isFrozen(displayName.metadata)).toBe(true);
    expect(Object.isFrozen(displayName.metadata.examples)).toBe(true);
    expect(displayName.metadata).not.toHaveProperty("unsafeValue");
    expect(findProperty(schema, "locked").readOnly).toBe(true);

    expect(findProperty(schema, "age")).toMatchObject({
      type: "number",
      constraints: {
        minValue: 0,
        maxValue: 130,
        integer: true,
      },
    });
    expect(findProperty(schema, "since")).toMatchObject({
      type: "date",
      constraints: { minDate: "2020-01-01T00:00:00.000Z" },
    });
  });

  it("normalizes enum and literal values into labeled options", () => {
    const schema = normalizeZodObjectSchema(
      z.object({
        status: z.enum(["draft", "published"]),
        mode: z.literal(["automatic", 1, null]),
      }),
    );

    expect(findProperty(schema, "status")).toMatchObject({
      type: "enum",
      options: [
        { value: "draft", label: "draft" },
        { value: "published", label: "published" },
      ],
    });
    expect(findProperty(schema, "mode")).toMatchObject({
      type: "literal",
      options: [
        { value: "automatic", label: "automatic" },
        { value: 1, label: "1" },
        { value: null, label: "null" },
      ],
    });
  });

  it("uses pipe input types and never runs transforms or coercion", () => {
    let transformCalls = 0;
    const schema = normalizeZodObjectSchema(
      z.object({
        transformed: z.string().transform((value) => {
          transformCalls += 1;
          return value.length;
        }),
        piped: z.string().pipe(z.coerce.number()),
        coerced: z.coerce.number(),
      }),
    );

    expect(findProperty(schema, "transformed").type).toBe("string");
    expect(findProperty(schema, "piped").type).toBe("string");
    expect(findProperty(schema, "coerced").type).toBe("number");
    expect(transformCalls).toBe(0);
    expect(schema.diagnostics.map(({ code }) => code)).toEqual([
      "pipe_input_display",
      "pipe_input_display",
    ]);
  });

  it("returns diagnostic fallback descriptors for unsupported schemas", () => {
    const schema = normalizeZodObjectSchema(
      z.object({
        choice: z.union([z.string(), z.number()]),
        unknown: z.unknown(),
      }),
    );

    expect(findProperty(schema, "choice")).toMatchObject({
      type: "unsupported",
      sourceType: "union",
      reason: "unsupported_schema",
    });
    expect(findProperty(schema, "unknown")).toMatchObject({
      type: "unsupported",
      sourceType: "unknown",
      reason: "unsupported_schema",
    });
    expect(schema.diagnostics).toHaveLength(2);
    expect(
      schema.diagnostics.every(({ severity }) => severity === "warning"),
    ).toBe(true);
  });

  it("stops recursive lazy expansion and reports the recursive path", () => {
    let recursiveSchema: z.ZodType;
    const recursiveObject = z.object({
      name: z.string(),
      child: z.lazy(() => recursiveSchema).optional(),
    });
    recursiveSchema = recursiveObject;

    const schema = normalizeZodObjectSchema(recursiveObject);
    const child = findProperty(schema, "child");

    expect(child.type).toBe("unsupported");
    expect(child.path).toEqual(["child"]);
    expect(schema.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "recursive_schema",
        path: ["child"],
      }),
    );
  });

  it("keeps ambiguous property names as distinct path segments", () => {
    const schema = normalizeZodObjectSchema(
      z.object(
        Object.fromEntries([
          ["account.name", z.string()],
          ["account", z.object({ name: z.number() })],
          ["__proto__", z.boolean()],
          ["constructor", z.date()],
        ]),
      ),
    );

    const dottedName = findProperty(schema, "account.name");
    const account = findProperty(schema, "account");
    const prototypeNamed = findProperty(schema, "__proto__");
    const constructorNamed = findProperty(schema, "constructor");

    expect(dottedName.path).toEqual(["account.name"]);
    expect(account.type).toBe("object");
    if (account.type !== "object") throw new Error("Expected an object field.");
    expect(account.properties[0]?.path).toEqual(["account", "name"]);
    expect(prototypeNamed.path).toEqual(["__proto__"]);
    expect(constructorNamed.path).toEqual(["constructor"]);
  });
});
