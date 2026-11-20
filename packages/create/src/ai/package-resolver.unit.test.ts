import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resolveInstructionPackages } from "./package-resolver";

describe("resolveInstructionPackages", () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await mkdtemp(path.join(os.tmpdir(), "puzzle-ai-resolver-"));
    await writeFile(
      path.join(projectRoot, "package.json"),
      JSON.stringify({
        name: "consumer-app",
        dependencies: { "@puzzle-ui/ui": "1.0.0" },
      }),
    );
    await addPackage({
      name: "@puzzle-ui/ui",
      dependencies: ["@puzzle-ui/theme"],
      content: "# UI instructions\n",
    });
    await addPackage({
      name: "@puzzle-ui/theme",
      dependencies: [],
      content: "# Theme instructions\n",
    });
  });

  afterEach(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  const addPackage = async ({
    name,
    dependencies,
    content,
    contentFile = "instructions.md",
  }: {
    name: string;
    dependencies: string[];
    content: string;
    contentFile?: string;
  }) => {
    const packageDirectory = path.join(
      projectRoot,
      "node_modules",
      ...name.split("/"),
    );
    const aiDirectory = path.join(packageDirectory, "ai");
    await mkdir(aiDirectory, { recursive: true });
    await writeFile(
      path.join(packageDirectory, "package.json"),
      JSON.stringify({ name, version: "1.2.3" }),
    );
    await writeFile(
      path.join(aiDirectory, "manifest.json"),
      JSON.stringify({
        schemaVersion: 1,
        packageName: name,
        instructionVersion: 1,
        contentFile,
        instructionDependencies: dependencies,
        documentationUrl: "https://puzzle-ui.com/docs",
      }),
    );
    await writeFile(path.join(aiDirectory, contentFile), content);
  };

  it("resolves package instruction dependencies once in a stable order", async () => {
    const resolved = await resolveInstructionPackages(projectRoot);

    expect(resolved.map(({ name, version }) => `${name}@${version}`)).toEqual([
      "@puzzle-ui/theme@1.2.3",
      "@puzzle-ui/ui@1.2.3",
    ]);
  });

  it("limits explicit package selection to detected direct dependencies", async () => {
    await expect(
      resolveInstructionPackages(projectRoot, ["@puzzle-ui/theme"]),
    ).rejects.toThrow("not installed as direct dependencies");
  });

  it("rejects unsafe instruction content paths", async () => {
    const manifestPath = path.join(
      projectRoot,
      "node_modules",
      "@puzzle-ui",
      "ui",
      "ai",
      "manifest.json",
    );
    await writeFile(
      manifestPath,
      JSON.stringify({
        schemaVersion: 1,
        packageName: "@puzzle-ui/ui",
        instructionVersion: 1,
        contentFile: "../outside.md",
        instructionDependencies: [],
        documentationUrl: "https://puzzle-ui.com/docs",
      }),
    );

    await expect(resolveInstructionPackages(projectRoot)).rejects.toThrow(
      "Unsafe contentFile",
    );
  });

  it("reports declared but missing installed packages", async () => {
    await writeFile(
      path.join(projectRoot, "package.json"),
      JSON.stringify({
        name: "consumer-app",
        dependencies: { "@puzzle-ui/storage": "1.0.0" },
      }),
    );

    await expect(resolveInstructionPackages(projectRoot)).rejects.toThrow(
      "is declared in",
    );
  });
});
