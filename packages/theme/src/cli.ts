#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { downloadGoogleFonts } from "./fonts/download-google-fonts";
import type { FontConfig, FontRole, ThemeFonts } from "./fonts/types";

const FONT_ROLES: readonly FontRole[] = ["heading", "body", "accent"];

const printHelp = () => {
  console.log(`
Puzzle Theme CLI

Usage:
  puzzle-theme fonts download [options]

Commands:
  fonts download          Download configured Google Fonts.

Options:
  --config <path>         Configuration file (default: puzzle-fonts.json).
  --out-dir <path>        Output directory (default: public/fonts).
  --force                 Force a new download.
  --subsets <names>       Comma-separated subsets (default: all).
  --help                  Display this help.

Examples:
  puzzle-theme fonts download
  puzzle-theme fonts download --force
  puzzle-theme fonts download --config ./config/fonts.json
  puzzle-theme fonts download --out-dir public/assets/fonts
`);
};

const getOption = (args: string[], name: string, fallback: string): string => {
  const inlineOption = args.find((arg) => arg.startsWith(`${name}=`));

  if (inlineOption) {
    const value = inlineOption.slice(name.length + 1);

    if (!value) {
      throw new Error(`Missing value for ${name}.`);
    }

    return value;
  }

  const index = args.indexOf(name);

  if (index === -1) {
    return fallback;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${name}.`);
  }

  return value;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const parseFontConfig = (value: unknown): ThemeFonts => {
  if (!isRecord(value)) {
    throw new TypeError("The font configuration must be a JSON object.");
  }

  const fonts: Partial<Record<FontRole, FontConfig>> = {};

  for (const [role, config] of Object.entries(value)) {
    if (!FONT_ROLES.includes(role as FontRole)) {
      throw new TypeError(
        `Unknown font role "${role}". Expected heading, body, or accent.`,
      );
    }

    if (!isRecord(config)) {
      throw new TypeError(
        `Font configuration for "${role}" must be an object.`,
      );
    }

    if (typeof config.family !== "string" || !config.family.trim()) {
      throw new TypeError(
        `Font configuration for "${role}" requires a family.`,
      );
    }

    fonts[role as FontRole] = config as unknown as FontConfig;
  }

  if (Object.keys(fonts).length === 0) {
    throw new TypeError("No fonts configured. Add at least one font role.");
  }

  return fonts;
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    printHelp();
    return;
  }

  if (args[0] !== "fonts" || args[1] !== "download") {
    printHelp();
    throw new Error("Unknown command.");
  }

  const configPath = resolve(
    process.cwd(),
    getOption(args, "--config", "puzzle-fonts.json"),
  );

  const outputDir = resolve(
    process.cwd(),
    getOption(args, "--out-dir", "public/fonts"),
  );

  const rawConfig = JSON.parse(await readFile(configPath, "utf8")) as unknown;

  const fonts = parseFontConfig(rawConfig);

  const result = await downloadGoogleFonts({
    fonts,
    outputDir,
    force: args.includes("--force"),
    subsets: getOption(args, "--subsets", "all") === "all"
      ? undefined
      : getOption(args, "--subsets", "all").split(",").map((subset) => subset.trim()),
  });

  if (result.skipped) {
    console.log("Google Fonts are already up to date.");
    console.log(`Location: ${result.cssPath}`);
    return;
  }

  console.log(`Downloaded ${result.fontFiles} WOFF2 font files.`);

  console.log(`Generated: ${result.cssPath}`);
};

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);

  process.exitCode = 1;
});
