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

  it("configures TanStack Start SSR dependencies and Nitro", async () => {
    await writeFile(
      path.join(cwd, "vite.config.ts"),
      `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
});
`,
      "utf8",
    );
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ scripts: { build: "vite build" } }),
      "utf8",
    );

    await configureFramework(cwd, "tanstack", true);

    const config = await readFile(path.join(cwd, "vite.config.ts"), "utf8");
    const packageJson = JSON.parse(
      await readFile(path.join(cwd, "package.json"), "utf8"),
    );

    expect(config).toContain("noExternal");
    expect(config).toContain('"@puzzle-ui/ui"');
    expect(config).toContain('"@puzzle-ui/theme"');
    expect(config).toContain('"@puzzle-ui/fullstack"');
    expect(config).toContain('import { nitro } from "nitro/vite";');
    expect(config).toContain(
      'import { createFontRouteRules } from "@puzzle-ui/theme/nitro";',
    );
    expect(config).toContain(
      "plugins: [tanstackStart(), nitro({ routeRules: createFontRouteRules(), inlineDynamicImports: true }), viteReact()]",
    );
    expect(packageJson.scripts).toEqual({
      build: "vite build",
      start: "node .output/server/index.mjs",
    });
  });

  it("adds the OpenNext dev bindings for Next.js on D1", async () => {
    await configureFramework(cwd, "next", true, "d1");

    const config = await readFile(path.join(cwd, "next.config.ts"), "utf8");

    expect(config).toContain("@opennextjs/cloudflare");
    expect(config).toContain("initOpenNextCloudflareForDev();");
  });

  it("adds the Cloudflare Vite plugin for TanStack Start on D1", async () => {
    await writeFile(
      path.join(cwd, "vite.config.ts"),
      `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart(), viteReact()],
});
`,
      "utf8",
    );

    await configureFramework(cwd, "tanstack", true, "d1");

    const config = await readFile(path.join(cwd, "vite.config.ts"), "utf8");

    expect(config).toContain('from "@cloudflare/vite-plugin"');
    expect(config).toContain(
      'plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), tanstackStart(), viteReact()]',
    );
    expect(config).not.toContain("nitro");
  });

  it("configures React Router and removes the template's Tailwind", async () => {
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({
        devDependencies: {
          "@react-router/dev": "^7.0.0",
          "@tailwindcss/vite": "^4.0.0",
          tailwindcss: "^4.0.0",
        },
      }),
      "utf8",
    );

    await configureFramework(cwd, "react-router", true, "d1");

    const config = await readFile(path.join(cwd, "vite.config.ts"), "utf8");
    const packageJson = JSON.parse(
      await readFile(path.join(cwd, "package.json"), "utf8"),
    );

    expect(config).toContain("reactRouter()");
    expect(config).toContain("cloudflare(");
    expect(config).toContain('"@puzzle-ui/fullstack"');
    expect(packageJson.devDependencies).toEqual({
      "@react-router/dev": "^7.0.0",
    });
  });

  it("does not modify a basic React application", async () => {
    await configureFramework(cwd, "react", true);

    const files = await readFile(path.join(cwd, "package.json")).catch(
      () => null,
    );

    expect(files).toBeNull();
  });
});
