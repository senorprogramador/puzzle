import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { build, type InlineConfig } from "vite";

import { puzzleI18n, validateI18nProject } from "../compiler/vite";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("Vite compiler integration", () => {
  it("validates catalogs, scans source, and returns watch paths", async () => {
    const root = await mkdtemp(join(tmpdir(), "puzzle-i18n-vite-"));
    temporaryDirectories.push(root);
    await mkdir(join(root, "locales"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "locales", "en.json"),
      JSON.stringify({ greeting: "Hello" }),
      "utf8",
    );
    await writeFile(
      join(root, "src", "page.tsx"),
      'const greeting = t("greeting");',
      "utf8",
    );

    const result = await validateI18nProject(
      {
        catalogDirectory: "locales",
        sourceDirectories: ["src"],
        defaultLocale: "en",
      },
      root,
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.watchedFiles).toContain(join(root, "src", "page.tsx"));
  });

  it("reports missing, unused, and non-static keys as build diagnostics", async () => {
    const root = await mkdtemp(join(tmpdir(), "puzzle-i18n-vite-"));
    temporaryDirectories.push(root);
    await mkdir(join(root, "locales"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "locales", "en.json"),
      JSON.stringify({ greeting: "Hello", unused: "Unused" }),
      "utf8",
    );
    await writeFile(
      join(root, "src", "page.tsx"),
      'const label = t(dynamicKey);\nconst title = t("missing");',
      "utf8",
    );

    const result = await validateI18nProject(
      {
        catalogDirectory: "locales",
        sourceDirectories: ["src"],
        defaultLocale: "en",
      },
      root,
    );

    expect(result.diagnostics.join("\n")).toContain("[dynamic-key]");
    expect(result.diagnostics.join("\n")).toContain("[missing-key] missing");
    expect(result.diagnostics.join("\n")).toContain("[unused-key] unused");
    expect(puzzleI18n({ catalogDirectory: "locales", sourceDirectories: ["src"], defaultLocale: "en" }).name)
      .toBe("@puzzle-ui/i18n");
  });

  it("runs catalog validation inside a real Vite build", async () => {
    const root = await mkdtemp(join(tmpdir(), "puzzle-i18n-vite-build-"));
    temporaryDirectories.push(root);
    await mkdir(join(root, "locales"), { recursive: true });
    await mkdir(join(root, "src"), { recursive: true });
    await writeFile(
      join(root, "locales", "en.json"),
      JSON.stringify({ greeting: "Hello" }),
      "utf8",
    );
    await writeFile(
      join(root, "src", "page.ts"),
      'export const greeting = t("greeting");',
      "utf8",
    );

    const config: InlineConfig = {
      configFile: false,
      logLevel: "silent",
      root,
      plugins: [
        puzzleI18n({
          catalogDirectory: "locales",
          sourceDirectories: ["src"],
          defaultLocale: "en",
        }),
      ],
      build: {
        write: false,
        rollupOptions: { input: join(root, "src", "page.ts") },
      },
    };

    await build(config);
    await writeFile(
      join(root, "src", "page.ts"),
      'export const greeting = t("missing");',
      "utf8",
    );
    await expect(build(config)).rejects.toThrow(
      "Puzzle i18n validation failed",
    );
  });

  it("keeps the development diagnostics panel out of production bundles", async () => {
    const diagnosticsEntry = fileURLToPath(
      new URL("../devtools/index.tsx", import.meta.url),
    );
    const result = await build({
      configFile: false,
      logLevel: "silent",
      mode: "production",
      root: process.cwd(),
      define: { "import.meta.env.DEV": "false" },
      plugins: [
        {
          name: "devtools-bundle-fixture",
          resolveId(source) {
            return source === "virtual:devtools-fixture"
              ? "\0virtual:devtools-fixture"
              : undefined;
          },
          load(id) {
            if (id === "\0virtual:devtools-fixture") {
              return `if (import.meta.env.DEV) await import(${JSON.stringify(diagnosticsEntry)});`;
            }

            return undefined;
          },
        },
      ],
      build: {
        write: false,
        rollupOptions: { input: "virtual:devtools-fixture" },
      },
    });
    const outputs = Array.isArray(result)
      ? result.flatMap((buildResult) => buildResult.output)
      : "output" in result
        ? result.output
        : (() => {
            throw new Error("Vite returned a watcher for a production build.");
          })();
    const productionCode = outputs
      .filter((output) => output.type === "chunk")
      .map((output) => output.code)
      .join("\n");

    expect(productionCode).not.toContain("i18n diagnostics");
    expect(productionCode).not.toContain("react/jsx-runtime");
  });
});
