import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { AUTH_DATABASES, FRAMEWORKS } from "./constants";
import {
  loadProjectConfiguration,
  requiresInitialUser,
  toProjectOptions,
  validateProjectConfiguration,
} from "./configuration";

const baseConfiguration = {
  projectName: "My Puzzle App",
  framework: "next",
  styling: "tailwind",
  auth: false,
};

describe("validateProjectConfiguration", () => {
  it.each(FRAMEWORKS.map(({ value }) => value))(
    "accepts the %s framework without Auth",
    (framework) => {
      expect(
        validateProjectConfiguration({ ...baseConfiguration, framework }),
      ).toMatchObject({ framework, auth: false });
    },
  );

  it.each(["mongodb", "d1", "custom"] as const)(
    "accepts %s Auth on full-stack frameworks",
    (database) => {
      expect(
        validateProjectConfiguration({
          ...baseConfiguration,
          auth: true,
          database,
        }),
      ).toMatchObject({ auth: true, database });
    },
  );

  it("accepts client-side React Auth without a database", () => {
    expect(
      validateProjectConfiguration({
        ...baseConfiguration,
        framework: "react",
        auth: true,
      }),
    ).toMatchObject({ framework: "react", auth: true });
  });

  it.each([
    [{ ...baseConfiguration, framework: "astro" }, /"framework"/],
    [{ ...baseConfiguration, styling: "bootstrap" }, /"styling"/],
    [{ ...baseConfiguration, auth: true }, /"database" is required/],
    [{ ...baseConfiguration, database: "d1" }, /only when Auth is enabled/],
    [
      { ...baseConfiguration, framework: "react", auth: true, database: "d1" },
      /only when Auth is enabled/,
    ],
    [{ ...baseConfiguration, password: "not allowed" }, /unsupported field/],
    [{ ...baseConfiguration, packageManager: "deno" }, /"packageManager"/],
    [{ ...baseConfiguration, projectName: "---" }, /"projectName"/],
  ])("rejects unsupported configuration %j", (configuration, message) => {
    expect(() => validateProjectConfiguration(configuration)).toThrow(message);
  });

  it("normalizes names and resolves the selected package manager", () => {
    const configuration = validateProjectConfiguration({
      ...baseConfiguration,
      packageManager: "pnpm",
    });

    expect(toProjectOptions(configuration, "bun")).toEqual({
      name: "my-puzzle-app",
      directory: "my-puzzle-app",
      framework: "next",
      packageManager: "pnpm",
      tailwind: true,
      auth: false,
    });
  });

  it("identifies which configurations need initial-user credentials", () => {
    expect(
      requiresInitialUser(
        validateProjectConfiguration({
          ...baseConfiguration,
          auth: true,
          database: "mongodb",
        }),
      ),
    ).toBe(true);
    expect(
      requiresInitialUser(
        validateProjectConfiguration({
          ...baseConfiguration,
          auth: true,
          database: "custom",
        }),
      ),
    ).toBe(false);
    expect(
      requiresInitialUser(
        validateProjectConfiguration({
          ...baseConfiguration,
          framework: "react",
          auth: true,
        }),
      ),
    ).toBe(false);
  });

  it("keeps the JSON Schema enums aligned with supported CLI options", async () => {
    const schema = JSON.parse(
      await readFile(new URL("../config.schema.json", import.meta.url), "utf8"),
    ) as {
      properties: {
        framework: { enum: string[] };
        styling: { enum: string[] };
        database: { enum: string[] };
        packageManager: { enum: string[] };
      };
    };

    expect([...schema.properties.framework.enum].sort()).toEqual(
      FRAMEWORKS.map(({ value }) => value).sort(),
    );
    expect([...schema.properties.database.enum].sort()).toEqual(
      AUTH_DATABASES.map(({ value }) => value).sort(),
    );
    expect([...schema.properties.styling.enum].sort()).toEqual(["none", "tailwind"]);
    expect(schema.properties.packageManager.enum).toEqual([
      "bun",
      "npm",
      "pnpm",
      "yarn",
    ]);
  });
});

describe("loadProjectConfiguration", () => {
  let directory: string;

  afterEach(async () => {
    if (directory) {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("loads and validates JSON configuration from disk", async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-config-"));
    await writeFile(
      path.join(directory, "puzzle.config.json"),
      JSON.stringify(baseConfiguration),
    );

    await expect(
      loadProjectConfiguration("puzzle.config.json", directory),
    ).resolves.toMatchObject({ projectName: "My Puzzle App" });
  });

  it("reports invalid JSON and unreadable configuration paths", async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-config-"));
    await writeFile(path.join(directory, "invalid.json"), "{");

    await expect(
      loadProjectConfiguration("invalid.json", directory),
    ).rejects.toThrow("must contain valid JSON");
    await expect(
      loadProjectConfiguration("missing.json", directory),
    ).rejects.toThrow("Could not read configuration file");
  });
});
