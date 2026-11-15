import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ecosystem } from "./homepage";

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

describe("homepage ecosystem", () => {
  it("links each unique, described ecosystem item to a documentation page", () => {
    const hrefs = ecosystem.map((item) => item.href);
    const names = ecosystem.map((item) => item.name);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(names).size).toBe(names.length);

    for (const item of ecosystem) {
      expect(item.description.trim().length).toBeGreaterThan(0);

      const slug = item.href.replace(/^\/docs\/?/, "");
      const page = resolve(docsDirectory, `${slug}.mdx`);
      const index = resolve(docsDirectory, slug, "index.mdx");

      expect(existsSync(page) || existsSync(index), item.href).toBe(true);
    }
  });

  it("lists authentication and Fullstack separately and includes Storage", () => {
    expect(ecosystem.find((item) => item.name === "Authentication")?.href).toBe(
      "/docs/auth",
    );
    expect(ecosystem.find((item) => item.name === "Fullstack")?.href).toBe(
      "/docs/fullstack",
    );
    expect(ecosystem.find((item) => item.name === "Storage")?.href).toBe(
      "/docs/storage",
    );
  });
});
