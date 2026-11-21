import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import {
  components,
  componentPanels,
  randomComponentsOfLength,
} from "./component-catalog";

describe("component catalog", () => {
  const categories = [
    "actions",
    "data-display",
    "editors",
    "forms",
    "layout",
    "navigation",
    "overlays",
    "typography",
    "utilities",
  ] as const;

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
    const componentPages = readdirSync(docs, { recursive: true, encoding: "utf8" })
      .filter((path) => path.endsWith(".mdx") && path !== "index.mdx")
      .filter((path) => !path.endsWith("/index.mdx"))
      .map((path) => `/docs/ui/${path.replace(/\.mdx$/, "")}`)
      .sort();

    expect(componentPages).toEqual(
      components.map((component) => component.href).sort(),
    );
  });

  it("provides a unique, linked category landing page for every UI group", () => {
    const sidebar = readFileSync(
      new URL("./layout/sidebar/ui.ts", import.meta.url),
      "utf8",
    );
    const overview = readFileSync(
      new URL("../../content/docs/ui/index.mdx", import.meta.url),
      "utf8",
    );
    expect(overview).not.toMatch(/^#{1,6}\s+\[/m);

    for (const category of categories) {
      const page = readFileSync(
        new URL(`../../content/docs/ui/${category}/index.mdx`, import.meta.url),
        "utf8",
      );
      const categoryComponents = components.filter((component) =>
        component.href.startsWith(`/docs/ui/${category}/`),
      );

      expect(page, `${category} has a standalone introduction`).toMatch(
        /When to use[\s\S]*<UIComponentCatalog/,
      );
      expect(page, `${category} documents its category`).toContain(
        `category="${category}"`,
      );
      expect(categoryComponents.length, `${category} is not empty`).toBeGreaterThan(
        0,
      );
      expect(sidebar, `${category} category is directly linked`).toContain(
        `href: \`\${folder}/${category}\``,
      );
      expect(overview, `${category} is linked from the overview`).toContain(
        `](/docs/ui/${category})`,
      );
    }
  });

  it("uses a one, two, then three-column responsive catalog with linked cards", () => {
    const styles = readFileSync(
      new URL("./doc-examples/ui/component-catalog.css", import.meta.url),
      "utf8",
    );
    const catalog = readFileSync(
      new URL("./doc-examples/ui/component-catalog.tsx", import.meta.url),
      "utf8",
    );

    expect(styles).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(styles).toMatch(/min-width:\s*768px[\s\S]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(styles).toMatch(/min-width:\s*1024px[\s\S]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
    expect(catalog).toContain('as="a"');
    expect(catalog).toContain("href={component.href}");
    expect(catalog).toContain("component.description");
  });

  it("covers every exported component family", () => {
    const exports = readFileSync(
      new URL("../../../../packages/ui/src/index.ts", import.meta.url),
      "utf8",
    );
    const families = new Set(
      [...exports.matchAll(/from "\.\/components\/([^"]+)"/g)].flatMap(
        ([, modulePath]) => {
          const [category, component] = (modulePath ?? "").split("/");

          if (!component) {
            return [];
          }

          return category === "forms" && component === "input"
            ? [
                "forms/number-input",
                "forms/text-area-input",
                "forms/text-input",
              ]
            : [`${category}/${component}`];
        },
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
