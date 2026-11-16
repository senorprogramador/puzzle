import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { configureTailwind } from "./configure-tailwind";

const cwd = path.resolve(process.cwd(), ".test-work/configure-tailwind");

const write = async (relativePath: string, value: string) => {
  const file = path.join(cwd, relativePath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, value, "utf8");
};

const read = (relativePath: string) =>
  readFile(path.join(cwd, relativePath), "utf8");

beforeEach(async () => {
  await rm(cwd, { recursive: true, force: true });
  await mkdir(cwd, { recursive: true });
});

afterEach(async () => {
  await rm(cwd, { recursive: true, force: true });
});

describe("configureTailwind", () => {
  it("preserves existing Next.js CSS and is idempotent", async () => {
    await write("src/app/globals.css", "body { color: red; }\n");

    await configureTailwind(cwd, "next");
    const firstCss = await read("src/app/globals.css");
    const firstConfig = await read("postcss.config.mjs");
    await configureTailwind(cwd, "next");

    expect(firstCss).toContain('@import "tailwindcss";');
    expect(firstCss).toContain("body { color: red; }");
    expect(await read("src/app/globals.css")).toBe(firstCss);
    expect(await read("postcss.config.mjs")).toBe(firstConfig);
    expect(firstConfig).toContain('"@tailwindcss/postcss"');
  });

  it("preserves React Router CSS and existing Vite plugins across repeat runs", async () => {
    const css = "@import './base.css';\n";
    const config =
      'import { defineConfig } from "vite";\nexport default defineConfig({ plugins: [react()] });\n';
    await write("app/app.css", css);
    await write("vite.config.ts", config);

    await configureTailwind(cwd, "react-router");
    const configuredCss = await read("app/app.css");
    const configuredVite = await read("vite.config.ts");
    await configureTailwind(cwd, "react-router");

    expect(configuredCss).toBe('@import "tailwindcss";\n\n' + css);
    expect(configuredVite).toContain("react()");
    expect(configuredVite.match(/tailwindcss\(\)/g)).toHaveLength(1);
    expect(await read("vite.config.ts")).toBe(configuredVite);
  });

  it("uses an existing TanStack stylesheet import and preserves other config", async () => {
    await write(
      "src/routes/__root.tsx",
      'import stylesheet from "../styles/app.css?url";\nexport { stylesheet };\n',
    );
    await write(
      "src/styles/app.css",
      "/* keep this stylesheet */\n",
    );
    await write(
      "vite.config.ts",
      'import { defineConfig } from "vite";\nexport default defineConfig({ plugins: [start()] });\n',
    );

    await configureTailwind(cwd, "tanstack");

    const css = await read("src/styles/app.css");
    const rootRoute = await read("src/routes/__root.tsx");
    const viteConfig = await read("vite.config.ts");

    expect(css).toBe('@import "tailwindcss";\n\n/* keep this stylesheet */\n');
    expect(rootRoute).toContain('import stylesheet from "../styles/app.css?url"');
    expect(rootRoute).not.toContain('import "../styles.css"');
    expect(viteConfig).toContain("start()");
    expect(viteConfig).toContain("noExternal");
    await configureTailwind(cwd, "tanstack");
    expect(await read("src/styles/app.css")).toBe(css);
    expect(await read("vite.config.ts")).toBe(viteConfig);
  });
});
