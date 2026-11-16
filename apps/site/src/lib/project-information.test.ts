import { describe, expect, it } from "bun:test";
import { readdir, readFile } from "node:fs/promises";

import { projectInformationGET } from "./project-information";
import { getCanonicalUrl } from "./seo";

describe("project information route", () => {
  it("serves only public project facts and published package fields", async () => {
    const response = projectInformationGET();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");

    const data = await response.json();
    expect(Object.keys(data).sort()).toEqual([
      "apiMaturity", "contributing", "issues", "license", "name", "packages",
      "repository", "site",
    ].sort());
    expect(data.name).toBe("Puzzle UI");
    expect(data.site).toBe("https://puzzle-ui.com/");
    expect(data.repository).toBe("https://github.com/senorprogramador/puzzle");
    expect(data.license).toBe("MIT");
    expect(data.contributing).toBe(`${data.repository}/blob/main/CONTRIBUTING.md`);
    expect(data.issues).toBe(`${data.repository}/issues`);
    expect(Object.keys(data.apiMaturity).sort()).toEqual(["documentation", "summary"]);
    expect(data.apiMaturity.documentation).toBe("https://puzzle-ui.com/docs/tutorials#api-maturity");
    expect(data.apiMaturity.summary).toContain("Beta status does not guarantee production readiness");

    const packagesDir = new URL("../../../../packages/", import.meta.url);
    const manifests = await Promise.all(
      (await readdir(packagesDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => JSON.parse(await readFile(new URL(`${entry.name}/package.json`, packagesDir), "utf8"))),
    );
    const published = manifests.filter((manifest) => !manifest.private);
    expect(data.packages.map((pkg: { name: string }) => pkg.name).sort()).toEqual(
      published.map((manifest) => manifest.name).sort(),
    );
    expect(new Set(data.packages.map((pkg: { name: string }) => pkg.name)).size).toBe(published.length);

    for (const pkg of data.packages) {
      const manifest = published.find((item) => item.name === pkg.name);
      expect(manifest).toBeDefined();
      expect(Object.keys(pkg).sort()).toEqual([
        "name", "description", "documentation", "npm", "license",
        ...(manifest.engines?.node ? ["node"] : []),
        ...(["react", "next", "@tanstack/react-start"].some((key) => manifest.peerDependencies?.[key]) ? ["peers"] : []),
      ].sort());
      expect(pkg.description).toBe(manifest.description);
      expect(pkg.license).toBe("MIT");
      expect(pkg.documentation).toBe(manifest.homepage);
      expect(pkg.documentation).toMatch(/^https:\/\/puzzle-ui\.com\/docs\/[a-z0-9/-]+$/);
      expect(pkg.documentation).toBe(getCanonicalUrl(pkg.documentation));
      expect(pkg.npm).toBe(`https://www.npmjs.com/package/${manifest.name}`);
      if (pkg.node) expect(pkg.node).toBe(manifest.engines.node);
      if (pkg.peers) {
        const expectedPeers = Object.fromEntries(
          ["react", "next", "@tanstack/react-start"]
            .filter((name) => manifest.peerDependencies?.[name])
            .map((name) => [name, manifest.peerDependencies[name]]),
        );
        expect(pkg.peers).toEqual(expectedPeers);
      }
    }
  });
});
