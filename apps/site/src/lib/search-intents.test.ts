import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { getCanonicalUrl } from "./seo";
import { searchIntentMap } from "./search-intents";

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

const docsPagePath = (route: string): string => {
  const slug = route.replace(/^\/docs\/?/, "");
  const pagePath = join(docsDirectory, `${slug}.mdx`);
  const indexPath = join(docsDirectory, slug, "index.mdx");

  if (existsSync(pagePath)) return pagePath;
  if (existsSync(indexPath)) return indexPath;
  throw new Error(`No documentation page exists for ${route}`);
};

const getFrontmatterField = (source: string, field: string): string | null => {
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return (
    frontmatter?.[1]?.match(new RegExp(`^${field}:\\s*(.+)$`, "m"))?.[1]
      ?.trim()
      .replace(/^(['"])(.*)\1$/, "$2") ?? null
  );
};

describe("search intent map", () => {
  const entries = Object.entries(searchIntentMap);

  it("uses a distinct primary keyword and unique metadata for every mapped route", () => {
    expect(new Set(entries.map(([, entry]) => entry.primaryKeyword)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map(([, entry]) => entry.title)).size).toBe(
      entries.length,
    );
    expect(new Set(entries.map(([, entry]) => entry.description)).size).toBe(
      entries.length,
    );

    for (const [route, entry] of entries) {
      expect(entry.intent.trim().length, route).toBeGreaterThan(0);
      expect(entry.secondaryKeywords.length, route).toBeGreaterThan(0);
      expect(entry.canonical).toBe(getCanonicalUrl(route));
      expect(entry.structuredData.length, route).toBeGreaterThan(0);
      expect(entry.internalLinks.length, route).toBeGreaterThan(0);
    }
  });

  it("matches the SEO metadata in each important route", () => {
    for (const [route, entry] of entries) {
      if (route === "/") {
        expect(entry.title).toBe("React UI Library and Developer Toolkit");
        continue;
      }

      const source = readFileSync(docsPagePath(route), "utf8");
      expect(getFrontmatterField(source, "title"), route).toBe(entry.title);
      expect(getFrontmatterField(source, "description"), route).toBe(
        entry.description,
      );
    }
  });

  it("links only to existing local documentation routes", () => {
    for (const [route, entry] of entries) {
      for (const link of entry.internalLinks) {
        const url = new URL(link);
        expect(url.origin, `${route} links to ${link}`).toBe(
          "https://puzzle-ui.com",
        );
        if (url.pathname === "/") continue;
        expect(() => docsPagePath(url.pathname), `${route} links to ${link}`).not
          .toThrow();
      }
    }
  });
});
