import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";

import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureFramework } from "./configure-framework";

describe("configureFramework", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), "puzzle-framework-config-"));
  });

  afterEach(async () => {
    await rm(cwd, {
      recursive: true,
      force: true,
    });
  });

  it("configures Next.js package transpilation without Auth", async () => {
    await configureFramework(cwd, "next");

    const config = await readFile(path.join(cwd, "next.config.ts"), "utf8");

    expect(config).toContain('"@puzzle-ui/ui"');
    expect(config).toContain('"@puzzle-ui/theme"');
    expect(config).not.toContain('"@puzzle-ui/fullstack"');
  });

  it("includes Fullstack when configuring Next.js Auth", async () => {
    await configureFramework(cwd, "next", true);

    const config = await readFile(path.join(cwd, "next.config.ts"), "utf8");

    expect(config).toContain('"@puzzle-ui/fullstack"');
  });

  it("configures TanStack Start SSR dependencies", async () => {
    await writeFile(
      path.join(cwd, "vite.config.ts"),
      `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
});
`,
      "utf8",
    );

    await configureFramework(cwd, "tanstack", true);

    const config = await readFile(path.join(cwd, "vite.config.ts"), "utf8");

    expect(config).toContain("noExternal");
    expect(config).toContain('"@puzzle-ui/ui"');
    expect(config).toContain('"@puzzle-ui/theme"');
    expect(config).toContain('"@puzzle-ui/fullstack"');
  });

  it("does not modify a basic React application", async () => {
    await configureFramework(cwd, "react", true);

    const files = await readFile(path.join(cwd, "package.json")).catch(
      () => null,
    );

    expect(files).toBeNull();
  });
});
