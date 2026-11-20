import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { runI18nCli } from "../cli";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("Puzzle Multilingual CLI", () => {
  it("prints help and reports unknown commands with a usage exit code", async () => {
    const output: string[] = [];
    const stdout = (message: string) => output.push(message);

    await expect(
      runI18nCli(["--help"], { stdout }),
    ).resolves.toBe(0);
    expect(output.join("\n")).toContain("puzzle-i18n validate");

    await expect(
      runI18nCli(["unknown"], { stdout, stderr: (message) => output.push(message) }),
    ).resolves.toBe(2);
  });

  it("validates locale catalogs and generates declarations", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "puzzle-i18n-cli-"));
    temporaryDirectories.push(cwd);
    const catalogDirectory = join(cwd, "locales");
    await mkdir(catalogDirectory, { recursive: true });
    await writeFile(
      join(catalogDirectory, "en.json"),
      JSON.stringify({ greeting: "Hello {name}" }),
      "utf8",
    );
    await writeFile(
      join(catalogDirectory, "nl.json"),
      JSON.stringify({ greeting: "Hallo {name}" }),
      "utf8",
    );

    const messages: string[] = [];
    const output = {
      cwd,
      stdout: (message: string) => messages.push(message),
      stderr: (message: string) => messages.push(message),
    };

    await expect(
      runI18nCli(
        ["validate", "locales", "--default-locale", "en"],
        output,
      ),
    ).resolves.toBe(0);
    expect(messages.join("\n")).toContain("Catalogs are valid");

    await expect(
      runI18nCli(
        [
          "generate-types",
          "locales/en.json",
          "--out",
          "messages.d.ts",
          "--type-name",
          "Messages",
        ],
        output,
      ),
    ).resolves.toBe(0);
    expect(await readFile(join(cwd, "messages.d.ts"), "utf8")).toContain(
      "interface Messages",
    );
  });

  it("returns an error when the requested validation configuration is incomplete", async () => {
    const errors: string[] = [];
    await expect(
      runI18nCli(["validate", "locales"], {
        stderr: (message) => errors.push(message),
      }),
    ).resolves.toBe(2);
    expect(errors.join("\n")).toContain("--default-locale");
  });

  it("scans TypeScript translation calls for missing, unused, and dynamic keys", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "puzzle-i18n-scan-"));
    temporaryDirectories.push(cwd);
    await mkdir(join(cwd, "src"), { recursive: true });
    await writeFile(
      join(cwd, "src", "Component.tsx"),
      'const greeting = t("greeting");\n',
      "utf8",
    );
    await writeFile(
      join(cwd, "en.json"),
      JSON.stringify({ greeting: "Hello" }),
      "utf8",
    );

    const messages: string[] = [];
    const output = {
      cwd,
      stdout: (message: string) => messages.push(message),
      stderr: (message: string) => messages.push(message),
    };

    await expect(
      runI18nCli(["scan", "src", "--catalog", "en.json"], output),
    ).resolves.toBe(0);
    expect(messages.join("\n")).toContain("Source scan passed");

    await writeFile(
      join(cwd, "src", "Component.tsx"),
      'const greeting = t(dynamicKey);\n',
      "utf8",
    );

    await expect(
      runI18nCli(["scan", "src", "--catalog", "en.json"], output),
    ).resolves.toBe(1);
    expect(messages.join("\n")).toContain("[dynamic-key]");
  });

  it("initializes detected framework locales without overwriting files", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "puzzle-i18n-init-"));
    temporaryDirectories.push(cwd);
    await writeFile(
      join(cwd, "package.json"),
      JSON.stringify({ devDependencies: { next: "16.0.0" } }),
      "utf8",
    );
    const messages: string[] = [];

    await expect(
      runI18nCli(["init", ".", "--locales", "en,nl"], {
        cwd,
        stdout: (message) => messages.push(message),
        stderr: (message) => messages.push(message),
      }),
    ).resolves.toBe(0);

    const config = JSON.parse(
      await readFile(join(cwd, "puzzle-i18n.config.json"), "utf8"),
    );
    expect(config).toMatchObject({
      framework: "next",
      defaultLocale: "en",
      locales: ["en", "nl"],
    });
    expect(
      JSON.parse(await readFile(join(cwd, "locales", "nl.json"), "utf8")),
    ).toEqual({ common: { greeting: "Hello {name}" } });

    await writeFile(
      join(cwd, "puzzle-i18n.config.json"),
      '{"preserve":true}',
      "utf8",
    );
    await expect(
      runI18nCli(["init", ".", "--locales", "en,nl"], {
        cwd,
        stderr: (message) => messages.push(message),
      }),
    ).resolves.toBe(1);
    expect(
      await readFile(join(cwd, "puzzle-i18n.config.json"), "utf8"),
    ).toBe('{"preserve":true}');
    expect(messages.join("\n")).toContain("would overwrite existing files");
  });

  it("loads generated project config for validation, type generation, and scanning", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "puzzle-i18n-config-"));
    temporaryDirectories.push(cwd);
    await mkdir(join(cwd, "locales"), { recursive: true });
    await mkdir(join(cwd, "src"), { recursive: true });
    await writeFile(
      join(cwd, "locales", "en.json"),
      JSON.stringify({ greeting: "Hello" }),
      "utf8",
    );
    await writeFile(
      join(cwd, "locales", "nl.json"),
      JSON.stringify({ greeting: "Hallo" }),
      "utf8",
    );
    await writeFile(
      join(cwd, "src", "page.ts"),
      'export const greeting = t("greeting");',
      "utf8",
    );
    await writeFile(
      join(cwd, "project.json"),
      JSON.stringify({
        defaultLocale: "en",
        locales: ["en", "nl"],
        catalogDirectory: "./locales",
        sourceDirectories: ["./src"],
      }),
      "utf8",
    );

    const messages: string[] = [];
    const output = {
      cwd,
      stdout: (message: string) => messages.push(message),
      stderr: (message: string) => messages.push(message),
    };

    await expect(
      runI18nCli(["validate", "--config", "project.json"], output),
    ).resolves.toBe(0);
    await expect(
      runI18nCli(["generate-types", "--config", "project.json"], output),
    ).resolves.toBe(0);
    await expect(
      readFile(join(cwd, "messages.d.ts"), "utf8"),
    ).resolves.toContain("interface Messages");
    await expect(
      runI18nCli(["scan", "--config", "project.json"], output),
    ).resolves.toBe(0);
    expect(messages.join("\n")).toContain("Source scan passed");
  });
});
