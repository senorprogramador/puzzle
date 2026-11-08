import { mkdtemp, mkdir, rm } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { validateProjectDirectory } from "./validate-project";

describe("validateProjectDirectory", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-create-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("returns the absolute path for a new directory", async () => {
    const result = await validateProjectDirectory("my-app", cwd);

    expect(result).toBe(path.join(cwd, "my-app"));
  });

  it("rejects an existing directory", async () => {
    await mkdir(path.join(cwd, "existing-app"));

    await expect(validateProjectDirectory("existing-app", cwd)).rejects.toThrow(
      "already exists",
    );
  });

  it("rejects the current working directory", async () => {
    await expect(validateProjectDirectory(".", cwd)).rejects.toThrow(
      "Invalid project directory",
    );
  });

  it("rejects parent directory traversal", async () => {
    await expect(validateProjectDirectory("../outside", cwd)).rejects.toThrow(
      "Invalid project directory",
    );
  });
});
