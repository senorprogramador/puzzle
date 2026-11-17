import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { getMDXComponents } from "../components/mdx";

const docsDirectory = fileURLToPath(new URL("../../content/docs/", import.meta.url));
const processor = remark().use(remarkGfm).use(remarkMdx);
const provided = new Set(Object.keys(getMDXComponents()));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const walk = (value: unknown, visit: (node: Record<string, unknown>) => void) => {
  if (Array.isArray(value)) {
    value.forEach((child) => walk(child, visit));
  } else if (isRecord(value)) {
    visit(value);
    Object.entries(value).forEach(([key, child]) => {
      if (key !== "position" && key !== "loc") walk(child, visit);
    });
  }
};

const addBinding = (pattern: unknown, bindings: Set<string>) => {
  if (!isRecord(pattern)) return;
  if (pattern.type === "Identifier" && typeof pattern.name === "string") {
    bindings.add(pattern.name);
  } else if (pattern.type === "ObjectPattern" && Array.isArray(pattern.properties)) {
    pattern.properties.forEach((property: unknown) => {
      if (isRecord(property)) addBinding(property.value ?? property.argument, bindings);
    });
  } else if (pattern.type === "ArrayPattern" && Array.isArray(pattern.elements)) {
    pattern.elements.forEach((element: unknown) => addBinding(element, bindings));
  } else if (pattern.type === "RestElement") {
    addBinding(pattern.argument, bindings);
  } else if (pattern.type === "AssignmentPattern") {
    addBinding(pattern.left, bindings);
  }
};

const jsxRoot = (name: unknown): string | undefined => {
  if (!isRecord(name)) return;
  if (name.type === "JSXIdentifier" && typeof name.name === "string") return name.name;
  if (name.type === "JSXMemberExpression") return jsxRoot(name.object);
};

describe("page-scoped MDX imports", () => {
  it("keeps the shared map limited to Fumadocs and lightweight site wrappers", () => {
    expect(Object.keys(getMDXComponents()).sort()).toEqual(
      [...new Set([
        ...Object.keys(defaultMdxComponents),
        "h1", "h2", "h3", "h4",
        "PackageManagerTab", "PackageManagerTabs",
      ])].sort(),
    );
    const Heading = () => null;
    expect(getMDXComponents({ h1: Heading }).h1).toBe(Heading);
  });

  it("resolves every documentation component through a page import or the shared map", async () => {
    const errors: string[] = [];
    let pages = 0;
    for await (const path of new Bun.Glob("**/*.{md,mdx}").scan(docsDirectory)) {
      pages++;
      const source = await readFile(join(docsDirectory, path), "utf8");
      const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
      const imported = new Set<string>();
      const used = new Set<string>();

      walk(processor.parse(body), (node) => {
        if (node.type === "ImportDeclaration" && Array.isArray(node.specifiers)) {
          node.specifiers.forEach((specifier: unknown) => {
            if (!isRecord(specifier)) return;
            addBinding(specifier.local, imported);
            if (
              specifier.type === "ImportNamespaceSpecifier" &&
              isRecord(node.source) &&
              typeof node.source.value === "string" &&
              /^@puzzle-ui\/(?:ui|pieces|icons)$/.test(node.source.value)
            ) {
              errors.push(`${path}: use named imports from ${node.source.value}`);
            }
          });
        }
        if (node.type === "VariableDeclarator") addBinding(node.id, imported);
        if (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") {
          addBinding(node.id, imported);
        }
        if (
          (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
          typeof node.name === "string"
        ) {
          const name = node.name.split(".")[0];
          if (name) used.add(name);
        }
        if (node.type === "JSXOpeningElement") {
          const name = jsxRoot(node.name);
          if (name) used.add(name);
        }
      });

      for (const name of used) {
        if (/^[A-Z]/.test(name) && !imported.has(name) && !provided.has(name)) {
          errors.push(`${path}: ${name} needs an explicit import`);
        }
      }
    }
    expect(pages).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });
});
