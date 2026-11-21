import type { AutocompleteOption } from "@puzzle-ui/ui";
import type { DocumentationPage, TreeViewItem } from "./types";
import { items } from "./index";

export const normalizePath = (path: string) =>
  path.replace(/\/+$/, "") || "/";

export const findNavigationPath = (
  nodes: TreeViewItem[],
  pathname: string,
): TreeViewItem[] => {
  const path = normalizePath(pathname);

  for (const node of nodes) {
    if (node.href && normalizePath(node.href) === path) return [node];

    const descendants = node.children
      ? findNavigationPath(node.children, path)
      : [];
    if (descendants.length) return [node, ...descendants];
  }

  return [];
};

export const getPathExpandedIds = (pathname: string) =>
  findNavigationPath(items, pathname)
    .slice(0, -1)
    .map((item) => item.id);

export const mergeExpandedIds = (expandedIds: string[], pathname: string) =>
  [...new Set([...expandedIds, ...getPathExpandedIds(pathname)])];

const searchAliases: Record<string, string> = {
  "/docs/auth": "Auth Authentication",
  "/docs/auth/mfa": "MFA Multi-factor authentication Step-Up",
  "/docs/ui": "UI components",
  "/docs/pieces": "Page Sections Pieces",
  "/docs/theme/tokens": "Theme tokens Design Tokens",
};

export const getDocumentationSearchOptions = (
  pages: DocumentationPage[],
): AutocompleteOption<string>[] =>
  pages.map((page) => ({
    value: page.url,
    label: page.title,
    description: [
      ...findNavigationPath(items, page.url).map((item) => item.label),
      searchAliases[page.url],
      page.url,
    ]
      .filter((text): text is string => typeof text === "string")
      .join(" / "),
  }));
