import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

type PackageManifest = {
  name: string;
  exports: Record<string, unknown>;
};

const packages = [
  ["seo", "seo"],
  ["fullstack", "fullstack"],
  ["theme", "theme"],
  ["hooks", "hooks"],
] as const;

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

const readPackageManifest = (packageName: string): PackageManifest =>
  JSON.parse(
    readFileSync(
      fileURLToPath(
        new URL(`../../../../packages/${packageName}/package.json`, import.meta.url),
      ),
      "utf8",
    ),
  ) as PackageManifest;

const docsPageExists = (route: string): boolean => {
  const slug = route.replace(/^\/docs\/?/, "");
  const pagePath = join(docsDirectory, `${slug}.mdx`);
  const indexPath = join(docsDirectory, slug, "index.mdx");
  return existsSync(pagePath) || existsSync(indexPath);
};

describe("package overview entry points", () => {
  it("documents every exported package import path", () => {
    for (const [packageName, docsName] of packages) {
      const manifest = readPackageManifest(packageName);
      const overview = readFileSync(
        fileURLToPath(
          new URL(`../../content/docs/${docsName}/index.mdx`, import.meta.url),
        ),
        "utf8",
      );

      for (const subpath of Object.keys(manifest.exports)) {
        const importPath =
          subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
        expect(overview, `${packageName} documents ${importPath}`).toContain(
          importPath,
        );
      }
    }
  });

  it("exports and documents the theme types used by its public configuration", () => {
    const themeExports = readFileSync(
      fileURLToPath(
        new URL("../../../../packages/theme/src/index.ts", import.meta.url),
      ),
      "utf8",
    );
    const themeOverview = readFileSync(
      fileURLToPath(
        new URL("../../content/docs/theme/index.mdx", import.meta.url),
      ),
      "utf8",
    );

    for (const typeName of ["ColorThemes", "FontSource", "FontPreload"]) {
      expect(themeExports).toContain(typeName);
      expect(themeOverview).toContain(typeName);
    }
  });

  it("connects related package documentation", () => {
    const expectedLinks = [
      { docsName: "hooks", links: ["/docs/ui", "/docs/theme", "/docs/pieces"] },
      { docsName: "theme", links: ["/docs/ui", "/docs/pieces"] },
      {
        docsName: "fullstack",
        links: ["/docs/ui", "/docs/theme", "/docs/auth", "/docs/storage"],
      },
      {
        docsName: "seo",
        links: ["/docs/tutorials/seo", "/docs/seo/frameworks"],
      },
    ] as const;

    for (const { docsName, links } of expectedLinks) {
      const overview = readFileSync(
        fileURLToPath(
          new URL(`../../content/docs/${docsName}/index.mdx`, import.meta.url),
        ),
        "utf8",
      );
      for (const link of links) {
        expect(overview, `${docsName} links to ${link}`).toContain(link);
        expect(docsPageExists(link), `${docsName} links to an existing ${link}`)
          .toBe(true);
      }
    }
  });
});
