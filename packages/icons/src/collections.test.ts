import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { ALL_ICON_COLLECTIONS } from "./collections";

const sourceDirectory = dirname(fileURLToPath(import.meta.url));
const setsDirectory = resolve(sourceDirectory, "sets");
const setFiles = readdirSync(setsDirectory);
const typeSource = readFileSync(resolve(sourceDirectory, "collections.types.ts"), "utf8");
const constantsSource = readFileSync(
  resolve(sourceDirectory, "collections.constants.ts"),
  "utf8",
);

const namesWithSuffix = (suffix: string) =>
  setFiles
    .filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length))
    .sort();

describe("generated icon collection declarations", () => {
  it("matches the TypeScript collection union", () => {
    const typeNames = Array.from(
      typeSource.matchAll(/^\s*\|\s*"([^"]+)"/gm),
      (match) => match[1],
    ).sort();

    expect([...ALL_ICON_COLLECTIONS].sort()).toEqual(typeNames);
    expect(new Set(ALL_ICON_COLLECTIONS).size).toBe(ALL_ICON_COLLECTIONS.length);
  });

  it("has implementation, types, constants, and page files for every collection", () => {
    const implementations = namesWithSuffix(".tsx").filter(
      (name) => !name.endsWith(".page"),
    );
    const pages = namesWithSuffix(".page.tsx");
    const declarations = [...ALL_ICON_COLLECTIONS].sort();

    expect(implementations).toEqual(declarations);
    expect(pages).toEqual(declarations);
    expect(namesWithSuffix(".types.ts")).toEqual(declarations);
    expect(namesWithSuffix(".constants.ts")).toEqual(declarations);
  });

  it("imports a generated icon-name catalog for every collection", () => {
    const importedNames = Array.from(
      constantsSource.matchAll(/from "\.\/sets\/([^"]+)\.constants"/g),
      (match) => match[1],
    ).sort();

    expect(importedNames).toEqual([...ALL_ICON_COLLECTIONS].sort());
  });
});
