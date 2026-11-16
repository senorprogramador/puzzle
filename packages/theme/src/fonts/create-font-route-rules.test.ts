import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createFontRouteRules,
  FONT_STYLESHEET_CACHE_CONTROL,
  VERSIONED_FONT_CACHE_CONTROL,
} from "./create-font-route-rules";

const shortCache = { headers: { "cache-control": FONT_STYLESHEET_CACHE_CONTROL } };
const immutableCache = { headers: { "cache-control": VERSIONED_FONT_CACHE_CONTROL } };

describe("createFontRouteRules", () => {
  let cwd: string;

  beforeEach(async () => {
    cwd = await mkdtemp(join(tmpdir(), "puzzle-font-route-rules-"));
  });

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true });
  });

  const writeFonts = async (directory: string, filenames: string[]) => {
    await mkdir(join(cwd, directory), { recursive: true });

    await Promise.all(
      filenames.map((filename) => writeFile(join(cwd, directory, filename), "")),
    );
  };

  it("caches versioned fonts immutably and stable files briefly", async () => {
    await writeFonts("public/fonts", [
      "puzzle-fonts.css",
      "puzzle-font-inter.woff2",
      "font-0123456789abcdef.woff2",
      "font-fedcba9876543210.woff2",
    ]);

    expect(createFontRouteRules({ cwd })).toEqual({
      "/fonts/**": shortCache,
      "/fonts/puzzle-fonts.css": shortCache,
      "/fonts/font-0123456789abcdef.woff2": immutableCache,
      "/fonts/font-fedcba9876543210.woff2": immutableCache,
    });
  });

  it("supports custom output directories and base paths", async () => {
    await writeFonts("static/type", ["font-0123456789abcdef.woff2"]);

    expect(
      createFontRouteRules({
        cwd,
        outDir: "static/type",
        basePath: "/assets/type/",
      }),
    ).toEqual({
      "/assets/type/**": shortCache,
      "/assets/type/puzzle-fonts.css": shortCache,
      "/assets/type/font-0123456789abcdef.woff2": immutableCache,
    });
  });

  it("returns stylesheet rules before fonts are downloaded", () => {
    expect(createFontRouteRules({ cwd })).toEqual({
      "/fonts/**": shortCache,
      "/fonts/puzzle-fonts.css": shortCache,
    });
  });

  it("does not add a site-wide rule when fonts are served from the root", async () => {
    await writeFonts("public", [
      "puzzle-font-inter.woff2",
      "font-0123456789abcdef.woff2",
      "logo.svg",
    ]);

    expect(
      createFontRouteRules({ cwd, outDir: "public", basePath: "/" }),
    ).toEqual({
      "/puzzle-fonts.css": shortCache,
      "/font-0123456789abcdef.woff2": immutableCache,
      "/puzzle-font-inter.woff2": shortCache,
    });
  });

  it("rejects invalid base paths", () => {
    expect(() => createFontRouteRules({ cwd, basePath: "fonts" })).toThrow(
      TypeError,
    );
  });
});
