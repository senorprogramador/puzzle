import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { items } from "../components/layout/constants";

type PackageManifest = {
  name: string;
  exports?: Record<string, unknown>;
  private?: boolean;
};

const exportedPackages = [
  ["core", "core"],
  ["session", "session"],
  ["seo", "seo"],
  ["fullstack", "fullstack"],
  ["theme", "theme"],
  ["hooks", "hooks"],
] as const;

const packagePages = [
  ["core", "/docs/core"],
  ["hooks", "/docs/hooks"],
  ["icons", "/docs/icons"],
  ["theme", "/docs/theme"],
  ["ui", "/docs/ui"],
  ["pieces", "/docs/pieces"],
  ["auth", "/docs/auth"],
  ["session", "/docs/session"],
  ["storage", "/docs/storage"],
  ["storage-d1", "/docs/storage#cloudflare-d1-adapter"],
  ["storage-mongodb", "/docs/storage#mongodb-adapter"],
  ["fullstack", "/docs/fullstack"],
  ["seo", "/docs/seo"],
  ["i18n", "/docs/multilingual"],
  ["create", "/docs/create"],
] as const;

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);
const packagesDirectory = fileURLToPath(
  new URL("../../../../packages/", import.meta.url),
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
  const slug = route.split("#")[0]!.replace(/^\/docs\/?/, "");
  const pagePath = join(docsDirectory, `${slug}.mdx`);
  const indexPath = join(docsDirectory, slug, "index.mdx");
  return existsSync(pagePath) || existsSync(indexPath);
};

type NavigationNode = {
  href?: string;
  children?: readonly NavigationNode[];
};

const getNavigationRoutes = (nodes: readonly NavigationNode[]): string[] =>
  nodes.flatMap((node) => [
    ...(node.href ? [node.href] : []),
    ...(node.children ? getNavigationRoutes(node.children) : []),
  ]);

describe("package overview entry points", () => {
  it("provides a navigable first-use guide for every non-private package", () => {
    const packageDirectories = readdirSync(packagesDirectory)
      .filter((directory) =>
        existsSync(join(packagesDirectory, directory, "package.json")),
      )
      .sort();
    const nonPrivatePackageDirectories = packageDirectories.filter(
      (directory) => !readPackageManifest(directory).private,
    );
    const documentedPackages: string[] = packagePages.map(
      ([directory]) => directory,
    );
    expect(documentedPackages.sort()).toEqual(nonPrivatePackageDirectories);

    const navigationRoutes = new Set(getNavigationRoutes(items));
    const tutorialIndex = readFileSync(
      join(docsDirectory, "tutorials", "index.mdx"),
      "utf8",
    );
    const llmsRoute = readFileSync(
      fileURLToPath(
        new URL("../routes/llms[.]txt.ts", import.meta.url),
      ),
      "utf8",
    );

    for (const [directory, route] of packagePages) {
      const manifest = readPackageManifest(directory);
      const pageRoute = route.split("#")[0]!;
      const slug = pageRoute.replace(/^\/docs\/?/, "");
      const pagePath = join(docsDirectory, slug, "index.mdx");
      const overview = readFileSync(pagePath, "utf8");

      expect(overview, `${manifest.name} needs a package guide`).toContain(
        manifest.name,
      );
      expect(tutorialIndex, `${manifest.name} needs a tutorial link`).toContain(
        manifest.name,
      );
      expect(tutorialIndex, `${manifest.name} needs a valid route`).toContain(
        route,
      );
      expect(docsPageExists(route), `${manifest.name} docs page exists`).toBe(
        true,
      );
      expect(navigationRoutes, `${manifest.name} appears in navigation`).toContain(
        pageRoute,
      );
      expect(llmsRoute, `${manifest.name} appears in llms.txt`).toContain(
        `"${pageRoute}"`,
      );

    }

    for (const directory of packageDirectories) {
      const manifest = readPackageManifest(directory);
      if (!manifest.private) continue;

      const route = `/docs/${directory}`;
      expect(tutorialIndex, `${manifest.name} is not a consumer tutorial`).not
        .toContain(manifest.name);
      expect(docsPageExists(route), `${manifest.name} has no package tutorial`)
        .toBe(false);
      expect(navigationRoutes, `${manifest.name} is not in package navigation`)
        .not.toContain(route);
      expect(llmsRoute, `${manifest.name} is not in package overviews`)
        .not.toContain(`"${route}"`);
    }
  });

  it("documents every exported package import path", () => {
    for (const [packageName, docsName] of exportedPackages) {
      const manifest = readPackageManifest(packageName);
      const overview = readFileSync(
        fileURLToPath(
          new URL(`../../content/docs/${docsName}/index.mdx`, import.meta.url),
        ),
        "utf8",
      );

      if (!manifest.exports) {
        throw new Error(`${packageName} must declare public exports`);
      }

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
      { docsName: "core", links: ["/docs/hooks", "/docs/theme"] },
      { docsName: "hooks", links: ["/docs/ui", "/docs/theme", "/docs/pieces"] },
      { docsName: "theme", links: ["/docs/ui", "/docs/pieces"] },
      {
        docsName: "session",
        links: ["/docs/auth", "/docs/storage", "/docs/tutorials/auth"],
      },
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
