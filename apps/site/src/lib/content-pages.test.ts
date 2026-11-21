import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

const landingPages = [
  "about.mdx",
  "architecture.mdx",
  "pieces/index.mdx",
  "developer/index.mdx",
];

const getDocumentationFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory()
      ? getDocumentationFiles(path)
      : path.endsWith(".mdx")
        ? [path]
        : [];
  });

const getFrontmatter = (content: string) => {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  expect(frontmatter, "page must have frontmatter").not.toBeNull();
  return frontmatter?.[1] ?? "";
};

describe("site overview pages", () => {
  it("have unique titles and descriptions and rely on the docs layout for one H1", () => {
    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const path of landingPages) {
      const content = readFileSync(resolve(docsDirectory, path), "utf8");
      const frontmatter = getFrontmatter(content);
      const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1];
      const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1];

      expect(title, path).toBeTruthy();
      expect(description, path).toBeTruthy();
      expect(content.match(/^# /gm) ?? [], path).toHaveLength(0);
      titles.push(title ?? "");
      descriptions.push(description ?? "");
    }

    expect(new Set(titles).size).toBe(landingPages.length);
    expect(new Set(descriptions).size).toBe(landingPages.length);
  });

  describe("site documentation titles", () => {
    it("are unique across all documentation pages", () => {
      const pathsByTitle = new Map<string, string[]>();

      for (const path of getDocumentationFiles(docsDirectory)) {
        const frontmatter = getFrontmatter(readFileSync(path, "utf8"));
        const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim();

        expect(title, path).toBeTruthy();
        const normalizedTitle = title?.replace(/^["']|["']$/g, "").toLowerCase();
        if (!normalizedTitle) continue;

        pathsByTitle.set(normalizedTitle, [
          ...(pathsByTitle.get(normalizedTitle) ?? []),
          path,
        ]);
      }

      const duplicates = [...pathsByTitle].filter(([, paths]) => paths.length > 1);
      expect(duplicates).toEqual([]);
    });
  });

  it("links only to documentation pages that exist in the source tree", () => {
    for (const path of landingPages) {
      const content = readFileSync(resolve(docsDirectory, path), "utf8");
      const links = content.matchAll(/\]\((\/docs\/[^)#]+)(?:#[^)]+)?\)/g);

      for (const [, href] of links) {
        expect(href, path).toBeDefined();
        if (!href) continue;
        const slug = href.replace(/^\/docs\/?/, "");
        const page = resolve(docsDirectory, `${slug}.mdx`);
        const index = resolve(docsDirectory, slug, "index.mdx");
        expect(existsSync(page) || existsSync(index), `${path}: ${href}`).toBe(
          true,
        );
      }
    }
  });
});
