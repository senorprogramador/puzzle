import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Framework } from "../types";
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

    expect(configuredCss).toContain('@import "tailwindcss";\n\n' + css);
    expect(configuredVite).toContain("react()");
    expect(configuredVite.match(/tailwindcss\(\)/g)).toHaveLength(1);
    expect(await read("app/app.css")).toBe(configuredCss);
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

    expect(css).toContain(
      '@import "tailwindcss";\n\n/* keep this stylesheet */\n',
    );
    expect(rootRoute).toContain('import stylesheet from "../styles/app.css?url"');
    expect(rootRoute).not.toContain('import "../styles.css"');
    expect(viteConfig).toContain("start()");
    expect(viteConfig).toContain("noExternal");
    await configureTailwind(cwd, "tanstack");
    expect(await read("src/styles/app.css")).toBe(css);
    expect(await read("vite.config.ts")).toBe(viteConfig);
  });

  it("adds colors when breakpoints were already configured", async () => {
    const existing = `@import "tailwindcss";

/* Puzzle responsive breakpoints */
@theme {
  --breakpoint-hd: 100rem;
}
`;
    await write("src/app/globals.css", existing);

    await configureTailwind(cwd, "next");

    const css = await read("src/app/globals.css");
    expect(css.startsWith(existing)).toBe(true);
    expect(css).toContain(
      "--color-puzzle-primary: var(--puzzle-color-primary);",
    );
    expect(css).toContain(
      "--spacing-puzzle-4: var(--puzzle-space-4);",
    );
    await configureTailwind(cwd, "next");
    expect(await read("src/app/globals.css")).toBe(css);
  });

  it.each([
    ["next", "src/app/globals.css"],
    ["tanstack", "src/styles.css"],
    ["react-router", "app/app.css"],
    ["react", "src/index.css"],
  ] as [Framework, string][])(
    "registers Puzzle tokens in the %s stylesheet without duplicating them",
    async (framework, cssPath) => {
      await write(cssPath, '@import "tailwindcss";\n@import "./base.css";\n');
      if (framework === "tanstack") {
        await write("src/routes/__root.tsx", 'import "../styles.css";\n');
      }
      if (framework !== "next") {
        await write(
          "vite.config.ts",
          "export default defineConfig({ plugins: [] });\n",
        );
      }

      await configureTailwind(cwd, framework);
      const css = await read(cssPath);
      expect(css).toContain('@import "tailwindcss";\n@import "./base.css";');
      expect(css).toContain("--breakpoint-compact: 30rem;");
      expect(css).toContain("--breakpoint-tablet: 48rem;");
      expect(css).toContain("--breakpoint-desktop: 64rem;");
      expect(css).toContain("--breakpoint-hd: 90rem;");
      expect(css).toContain("@theme inline {");
      expect(css).toContain(
        "--color-puzzle-primary: var(--puzzle-color-primary);",
      );
      expect(css).toContain(
        "--color-puzzle-primary-foreground: var(--puzzle-color-primary-foreground);",
      );
      expect(css).toContain(
        "--spacing-puzzle-4: var(--puzzle-space-4);",
      );
      expect(css).toContain(
        "--radius-puzzle-md: var(--puzzle-radius-md);",
      );
      expect(css).toContain(
        "--shadow-puzzle-elevation-2: var(--puzzle-elevation-2);",
      );
      expect(css).toContain(
        "--text-puzzle-body1: var(--puzzle-font-size-body1);",
      );
      expect(css).toContain(
        "--container-puzzle-container: var(--puzzle-container-width);",
      );
      expect(css).toContain(
        "transition-duration: var(--puzzle-duration-fast);",
      );
      expect(css).toContain(
        "z-index: var(--puzzle-z-index-modal);",
      );

      const customized = css
        .replace("--breakpoint-hd: 90rem;", "--breakpoint-hd: 100rem;")
        .replace(
          "var(--puzzle-color-primary);",
          "var(--my-primary);",
        )
        .replace(
          "var(--puzzle-space-4);",
          "var(--my-spacing);",
        );
      await write(cssPath, customized);
      await configureTailwind(cwd, framework);
      expect(await read(cssPath)).toBe(customized);
    },
  );
});
