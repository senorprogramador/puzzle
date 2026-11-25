import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  createValidationRunGuard,
  createZodSchemaValidator,
  formatValidationPath,
} from "./index";

describe("Zod schema validation", () => {
  it("validates synchronous schemas and returns only parsed output", async () => {
    const schema = z.object({
      count: z.number().int().positive(),
    });
    const validate = createZodSchemaValidator(schema);

    await expect(validate({ count: 3 })).resolves.toEqual({
      success: true,
      data: { count: 3 },
    });
  });

  it("supports asynchronous refinements and transforms", async () => {
    const schema = z
      .string()
      .refine(async (value) => value.startsWith("valid"), {
        message: "Must start with valid",
      })
      .transform(async (value) => value.toUpperCase());
    const validate = createZodSchemaValidator(schema);

    await expect(validate("valid input")).resolves.toEqual({
      success: true,
      data: "VALID INPUT",
    });
    await expect(validate("invalid")).resolves.toMatchObject({
      success: false,
      messages: { "#": ["Must start with valid"] },
    });
  });

  it("returns transformed values and defaults without mutating the input", async () => {
    const schema = z.object({
      name: z.string().trim().transform((value) => value.toUpperCase()),
      enabled: z.boolean().default(true),
    });
    const input = Object.freeze({ name: " Ada " });
    const validate = createZodSchemaValidator(schema);

    await expect(validate(input)).resolves.toEqual({
      success: true,
      data: { name: "ADA", enabled: true },
    });
    expect(input).toEqual({ name: " Ada " });
  });

  it("maps nested, root, and cross-field issues to all-message records", async () => {
    const schema = z
      .object({
        profile: z.object({
          email: z.email(),
          "a/b~c": z.string().min(2, "Must contain at least two characters"),
        }),
        password: z.string(),
        confirmation: z.string(),
      })
      .superRefine((value, context) => {
        if (value.password !== value.confirmation) {
          context.addIssue({
            code: "custom",
            path: ["confirmation"],
            message: "Passwords do not match",
          });
        }
        context.addIssue({
          code: "custom",
          path: ["profile", "a/b~c"],
          message: "Cross-field issue",
        });
        context.addIssue({
          code: "custom",
          message: "Form-level issue",
        });
      });
    const validate = createZodSchemaValidator(schema);
    const result = await validate({
      profile: { email: "not-an-email", "a/b~c": "" },
      password: "first",
      confirmation: "second",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["profile", "email"],
            message: expect.any(String),
            code: expect.any(String),
          }),
          expect.objectContaining({
            path: ["confirmation"],
            message: "Passwords do not match",
          }),
          expect.objectContaining({
            path: [],
            message: "Form-level issue",
          }),
        ]),
      );
      expect(result.messages["#/profile/email"]).toHaveLength(1);
      expect(result.messages["#/profile/a~1b~0c"]).toEqual([
        "Must contain at least two characters",
        "Cross-field issue",
      ]);
      expect(result.messages["#/confirmation"]).toEqual([
        "Passwords do not match",
      ]);
      expect(result.messages["#"]).toEqual(["Form-level issue"]);
    }
  });

  it("formats root, numeric, and special-character paths unambiguously", () => {
    expect(formatValidationPath([])).toBe("#");
    expect(formatValidationPath(["items", 2, "a/b~c"])).toBe(
      "#/items/2/a~1b~0c",
    );
    expect(
      formatValidationPath(["hash#", "percent%", "dot.key", " space"]),
    ).toBe("#/hash%23/percent%25/dot.key/%20space");
  });

  it("lets callers ignore racing and invalidated validation runs", async () => {
    const pending = new Map<string, (value: string) => void>();
    const schema = z
      .string()
      .transform(
        (value) =>
          new Promise<string>((resolve) => {
            pending.set(value, resolve);
          }),
      );
    const validate = createZodSchemaValidator(schema);
    const guard = createValidationRunGuard();

    const staleRevision = guard.startRun();
    const staleResult = validate("stale");
    const latestRevision = guard.startRun();
    const latestResult = validate("latest");

    await Promise.resolve();
    pending.get("latest")?.("LATEST");
    await expect(latestResult).resolves.toEqual({
      success: true,
      data: "LATEST",
    });
    expect(guard.isCurrent(latestRevision)).toBe(true);

    pending.get("stale")?.("STALE");
    await expect(staleResult).resolves.toEqual({
      success: true,
      data: "STALE",
    });
    expect(guard.isCurrent(staleRevision)).toBe(false);

    guard.invalidate();
    expect(guard.isCurrent(latestRevision)).toBe(false);
  });
});
