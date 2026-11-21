import { describe, expect, it } from "bun:test";
import { items } from "./index";
import {
  findNavigationPath,
  getDocumentationSearchOptions,
  getPathExpandedIds,
  mergeExpandedIds,
  normalizePath,
} from "./helpers";
import type { TreeViewItem } from "./types";
import { getDocumentationInventory } from "../../../lib/documentation-inventory";

const flatten = (nodes: TreeViewItem[]): TreeViewItem[] =>
  nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);

const nodes = flatten(items);
const pages = getDocumentationInventory();
const hrefs = nodes.flatMap((node) => node.href ? [node.href] : []);

describe("documentation navigation", () => {
  it("has exactly the six ordered main groups", () => {
    expect(items.map((item) => item.label)).toEqual([
      "Getting Started",
      "Guides",
      "Foundations",
      "UI & Composition",
      "Application Development",
      "Project",
    ]);
  });

  it("uses unique IDs and URLs and valid nonempty labels and groups", () => {
    expect(new Set(nodes.map((node) => node.id)).size).toBe(nodes.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const node of nodes) {
      expect(node.id.trim()).not.toBe("");
      expect(typeof node.label).toBe("string");
      expect(String(node.label).trim()).not.toBe("");
      if (node.children) expect(node.children.length).toBeGreaterThan(0);
      else expect(node.href, node.id).toBeDefined();
    }
    expect(items.every((item) => !item.href && item.children?.length)).toBe(true);
  });

  it("represents every Markdown and MDX page exactly once without invented URLs", () => {
    expect([...hrefs].sort()).toEqual(pages.map((page) => page.url).sort());
    expect(new Set(pages.map((page) => page.url)).size).toBe(pages.length);
    for (const page of pages) {
      expect(findNavigationPath(items, page.url).at(-1)?.href).toBe(page.url);
    }
  });

  it("keeps tutorials together and project maintenance pages canonical", () => {
    for (const page of pages.filter((page) => page.url.startsWith("/docs/tutorials"))) {
      expect(findNavigationPath(items, page.url).slice(0, 2).map((node) => node.id))
        .toEqual(["guides", "tutorials"]);
    }
    for (const slug of ["contributing", "testing"]) {
      expect(findNavigationPath(items, `/docs/developer/${slug}`)[0]?.id)
        .toBe("project");
    }
    expect(nodes.find((node) => node.id === "auth")?.label).toBe("Authentication");
    expect(nodes.find((node) => node.id === "session")?.href).toBe("/docs/session");
  });

  it("matches exact routes, tolerating trailing slashes but not prefix collisions", () => {
    expect(normalizePath("/docs/auth///")).toBe("/docs/auth");
    expect(normalizePath("/")).toBe("/");
    expect(findNavigationPath(items, "/docs/auth/mfa/").at(-1)?.id).toBe("auth-mfa");
    for (const path of ["/docs/authentication", "/docs/auth/mfa-extra", "/docs/missing"]) {
      expect(findNavigationPath(items, path)).toEqual([]);
      expect(getPathExpandedIds(path)).toEqual([]);
    }
    expect(findNavigationPath(items, "/docs/ui/actions").at(-1)?.id)
      .toBe("ui-actions");
  });

  it("expands every ancestor, including deep catalog pages, but not the leaf", () => {
    expect(getPathExpandedIds("/docs/ui/actions/button")).toEqual([
      "ui-composition", "ui", "ui-actions",
    ]);
    expect(getPathExpandedIds("/docs/pieces/components/dashboard")).toEqual([
      "ui-composition", "pieces", "pieces-components", "pieces-application-dashboard",
    ]);
    expect(getPathExpandedIds("/docs/auth/mfa")).toEqual([
      "application-development", "auth",
    ]);
  });

  it("retains independent expanded groups across route changes without duplicates", () => {
    const expanded = mergeExpandedIds(["foundations", "theme"], "/docs/auth/mfa");
    expect(expanded).toEqual(["foundations", "theme", "application-development", "auth"]);
    expect(mergeExpandedIds(expanded, "/docs/auth/mfa/")).toEqual(expanded);
  });

  it("searches all pages using their actual titles including linked categories", () => {
    const options = getDocumentationSearchOptions(pages);
    expect(options.map((option) => option.value).sort()).toEqual([...hrefs].sort());
    for (const page of pages) {
      expect(options.find((option) => option.value === page.url)?.label).toBe(page.title);
    }
    for (const [query, url] of [
      ["Auth", "/docs/auth"],
      ["MFA", "/docs/auth/mfa"],
      ["UI components", "/docs/ui"],
      ["Page Sections", "/docs/pieces"],
      ["Theme tokens", "/docs/theme/tokens"],
    ]) {
      expect(options.some((option) =>
        option.value === url &&
        `${option.label} ${option.description}`.toLowerCase().includes(query!.toLowerCase()),
      ), query).toBe(true);
    }
  });
});
