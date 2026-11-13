import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import {
  components,
  componentPanels,
  randomComponentsOfLength,
} from "./component-catalog";

describe("component catalog", () => {
  it("groups eight random components into nonempty carousel panels", () => {
    const original = [...components];
    const panels = randomComponentsOfLength(8);
    expect(panels).toHaveLength(4);
    for (const panel of panels) {
      expect(panel).toHaveLength(2);
      expect(panel[0]?.href).toStartWith("/docs/ui/");
    }
    const selected = panels.flat();
    expect(selected).toHaveLength(8);
    expect(new Set(selected.map((component) => component.href)).size).toBe(8);
    for (const component of selected) {
      expect(components).toContain(component);
    }
    expect(components).toEqual(original);
  });

  it("keeps a final partial panel and handles empty or oversized selections", () => {
    expect(randomComponentsOfLength(3).map((panel) => panel.length)).toEqual([2, 1]);
    expect(randomComponentsOfLength(0)).toEqual([]);
    expect(randomComponentsOfLength(components.length + 1).flat()).toHaveLength(
      components.length,
    );
  });

  it("pairs cards into panels without losing or duplicating components", () => {
    expect(componentPanels.flat()).toEqual(components);
    for (const panel of componentPanels.slice(0, -1)) {
      expect(panel).toHaveLength(2);
    }
    expect(componentPanels.at(-1)?.length).toBe(components.length % 2 || 2);
  });

  it("links to every component documentation page exactly once", () => {
    const docs = new URL("../../content/docs/ui/", import.meta.url);
    const pages = readdirSync(docs, { recursive: true, encoding: "utf8" })
      .filter((path) => path.endsWith(".mdx") && path !== "index.mdx")
      .map((path) => `/docs/ui/${path.replace(/\.mdx$/, "")}`)
      .sort();

    expect(pages).toEqual(components.map((component) => component.href).sort());
  });

  it("covers every exported component family", () => {
    const exports = readFileSync(
      new URL("../../../../packages/ui/src/index.ts", import.meta.url),
      "utf8",
    );
    const families = new Set(
      [...exports.matchAll(/from "\.\/components\/([^/]+)\/([^/"]+)/g)]
        .flatMap((match) =>
          match[2] === "input"
            ? ["forms/number-input", "forms/text-area-input", "forms/text-input"]
            : [`${match[1]}/${match[2]}`],
        ),
    );

    expect(components.map((component) => component.href.slice("/docs/ui/".length)).sort())
      .toEqual([...families].sort());
  });

  it("uses available icons and useful labels and descriptions", () => {
    const icons = readFileSync(
      new URL("../../../../packages/icons/src/sets/lucide.types.ts", import.meta.url),
      "utf8",
    );
    const names = new Set(
      [...icons.matchAll(/"([^"]+)"/g)].map((match) => `lucide:${match[1]}`),
    );

    for (const component of components) {
      expect(names.has(component.icon)).toBe(true);
      expect(component.name.trim().length).toBeGreaterThan(0);
      expect(component.description.trim().length).toBeGreaterThan(0);
    }
  });
});
