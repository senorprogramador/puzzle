import { describe, expect, it } from "vitest";

import { getInitialUserTemplate } from "./initial-user-template";
import { getAuthTemplates } from "./templates";

import type { FullStackFramework } from "../types";

const frameworks: FullStackFramework[] = ["next", "tanstack", "react-router"];

describe("getAuthTemplates", () => {
  it.each(frameworks.flatMap((framework) =>
    (["mongodb", "d1", "custom"] as const).map((database) => ({
      framework,
      database,
    })),
  ))("generates stable $database templates for $framework", ({ framework, database }) => {
    const options = { framework, database };
    const files = getAuthTemplates(options);
    const repeated = getAuthTemplates(options);
    const directory = framework === "react-router" ? "app" : "src";
    const suffix = framework === "react-router" ? ".server" : "";

    expect(files).toEqual(repeated);
    expect(files[`${directory}/lib/auth/services${suffix}.ts`]).toContain(
      'from "@puzzle-ui/fullstack/auth/server"',
    );
    expect(files[`${directory}/lib/auth/database${suffix}.ts`]).toBeDefined();
    expect(files[`${directory}/routes/sign-in.tsx`] ??
      files["src/app/sign-in/page.tsx"]).toContain(
      'mode="sign-in"',
    );
    expect(files[`${directory}/routes/sign-up.tsx`] ??
      files["src/app/sign-up/page.tsx"]).toContain(
      'mode="sign-up"',
    );

    const clientTemplates = Object.entries(files).filter(
      ([path]) =>
        path.includes("sign-in") ||
        path.includes("sign-up") ||
        path.includes("sign-out"),
    );
    for (const [, source] of clientTemplates) {
      expect(source).not.toContain("@puzzle-ui/fullstack/auth/server");
      expect(source).not.toContain("AUTH_ENCRYPTION_KEY_HEX");
    }

    const databaseModule = files[`${directory}/lib/auth/database${suffix}.ts`]!;
    if (database === "mongodb") {
      expect(databaseModule).toContain("MongoStorageAdapter");
      expect(databaseModule).toContain("transactionsEnabled: true");
    } else if (database === "d1") {
      expect(databaseModule).toContain("D1StorageAdapter");
      expect(databaseModule).not.toContain("TODO: create and return");
    } else {
      expect(databaseModule).toContain("TODO: create and return");
      expect(databaseModule).toContain("StorageAdapter");
    }

    const signInPage =
      files[`${directory}/routes/sign-in.tsx`] ??
      files["src/app/sign-in/page.tsx"];
    expect(signInPage).toContain(
      `offerPasskeyAfterSignIn: ${database === "mongodb" || database === "d1"}`,
    );
  });

  it("uses the custom database by default and emits the minimal React pages", () => {
    expect(getAuthTemplates({ framework: "next" })).toEqual(
      getAuthTemplates({ framework: "next", database: "custom" }),
    );

    const files = getAuthTemplates({ framework: "react" });
    expect(Object.keys(files)).toEqual([
      "src/auth/sign-in.tsx",
      "src/auth/sign-up.tsx",
    ]);
    expect(files["src/auth/sign-in.tsx"]).toContain(
      'import { AuthExperience } from "@puzzle-ui/fullstack/auth/client";',
    );
    expect(files["src/auth/sign-up.tsx"]).toContain('mode="sign-up"');
  });
});

describe("getInitialUserTemplate", () => {
  it.each(["mongodb", "d1"] as const)(
    "generates a safe %s initial-user script",
    (database) => {
      const source = getInitialUserTemplate(database);

      expect(source).toContain("Credentials arrive over stdin");
      expect(source).toContain("JSON.parse(credentials)");
      expect(source).toContain(
        "Initial user credentials must include email and password.",
      );
      expect(source).not.toContain("process.argv");
      expect(source).not.toContain("console.log(input.password)");

      if (database === "mongodb") {
        expect(source).toContain("MongoClient");
        expect(source).toContain("argon2id");
        expect(source).toContain("await client.close()");
      } else {
        expect(source).toContain("Pbkdf2PasswordHasher");
        expect(source).toContain("await platform.dispose()");
        expect(source).toContain("AUTH_PASSWORD_PEPPER_HEX");
      }
    },
  );
});
